import { readFile } from "node:fs/promises";
import { gunzipSync } from "node:zlib";
import path from "node:path";
import { MASTER_DISTRICTS, MASTER_SUBDISTRICTS } from "@/lib/master-hierarchy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type LocationAggregate = {
  districtCode: string;
  talukaCode: string;
  schemes: Record<string, { id: string; nameEn: string; nameGu: string; count: number }>;
};

type AnalyticsIndex = {
  meta: { classification: string; dataset: string; referenceDate: string; metricsNote: string };
  locations: Record<string, LocationAggregate>;
};

type SchemeAggregate = { id: string; nameEn: string; nameGu: string; sampleRows: number; locationsWithRows: number };

let indexPromise: Promise<AnalyticsIndex> | undefined;

function loadIndex() {
  if (!indexPromise) {
    const file = path.join(process.cwd(), "data", "processed", "location-analytics.json.gz");
    indexPromise = readFile(file).then((buffer) =>
      JSON.parse(gunzipSync(buffer).toString("utf8")) as AnalyticsIndex,
    ).catch((error: unknown) => {
      indexPromise = undefined;
      throw error;
    });
  }
  return indexPromise;
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const districtCode = params.get("districtCode")?.trim() || "";
  const subdistrictCode = params.get("subdistrictCode")?.trim() || "";
  const district = MASTER_DISTRICTS.find((entry) => String(entry.code) === districtCode);
  const taluka = subdistrictCode
    ? MASTER_SUBDISTRICTS.find((entry) => String(entry.code) === subdistrictCode && entry.districtCode === district?.code)
    : undefined;

  if (!district || !/^\d{3,4}$/.test(districtCode) || (subdistrictCode && (!/^\d{3,5}$/.test(subdistrictCode) || !taluka))) {
    return Response.json({ status: "error", message: "A valid Gujarat district and optional matching taluka code are required." }, { status: 400 });
  }

  try {
    const index = await loadIndex();
    const matchingLocations = Object.values(index.locations).filter((location) =>
      location.districtCode === districtCode && (!subdistrictCode || location.talukaCode === subdistrictCode),
    );
    const schemes = new Map<string, SchemeAggregate>();
    for (const location of matchingLocations) {
      for (const [id, scheme] of Object.entries(location.schemes || {})) {
        const aggregate = schemes.get(id) || { id, nameEn: scheme.nameEn, nameGu: scheme.nameGu, sampleRows: 0, locationsWithRows: 0 };
        if (scheme.count > 0) {
          aggregate.sampleRows += scheme.count;
          aggregate.locationsWithRows += 1;
        }
        schemes.set(id, aggregate);
      }
    }
    const sampleRecordCount = [...schemes.values()].reduce((sum, scheme) => sum + scheme.sampleRows, 0);
    const area = {
      level: subdistrictCode ? "taluka" : "district",
      districtCode,
      districtNameEn: district.nameEn,
      districtNameGu: district.nameGu,
      subdistrictCode: subdistrictCode || undefined,
      areaNameEn: taluka?.nameEn || district.nameEn,
      areaNameGu: taluka?.nameGu || district.nameGu,
    };
    return Response.json({
      status: "success",
      meta: index.meta,
      data: {
        area,
        locationCount: matchingLocations.length,
        sampleRecordCount,
        schemes: [...schemes.values()].sort((left, right) => left.id.localeCompare(right.id)),
      },
    }, { headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=600" } });
  } catch {
    return Response.json({ status: "unavailable", message: "Area analytics are not available. Build the supplied location analytics index first." }, { status: 503 });
  }
}
