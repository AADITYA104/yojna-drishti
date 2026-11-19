import { open, readFile } from "node:fs/promises";
import { gunzipSync } from "node:zlib";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RowBlock = { file: string; offset: number; length: number; rows: number };
type RecordIndex = {
  meta: { classification: string; sourceRows: number; columns: string[]; schemes: Record<string, string> };
  locations: Record<string, Record<string, RowBlock>>;
};
type ShardBlock = { file: string; districtCode: string; offset: number; length: number; rows: number };
type ShardIndex = {
  meta: { classification: string; sourceRows: number; locationCount: number; schemeCount: number; columns: string[]; schemes: Record<string, string> };
  locations: Record<string, ShardBlock>;
};

let indexPromise: Promise<RecordIndex> | undefined;
let shardIndexPromise: Promise<ShardIndex> | undefined;

function loadIndex() {
  if (!indexPromise) {
    const indexPath = path.join(process.cwd(), "data", "processed", "location-record-index.json.gz");
    indexPromise = readFile(indexPath)
      .then((compressed) => JSON.parse(gunzipSync(compressed).toString("utf8")) as RecordIndex)
      .catch((error: unknown) => {
        indexPromise = undefined;
        throw error;
      });
  }
  return indexPromise;
}

function loadShardIndex() {
  if (!shardIndexPromise) {
    const indexPath = path.join(process.cwd(), "data", "processed", "location-record-shard-index.json.gz");
    shardIndexPromise = readFile(indexPath)
      .then((compressed) => JSON.parse(gunzipSync(compressed).toString("utf8")) as ShardIndex)
      .catch((error: unknown) => {
        shardIndexPromise = undefined;
        throw error;
      });
  }
  return shardIndexPromise;
}

function parseCsvRows(source: string, columnCount: number) {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    if (quoted) {
      if (character === '"' && source[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        field += character;
      }
    } else if (character === '"') {
      quoted = true;
    } else if (character === ",") {
      row.push(field);
      field = "";
    } else if (character === "\n") {
      row.push(field.replace(/\r$/, ""));
      field = "";
      if (row.length !== 1 || row[0] !== "") rows.push(row);
      row = [];
    } else {
      field += character;
    }
  }

  if (quoted) throw new Error("The source row block has an unclosed CSV quote.");
  if (field.length || row.length) {
    row.push(field.replace(/\r$/, ""));
    if (row.length !== 1 || row[0] !== "") rows.push(row);
  }
  if (rows.some((values) => values.length !== columnCount)) {
    throw new Error("A source row does not match the dataset column count.");
  }
  return rows;
}

async function readLocationRows(datasetRoot: string, columns: string[], locationCode: string, schemeId: string, block: RowBlock) {
  if (!Number.isSafeInteger(block.offset) || !Number.isSafeInteger(block.length) || block.offset < 0 || block.length < 1 || block.length > 1_000_000) {
    throw new Error("The indexed dataset row range is invalid.");
  }
  const fileName = path.basename(block.file);
  if (fileName !== block.file || !/^[\w.-]+\.csv$/i.test(fileName)) throw new Error("The indexed dataset file is invalid.");

  const csvPath = path.join(datasetRoot, "scheme_data", fileName);
  const file = await open(csvPath, "r");
  try {
    const bytes = Buffer.alloc(block.length);
    const { bytesRead } = await file.read(bytes, 0, block.length, block.offset);
    if (bytesRead !== block.length) throw new Error("The indexed dataset row block is incomplete.");
    const values = parseCsvRows(bytes.toString("utf8"), columns.length);
    if (values.length !== block.rows) throw new Error("The indexed dataset row count does not match its index.");
    return values.map((cells) => {
      const row = Object.fromEntries(columns.map((column, index) => [column, cells[index]])) as Record<string, string>;
      if (row.Location_Code !== locationCode || row.Scheme_ID !== schemeId) throw new Error("The indexed row does not match the selected map location and scheme.");
      return row;
    });
  } finally {
    await file.close();
  }
}

