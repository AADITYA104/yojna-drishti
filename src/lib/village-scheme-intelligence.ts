import {
  GHOGHA_48_VILLAGES,
  MASTER_DISTRICTS,
  MASTER_SUBDISTRICTS,
  NOTEBOOK_WOMEN_SCHEMES,
  type MasterVillage,
} from "@/lib/master-hierarchy";

export interface VillageActiveScheme {
  schemeId: string;
  schemeNameGu: string;
  schemeNameEn: string;
  categoryGu: string;
  categoryEn: string;
  beneficiaries: number;
  grantLakhs: number;
  saturationPct: number;
}

export interface CitizenBeneficiaryRecord {
  id: string;
  nameGu: string;
  nameEn: string;
  guardianGu: string;
  guardianEn: string;
  gender: "M" | "F";
  schemeNameGu: string;
  schemeNameEn: string;
  amount: number;
  statusGu: string;
  statusEn: string;
  date: string;
  bankRef: string;
  applicationId: string;
}

export interface EnhancedVillageRecord {
  code: string;
  nameGu: string;
  nameEn: string;
  talukaCode: number;
  talukaNameGu: string;
  talukaNameEn: string;
  districtId: string;
  districtNameGu: string;
  districtNameEn: string;
  households: number;
  population: number;
  femalePopulation: number;
  disbursedLakhs: number;
  beneficiaries: number;
  saturationPct: number;
  activeSchemes: VillageActiveScheme[];
  beneficiaryRoster: CitizenBeneficiaryRecord[];
}

const COMMON_GUJ_SCHEMES = [
  {
    id: "kisan-sahay",
    nameEn: "Mukhyamantri Kisan Sahay Yojana",
    nameGu: "મુખ્યમંત્રી કિસાન સહાય યોજના",
    categoryEn: "Agriculture",
    categoryGu: "ખેતીવાડી",
    avgBenefit: 12000,
  },
  {
    id: "vahali-dikri",
    nameEn: "Vahali Dikri Yojana",
    nameGu: "વ્હાલી દીકરી યોજના",
    categoryEn: "Women & Child",
    categoryGu: "મહિલા અને બાળકલ્યાણ",
    avgBenefit: 50000,
  },
  {
    id: "namo-lakshmi",
    nameEn: "Namo Lakshmi Yojana",
    nameGu: "નમો લક્ષ્મી યોજના",
    categoryEn: "Education",
    categoryGu: "શિક્ષણ",
    avgBenefit: 10000,
  },
  {
    id: "pm-awas-gramin",
    nameEn: "PM Awas Yojana (Gramin)",
    nameGu: "પ્રધાનમંત્રી આવાસ યોજના (ગ્રામીણ)",
    categoryEn: "Housing",
    categoryGu: "આવાસ",
    avgBenefit: 120000,
  },
  {
    id: "maa-card",
    nameEn: "Mukhyamantri Amrutam / PM-JAY",
    nameGu: "મુખ્યમંત્રી અમૃતમ (મા અમૃતમ) / PM-JAY",
    categoryEn: "Health",
    categoryGu: "આરોગ્ય",
    avgBenefit: 500000,
  },
  {
    id: "ganga-swarupa",
    nameEn: "Ganga Swarupa Sahay (Widow Pension)",
    nameGu: "ગંગા સ્વરૂપા સહાય યોજના (વિધવા સહાય)",
    categoryEn: "Social Welfare",
    categoryGu: "સામાજિક ન્યાય",
    avgBenefit: 15000,
  },
  {
    id: "vidhyadeep",
    nameEn: "Vidhyadeep Bima Yojana",
    nameGu: "વિદ્યાદીપ વીમા યોજના",
    categoryEn: "Education",
    categoryGu: "શિક્ષણ",
    avgBenefit: 50000,
  },
  {
    id: "surya-gujarat",
    nameEn: "Surya Gujarat Solar Subsidy",
    nameGu: "સૂર્ય શક્તિ કિસાન અને સોલાર યોજના",
    categoryEn: "Energy",
    categoryGu: "ઊર્જા અને કિસાન",
    avgBenefit: 28000,
  },
];

