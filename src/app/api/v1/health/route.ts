import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    data: { status: "ok", mode: "DEMO", database: "not-connected" },
    meta: { data_mode: "DEMO", generated_at: new Date().toISOString(), requestId: crypto.randomUUID() },
  }, { headers: { "Cache-Control": "no-store" } });
}
