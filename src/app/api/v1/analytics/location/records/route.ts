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

let indexPromise: Promise<RecordIndex> | undefined;

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
    const index = await loadIndex();
    const location = index.locations[locationCode];
    if (!location) return Response.json({ status: "not_found", data: null }, { status: 404 });

    const datasetDirectory = process.env.YOJANA_DATASET_DIR;
    if (!datasetDirectory) {
      return Response.json({ status: "unavailable", message: "Set YOJANA_DATASET_DIR to the supplied dataset folder." }, { status: 503 });
    }
    const datasetRoot = path.resolve(datasetDirectory);
    const schemeIds = schemeId === "all" ? Object.keys(location).sort() : [schemeId];
    const rows: Record<string, string>[] = [];
    for (const id of schemeIds) {
      const block = location[id];
      if (!block) continue;
      rows.push(...await readLocationRows(datasetRoot, index.meta.columns, locationCode, id, block));
    }
    if (!rows.length) return Response.json({ status: "not_found", data: null }, { status: 404 });
    if (index.meta.columns.length !== 39 || rows.length !== schemeIds.length * 15) {
      throw new Error("The indexed row data is incomplete or does not match the 39-column source schema.");
    }
    if (new Set(rows.map((row) => row.Record_ID)).size !== rows.length) {
      throw new Error("The indexed row data contains duplicate record IDs.");
    }

    return Response.json({
      status: "success",
      meta: { ...index.meta, rowCount: rows.length, schemeFilter: schemeId, classification: "SYNTHETIC DEMO ONLY — ALL SOURCE ROWS ARE FICTIONAL" },
      data: { columns: index.meta.columns, rows },
    }, { headers: { "Cache-Control": "private, max-age=300" } });
  } catch {
    return Response.json({ status: "unavailable", message: "The location row data could not be read from the supplied dataset." }, { status: 503 });
  }
}
