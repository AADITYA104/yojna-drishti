import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { demoSchemes } from "@/lib/demo-data";
import {
  GHOGHA_48_VILLAGES,
  MASTER_DISTRICTS,
  MASTER_SUBDISTRICTS,
  type MasterVillage,
} from "@/lib/master-hierarchy";

type SearchVillage = { code: string; nameEn: string; nameGu?: string; subDistrictCode: number; districtCode: number };
type SearchItem = {
  id: string;
  label: string;
  detail: string;
  kind: "district" | "taluka" | "village" | "scheme";
  districtId?: string;
  subdistrictCode?: number;
  villageCode?: string;
  aliases: string[];
};

let villageIndex: SearchVillage[] | null = null;
let villageCoverageMeta = {
  totalSubdistricts: MASTER_SUBDISTRICTS.length,
  indexedSubdistricts: 0,
  missingSubdistricts: 0,
  isPartial: false,
};

function normalize(value: string) {
  return value.toLocaleLowerCase().normalize("NFKC").replace(/[^\p{L}\p{N}]/gu, "");
}

function loadVillageIndex() {
  if (villageIndex) return { villages: villageIndex, coverage: villageCoverageMeta };
  const root = path.join(process.cwd(), "public", "data", "hierarchy", "villages");
  const notebookNames = new Map<string, MasterVillage>(GHOGHA_48_VILLAGES.map((village) => [village.code, village]));
  let indexed = 0;
  let missing = 0;

  villageIndex = MASTER_SUBDISTRICTS.flatMap((subdistrict) => {
    const filePath = path.join(root, `${subdistrict.code}.json`);
    if (!fs.existsSync(filePath)) {
      missing++;
      return [];
    }
    try {
      const entries = JSON.parse(fs.readFileSync(filePath, "utf8")) as Array<{ code: string | number; nameEn: string }>;
      indexed++;
      return entries.map((entry) => {
        const code = String(entry.code);
        const notebook = notebookNames.get(code);
        return {
          code,
          nameEn: entry.nameEn,
          nameGu: notebook?.nameGu,
          subDistrictCode: subdistrict.code,
          districtCode: subdistrict.districtCode,
        };
      });
    } catch {
      missing++;
      return [];
    }
  });

  villageCoverageMeta = {
    totalSubdistricts: MASTER_SUBDISTRICTS.length,
    indexedSubdistricts: indexed,
    missingSubdistricts: missing,
    isPartial: missing > 0,
  };

  return { villages: villageIndex, coverage: villageCoverageMeta };
}

export async function GET(request: NextRequest) {
  const queryText = request.nextUrl.searchParams.get("q")?.trim() || "";
  const language = request.nextUrl.searchParams.get("lang") === "en" ? "en" : "gu";
  const query = normalize(queryText);
  if (query.length < 2) {
    return NextResponse.json({ data: [], meta: { count: 0, reason: "QUERY_TOO_SHORT" } }, { headers: { "Cache-Control": "no-store" } });
  }

  const items: SearchItem[] = [];
  for (const district of MASTER_DISTRICTS) {
    const aliases = [district.id, district.nameEn, district.nameGu, district.officialNo, String(district.code)];
    if (aliases.some((value) => normalize(value).includes(query))) {
      items.push({ id: district.id, label: language === "gu" ? district.nameGu : district.nameEn, detail: `${language === "gu" ? "જિલ્લો" : "District"} · ${district.officialNo}`, kind: "district", districtId: district.id, aliases });
    }
  }
  for (const taluka of MASTER_SUBDISTRICTS) {
    const aliases = [taluka.nameEn, taluka.nameGu, taluka.districtNameEn, taluka.districtNameGu, String(taluka.code)];
    if (aliases.some((value) => normalize(value).includes(query))) {
      items.push({ id: String(taluka.code), label: language === "gu" ? taluka.nameGu : taluka.nameEn, detail: `${language === "gu" ? taluka.districtNameGu : taluka.districtNameEn} · LGD ${taluka.code}`, kind: "taluka", districtId: taluka.districtId, subdistrictCode: taluka.code, aliases });
    }
  }

  const { villages, coverage } = loadVillageIndex();
  const matchingVillages = villages.filter((village) => [village.nameEn, village.nameGu || "", village.code].some((value) => normalize(value).includes(query)));
  for (const village of matchingVillages.slice(0, 12)) {
    const subdistrict = MASTER_SUBDISTRICTS.find((item) => item.code === village.subDistrictCode);
    const district = MASTER_DISTRICTS.find((item) => item.code === village.districtCode);
    if (!subdistrict || !district) continue;
    const aliases = [village.nameEn, village.nameGu || "", village.code];
    items.push({
      id: village.code,
      label: language === "gu" ? village.nameGu || village.nameEn : village.nameEn,
      detail: `${language === "gu" ? subdistrict.nameGu : subdistrict.nameEn} · ${language === "gu" ? district.nameGu : district.nameEn} · LGD ${village.code}`,
      kind: "village",
      districtId: district.id,
      subdistrictCode: subdistrict.code,
      villageCode: village.code,
      aliases,
    });
  }
  for (const scheme of demoSchemes) {
    const aliases = [scheme.id, scheme.name, scheme.gu, scheme.shortName, scheme.shortNameGu, scheme.department, scheme.departmentGu];
    if (aliases.some((value) => normalize(value).includes(query))) {
      items.push({ id: scheme.id, label: language === "gu" ? scheme.gu : scheme.name, detail: `${language === "gu" ? scheme.departmentGu : scheme.department} · ${language === "gu" ? "ડેમો સૂચિ" : "Demo catalogue"}`, kind: "scheme", aliases });
    }
  }

  const ranked = items
    .sort((a, b) => {
      const aStarts = [a.label, ...a.aliases].some((value) => normalize(value).startsWith(query));
      const bStarts = [b.label, ...b.aliases].some((value) => normalize(value).startsWith(query));
      return Number(bStarts) - Number(aStarts) || a.label.localeCompare(b.label);
    })
    .slice(0, 10);
  return NextResponse.json({
    data: ranked,
    meta: {
      count: ranked.length,
      data_mode: "LOCAL_HIERARCHY_AND_DEMO_CATALOGUE",
      coverage,
    },
  }, { headers: { "Cache-Control": "no-store" } });
}
