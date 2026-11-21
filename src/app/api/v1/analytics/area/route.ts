import { readFile } from "node:fs/promises";
import { gunzipSync } from "node:zlib";
import path from "node:path";
import { MASTER_DISTRICTS, MASTER_SUBDISTRICTS } from "@/lib/master-hierarchy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Bucket = Record<string, number>;

type SchemeAggregate = {
  id: string;
  nameEn: string;
  nameGu: string;
  count: number;
  activity: Bucket;
  gender: Bucket;
  eligibility: Bucket;
};

type LocationAggregate = {
  code: string;
  nameEn: string;
  nameGu: string;
  category: string;
  districtCode: string;
  districtEn: string;
  districtGu: string;
  talukaCode: string;
  talukaEn: string;
  talukaGu: string;
  schemes: Record<string, SchemeAggregate>;
};

type AnalyticsIndex = {
  meta: { classification: string; dataset: string; referenceDate: string; metricsNote: string };
  locations: Record<string, LocationAggregate>;
};

type AreaSchemeSummary = {
  id: string;
  nameEn: string;
  nameGu: string;
  sampleRows: number;
  locationsWithRows: number;
  activity: Bucket;
  gender: Bucket;
};

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

    let urbanCount = 0;
    let ruralCount = 0;
    const urbanLocationsList: Array<{ code: string; nameEn: string; nameGu: string; talukaEn: string; talukaGu: string; sampleRows: number }> = [];

    const schemes = new Map<string, AreaSchemeSummary>();
    const totalActivity: Bucket = {};
    const totalGender: Bucket = {};

    for (const location of matchingLocations) {
      if (location.category === "Urban") {
        urbanCount++;
        const totalRows = Object.values(location.schemes || {}).reduce((sum, s) => sum + (s.count || 0), 0);
        if (urbanLocationsList.length < 50) {
          urbanLocationsList.push({
            code: location.code,
            nameEn: location.nameEn,
            nameGu: location.nameGu,
            talukaEn: location.talukaEn,
            talukaGu: location.talukaGu,
            sampleRows: totalRows,
          });
        }
      } else {
        ruralCount++;
      }

      for (const [id, scheme] of Object.entries(location.schemes || {})) {
        let aggregate = schemes.get(id);
        if (!aggregate) {
          aggregate = {
            id,
            nameEn: scheme.nameEn,
            nameGu: scheme.nameGu,
            sampleRows: 0,
            locationsWithRows: 0,
            activity: {},
            gender: {},
          };
          schemes.set(id, aggregate);
        }

        if (scheme.count > 0) {
          aggregate.sampleRows += scheme.count;
          aggregate.locationsWithRows += 1;

          if (scheme.activity) {
            for (const [key, val] of Object.entries(scheme.activity)) {
              aggregate.activity[key] = (aggregate.activity[key] || 0) + val;
              totalActivity[key] = (totalActivity[key] || 0) + val;
            }
          }

          if (scheme.gender) {
            for (const [key, val] of Object.entries(scheme.gender)) {
              aggregate.gender[key] = (aggregate.gender[key] || 0) + val;
              totalGender[key] = (totalGender[key] || 0) + val;
            }
          }
        }
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
        urbanCount,
        ruralCount,
        sampleRecordCount,
        totalActivity,
        totalGender,
        urbanLocations: urbanLocationsList,
        schemes: [...schemes.values()].sort((left, right) => left.id.localeCompare(right.id)),
      },
    }, { headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=600" } });
  } catch {
    return Response.json({ status: "unavailable", message: "Area analytics are not available. Build the supplied location analytics index first." }, { status: 503 });
  }
}