const CITIZEN_SAMPLE_NAMES: {
  m: { nameGu: string; nameEn: string; gGu: string; gEn: string }[];
  f: { nameGu: string; nameEn: string; gGu: string; gEn: string }[];
} = {
  m: [
    { nameGu: "રમેશભાઈ કે. પટેલ", nameEn: "Rameshbhai K. Patel", gGu: "કાનજીભાઈ", gEn: "Kanjibhai" },
    { nameGu: "કિરણભાઈ ડી. સોલંકી", nameEn: "Kiranbhai D. Solanki", gGu: "દેવજીભાઈ", gEn: "Devjibhai" },
    { nameGu: "હસમુખભાઈ બી. ગોહિલ", nameEn: "Hasmukhbhai B. Gohil", gGu: "ભીમજીભાઈ", gEn: "Bhimjibhai" },
    { nameGu: "જીતેન્દ્રસિંહ એમ. ઝાલા", nameEn: "Jitendrasinh M. Zala", gGu: "મહિપતસિંહ", gEn: "Mahipatsinh" },
    { nameGu: "ભરતભાઈ પી. વાઘેલા", nameEn: "Bharatbhai P. Vaghela", gGu: "પ્રવીણભાઈ", gEn: "Pravinbhai" },
    { nameGu: "મનોજભાઈ એસ. શાહ", nameEn: "Manojbhai S. Shah", gGu: "શાંતિલાલ", gEn: "Shantilal" },
    { nameGu: "અલ્પેશભાઈ આર. ચૌહાણ", nameEn: "Alpeshbhai R. Chauhan", gGu: "રમેશચંદ્ર", gEn: "Rameshchandra" },
    { nameGu: "દિનેશભાઈ વી. જોશી", nameEn: "Dineshbhai V. Joshi", gGu: "વિષ્ણુપ્રસાદ", gEn: "Vishnuprasad" },
    { nameGu: "પ્રકાશભાઈ એલ. પંડ્યા", nameEn: "Prakashbhai L. Pandya", gGu: "લક્ષ્મીશંકર", gEn: "Lakshmishankar" },
    { nameGu: "રાજેશભાઈ ટી. મેવાડા", nameEn: "Rajeshbhai T. Mewada", gGu: "તુલસીદાસ", gEn: "Tulsidas" },
  ],
  f: [
    { nameGu: "ગીતાબેન એમ. રાઠોડ", nameEn: "Geetaben M. Rathod", gGu: "મહેશભાઈ", gEn: "Maheshbhai" },
    { nameGu: "શાંતાબેન વી. ગોહિલ", nameEn: "Shantaben V. Gohil", gGu: "વાલાજીભાઈ", gEn: "Valjibhai" },
    { nameGu: "દક્ષાબેન જે. ઝાલા", nameEn: "Dakshaben J. Zala", gGu: "જીતેન્દ્રસિંહ", gEn: "Jitendrasinh" },
    { nameGu: "ભાવનાબેન કે. પટેલ", nameEn: "Bhavnaben K. Patel", gGu: "કાંતિલાલ", gEn: "Kantilal" },
    { nameGu: "મંજુલાબેન આર. પરમાર", nameEn: "Manjulaben R. Parmar", gGu: "રમેશચંદ્ર", gEn: "Rameshchandra" },
    { nameGu: "પૂજાબેન એન. દવે", nameEn: "Poojaben N. Dave", gGu: "નરેશભાઈ", gEn: "Nareshbhai" },
    { nameGu: "કોકિલાબેન બી. વાઘેલા", nameEn: "Kokilaben B. Vaghela", gGu: "ભરતભાઈ", gEn: "Bharatbhai" },
    { nameGu: "ચેતનાબેન ડી. ચાવડા", nameEn: "Chetnaben D. Chavda", gGu: "દિલીપસિંહ", gEn: "Dilipsinh" },
    { nameGu: "મીનાબેન કે. ત્રિવેદી", nameEn: "Meenaben K. Trivedi", gGu: "કલ્પેશભાઈ", gEn: "Kalpeshbhai" },
    { nameGu: "હર્ષાબેન એમ. સોલંકી", nameEn: "Harshaben M. Solanki", gGu: "મનોજભાઈ", gEn: "Manojbhai" },
  ],
};

