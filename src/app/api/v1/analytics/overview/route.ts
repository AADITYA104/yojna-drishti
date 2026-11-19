import { readFile } from "node:fs/promises";
import { gunzipSync } from "node:zlib";
import path from "node:path";
import { MASTER_DISTRICTS } from "@/lib/master-hierarchy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Counts = Record<string, number>;
type SchemeAggregate = {
  id: string;
  nameEn: string;
  nameGu: string;
  count: number;
  eligibility: Counts;
  activity: Counts;
  documents: Counts;
  gender: Counts;
  ageBands: Counts;
};
type LocationAggregate = {
  districtCode: string;
  schemes: Record<string, SchemeAggregate>;
};
type AnalyticsIndex = {
  meta: { classification: string; dataset: string; referenceDate: string; metricsNote: string; sourceRowsAggregated: number };
  locations: Record<string, LocationAggregate>;
};

let indexPromise: Promise<AnalyticsIndex> | undefined;

function loadIndex() {
  if (!indexPromise) {
    const file = path.join(process.cwd(), "data", "processed", "location-analytics.json.gz");
    indexPromise = readFile(file)
      .then((buffer) => JSON.parse(gunzipSync(buffer).toString("utf8")) as AnalyticsIndex)
      .catch((error: unknown) => {
        indexPromise = undefined;
        throw error;
      });
  }
  return indexPromise;
}

function addCounts(target: Counts, source: Counts) {
  for (const [key, value] of Object.entries(source || {})) target[key] = (target[key] || 0) + value;
}

export async function GET() {
  try {
    const index = await loadIndex();
    const schemes = new Map<string, SchemeAggregate>();
    const districts = new Map<string, { districtCode: string; nameEn: string; nameGu: string; locationCount: number; sampleRows: number; schemeIds: Set<string> }>();
    const demographics = { ageBands: {} as Counts, gender: {} as Counts, eligibility: {} as Counts, activity: {} as Counts, documents: {} as Counts };
    let sourceRows = 0;

    for (const location of Object.values(index.locations)) {
      const districtCode = location.districtCode;
      const districtMaster = MASTER_DISTRICTS.find((entry) => String(entry.code) === districtCode);
      const district = districts.get(districtCode) || {
        districtCode,
        nameEn: districtMaster?.nameEn || districtCode,
        nameGu: districtMaster?.nameGu || districtCode,
        locationCount: 0,
        sampleRows: 0,
        schemeIds: new Set<string>(),
      };
      district.locationCount += 1;

      for (const [id, item] of Object.entries(location.schemes || {})) {
        const scheme = schemes.get(id) || {
          id,
          nameEn: item.nameEn,
          nameGu: item.nameGu,
          count: 0,
          eligibility: {},
          activity: {},
          documents: {},
          gender: {},
          ageBands: {},
        };
        scheme.count += item.count;
        addCounts(scheme.eligibility, item.eligibility);
        addCounts(scheme.activity, item.activity);
        addCounts(scheme.documents, item.documents);
        addCounts(scheme.gender, item.gender);
        addCounts(scheme.ageBands, item.ageBands);
        schemes.set(id, scheme);

        district.sampleRows += item.count;
        district.schemeIds.add(id);
        sourceRows += item.count;
        addCounts(demographics.ageBands, item.ageBands);
        addCounts(demographics.gender, item.gender);
        addCounts(demographics.eligibility, item.eligibility);
        addCounts(demographics.activity, item.activity);
        addCounts(demographics.documents, item.documents);
      }
      districts.set(districtCode, district);
    }

    return Response.json({
      status: "success",
      meta: {
        ...index.meta,
        classification: "SYNTHETIC DEMO ONLY — COUNTS ARE SAMPLE ROWS, NOT PEOPLE OR OFFICIAL SCHEME DELIVERY",
        locationCount: Object.keys(index.locations).length,
        districtCount: districts.size,
        schemeCount: schemes.size,
        sourceRows,
      },
      data: {
        schemes: [...schemes.values()].sort((left, right) => left.id.localeCompare(right.id)),
        districts: [...districts.values()]
          .map(({ schemeIds, ...district }) => ({ ...district, schemeCount: schemeIds.size }))
          .sort((left, right) => right.sampleRows - left.sampleRows),
        demographics,
      },
    }, { headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=600" } });
  } catch {
    return Response.json({ status: "unavailable", message: "Dataset overview is unavailable until the location analytics index is configured." }, { status: 503 });
  }
}
