import { NextRequest, NextResponse } from "next/server";
import { demoDistricts } from "@/lib/demo-data";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim().toLocaleLowerCase() ?? "";
  const units = demoDistricts.filter((unit) => !query || `${unit.name} ${unit.gu}`.toLocaleLowerCase().includes(query)).map((unit) => ({
    lgd_code: unit.code,
    level: "DISTRICT",
    name_en: unit.name,
    name_gu: unit.gu,
    source_status: "SYNTHETIC_DEMO_FIXTURE",
  }));
  return NextResponse.json({
    data: units,
    meta: { data_mode: "DEMO", generated_at: new Date().toISOString(), requestId: crypto.randomUUID(), official_geography_available: false },
  }, { headers: { "Cache-Control": "no-store" } });
}
