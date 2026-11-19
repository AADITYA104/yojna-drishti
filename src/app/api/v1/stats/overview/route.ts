import { NextResponse } from "next/server";

export async function GET() {
  const unavailable = (unit: string) => ({ value: null, unit, reason_code: "OFFICIAL_SOURCE_NOT_CONNECTED", suppressed: true });
  return NextResponse.json({
    status: "unavailable",
    data: {
      beneficiaries: unavailable("count"),
      applications: unavailable("count"),
      approved: unavailable("count"),
      disbursed: unavailable("inr"),
      geography: { districts: null, talukas: null, villages: null, reason_code: "OFFICIAL_LGD_DATA_PENDING" },
    },
    meta: { data_mode: "OFFICIAL_DATA_NOT_CONNECTED", financial_year: null, sources: [], data_as_of: null, generated_at: new Date().toISOString(), requestId: crypto.randomUUID() },
  }, { headers: { "Cache-Control": "no-store" } });
}
