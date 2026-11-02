import { NextResponse } from "next/server";
import { demoDistricts } from "@/lib/demo-data";

export async function GET() {
  const metrics = demoDistricts.reduce((total, district) => ({
    beneficiaries: total.beneficiaries + district.beneficiaries,
    applications: total.applications + district.applications,
    approved: total.approved + district.approved,
    disbursed: total.disbursed + district.disbursed,
  }), { beneficiaries: 0, applications: 0, approved: 0, disbursed: 0 });
  return NextResponse.json({
    data: {
      ...Object.fromEntries(Object.entries(metrics).map(([key, value]) => [key, { value: key === "disbursed" ? value * 10_000_000 : value, unit: key === "disbursed" ? "inr" : "count", reason_code: "SYNTHETIC_FIXTURE", suppressed: false }])),
      geography: { districts: null, talukas: null, villages: null, reason_code: "OFFICIAL_LGD_DATA_PENDING" },
    },
    meta: { data_mode: "DEMO", financial_year: "2025-26", sources: [], data_as_of: null, generated_at: new Date().toISOString(), requestId: crypto.randomUUID() },
  }, { headers: { "Cache-Control": "no-store" } });
}
