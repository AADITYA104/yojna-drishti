import { readFile } from "node:fs/promises";
import { gunzipSync } from "node:zlib";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SchemeAggregate = {
  id: string;
  nameEn: string;
  nameGu: string;
  count: number;
  eligibility: Record<string, number>;
  activity: Record<string, number>;
  documents: Record<string, number>;
  gender: Record<string, number>;
  ageBands: Record<string, number>;
  months: Record<string, number>;
};

type LocationAggregate = {
  code: string;
  nameEn: string;
  nameGu: string;
  category: string;
  talukaCode: string;
  talukaEn: string;
  talukaGu: string;
  districtCode: string;
  districtEn: string;
  districtGu: string;
  schemes: Record<string, SchemeAggregate>;
};

type AnalyticsIndex = {
  meta: {
    classification: string;
    dataset: string;
    referenceDate: string;
    metricsNote: string;
  };
  locations: Record<string, LocationAggregate>;
};

let indexPromise: Promise<AnalyticsIndex> | undefined;

function loadIndex() {
  if (!indexPromise) {
    const indexPath = path.join(process.cwd(), "data", "processed", "location-analytics.json.gz");
    indexPromise = readFile(indexPath).then((compressed) =>
      JSON.parse(gunzipSync(compressed).toString("utf8")) as AnalyticsIndex,
    ).catch((error: unknown) => {
      indexPromise = undefined;
      throw error;
    });
  }
  return indexPromise;
}

export async function GET(request: Request) {
  const locationCode = new URL(request.url).searchParams.get("locationCode")?.trim();
  if (!locationCode || !/^\d{1,12}$/.test(locationCode)) {
    return Response.json({ status: "error", message: "A valid location code is required." }, { status: 400 });
  }

  try {
    const index = await loadIndex();
    const location = index.locations[locationCode];
    if (!location) {
      return Response.json({ status: "not_found", meta: index.meta, data: null }, {
        headers: { "Cache-Control": "private, max-age=300" },
      });
    }
    return Response.json({ status: "success", meta: index.meta, data: location }, {
      headers: { "Cache-Control": "private, max-age=300" },
    });
  } catch {
    return Response.json({ status: "unavailable", message: "Location analytics are not available. Build the aggregate dataset index first." }, { status: 503 });
  }
}
