import { readFile } from "node:fs/promises";
import { gunzipSync } from "node:zlib";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SchemeAggregate = {
  id: string;
  nameEn: string;
  nameGu: string;
  count: number;
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
  meta: { classification: string; dataset: string; referenceDate: string; metricsNote: string };
  locations: Record<string, LocationAggregate>;
};

export type SettlementSummary = {
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
  schemesCount: number;
  totalRows: number;
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

function normalize(value: string) {
  return value.toLocaleLowerCase().normalize("NFKC").replace(/[^\p{L}\p{N}]/gu, "");
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const categoryParam = searchParams.get("category")?.trim(); // "Urban" | "Rural" | "All"
  const districtCodeParam = searchParams.get("districtCode")?.trim();
  const subdistrictCodeParam = searchParams.get("subdistrictCode")?.trim();
  const query = normalize(searchParams.get("q")?.trim() || "");
  const limitParam = searchParams.get("limit");

  try {
    const index = await loadIndex();
    let settlements = Object.values(index.locations);

    if (categoryParam && categoryParam !== "All") {
      settlements = settlements.filter(
        (l) => l.category?.toLowerCase() === categoryParam.toLowerCase()
      );
    }

    if (districtCodeParam) {
      settlements = settlements.filter((l) => l.districtCode === districtCodeParam);
    }

    if (subdistrictCodeParam) {
      settlements = settlements.filter((l) => l.talukaCode === subdistrictCodeParam);
    }

    if (query) {
      settlements = settlements.filter((l) => {
        const en = normalize(l.nameEn || "");
        const gu = normalize(l.nameGu || "");
        const tEn = normalize(l.talukaEn || "");
        const tGu = normalize(l.talukaGu || "");
        const dEn = normalize(l.districtEn || "");
        const dGu = normalize(l.districtGu || "");
        return en.includes(query) || gu.includes(query) || l.code.includes(query) ||
               tEn.includes(query) || tGu.includes(query) || dEn.includes(query) || dGu.includes(query);
      });
    }

    const totalCount = settlements.length;

    // Apply limit if specified, else if category is Urban return all 618, else default 100 for Rural
    let limit = 100;
    if (limitParam === "all" || (!limitParam && categoryParam?.toLowerCase() === "urban")) {
      limit = totalCount;
    } else if (limitParam) {
      const parsed = parseInt(limitParam, 10);
      if (!isNaN(parsed) && parsed > 0) limit = parsed;
    }

    const items: SettlementSummary[] = settlements.slice(0, limit).map((l) => ({
      code: l.code,
      nameEn: l.nameEn,
      nameGu: l.nameGu,
      category: l.category,
      talukaCode: l.talukaCode,
      talukaEn: l.talukaEn,
      talukaGu: l.talukaGu,
      districtCode: l.districtCode,
      districtEn: l.districtEn,
      districtGu: l.districtGu,
      schemesCount: Object.keys(l.schemes || {}).length,
      totalRows: Object.values(l.schemes || {}).reduce((sum, s) => sum + (s.count || 0), 0),
    }));

    return NextResponse.json({
      status: "success",
      meta: {
        total: totalCount,
        returned: items.length,
        category: categoryParam || "All",
        districtCode: districtCodeParam || null,
        subdistrictCode: subdistrictCodeParam || null,
      },
      data: items,
    }, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch {
    return NextResponse.json(
      { status: "unavailable", message: "Settlement analytics are unavailable." },
      { status: 503 }
    );
  }
}