function generateRosterForVillage(villageCode: string, villageNameGu: string, villageNameEn: string, schemes: VillageActiveScheme[]): CitizenBeneficiaryRecord[] {
  const seed = villageCode.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const records: CitizenBeneficiaryRecord[] = [];
  const count = 12;

  for (let i = 0; i < count; i++) {
    const isFemale = (i + seed) % 2 === 0;
    const pool = isFemale ? CITIZEN_SAMPLE_NAMES.f : CITIZEN_SAMPLE_NAMES.m;
    const person = pool[(i + seed) % pool.length];
    const scheme = schemes[i % schemes.length] || COMMON_GUJ_SCHEMES[0];
    const day = ((seed + i * 3) % 27) + 1;
    const month = ((seed + i) % 11) + 1;
    const year = 2026;
    const appNo = `GJ/${year}/${villageCode.slice(-4)}/${1000 + i * 47}`;
    const bankSuffix = (1000 + ((seed * 17 + i * 79) % 8999));
    const bankName = i % 3 === 0 ? "SBI" : i % 3 === 1 ? "Bank of Baroda" : "HDFC Bank";

    let amount = 12000;
    if (scheme.schemeId.includes("dikri")) amount = 50000;
    else if (scheme.schemeId.includes("awas")) amount = 120000;
    else if (scheme.schemeId.includes("lakshmi")) amount = 10000;
    else if (scheme.schemeId.includes("ganga")) amount = 15000;
    else if (scheme.schemeId.includes("sahay")) amount = 12000;
    else amount = 25000;

    records.push({
      id: `${villageCode}-BEN-${i + 1}`,
      nameGu: person.nameGu,
      nameEn: person.nameEn,
      guardianGu: person.gGu,
      guardianEn: person.gEn,
      gender: isFemale ? "F" : "M",
      schemeNameGu: scheme.schemeNameGu,
      schemeNameEn: scheme.schemeNameEn,
      amount,
      statusGu: "DBT બેંક ખાતામાં જમા થયેલ",
      statusEn: "DBT Direct Credited",
      date: `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`,
      bankRef: `${bankName} (A/C **${bankSuffix})`,
      applicationId: appNo,
    });
  }

  return records;
}

function buildSchemesForVillage(seed: number, beneficiaries: number, disbursedLakhs: number): VillageActiveScheme[] {
  const schemeIndices = [
    seed % COMMON_GUJ_SCHEMES.length,
    (seed + 2) % COMMON_GUJ_SCHEMES.length,
    (seed + 4) % COMMON_GUJ_SCHEMES.length,
    (seed + 6) % COMMON_GUJ_SCHEMES.length,
  ];
  const unique = [...new Set(schemeIndices)];

  return unique.map((idx, i) => {
    const s = COMMON_GUJ_SCHEMES[idx];
    const weight = i === 0 ? 0.4 : i === 1 ? 0.3 : i === 2 ? 0.2 : 0.1;
    const schemeBen = Math.max(12, Math.round(beneficiaries * weight));
    const grant = Number((disbursedLakhs * weight).toFixed(1));
    const saturation = Math.min(99, Math.round(82 + ((seed * 7 + i * 13) % 17)));

    return {
      schemeId: s.id,
      schemeNameGu: s.nameGu,
      schemeNameEn: s.nameEn,
      categoryGu: s.categoryGu,
      categoryEn: s.categoryEn,
      beneficiaries: schemeBen,
      grantLakhs: grant,
      saturationPct: saturation,
    };
  });
}

// 1. Convert Ghogha 48 villages to EnhancedVillageRecord
export const ALL_GHOGHA_ENHANCED_VILLAGES: EnhancedVillageRecord[] = GHOGHA_48_VILLAGES.map((v, idx) => {
  const seed = idx + 101;
  const activeSchemes = buildSchemesForVillage(seed, v.beneficiaries, v.disbursedLakhs);
  const saturationPct = Math.min(99, Math.round(86 + (seed % 13)));
  return {
    code: v.code,
    nameGu: v.nameGu,
    nameEn: v.nameEn,
    talukaCode: 3855,
    talukaNameGu: "ઘોઘા",
    talukaNameEn: "Ghogha",
    districtId: "bhavnagar",
    districtNameGu: "ભાવનગર",
    districtNameEn: "Bhavnagar",
    households: v.households,
    population: v.population,
    femalePopulation: v.femalePopulation,
    disbursedLakhs: v.disbursedLakhs,
    beneficiaries: v.beneficiaries,
    saturationPct,
    activeSchemes,
    beneficiaryRoster: generateRosterForVillage(v.code, v.nameGu, v.nameEn, activeSchemes),
  };
});

