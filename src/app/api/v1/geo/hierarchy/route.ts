import { NextRequest, NextResponse } from "next/server";
import { MASTER_DISTRICTS, MASTER_SUBDISTRICTS, getSubdistrictsForDistrict } from "@/lib/master-hierarchy";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const level = searchParams.get("level") || "districts";
  const districtCodeParam = searchParams.get("districtCode");
  const subdistrictCodeParam = searchParams.get("subdistrictCode");
  const query = (searchParams.get("q") || "").trim().toLowerCase();

  // 1. Fetch villages for a specific subdistrict
  if (subdistrictCodeParam) {
    const subCode = parseInt(subdistrictCodeParam, 10);
    const filePath = path.join(process.cwd(), "public", "data", "hierarchy", "villages", `${subCode}.json`);
    
    if (fs.existsSync(filePath)) {
      try {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        let villages = JSON.parse(fileContent);

        if (query) {
          villages = villages.filter((v: { nameEn: string; code: string }) => 
            v.nameEn.toLowerCase().includes(query) || v.code.includes(query)
          );
        }

        return NextResponse.json({
          status: "success",
          level: "villages",
          subdistrictCode: subCode,
          count: villages.length,
          data: villages,
        });
      } catch (err) {
        return NextResponse.json({ status: "error", message: "Failed reading village file" }, { status: 500 });
      }
    } else {
      return NextResponse.json({ status: "error", message: "Subdistrict not found" }, { status: 404 });
    }
  }

  // 2. Fetch subdistricts for a specific district
  if (districtCodeParam || level === "subdistricts") {
    let subdistricts = MASTER_SUBDISTRICTS;
    if (districtCodeParam) {
      const dCode = parseInt(districtCodeParam, 10);
      subdistricts = getSubdistrictsForDistrict(isNaN(dCode) ? districtCodeParam : dCode);
    }

    if (query) {
      subdistricts = subdistricts.filter((s) =>
        s.nameEn.toLowerCase().includes(query) ||
        s.nameGu.includes(query) ||
        s.districtNameEn.toLowerCase().includes(query)
      );
    }

    return NextResponse.json({
      status: "success",
      level: "subdistricts",
      count: subdistricts.length,
      data: subdistricts,
    });
  }

  // 3. Default: return all 34 districts
  let districts = MASTER_DISTRICTS;
  if (query) {
    districts = districts.filter((d) =>
      d.nameEn.toLowerCase().includes(query) ||
      d.nameGu.includes(query) ||
      d.id.includes(query)
    );
  }

  return NextResponse.json({
    status: "success",
    level: "districts",
    count: districts.length,
    data: districts,
  });
}
