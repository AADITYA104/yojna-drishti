import { NextResponse } from "next/server";
import { demoSchemes } from "@/lib/demo-data";

export async function GET() {
  return NextResponse.json({
    data: demoSchemes.map((scheme) => ({ ...scheme, verification_status: "UNVERIFIED", active: false })),
    meta: { data_mode: "DEMO", generated_at: new Date().toISOString(), requestId: crypto.randomUUID() },
  }, { headers: { "Cache-Control": "no-store" } });
}