// 2. Procedural Authentic Village Database for other districts/talukas
const SAMPLE_TALUKA_VILLAGE_NAMES: Record<string, { en: string; gu: string }[]> = {
  sanand: [
    { en: "Sanand Gam", gu: "સાણંદ ગામ" },
    { en: "Sarvodaya", gu: "સર્વોદય" },
    { en: "Nidhrad", gu: "નિધરાડ" },
    { en: "Godhavi", gu: "ગોધાવી" },
    { en: "Telav", gu: "તેલાવ" },
    { en: "Kaneti", gu: "કાણેટી" },
    { en: "Modasar", gu: "મોદાસર" },
    { en: "Shela", gu: "શેલા" },
    { en: "Bopal Gramin", gu: "બોપલ ગ્રામીણ" },
    { en: "Manipur", gu: "મણિપુર" },
    { en: "Kolam", gu: "કોલમ" },
    { en: "Zundal Gam", gu: "ઝુંડાલ ગામ" },
  ],
  gondal: [
    { en: "Gondal Rural", gu: "ગોંડલ રૂરલ" },
    { en: "Gomta", gu: "ગોમટા" },
    { en: "Derdi", gu: "દેરડી" },
    { en: "Bandhiya", gu: "બાંધિયા" },
    { en: "Ribda", gu: "રીબડા" },
    { en: "Bhojpara", gu: "ભોજપરા" },
    { en: "Shivrajgadh", gu: "શિવરાજગઢ" },
    { en: "Kamadhiya", gu: "કામઢિયા" },
    { en: "Kotda Sangani", gu: "કોટડા સાંગાણી" },
    { en: "Hadamtala", gu: "હડમતાળા" },
  ],
  bhuj: [
    { en: "Madhapar", gu: "માધાપર" },
    { en: "Kukma", gu: "કુકમા" },
    { en: "Mirzapar", gu: "મિર્ઝાપર" },
    { en: "Baladiya", gu: "બળદિયા" },
    { en: "Sukhpar", gu: "સુખપર" },
    { en: "Reha", gu: "રેહા" },
    { en: "Kodki", gu: "કોડકી" },
    { en: "Mankuva", gu: "માનકુવા" },
    { en: "Khavda", gu: "ખાવડા" },
    { en: "Loria", gu: "લોરિયા" },
  ],
  olpad: [
    { en: "Olpad Gam", gu: "ઓલપાડ ગામ" },
    { en: "Sayan", gu: "સાયણ" },
    { en: "Kim", gu: "કીમ" },
    { en: "Kudsad", gu: "કુડસદ" },
    { en: "Karanj", gu: "કારંજ" },
    { en: "Masma", gu: "મસમા" },
    { en: "Mulad", gu: "મુલાદ" },
    { en: "Kosamba Gramin", gu: "કોસંબા ગ્રામીણ" },
  ],
  padra: [
    { en: "Padra Rural", gu: "પાદરા રૂરલ" },
    { en: "Mobha", gu: "મોભા" },
    { en: "Luna", gu: "લુણા" },
    { en: "Chokari", gu: "ચોકારી" },
    { en: "Dabhasa", gu: "ડભાસા" },
    { en: "Lalpur", gu: "લાલપુર" },
    { en: "Sultanpura", gu: "સુલતાનપુરા" },
    { en: "Gayasad", gu: "ગાયાસદ" },
  ],
  palanpur: [
    { en: "Gadh", gu: "ગઢ" },
    { en: "Chandisar", gu: "ચંડીસર" },
    { en: "Malana", gu: "માલણા" },
    { en: "Sedrasana", gu: "સેદ્રાસણા" },
    { en: "Jasleni", gu: "જસલેણી" },
    { en: "Kharodiya", gu: "ખરોડિયા" },
    { en: "Hathidra", gu: "હાથીદ્રા" },
    { en: "Morriya", gu: "મોરીયા" },
  ],
};

const DEFAULT_GENERIC_NAMES = [
  { en: "Sarvodaya Nagar", gu: "સર્વોદય નગર" },
  { en: "Navagam", gu: "નવાગામ" },
  { en: "Kalyanpur", gu: "કલ્યાણપુર" },
  { en: "Shantiniketan", gu: "શાંતિનિકેતન" },
  { en: "Vasantpura", gu: "વસંતપુરા" },
  { en: "Rampara", gu: "રામપરા" },
  { en: "Gokulnagar", gu: "ગોકુળનગર" },
  { en: "Ambaji Pura", gu: "અંબાજી પુરા" },
  { en: "Sardar Patel Nagar", gu: "સરદાર પટેલ નગર" },
  { en: "Shivaji Nagar Gramin", gu: "શિવાજી નગર ગ્રામીણ" },
  { en: "Jivrajpur", gu: "જીવરાજપુર" },
  { en: "Madhupura", gu: "મધુપુરા" },
];

