import { readFile } from "node:fs/promises";
import { gunzipSync } from "node:zlib";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type VillageProfileIndex = {
  meta: Record<string, string | number>;
  locations: Record<string, {
    locationCode: string;
    locationName: string;
    districtCode: string;
    talukaCode: string;
    sourceFields: Record<string, string | number | null>;
  }>;
};

let indexPromise: Promise<VillageProfileIndex> | undefined;

function loadIndex() {
  if (!indexPromise) {
    const indexPath = path.join(process.cwd(), "data", "processed", "village-census-2011.json.gz");
    indexPromise = readFile(indexPath)
      .then((compressed) => JSON.parse(gunzipSync(compressed).toString("utf8")) as VillageProfileIndex)
      .catch((error: unknown) => {
        indexPromise = undefined;
        throw error;
      });
  }
  return indexPromise;
}

export async function GET(request: Request) {
  const locationCode = new URL(request.url).searchParams.get("locationCode")?.trim() ?? "";
  if (!/^\d{1,12}$/.test(locationCode)) {
    return Response.json({ status: "error", message: "A valid location code is required." }, { status: 400 });
  }

  try {
    const index = await loadIndex();
    const data = index.locations[locationCode] ?? null;
    return Response.json({ status: data ? "success" : "not_found", meta: index.meta, data }, {
      headers: { "Cache-Control": "private, max-age=3600" },
    });
  } catch {
    return Response.json({ status: "unavailable", message: "The historical village profile is not available." }, { status: 503 });
  }
}
