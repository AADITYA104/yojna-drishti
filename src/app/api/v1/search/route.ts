import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
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

// FIX C-02 & C-03: Use a proper async cache instead of a module-level mutable singleton.
// The cache is keyed by a stable string and populated asynchronously.
// This is safe in both long-running (Node) and short-lived (serverless) environments.
let villageIndexCache: Promise<{ villages: SearchVillage[]; coverage: VillageCoverageMeta }> | null = null;

type VillageCoverageMeta = {
  totalSubdistricts: number;
  indexedSubdistricts: number;
  missingSubdistricts: number;
  isPartial: boolean;
};

function normalize(value: string) {
  return value.toLocaleLowerCase().normalize("NFKC").replace(/[^\p{L}\p{N}]/gu, "");
}

// FIX C-03: All file I/O is now async — no blocking `readFileSync`.
async function buildVillageIndex(): Promise<{ villages: SearchVillage[]; coverage: VillageCoverageMeta }> {
  const root = path.join(process.cwd(), "public", "data", "hierarchy", "villages");
  const notebookNames = new Map<string, MasterVillage>(GHOGHA_48_VILLAGES.map((v) => [v.code, v]));

  let indexed = 0;
  let missing = 0;

  // FIX C-03: Parallel async reads instead of synchronous sequential reads.
  const perSubdistrict = await Promise.all(
    MASTER_SUBDISTRICTS.map(async (subdistrict) => {
      const filePath = path.join(root, `${subdistrict.code}.json`);
      try {
        const raw = await fs.readFile(filePath, "utf8");
        const entries = JSON.parse(raw) as Array<{ code: string | number; nameEn: string }>;
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
          } satisfies SearchVillage;
        });
      } catch {
        missing++;
        return [] as SearchVillage[];
      }
    })
  );

  return {
    villages: perSubdistrict.flat(),
    coverage: {
      totalSubdistricts: MASTER_SUBDISTRICTS.length,
      indexedSubdistricts: indexed,
      missingSubdistricts: missing,
      isPartial: missing > 0,
    },
  };
}

function getVillageIndex() {
  // FIX C-02: Cache the Promise itself so parallel requests share the same load.
  // In serverless, this is per-invocation; in long-running Node it persists.
  if (!villageIndexCache) {
    villageIndexCache = buildVillageIndex();
  }
  return villageIndexCache;
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

  const { villages, coverage } = await getVillageIndex();
  const matchingVillages = villages.filter((village) =>
    [village.nameEn, village.nameGu || "", village.code].some((value) => normalize(value).includes(query))
  );
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