export function getVillagesForSubdistrict(
  subdistrictCode: number,
  districtId: string
): EnhancedVillageRecord[] {
  if (subdistrictCode === 3855) {
    return ALL_GHOGHA_ENHANCED_VILLAGES;
  }

  const subdistrict = MASTER_SUBDISTRICTS.find((s) => s.code === subdistrictCode);
  const district = MASTER_DISTRICTS.find((d) => d.id === districtId);

  const tNameEn = subdistrict?.nameEn || "Taluka";
  const tNameGu = subdistrict?.nameGu || "તાલુકો";
  const dNameEn = district?.nameEn || districtId;
  const dNameGu = district?.nameGu || districtId;

  // Key check for preset names
  const key = tNameEn.toLowerCase();
  const namePool = SAMPLE_TALUKA_VILLAGE_NAMES[key] || DEFAULT_GENERIC_NAMES;

  return namePool.map((item, idx) => {
    const code = String(subdistrictCode * 100 + idx + 1);
    const households = 320 + ((subdistrictCode + idx * 83) % 450);
    const population = households * 4 + ((subdistrictCode + idx * 31) % 180);
    const femalePopulation = Math.round(population * 0.49);
    const beneficiaries = Math.round(households * 0.78 + (idx * 11));
    const disbursedLakhs = Number((18.5 + ((subdistrictCode * 3 + idx * 7) % 35)).toFixed(1));
    const saturationPct = Math.min(99, Math.round(84 + ((idx * 7) % 15)));

    const activeSchemes = buildSchemesForVillage(subdistrictCode + idx, beneficiaries, disbursedLakhs);

    return {
      code,
      nameGu: item.gu,
      nameEn: item.en,
      talukaCode: subdistrictCode,
      talukaNameGu: tNameGu,
      talukaNameEn: tNameEn,
      districtId,
      districtNameGu: dNameGu,
      districtNameEn: dNameEn,
      households,
      population,
      femalePopulation,
      disbursedLakhs,
      beneficiaries,
      saturationPct,
      activeSchemes,
      beneficiaryRoster: generateRosterForVillage(code, item.gu, item.en, activeSchemes),
    };
  });
}

export function searchVillagesAcrossGujarat(query: string, districtId?: string): EnhancedVillageRecord[] {
  const term = query.trim().toLowerCase();
  if (!term && !districtId) {
    return ALL_GHOGHA_ENHANCED_VILLAGES.slice(0, 16);
  }

  // Pre-gather Ghogha villages
  let pool: EnhancedVillageRecord[] = [...ALL_GHOGHA_ENHANCED_VILLAGES];

  // Also include popular taluka sample villages
  const presetKeys = Object.keys(SAMPLE_TALUKA_VILLAGE_NAMES);
  for (const pKey of presetKeys) {
    const sub = MASTER_SUBDISTRICTS.find((s) => s.nameEn.toLowerCase() === pKey);
    if (sub) {
      pool.push(...getVillagesForSubdistrict(sub.code, sub.districtId));
    }
  }

  // If districtId is provided and different from bhavnagar, inject that district's first subdistrict villages
  if (districtId && districtId !== "bhavnagar") {
    const subs = MASTER_SUBDISTRICTS.filter((s) => s.districtId === districtId);
    if (subs.length > 0) {
      pool.push(...getVillagesForSubdistrict(subs[0].code, districtId));
      if (subs.length > 1) {
        pool.push(...getVillagesForSubdistrict(subs[1].code, districtId));
      }
    }
  }

  // Filter by district if specified
  if (districtId && districtId !== "all") {
    pool = pool.filter((v) => v.districtId === districtId);
  }

  if (!term) {
    return pool.slice(0, 24);
  }

  return pool.filter((v) => {
    return (
      v.nameEn.toLowerCase().includes(term) ||
      v.nameGu.includes(term) ||
      v.talukaNameEn.toLowerCase().includes(term) ||
      v.talukaNameGu.includes(term) ||
      v.code.includes(term) ||
      v.activeSchemes.some((s) => s.schemeNameEn.toLowerCase().includes(term) || s.schemeNameGu.includes(term))
    );
  }).slice(0, 24);
}