async function readRemoteLocationRows(baseUrl: string, columns: string[], locationCode: string, block: ShardBlock) {
  if (!Number.isSafeInteger(block.offset) || !Number.isSafeInteger(block.length) || block.offset < 0 || block.length < 1 || block.length > 2_000_000) {
    throw new Error("The indexed compressed row range is invalid.");
  }
  if (!/^[\w-]+\.bin$/i.test(block.file) || !/^\d{1,12}$/.test(block.districtCode)) {
    throw new Error("The indexed district shard is invalid.");
  }

  const storageRoot = new URL(baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`);
  if (storageRoot.protocol !== "https:" || !storageRoot.hostname.endsWith(".public.blob.vercel-storage.com")) {
    throw new Error("YOJANA_DATASET_BASE_URL must be a public HTTPS Vercel Blob URL.");
  }
  const shardUrl = new URL(`location-record-shards/${block.file}`, storageRoot);
  const end = block.offset + block.length - 1;
  const response = await fetch(shardUrl, {
    headers: { Range: `bytes=${block.offset}-${end}` },
    cache: "force-cache",
    signal: AbortSignal.timeout(20_000),
  });
  if (response.status !== 206 || response.headers.get("content-range")?.startsWith(`bytes ${block.offset}-${end}/`) !== true) {
    throw new Error("The dataset storage did not return the requested location byte range.");
  }

  const compressed = Buffer.from(await response.arrayBuffer());
  if (compressed.length !== block.length) throw new Error("The remote location shard range is incomplete.");
  const source = gunzipSync(compressed).toString("utf8");
  const values = parseCsvRows(source, columns.length);
  if (values.length !== block.rows) throw new Error("The remote location shard row count does not match its index.");
  return values.map((cells) => {
    const row = Object.fromEntries(columns.map((column, index) => [column, cells[index]])) as Record<string, string>;
    if (row.Location_Code !== locationCode) throw new Error("The remote rows do not match the selected map location.");
    return row;
  });
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const locationCode = params.get("locationCode")?.trim() ?? "";
  const schemeId = params.get("schemeId")?.trim() ?? "all";
  if (!/^\d{1,12}$/.test(locationCode)) {
    return Response.json({ status: "error", message: "A valid location code is required." }, { status: 400 });
  }
  if (schemeId !== "all" && !/^S\d{2}$/.test(schemeId)) {
    return Response.json({ status: "error", message: "A valid scheme code is required." }, { status: 400 });
  }

  try {
    const storageBaseUrl = process.env.YOJANA_DATASET_BASE_URL?.trim();
    let columns: string[];
    let rows: Record<string, string>[];
    let datasetMeta: ShardIndex["meta"] | RecordIndex["meta"];

    if (storageBaseUrl) {
      const index = await loadShardIndex();
      const location = index.locations[locationCode];
      if (!location) return Response.json({ status: "not_found", data: null }, { status: 404 });
      if (index.meta.columns.length !== 39) throw new Error("The remote row index does not match the 39-column source schema.");

      const allRows = await readRemoteLocationRows(storageBaseUrl, index.meta.columns, locationCode, location);
      const expectedSchemeIds = schemeId === "all" ? Object.keys(index.meta.schemes).sort() : [schemeId];
      rows = schemeId === "all" ? allRows : allRows.filter((row) => row.Scheme_ID === schemeId);
      if (!rows.length) return Response.json({ status: "not_found", data: null }, { status: 404 });
      if (rows.length !== expectedSchemeIds.length * 15 || rows.length !== (schemeId === "all" ? location.rows : 15)) {
        throw new Error("The remote row data is incomplete for the selected location and scheme.");
      }
      columns = index.meta.columns;
      datasetMeta = index.meta;
    } else {
      const index = await loadIndex();
      const location = index.locations[locationCode];
      if (!location) return Response.json({ status: "not_found", data: null }, { status: 404 });

      const datasetDirectory = process.env.YOJANA_DATASET_DIR;
      if (!datasetDirectory) {
        return Response.json({ status: "unavailable", message: "Configure YOJANA_DATASET_BASE_URL with the published district shards, or set YOJANA_DATASET_DIR for local development." }, { status: 503 });
      }
      const datasetRoot = path.resolve(datasetDirectory);
      const schemeIds = schemeId === "all" ? Object.keys(location).sort() : [schemeId];
      rows = [];
      for (const id of schemeIds) {
        const block = location[id];
        if (!block) continue;
        rows.push(...await readLocationRows(datasetRoot, index.meta.columns, locationCode, id, block));
      }
      if (!rows.length) return Response.json({ status: "not_found", data: null }, { status: 404 });
      if (index.meta.columns.length !== 39 || rows.length !== schemeIds.length * 15) {
        throw new Error("The indexed row data is incomplete or does not match the 39-column source schema.");
      }
      datasetMeta = index.meta;
      columns = index.meta.columns;
    }

    if (new Set(rows.map((row) => row.Record_ID)).size !== rows.length) {
      throw new Error("The indexed row data contains duplicate record IDs.");
    }

    return Response.json({
      status: "success",
      meta: { ...datasetMeta, rowCount: rows.length, schemeFilter: schemeId, classification: "SYNTHETIC DEMO ONLY — ALL SOURCE ROWS ARE FICTIONAL" },
      data: { columns, rows },
    }, { headers: { "Cache-Control": "private, max-age=300" } });
  } catch {
    return Response.json({ status: "unavailable", message: "The selected location rows could not be read from the configured dataset storage." }, { status: 503 });
  }
}
