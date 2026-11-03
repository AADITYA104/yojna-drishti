// YOJANA DRISHTI - Master Geographic & Scheme Intelligence
// Ingested from Image 2 (34 Districts Official Specs) and LGD Master Directory (309 Subdistricts, 19,201 Villages)

export interface MasterDistrict {
  officialNo: string; // 01 to 34 from Image 2
  code: number;
  id: string;
  nameEn: string;
  nameGu: string;
  areaKm2: number; // Official km² from Image 2
  subDistrictCount: number;
  villageCount: number;
  centroid: { x: number; y: number };
}

export interface MasterSubdistrict {
  code: number;
  id: string;
  districtCode: number;
  districtId: string;
  districtNameEn: string;
  districtNameGu: string;
  nameEn: string;
  nameGu: string;
  villageCount: number;
}

export interface MasterVillage {
  code: string;
  id: string;
  nameEn: string;
  nameGu: string;
  subDistrictCode: number;
  districtCode: number;
  category: string;
  status: string;
  venueGu: string;
  venueEn: string;
  households: number;
  population: number;
  femalePopulation: number;
  beneficiaries: number;
  applications: number;
  approved: number;
  disbursedLakhs: number;
  anganwadis: number;
  coordinates: { x: number; y: number };
}

export interface NotebookScheme {
  id: string;
  nameEn: string;
  nameGu: string;
  notebookCategory: string;
  categoryGu: string;
  benefit: string;
  benefitGu: string;
  target: string;
  targetGu: string;
  activeBeneficiaries: number;
  disbursedCr: number;
}

// ========================================================
// 1. ALL 34 DISTRICTS OF GUJARAT (OFFICIAL 01 TO 34 FROM IMAGE 2)
// ========================================================
export const MASTER_DISTRICTS: MasterDistrict[] = [
  {
    "officialNo": "GJ-01",
    "code": 438,
    "id": "ahmedabad",
    "nameEn": "Ahmedabad",
    "nameGu": "અમદાવાદ",
    "areaKm2": 8719,
    "subDistrictCount": 21,
    "villageCount": 832,
    "centroid": {
      "x": 268,
      "y": 142
    }
  },
  {
    "officialNo": "GJ-14",
    "code": 439,
    "id": "amreli",
    "nameEn": "Amreli",
    "nameGu": "અમરેલી",
    "areaKm2": 6577,
    "subDistrictCount": 12,
    "villageCount": 630,
    "centroid": {
      "x": 216,
      "y": 222
    }
  },
  {
    "officialNo": "GJ-23",
    "code": 440,
    "id": "anand",
    "nameEn": "Anand",
    "nameGu": "આણંદ",
    "areaKm2": 2654,
    "subDistrictCount": 9,
    "villageCount": 360,
    "centroid": {
      "x": 290,
      "y": 168
    }
  },
  {
    "officialNo": "GJ-31",
    "code": 672,
    "id": "aravalli",
    "nameEn": "Arvalli",
    "nameGu": "અરવલ્લી",
    "areaKm2": 3068,
    "subDistrictCount": 8,
    "villageCount": 689,
    "centroid": {
      "x": 312,
      "y": 105
    }
  },
  {
    "officialNo": "GJ-08",
    "code": 441,
    "id": "banaskantha",
    "nameEn": "Banas Kantha",
    "nameGu": "બનાસકાંઠા",
    "areaKm2": 12057,
    "subDistrictCount": 12,
    "villageCount": 848,
    "centroid": {
      "x": 242,
      "y": 42
    }
  },
  {
    "officialNo": "GJ-16",
    "code": 442,
    "id": "bharuch",
    "nameEn": "Bharuch",
    "nameGu": "ભરૂચ",
    "areaKm2": 5235,
    "subDistrictCount": 10,
    "villageCount": 680,
    "centroid": {
      "x": 308,
      "y": 208
    }
  },
  {
    "officialNo": "GJ-04",
    "code": 443,
    "id": "bhavnagar",
    "nameEn": "Bhavnagar",
    "nameGu": "ભાવનગર",
    "areaKm2": 10643,
    "subDistrictCount": 10,
    "villageCount": 526,
    "centroid": {
      "x": 262,
      "y": 213
    }
  },
  {
    "officialNo": "GJ-33",
    "code": 676,
    "id": "botad",
    "nameEn": "Botad",
    "nameGu": "બોટાદ",
    "areaKm2": 2138,
    "subDistrictCount": 5,
    "villageCount": 190,
    "centroid": {
      "x": 238,
      "y": 182
    }
  },
  {
    "officialNo": "GJ-34",
    "code": 668,
    "id": "chhotaudepur",
    "nameEn": "Chhotaudepur",
    "nameGu": "છોટાઉદેપુર",
    "areaKm2": 3868,
    "subDistrictCount": 7,
    "villageCount": 904,
    "centroid": {
      "x": 352,
      "y": 192
    }
  },
  {
    "officialNo": "GJ-20",
    "code": 445,
    "id": "dahod",
    "nameEn": "Dahod",
    "nameGu": "દાહોદ",
    "areaKm2": 3737,
    "subDistrictCount": 11,
    "villageCount": 713,
    "centroid": {
      "x": 372,
      "y": 145
    }
  },
  {
    "officialNo": "GJ-30",
    "code": 444,
    "id": "dang",
    "nameEn": "Dangs",
    "nameGu": "ડાંગ",
    "areaKm2": 1764,
    "subDistrictCount": 3,
    "villageCount": 311,
    "centroid": {
      "x": 352,
      "y": 285
    }
  },
  {
    "officialNo": "GJ-37",
    "code": 674,
    "id": "devbhumi_dwarka",
    "nameEn": "Devbhumi Dwarka",
    "nameGu": "દેવભૂમિ દ્વારકા",
    "areaKm2": 4297,
    "subDistrictCount": 4,
    "villageCount": 303,
    "centroid": {
      "x": 88,
      "y": 175
    }
  },
  {
    "officialNo": "GJ-18",
    "code": 446,
    "id": "gandhinagar",
    "nameEn": "Gandhinagar",
    "nameGu": "ગાંધીનગર",
    "areaKm2": 2148,
    "subDistrictCount": 5,
    "villageCount": 168,
    "centroid": {
      "x": 284,
      "y": 122
    }
  },
  {
    "officialNo": "GJ-32",
    "code": 675,
    "id": "gir_somnath",
    "nameEn": "Gir Somnath",
    "nameGu": "ગીર સોમનાથ",
    "areaKm2": 5444,
    "subDistrictCount": 7,
    "villageCount": 485,
    "centroid": {
      "x": 176,
      "y": 268
    }
  },
  {
    "officialNo": "GJ-10",
    "code": 447,
    "id": "jamnagar",
    "nameEn": "Jamnagar",
    "nameGu": "જામનગર",
    "areaKm2": 14184,
    "subDistrictCount": 7,
    "villageCount": 436,
    "centroid": {
      "x": 140,
      "y": 165
    }
  },
  {
    "officialNo": "GJ-11",
    "code": 448,
    "id": "junagadh",
    "nameEn": "Junagadh",
    "nameGu": "જુનાગઢ",
    "areaKm2": 8827,
    "subDistrictCount": 10,
    "villageCount": 567,
    "centroid": {
      "x": 160,
      "y": 228
    }
  },
  {
    "officialNo": "GJ-12",
    "code": 449,
    "id": "kutch",
    "nameEn": "Kachchh",
    "nameGu": "કચ્છ",
    "areaKm2": 45652,
    "subDistrictCount": 11,
    "villageCount": 1003,
    "centroid": {
      "x": 115,
      "y": 92
    }
  },
  {
    "officialNo": "GJ-07",
    "code": 450,
    "id": "kheda",
    "nameEn": "Kheda",
    "nameGu": "ખેડા",
    "areaKm2": 3988,
    "subDistrictCount": 12,
    "villageCount": 541,
    "centroid": {
      "x": 295,
      "y": 142
    }
  },
  {
    "officialNo": "GJ-35",
    "code": 669,
    "id": "mahisagar",
    "nameEn": "Mahisagar",
    "nameGu": "મહીસાગર",
    "areaKm2": 2622,
    "subDistrictCount": 8,
    "villageCount": 723,
    "centroid": {
      "x": 332,
      "y": 125
    }
  },
  {
    "officialNo": "GJ-02",
    "code": 451,
    "id": "mehsana",
    "nameEn": "Mahesana",
    "nameGu": "મહેસાણા",
    "areaKm2": 5957,
    "subDistrictCount": 11,
    "villageCount": 621,
    "centroid": {
      "x": 252,
      "y": 95
    }
  },
  {
    "officialNo": "GJ-36",
    "code": 673,
    "id": "morbi",
    "nameEn": "Morbi",
    "nameGu": "મોરબી",
    "areaKm2": 4976,
    "subDistrictCount": 6,
    "villageCount": 353,
    "centroid": {
      "x": 172,
      "y": 140
    }
  },
  {
    "officialNo": "GJ-22",
    "code": 452,
    "id": "narmada",
    "nameEn": "Narmada",
    "nameGu": "નર્મદા",
    "areaKm2": 2750,
    "subDistrictCount": 6,
    "villageCount": 615,
    "centroid": {
      "x": 342,
      "y": 214
    }
  },
  {
    "officialNo": "GJ-21",
    "code": 453,
    "id": "navsari",
    "nameEn": "Navsari",
    "nameGu": "નવસારી",
    "areaKm2": 2248,
    "subDistrictCount": 6,
    "villageCount": 415,
    "centroid": {
      "x": 318,
      "y": 264
    }
  },
  {
    "officialNo": "GJ-17",
    "code": 454,
    "id": "panchmahal",
    "nameEn": "Panch Mahals",
    "nameGu": "પંચમહાલ",
    "areaKm2": 6003,
    "subDistrictCount": 8,
    "villageCount": 639,
    "centroid": {
      "x": 334,
      "y": 155
    }
  },
  {
    "officialNo": "GJ-24",
    "code": 455,
    "id": "patan",
    "nameEn": "Patan",
    "nameGu": "પાટણ",
    "areaKm2": 5750,
    "subDistrictCount": 10,
    "villageCount": 531,
    "centroid": {
      "x": 228,
      "y": 80
    }
  },
  {
    "officialNo": "GJ-25",
    "code": 456,
    "id": "porbandar",
    "nameEn": "Porbandar",
    "nameGu": "પોરબંદર",
    "areaKm2": 2295,
    "subDistrictCount": 4,
    "villageCount": 190,
    "centroid": {
      "x": 122,
      "y": 215
    }
  },
  {
    "officialNo": "GJ-03",
    "code": 457,
    "id": "rajkot",
    "nameEn": "Rajkot",
    "nameGu": "રાજકોટ",
    "areaKm2": 11203,
    "subDistrictCount": 16,
    "villageCount": 661,
    "centroid": {
      "x": 199,
      "y": 178
    }
  },
  {
    "officialNo": "GJ-09",
    "code": 458,
    "id": "sabarkantha",
    "nameEn": "Sabar Kantha",
    "nameGu": "સાબરકાંઠા",
    "areaKm2": 7398,
    "subDistrictCount": 8,
    "villageCount": 723,
    "centroid": {
      "x": 288,
      "y": 82
    }
  },
  {
    "officialNo": "GJ-05",
    "code": 459,
    "id": "surat",
    "nameEn": "Surat",
    "nameGu": "સુરત",
    "areaKm2": 4418,
    "subDistrictCount": 17,
    "villageCount": 823,
    "centroid": {
      "x": 306,
      "y": 238
    }
  },
  {
    "officialNo": "GJ-13",
    "code": 460,
    "id": "surendranagar",
    "nameEn": "Surendranagar",
    "nameGu": "સુરેન્દ્રનગર",
    "areaKm2": 10486,
    "subDistrictCount": 11,
    "villageCount": 579,
    "centroid": {
      "x": 218,
      "y": 148
    }
  },
  {
    "officialNo": "GJ-26",
    "code": 641,
    "id": "tapi",
    "nameEn": "Tapi",
    "nameGu": "તાપી",
    "areaKm2": 2003,
    "subDistrictCount": 8,
    "villageCount": 513,
    "centroid": {
      "x": 345,
      "y": 252
    }
  },
  {
    "officialNo": "GJ-06",
    "code": 461,
    "id": "vadodara",
    "nameEn": "Vadodara",
    "nameGu": "વડોદરા",
    "areaKm2": 7548,
    "subDistrictCount": 8,
    "villageCount": 358,
    "centroid": {
      "x": 314,
      "y": 182
    }
  },
  {
    "officialNo": "GJ-15",
    "code": 462,
    "id": "valsad",
    "nameEn": "Valsad",
    "nameGu": "વલસાડ",
    "areaKm2": 3035,
    "subDistrictCount": 9,
    "villageCount": 474,
    "centroid": {
      "x": 322,
      "y": 295
    }
  },
  {
    "officialNo": "GJ-39",
    "code": 789,
    "id": "vav_tharad",
    "nameEn": "Vav-Tharad",
    "nameGu": "વાવ-થરાદ",
    "areaKm2": 1779,
    "subDistrictCount": 8,
    "villageCount": 418,
    "centroid": {
      "x": 222,
      "y": 38
    }
  }
];

// ========================================================
// 2. ALL 309 SUB-DISTRICTS / TALUKAS OF GUJARAT
// ========================================================
export const MASTER_SUBDISTRICTS: MasterSubdistrict[] = [
  {
    "code": 6512,
    "id": "ahmedabad_asarva",
    "districtCode": 438,
    "districtId": "ahmedabad",
    "districtNameEn": "Ahmedabad",
    "districtNameGu": "અમદાવાદ",
    "nameEn": "Asarva",
    "nameGu": "અસારવા",
    "villageCount": 10
  },
  {
    "code": 3784,
    "id": "ahmedabad_bavla",
    "districtCode": 438,
    "districtId": "ahmedabad",
    "districtNameEn": "Ahmedabad",
    "districtNameGu": "અમદાવાદ",
    "nameEn": "Bavla",
    "nameGu": "બાવળા",
    "villageCount": 48
  },
  {
    "code": 3782,
    "id": "ahmedabad_daskroi",
    "districtCode": 438,
    "districtId": "ahmedabad",
    "districtNameEn": "Ahmedabad",
    "districtNameGu": "અમદાવાદ",
    "nameEn": "Daskroi",
    "nameGu": "દસક્રોઈ",
    "villageCount": 59
  },
  {
    "code": 3778,
    "id": "ahmedabad_detroj_rampura",
    "districtCode": 438,
    "districtId": "ahmedabad",
    "districtNameEn": "Ahmedabad",
    "districtNameGu": "અમદાવાદ",
    "nameEn": "Detroj-Rampura",
    "nameGu": "દેત્રોજ-રામપુરા",
    "villageCount": 53
  },
  {
    "code": 3787,
    "id": "ahmedabad_dhandhuka",
    "districtCode": 438,
    "districtId": "ahmedabad",
    "districtNameEn": "Ahmedabad",
    "districtNameGu": "અમદાવાદ",
    "nameEn": "Dhandhuka",
    "nameGu": "ધંધુકા",
    "villageCount": 44
  },
  {
    "code": 6167,
    "id": "ahmedabad_dholera",
    "districtCode": 438,
    "districtId": "ahmedabad",
    "districtNameEn": "Ahmedabad",
    "districtNameGu": "અમદાવાદ",
    "nameEn": "Dholera",
    "nameGu": "ધોલેરા",
    "villageCount": 33
  },
  {
    "code": 3783,
    "id": "ahmedabad_dholka",
    "districtCode": 438,
    "districtId": "ahmedabad",
    "districtNameEn": "Ahmedabad",
    "districtNameGu": "અમદાવાદ",
    "nameEn": "Dholka",
    "nameGu": "ધોળકા",
    "villageCount": 71
  },
  {
    "code": 6513,
    "id": "ahmedabad_ghatlodiya",
    "districtCode": 438,
    "districtId": "ahmedabad",
    "districtNameEn": "Ahmedabad",
    "districtNameGu": "અમદાવાદ",
    "nameEn": "Ghatlodiya",
    "nameGu": "ઘાટલોડિયા",
    "villageCount": 20
  },
  {
    "code": 3777,
    "id": "ahmedabad_mandal",
    "districtCode": 438,
    "districtId": "ahmedabad",
    "districtNameEn": "Ahmedabad",
    "districtNameGu": "અમદાવાદ",
    "nameEn": "Mandal",
    "nameGu": "માંડલ",
    "villageCount": 37
  },
  {
    "code": 6515,
    "id": "ahmedabad_maninagar",
    "districtCode": 438,
    "districtId": "ahmedabad",
    "districtNameEn": "Ahmedabad",
    "districtNameGu": "અમદાવાદ",
    "nameEn": "Maninagar",
    "nameGu": "મણિનગર",
    "villageCount": 11
  },
  {
    "code": 3781,
    "id": "ahmedabad_sabarmati",
    "districtCode": 438,
    "districtId": "ahmedabad",
    "districtNameEn": "Ahmedabad",
    "districtNameGu": "અમદાવાદ",
    "nameEn": "Sabarmati",
    "nameGu": "સાબરમતી",
    "villageCount": 14
  },
  {
    "code": 3780,
    "id": "ahmedabad_sanand",
    "districtCode": 438,
    "districtId": "ahmedabad",
    "districtNameEn": "Ahmedabad",
    "districtNameGu": "અમદાવાદ",
    "nameEn": "Sanand",
    "nameGu": "સાણંદ",
    "villageCount": 67
  },
  {
    "code": 6516,
    "id": "ahmedabad_vatva",
    "districtCode": 438,
    "districtId": "ahmedabad",
    "districtNameEn": "Ahmedabad",
    "districtNameGu": "અમદાવાદ",
    "nameEn": "Vatva",
    "nameGu": "વાટવા",
    "villageCount": 13
  },
  {
    "code": 6514,
    "id": "ahmedabad_vejalpur",
    "districtCode": 438,
    "districtId": "ahmedabad",
    "districtNameEn": "Ahmedabad",
    "districtNameGu": "અમદાવાદ",
    "nameEn": "Vejalpur",
    "nameGu": "વેજલપુર",
    "villageCount": 11
  },
  {
    "code": 3779,
    "id": "ahmedabad_viramgam",
    "districtCode": 438,
    "districtId": "ahmedabad",
    "districtNameEn": "Ahmedabad",
    "districtNameGu": "અમદાવાદ",
    "nameEn": "Viramgam",
    "nameGu": "વિરમગામ",
    "villageCount": 68
  },
  {
    "code": 3843,
    "id": "amreli_amreli",
    "districtCode": 439,
    "districtId": "amreli",
    "districtNameEn": "Amreli",
    "districtNameGu": "અમરેલી",
    "nameEn": "Amreli",
    "nameGu": "Amreli",
    "villageCount": 72
  },
  {
    "code": 7432,
    "id": "amreli_amreli_city",
    "districtCode": 439,
    "districtId": "amreli",
    "districtNameEn": "Amreli",
    "districtNameGu": "અમરેલી",
    "nameEn": "Amreli-City",
    "nameGu": "Amreli-City",
    "villageCount": 0
  },
  {
    "code": 3840,
    "id": "amreli_babra",
    "districtCode": 439,
    "districtId": "amreli",
    "districtNameEn": "Amreli",
    "districtNameGu": "અમરેલી",
    "nameEn": "Babra",
    "nameGu": "Babra",
    "villageCount": 58
  },
  {
    "code": 3844,
    "id": "amreli_bagasara",
    "districtCode": 439,
    "districtId": "amreli",
    "districtNameEn": "Amreli",
    "districtNameGu": "અમરેલી",
    "nameEn": "Bagasara",
    "nameGu": "Bagasara",
    "villageCount": 36
  },
  {
    "code": 3845,
    "id": "amreli_dhari",
    "districtCode": 439,
    "districtId": "amreli",
    "districtNameEn": "Amreli",
    "districtNameGu": "અમરેલી",
    "nameEn": "Dhari",
    "nameGu": "Dhari",
    "villageCount": 78
  },
  {
    "code": 3848,
    "id": "amreli_jafrabad",
    "districtCode": 439,
    "districtId": "amreli",
    "districtNameEn": "Amreli",
    "districtNameGu": "અમરેલી",
    "nameEn": "Jafrabad",
    "nameGu": "Jafrabad",
    "villageCount": 43
  },
  {
    "code": 3847,
    "id": "amreli_khambha",
    "districtCode": 439,
    "districtId": "amreli",
    "districtNameEn": "Amreli",
    "districtNameGu": "અમરેલી",
    "nameEn": "Khambha",
    "nameGu": "Khambha",
    "villageCount": 57
  },
  {
    "code": 3839,
    "id": "amreli_kunkavav_vadia",
    "districtCode": 439,
    "districtId": "amreli",
    "districtNameEn": "Amreli",
    "districtNameGu": "અમરેલી",
    "nameEn": "Kunkavav Vadia",
    "nameGu": "Kunkavav Vadia",
    "villageCount": 45
  },
  {
    "code": 3841,
    "id": "amreli_lathi",
    "districtCode": 439,
    "districtId": "amreli",
    "districtNameEn": "Amreli",
    "districtNameGu": "અમરેલી",
    "nameEn": "Lathi",
    "nameGu": "Lathi",
    "villageCount": 51
  },
  {
    "code": 3842,
    "id": "amreli_lilia",
    "districtCode": 439,
    "districtId": "amreli",
    "districtNameEn": "Amreli",
    "districtNameGu": "અમરેલી",
    "nameEn": "Lilia",
    "nameGu": "Lilia",
    "villageCount": 37
  },
  {
    "code": 3849,
    "id": "amreli_rajula",
    "districtCode": 439,
    "districtId": "amreli",
    "districtNameEn": "Amreli",
    "districtNameGu": "અમરેલી",
    "nameEn": "Rajula",
    "nameGu": "Rajula",
    "villageCount": 73
  },
  {
    "code": 3846,
    "id": "amreli_savar_kundla",
    "districtCode": 439,
    "districtId": "amreli",
    "districtNameEn": "Amreli",
    "districtNameGu": "અમરેલી",
    "nameEn": "Savar Kundla",
    "nameGu": "Savar Kundla",
    "villageCount": 80
  },
  {
    "code": 6530,
    "id": "anand_anand_city",
    "districtCode": 440,
    "districtId": "anand",
    "districtNameEn": "Anand",
    "districtNameGu": "આણંદ",
    "nameEn": "Anand City",
    "nameGu": "Anand City",
    "villageCount": 1
  },
  {
    "code": 3864,
    "id": "anand_anand_rural",
    "districtCode": 440,
    "districtId": "anand",
    "districtNameEn": "Anand",
    "districtNameGu": "આણંદ",
    "nameEn": "Anand Rural",
    "nameGu": "Anand Rural",
    "villageCount": 44
  },
  {
    "code": 3868,
    "id": "anand_anklav",
    "districtCode": 440,
    "districtId": "anand",
    "districtNameEn": "Anand",
    "districtNameGu": "આણંદ",
    "nameEn": "Anklav",
    "nameGu": "આંકલાવ",
    "villageCount": 32
  },
  {
    "code": 3867,
    "id": "anand_borsad",
    "districtCode": 440,
    "districtId": "anand",
    "districtNameEn": "Anand",
    "districtNameGu": "આણંદ",
    "nameEn": "Borsad",
    "nameGu": "બોરસદ",
    "villageCount": 65
  },
  {
    "code": 3866,
    "id": "anand_khambhat",
    "districtCode": 440,
    "districtId": "anand",
    "districtNameEn": "Anand",
    "districtNameGu": "આણંદ",
    "nameEn": "Khambhat",
    "nameGu": "ખંભાત",
    "villageCount": 61
  },
  {
    "code": 3865,
    "id": "anand_petlad",
    "districtCode": 440,
    "districtId": "anand",
    "districtNameEn": "Anand",
    "districtNameGu": "આણંદ",
    "nameEn": "Petlad",
    "nameGu": "પેટલાદ",
    "villageCount": 56
  },
  {
    "code": 3862,
    "id": "anand_sojitra",
    "districtCode": 440,
    "districtId": "anand",
    "districtNameEn": "Anand",
    "districtNameGu": "આણંદ",
    "nameEn": "Sojitra",
    "nameGu": "સોજિત્રા",
    "villageCount": 22
  },
  {
    "code": 3861,
    "id": "anand_tarapur",
    "districtCode": 440,
    "districtId": "anand",
    "districtNameEn": "Anand",
    "districtNameGu": "આણંદ",
    "nameEn": "Tarapur",
    "nameGu": "તારાપુર",
    "villageCount": 42
  },
  {
    "code": 3863,
    "id": "anand_umreth",
    "districtCode": 440,
    "districtId": "anand",
    "districtNameEn": "Anand",
    "districtNameGu": "આણંદ",
    "nameEn": "Umreth",
    "nameGu": "ઉમરેઠ",
    "villageCount": 37
  },
  {
    "code": 3736,
    "id": "banaskantha_amirgadh",
    "districtCode": 441,
    "districtId": "banaskantha",
    "districtNameEn": "Banas Kantha",
    "districtNameGu": "બનાસકાંઠા",
    "nameEn": "Amirgadh",
    "nameGu": "Amirgadh",
    "villageCount": 69
  },
  {
    "code": 3737,
    "id": "banaskantha_danta",
    "districtCode": 441,
    "districtId": "banaskantha",
    "districtNameEn": "Banas Kantha",
    "districtNameGu": "બનાસકાંઠા",
    "nameEn": "Danta",
    "nameGu": "Danta",
    "villageCount": 115
  },
  {
    "code": 3735,
    "id": "banaskantha_dantiwada",
    "districtCode": 441,
    "districtId": "banaskantha",
    "districtNameEn": "Banas Kantha",
    "districtNameGu": "બનાસકાંઠા",
    "nameEn": "Dantiwada",
    "nameGu": "Dantiwada",
    "villageCount": 57
  },
  {
    "code": 3740,
    "id": "banaskantha_deesa",
    "districtCode": 441,
    "districtId": "banaskantha",
    "districtNameEn": "Banas Kantha",
    "districtNameGu": "બનાસકાંઠા",
    "nameEn": "Deesa",
    "nameGu": "Deesa",
    "villageCount": 116
  },
  {
    "code": 7437,
    "id": "banaskantha_deesa_city",
    "districtCode": 441,
    "districtId": "banaskantha",
    "districtNameEn": "Banas Kantha",
    "districtNameGu": "બનાસકાંઠા",
    "nameEn": "Deesa City",
    "nameGu": "Deesa City",
    "villageCount": 1
  },
  {
    "code": 3734,
    "id": "banaskantha_dhanera",
    "districtCode": 441,
    "districtId": "banaskantha",
    "districtNameEn": "Banas Kantha",
    "districtNameGu": "બનાસકાંઠા",
    "nameEn": "Dhanera",
    "nameGu": "Dhanera",
    "villageCount": 79
  },
  {
    "code": 7555,
    "id": "banaskantha_hadad",
    "districtCode": 441,
    "districtId": "banaskantha",
    "districtNameEn": "Banas Kantha",
    "districtNameGu": "બનાસકાંઠા",
    "nameEn": "Hadad",
    "nameGu": "Hadad",
    "villageCount": 72
  },
  {
    "code": 3743,
    "id": "banaskantha_kankrej",
    "districtCode": 441,
    "districtId": "banaskantha",
    "districtNameEn": "Banas Kantha",
    "districtNameGu": "બનાસકાંઠા",
    "nameEn": "Kankrej",
    "nameGu": "Kankrej",
    "villageCount": 50
  },
  {
    "code": 7557,
    "id": "banaskantha_ogad",
    "districtCode": 441,
    "districtId": "banaskantha",
    "districtNameEn": "Banas Kantha",
    "districtNameGu": "બનાસકાંઠા",
    "nameEn": "Ogad",
    "nameGu": "Ogad",
    "villageCount": 59
  },
  {
    "code": 3739,
    "id": "banaskantha_palanpur",
    "districtCode": 441,
    "districtId": "banaskantha",
    "districtNameEn": "Banas Kantha",
    "districtNameGu": "બનાસકાંઠા",
    "nameEn": "Palanpur",
    "nameGu": "Palanpur",
    "villageCount": 119
  },
  {
    "code": 7436,
    "id": "banaskantha_palanpur_city",
    "districtCode": 441,
    "districtId": "banaskantha",
    "districtNameEn": "Banas Kantha",
    "districtNameGu": "બનાસકાંઠા",
    "nameEn": "Palanpur City",
    "nameGu": "Palanpur City",
    "villageCount": 1
  },
  {
    "code": 3738,
    "id": "banaskantha_vadgam",
    "districtCode": 441,
    "districtId": "banaskantha",
    "districtNameEn": "Banas Kantha",
    "districtNameGu": "બનાસકાંઠા",
    "nameEn": "Vadgam",
    "nameGu": "Vadgam",
    "villageCount": 110
  },
  {
    "code": 3914,
    "id": "bharuch_amod",
    "districtCode": 442,
    "districtId": "bharuch",
    "districtNameEn": "Bharuch",
    "districtNameGu": "ભરૂચ",
    "nameEn": "Amod",
    "nameGu": "Amod",
    "villageCount": 55
  },
  {
    "code": 3918,
    "id": "bharuch_anklesvar",
    "districtCode": 442,
    "districtId": "bharuch",
    "districtNameEn": "Bharuch",
    "districtNameGu": "ભરૂચ",
    "nameEn": "Anklesvar",
    "nameGu": "Anklesvar",
    "villageCount": 61
  },
  {
    "code": 3916,
    "id": "bharuch_bharuch",
    "districtCode": 442,
    "districtId": "bharuch",
    "districtNameEn": "Bharuch",
    "districtNameGu": "ભરૂચ",
    "nameEn": "Bharuch",
    "nameGu": "Bharuch",
    "villageCount": 96
  },
  {
    "code": 7597,
    "id": "bharuch_bharuch_city",
    "districtCode": 442,
    "districtId": "bharuch",
    "districtNameEn": "Bharuch",
    "districtNameGu": "ભરૂચ",
    "nameEn": "Bharuch City",
    "nameGu": "Bharuch City",
    "villageCount": 6
  },
  {
    "code": 3919,
    "id": "bharuch_hansot",
    "districtCode": 442,
    "districtId": "bharuch",
    "districtNameEn": "Bharuch",
    "districtNameGu": "ભરૂચ",
    "nameEn": "Hansot",
    "nameGu": "Hansot",
    "villageCount": 46
  },
  {
    "code": 3913,
    "id": "bharuch_jambusar",
    "districtCode": 442,
    "districtId": "bharuch",
    "districtNameEn": "Bharuch",
    "districtNameGu": "ભરૂચ",
    "nameEn": "Jambusar",
    "nameGu": "Jambusar",
    "villageCount": 83
  },
  {
    "code": 3917,
    "id": "bharuch_jhagadia",
    "districtCode": 442,
    "districtId": "bharuch",
    "districtNameEn": "Bharuch",
    "districtNameGu": "ભરૂચ",
    "nameEn": "Jhagadia",
    "nameGu": "Jhagadia",
    "villageCount": 126
  },
  {
    "code": 6170,
    "id": "bharuch_netrang",
    "districtCode": 442,
    "districtId": "bharuch",
    "districtNameEn": "Bharuch",
    "districtNameGu": "ભરૂચ",
    "nameEn": "Netrang",
    "nameGu": "Netrang",
    "villageCount": 79
  },
  {
    "code": 3915,
    "id": "bharuch_vagra",
    "districtCode": 442,
    "districtId": "bharuch",
    "districtNameEn": "Bharuch",
    "districtNameGu": "ભરૂચ",
    "nameEn": "Vagra",
    "nameGu": "Vagra",
    "villageCount": 68
  },
  {
    "code": 3920,
    "id": "bharuch_valia",
    "districtCode": 442,
    "districtId": "bharuch",
    "districtNameEn": "Bharuch",
    "districtNameGu": "ભરૂચ",
    "nameEn": "Valia",
    "nameGu": "Valia",
    "villageCount": 60
  },
  {
    "code": 3854,
    "id": "bhavnagar_bhavnagar",
    "districtCode": 443,
    "districtId": "bhavnagar",
    "districtNameEn": "Bhavnagar",
    "districtNameGu": "ભાવનગર",
    "nameEn": "Bhavnagar",
    "nameGu": "ભાવનગર",
    "villageCount": 54
  },
  {
    "code": 7444,
    "id": "bhavnagar_bhavnagar_city",
    "districtCode": 443,
    "districtId": "bhavnagar",
    "districtNameEn": "Bhavnagar",
    "districtNameGu": "ભાવનગર",
    "nameEn": "Bhavnagar City",
    "nameGu": "ભાવનગર શહેર",
    "villageCount": 0
  },
  {
    "code": 7604,
    "id": "bhavnagar_bhavnagar_city_(east)",
    "districtCode": 443,
    "districtId": "bhavnagar",
    "districtNameEn": "Bhavnagar",
    "districtNameGu": "ભાવનગર",
    "nameEn": "Bhavnagar City (East)",
    "nameGu": "Bhavnagar City (East)",
    "villageCount": 4
  },
  {
    "code": 7605,
    "id": "bhavnagar_bhavnagar_city_(west)",
    "districtCode": 443,
    "districtId": "bhavnagar",
    "districtNameEn": "Bhavnagar",
    "districtNameGu": "ભાવનગર",
    "nameEn": "Bhavnagar City (West)",
    "nameGu": "Bhavnagar City (West)",
    "villageCount": 5
  },
  {
    "code": 3857,
    "id": "bhavnagar_gariadhar",
    "districtCode": 443,
    "districtId": "bhavnagar",
    "districtNameEn": "Bhavnagar",
    "districtNameGu": "ભાવનગર",
    "nameEn": "Gariadhar",
    "nameGu": "ગારીયાધાર",
    "villageCount": 51
  },
  {
    "code": 3855,
    "id": "bhavnagar_ghogha",
    "districtCode": 443,
    "districtId": "bhavnagar",
    "districtNameEn": "Bhavnagar",
    "districtNameGu": "ભાવનગર",
    "nameEn": "Ghogha",
    "nameGu": "ઘોઘા",
    "villageCount": 48
  },
  {
    "code": 6203,
    "id": "bhavnagar_jesar",
    "districtCode": 443,
    "districtId": "bhavnagar",
    "districtNameEn": "Bhavnagar",
    "districtNameGu": "ભાવનગર",
    "nameEn": "Jesar",
    "nameGu": "જેસર",
    "villageCount": 35
  },
  {
    "code": 3860,
    "id": "bhavnagar_mahuva",
    "districtCode": 443,
    "districtId": "bhavnagar",
    "districtNameEn": "Bhavnagar",
    "districtNameGu": "ભાવનગર",
    "nameEn": "Mahuva",
    "nameGu": "મહુવા",
    "villageCount": 119
  },
  {
    "code": 3858,
    "id": "bhavnagar_palitana",
    "districtCode": 443,
    "districtId": "bhavnagar",
    "districtNameEn": "Bhavnagar",
    "districtNameGu": "ભાવનગર",
    "nameEn": "Palitana",
    "nameGu": "પાલીતાણા",
    "villageCount": 83
  },
  {
    "code": 3856,
    "id": "bhavnagar_sihor",
    "districtCode": 443,
    "districtId": "bhavnagar",
    "districtNameEn": "Bhavnagar",
    "districtNameGu": "ભાવનગર",
    "nameEn": "Sihor",
    "nameGu": "સિહોર",
    "villageCount": 82
  },
  {
    "code": 3859,
    "id": "bhavnagar_talaja",
    "districtCode": 443,
    "districtId": "bhavnagar",
    "districtNameEn": "Bhavnagar",
    "districtNameGu": "ભાવનગર",
    "nameEn": "Talaja",
    "nameGu": "તળાજા",
    "villageCount": 118
  },
  {
    "code": 3853,
    "id": "bhavnagar_umrala",
    "districtCode": 443,
    "districtId": "bhavnagar",
    "districtNameEn": "Bhavnagar",
    "districtNameGu": "ભાવનગર",
    "nameEn": "Umrala",
    "nameGu": "ઉમરાળા",
    "villageCount": 43
  },
  {
    "code": 3851,
    "id": "bhavnagar_vallabhipur",
    "districtCode": 443,
    "districtId": "bhavnagar",
    "districtNameEn": "Bhavnagar",
    "districtNameGu": "ભાવનગર",
    "nameEn": "Vallabhipur",
    "nameGu": "વલ્લભીપુર",
    "villageCount": 60
  },
  {
    "code": 3921,
    "id": "dang_ahwa",
    "districtCode": 444,
    "districtId": "dang",
    "districtNameEn": "Dangs",
    "districtNameGu": "ડાંગ",
    "nameEn": "Ahwa",
    "nameGu": "Ahwa",
    "villageCount": 123
  },
  {
    "code": 6024,
    "id": "dang_subir",
    "districtCode": 444,
    "districtId": "dang",
    "districtNameEn": "Dangs",
    "districtNameGu": "ડાંગ",
    "nameEn": "Subir",
    "nameGu": "Subir",
    "villageCount": 92
  },
  {
    "code": 6023,
    "id": "dang_waghai",
    "districtCode": 444,
    "districtId": "dang",
    "districtNameEn": "Dangs",
    "districtNameGu": "ડાંગ",
    "nameEn": "Waghai",
    "nameGu": "Waghai",
    "villageCount": 96
  },
  {
    "code": 3895,
    "id": "dahod_devgadbaria",
    "districtCode": 445,
    "districtId": "dahod",
    "districtNameEn": "Dahod",
    "districtNameGu": "દાહોદ",
    "nameEn": "Devgadbaria",
    "nameGu": "Devgadbaria",
    "villageCount": 88
  },
  {
    "code": 3896,
    "id": "dahod_dhanpur",
    "districtCode": 445,
    "districtId": "dahod",
    "districtNameEn": "Dahod",
    "districtNameGu": "દાહોદ",
    "nameEn": "Dhanpur",
    "nameGu": "Dhanpur",
    "villageCount": 92
  },
  {
    "code": 3893,
    "id": "dahod_dohad",
    "districtCode": 445,
    "districtId": "dahod",
    "districtNameEn": "Dahod",
    "districtNameGu": "દાહોદ",
    "nameEn": "Dohad",
    "nameGu": "Dohad",
    "villageCount": 89
  },
  {
    "code": 3890,
    "id": "dahod_fatepura",
    "districtCode": 445,
    "districtId": "dahod",
    "districtNameEn": "Dahod",
    "districtNameGu": "દાહોદ",
    "nameEn": "Fatepura",
    "nameGu": "Fatepura",
    "villageCount": 49
  },
  {
    "code": 3894,
    "id": "dahod_garbada",
    "districtCode": 445,
    "districtId": "dahod",
    "districtNameEn": "Dahod",
    "districtNameGu": "દાહોદ",
    "nameEn": "Garbada",
    "nameGu": "Garbada",
    "villageCount": 34
  },
  {
    "code": 7554,
    "id": "dahod_govindguru_limdi",
    "districtCode": 445,
    "districtId": "dahod",
    "districtNameEn": "Dahod",
    "districtNameGu": "દાહોદ",
    "nameEn": "Govindguru Limdi",
    "nameGu": "Govindguru Limdi",
    "villageCount": 46
  },
  {
    "code": 3891,
    "id": "dahod_jhalod",
    "districtCode": 445,
    "districtId": "dahod",
    "districtNameEn": "Dahod",
    "districtNameGu": "દાહોદ",
    "nameEn": "Jhalod",
    "nameGu": "Jhalod",
    "villageCount": 59
  },
  {
    "code": 3892,
    "id": "dahod_limkheda",
    "districtCode": 445,
    "districtId": "dahod",
    "districtNameEn": "Dahod",
    "districtNameGu": "દાહોદ",
    "nameEn": "Limkheda",
    "nameGu": "Limkheda",
    "villageCount": 82
  },
  {
    "code": 6204,
    "id": "dahod_sanjeli",
    "districtCode": 445,
    "districtId": "dahod",
    "districtNameEn": "Dahod",
    "districtNameGu": "દાહોદ",
    "nameEn": "Sanjeli",
    "nameGu": "Sanjeli",
    "villageCount": 56
  },
  {
    "code": 6480,
    "id": "dahod_singvad",
    "districtCode": 445,
    "districtId": "dahod",
    "districtNameEn": "Dahod",
    "districtNameGu": "દાહોદ",
    "nameEn": "Singvad",
    "nameGu": "Singvad",
    "villageCount": 71
  },
  {
    "code": 7549,
    "id": "dahod_sukhsar",
    "districtCode": 445,
    "districtId": "dahod",
    "districtNameEn": "Dahod",
    "districtNameGu": "દાહોદ",
    "nameEn": "Sukhsar",
    "nameGu": "Sukhsar",
    "villageCount": 47
  },
  {
    "code": 3776,
    "id": "gandhinagar_dehgam",
    "districtCode": 446,
    "districtId": "gandhinagar",
    "districtNameEn": "Gandhinagar",
    "districtNameGu": "ગાંધીનગર",
    "nameEn": "Dehgam",
    "nameGu": "Dehgam",
    "villageCount": 96
  },
  {
    "code": 3775,
    "id": "gandhinagar_gandhinagar",
    "districtCode": 446,
    "districtId": "gandhinagar",
    "districtNameEn": "Gandhinagar",
    "districtNameGu": "ગાંધીનગર",
    "nameEn": "Gandhinagar",
    "nameGu": "Gandhinagar",
    "villageCount": 81
  },
  {
    "code": 7438,
    "id": "gandhinagar_kalol_city",
    "districtCode": 446,
    "districtId": "gandhinagar",
    "districtNameEn": "Gandhinagar",
    "districtNameGu": "ગાંધીનગર",
    "nameEn": "Kalol City",
    "nameGu": "Kalol City",
    "villageCount": 1
  },
  {
    "code": 3773,
    "id": "gandhinagar_kalol_gandhinagar",
    "districtCode": 446,
    "districtId": "gandhinagar",
    "districtNameEn": "Gandhinagar",
    "districtNameGu": "ગાંધીનગર",
    "nameEn": "Kalol Gandhinagar",
    "nameGu": "Kalol Gandhinagar",
    "villageCount": 56
  },
  {
    "code": 3774,
    "id": "gandhinagar_mansa",
    "districtCode": 446,
    "districtId": "gandhinagar",
    "districtNameEn": "Gandhinagar",
    "districtNameGu": "ગાંધીનગર",
    "nameEn": "Mansa",
    "nameGu": "Mansa",
    "villageCount": 62
  },
  {
    "code": 3816,
    "id": "jamnagar_dhrol",
    "districtCode": 447,
    "districtId": "jamnagar",
    "districtNameEn": "Jamnagar",
    "districtNameGu": "જામનગર",
    "nameEn": "Dhrol",
    "nameGu": "Dhrol",
    "villageCount": 42
  },
  {
    "code": 3821,
    "id": "jamnagar_jamjodhpur",
    "districtCode": 447,
    "districtId": "jamnagar",
    "districtNameEn": "Jamnagar",
    "districtNameGu": "જામનગર",
    "nameEn": "Jamjodhpur",
    "nameGu": "Jamjodhpur",
    "villageCount": 70
  },
  {
    "code": 6525,
    "id": "jamnagar_jamnagar_city",
    "districtCode": 447,
    "districtId": "jamnagar",
    "districtNameEn": "Jamnagar",
    "districtNameGu": "જામનગર",
    "nameEn": "Jamnagar City",
    "nameGu": "Jamnagar City",
    "villageCount": 9
  },
  {
    "code": 3814,
    "id": "jamnagar_jamnagar_rural",
    "districtCode": 447,
    "districtId": "jamnagar",
    "districtNameEn": "Jamnagar",
    "districtNameGu": "જામનગર",
    "nameEn": "Jamnagar Rural",
    "nameGu": "Jamnagar Rural",
    "villageCount": 105
  },
  {
    "code": 3815,
    "id": "jamnagar_jodiya",
    "districtCode": 447,
    "districtId": "jamnagar",
    "districtNameEn": "Jamnagar",
    "districtNameGu": "જામનગર",
    "nameEn": "Jodiya",
    "nameGu": "Jodiya",
    "villageCount": 37
  },
  {
    "code": 3817,
    "id": "jamnagar_kalavad",
    "districtCode": 447,
    "districtId": "jamnagar",
    "districtNameEn": "Jamnagar",
    "districtNameGu": "જામનગર",
    "nameEn": "Kalavad",
    "nameGu": "Kalavad",
    "villageCount": 99
  },
  {
    "code": 3818,
    "id": "jamnagar_lalpur",
    "districtCode": 447,
    "districtId": "jamnagar",
    "districtNameEn": "Jamnagar",
    "districtNameGu": "જામનગર",
    "nameEn": "Lalpur",
    "nameGu": "Lalpur",
    "villageCount": 74
  },
  {
    "code": 3828,
    "id": "junagadh_bhesan",
    "districtCode": 448,
    "districtId": "junagadh",
    "districtNameEn": "Junagadh",
    "districtNameGu": "જુનાગઢ",
    "nameEn": "Bhesan",
    "nameGu": "Bhesan",
    "villageCount": 46
  },
  {
    "code": 3827,
    "id": "junagadh_junagadh",
    "districtCode": 448,
    "districtId": "junagadh",
    "districtNameEn": "Junagadh",
    "districtNameGu": "જુનાગઢ",
    "nameEn": "Junagadh",
    "nameGu": "Junagadh",
    "villageCount": 71
  },
  {
    "code": 6517,
    "id": "junagadh_junagadh_city",
    "districtCode": 448,
    "districtId": "junagadh",
    "districtNameEn": "Junagadh",
    "districtNameGu": "જુનાગઢ",
    "nameEn": "Junagadh City",
    "nameGu": "Junagadh City",
    "villageCount": 10
  },
  {
    "code": 3831,
    "id": "junagadh_keshod",
    "districtCode": 448,
    "districtId": "junagadh",
    "districtNameEn": "Junagadh",
    "districtNameGu": "જુનાગઢ",
    "nameEn": "Keshod",
    "nameGu": "Keshod",
    "villageCount": 54
  },
  {
    "code": 3833,
    "id": "junagadh_malia_hatina",
    "districtCode": 448,
    "districtId": "junagadh",
    "districtNameEn": "Junagadh",
    "districtNameGu": "જુનાગઢ",
    "nameEn": "Malia Hatina",
    "nameGu": "Malia Hatina",
    "villageCount": 69
  },
  {
    "code": 3825,
    "id": "junagadh_manavadar",
    "districtCode": 448,
    "districtId": "junagadh",
    "districtNameEn": "Junagadh",
    "districtNameGu": "જુનાગઢ",
    "nameEn": "Manavadar",
    "nameGu": "Manavadar",
    "villageCount": 58
  },
  {
    "code": 3832,
    "id": "junagadh_mangrol",
    "districtCode": 448,
    "districtId": "junagadh",
    "districtNameEn": "Junagadh",
    "districtNameGu": "જુનાગઢ",
    "nameEn": "Mangrol",
    "nameGu": "માંગરોળ",
    "villageCount": 60
  },
  {
    "code": 3830,
    "id": "junagadh_mendarda",
    "districtCode": 448,
    "districtId": "junagadh",
    "districtNameEn": "Junagadh",
    "districtNameGu": "જુનાગઢ",
    "nameEn": "Mendarda",
    "nameGu": "Mendarda",
    "villageCount": 51
  },
  {
    "code": 3826,
    "id": "junagadh_vanthali",
    "districtCode": 448,
    "districtId": "junagadh",
    "districtNameEn": "Junagadh",
    "districtNameGu": "જુનાગઢ",
    "nameEn": "Vanthali",
    "nameGu": "Vanthali",
    "villageCount": 47
  },
  {
    "code": 3829,
    "id": "junagadh_visavadar",
    "districtCode": 448,
    "districtId": "junagadh",
    "districtNameEn": "Junagadh",
    "districtNameGu": "જુનાગઢ",
    "nameEn": "Visavadar",
    "nameGu": "Visavadar",
    "villageCount": 101
  },
  {
    "code": 3728,
    "id": "kutch_abdasa",
    "districtCode": 449,
    "districtId": "kutch",
    "districtNameEn": "Kachchh",
    "districtNameGu": "કચ્છ",
    "nameEn": "Abdasa",
    "nameGu": "Abdasa",
    "villageCount": 157
  },
  {
    "code": 3725,
    "id": "kutch_anjar",
    "districtCode": 449,
    "districtId": "kutch",
    "districtNameEn": "Kachchh",
    "districtNameGu": "કચ્છ",
    "nameEn": "Anjar",
    "nameGu": "Anjar",
    "villageCount": 70
  },
  {
    "code": 3724,
    "id": "kutch_bhachau",
    "districtCode": 449,
    "districtId": "kutch",
    "districtNameEn": "Kachchh",
    "districtNameGu": "કચ્છ",
    "nameEn": "Bhachau",
    "nameGu": "Bhachau",
    "villageCount": 73
  },
  {
    "code": 3726,
    "id": "kutch_bhuj",
    "districtCode": 449,
    "districtId": "kutch",
    "districtNameEn": "Kachchh",
    "districtNameGu": "કચ્છ",
    "nameEn": "Bhuj",
    "nameGu": "Bhuj",
    "villageCount": 182
  },
  {
    "code": 7606,
    "id": "kutch_bhuj_city",
    "districtCode": 449,
    "districtId": "kutch",
    "districtNameEn": "Kachchh",
    "districtNameGu": "કચ્છ",
    "nameEn": "Bhuj City",
    "nameGu": "Bhuj City",
    "villageCount": 6
  },
  {
    "code": 3731,
    "id": "kutch_gandhidham",
    "districtCode": 449,
    "districtId": "kutch",
    "districtNameEn": "Kachchh",
    "districtNameGu": "કચ્છ",
    "nameEn": "Gandhidham",
    "nameGu": "Gandhidham",
    "villageCount": 10
  },
  {
    "code": 3722,
    "id": "kutch_lakhpat",
    "districtCode": 449,
    "districtId": "kutch",
    "districtNameEn": "Kachchh",
    "districtNameGu": "કચ્છ",
    "nameEn": "Lakhpat",
    "nameGu": "Lakhpat",
    "villageCount": 101
  },
  {
    "code": 3729,
    "id": "kutch_mandvi",
    "districtCode": 449,
    "districtId": "kutch",
    "districtNameEn": "Kachchh",
    "districtNameGu": "કચ્છ",
    "nameEn": "Mandvi",
    "nameGu": "માંડવી",
    "villageCount": 100
  },
  {
    "code": 3730,
    "id": "kutch_mundra",
    "districtCode": 449,
    "districtId": "kutch",
    "districtNameEn": "Kachchh",
    "districtNameGu": "કચ્છ",
    "nameEn": "Mundra",
    "nameGu": "Mundra",
    "villageCount": 64
  },
  {
    "code": 3727,
    "id": "kutch_nakhatrana",
    "districtCode": 449,
    "districtId": "kutch",
    "districtNameEn": "Kachchh",
    "districtNameGu": "કચ્છ",
    "nameEn": "Nakhatrana",
    "nameGu": "Nakhatrana",
    "villageCount": 139
  },
  {
    "code": 3723,
    "id": "kutch_rapar",
    "districtCode": 449,
    "districtId": "kutch",
    "districtNameEn": "Kachchh",
    "districtNameGu": "કચ્છ",
    "nameEn": "Rapar",
    "nameGu": "Rapar",
    "villageCount": 101
  },
  {
    "code": 7558,
    "id": "kheda_fagvel",
    "districtCode": 450,
    "districtId": "kheda",
    "districtNameEn": "Kheda",
    "districtNameGu": "ખેડા",
    "nameEn": "Fagvel",
    "nameGu": "Fagvel",
    "villageCount": 17
  },
  {
    "code": 6025,
    "id": "kheda_galteshwar",
    "districtCode": 450,
    "districtId": "kheda",
    "districtNameEn": "Kheda",
    "districtNameGu": "ખેડા",
    "nameEn": "Galteshwar",
    "nameGu": "Galteshwar",
    "villageCount": 28
  },
  {
    "code": 3869,
    "id": "kheda_kapadvanj",
    "districtCode": 450,
    "districtId": "kheda",
    "districtNameEn": "Kheda",
    "districtNameGu": "ખેડા",
    "nameEn": "Kapadvanj",
    "nameGu": "Kapadvanj",
    "villageCount": 101
  },
  {
    "code": 3872,
    "id": "kheda_kathlal",
    "districtCode": 450,
    "districtId": "kheda",
    "districtNameEn": "Kheda",
    "districtNameGu": "ખેડા",
    "nameEn": "Kathlal",
    "nameGu": "Kathlal",
    "villageCount": 50
  },
  {
    "code": 3874,
    "id": "kheda_kheda",
    "districtCode": 450,
    "districtId": "kheda",
    "districtNameEn": "Kheda",
    "districtNameGu": "ખેડા",
    "nameEn": "Kheda",
    "nameGu": "Kheda",
    "villageCount": 40
  },
  {
    "code": 3877,
    "id": "kheda_mahudha",
    "districtCode": 450,
    "districtId": "kheda",
    "districtNameEn": "Kheda",
    "districtNameGu": "ખેડા",
    "nameEn": "Mahudha",
    "nameGu": "Mahudha",
    "villageCount": 42
  },
  {
    "code": 3875,
    "id": "kheda_matar",
    "districtCode": 450,
    "districtId": "kheda",
    "districtNameEn": "Kheda",
    "districtNameGu": "ખેડા",
    "nameEn": "Matar",
    "nameGu": "Matar",
    "villageCount": 49
  },
  {
    "code": 3873,
    "id": "kheda_mehmedabad",
    "districtCode": 450,
    "districtId": "kheda",
    "districtNameEn": "Kheda",
    "districtNameGu": "ખેડા",
    "nameEn": "Mehmedabad",
    "nameGu": "Mehmedabad",
    "villageCount": 67
  },
  {
    "code": 3876,
    "id": "kheda_nadiad",
    "districtCode": 450,
    "districtId": "kheda",
    "districtNameEn": "Kheda",
    "districtNameGu": "ખેડા",
    "nameEn": "Nadiad",
    "nameGu": "Nadiad",
    "villageCount": 49
  },
  {
    "code": 6531,
    "id": "kheda_nadiad_city",
    "districtCode": 450,
    "districtId": "kheda",
    "districtNameEn": "Kheda",
    "districtNameGu": "ખેડા",
    "nameEn": "Nadiad City",
    "nameGu": "Nadiad City",
    "villageCount": 8
  },
  {
    "code": 3878,
    "id": "kheda_thasra",
    "districtCode": 450,
    "districtId": "kheda",
    "districtNameEn": "Kheda",
    "districtNameGu": "ખેડા",
    "nameEn": "Thasra",
    "nameGu": "Thasra",
    "villageCount": 68
  },
  {
    "code": 6034,
    "id": "kheda_vaso",
    "districtCode": 450,
    "districtId": "kheda",
    "districtNameEn": "Kheda",
    "districtNameGu": "ખેડા",
    "nameEn": "Vaso",
    "nameGu": "Vaso",
    "villageCount": 22
  },
  {
    "code": 3758,
    "id": "mehsana_becharaji",
    "districtCode": 451,
    "districtId": "mehsana",
    "districtNameEn": "Mahesana",
    "districtNameGu": "મહેસાણા",
    "nameEn": "Becharaji",
    "nameGu": "Becharaji",
    "villageCount": 52
  },
  {
    "code": 6021,
    "id": "mehsana_jotana",
    "districtCode": 451,
    "districtId": "mehsana",
    "districtNameEn": "Mahesana",
    "districtNameGu": "મહેસાણા",
    "nameEn": "Jotana",
    "nameGu": "Jotana",
    "villageCount": 35
  },
  {
    "code": 3759,
    "id": "mehsana_kadi",
    "districtCode": 451,
    "districtId": "mehsana",
    "districtNameEn": "Mahesana",
    "districtNameGu": "મહેસાણા",
    "nameEn": "Kadi",
    "nameGu": "Kadi",
    "villageCount": 112
  },
  {
    "code": 3752,
    "id": "mehsana_kheralu",
    "districtCode": 451,
    "districtId": "mehsana",
    "districtNameEn": "Mahesana",
    "districtNameGu": "મહેસાણા",
    "nameEn": "Kheralu",
    "nameGu": "Kheralu",
    "villageCount": 50
  },
  {
    "code": 3757,
    "id": "mehsana_mahesana",
    "districtCode": 451,
    "districtId": "mehsana",
    "districtNameEn": "Mahesana",
    "districtNameGu": "મહેસાણા",
    "nameEn": "Mahesana",
    "nameGu": "Mahesana",
    "villageCount": 96
  },
  {
    "code": 7441,
    "id": "mehsana_mahesana_city",
    "districtCode": 451,
    "districtId": "mehsana",
    "districtNameEn": "Mahesana",
    "districtNameGu": "મહેસાણા",
    "nameEn": "Mahesana City",
    "nameGu": "Mahesana City",
    "villageCount": 1
  },
  {
    "code": 3751,
    "id": "mehsana_satlasana",
    "districtCode": 451,
    "districtId": "mehsana",
    "districtNameEn": "Mahesana",
    "districtNameGu": "મહેસાણા",
    "nameEn": "Satlasana",
    "nameGu": "Satlasana",
    "villageCount": 73
  },
  {
    "code": 3753,
    "id": "mehsana_unjha",
    "districtCode": 451,
    "districtId": "mehsana",
    "districtNameEn": "Mahesana",
    "districtNameGu": "મહેસાણા",
    "nameEn": "Unjha",
    "nameGu": "Unjha",
    "villageCount": 32
  },
  {
    "code": 3755,
    "id": "mehsana_vadnagar",
    "districtCode": 451,
    "districtId": "mehsana",
    "districtNameEn": "Mahesana",
    "districtNameGu": "મહેસાણા",
    "nameEn": "Vadnagar",
    "nameGu": "Vadnagar",
    "villageCount": 47
  },
  {
    "code": 3756,
    "id": "mehsana_vijapur",
    "districtCode": 451,
    "districtId": "mehsana",
    "districtNameEn": "Mahesana",
    "districtNameGu": "મહેસાણા",
    "nameEn": "Vijapur",
    "nameGu": "Vijapur",
    "villageCount": 65
  },
  {
    "code": 3754,
    "id": "mehsana_visnagar",
    "districtCode": 451,
    "districtId": "mehsana",
    "districtNameEn": "Mahesana",
    "districtNameGu": "મહેસાણા",
    "nameEn": "Visnagar",
    "nameGu": "Visnagar",
    "villageCount": 58
  },
  {
    "code": 7545,
    "id": "narmada_chikada",
    "districtCode": 452,
    "districtId": "narmada",
    "districtNameEn": "Narmada",
    "districtNameGu": "નર્મદા",
    "nameEn": "Chikada",
    "nameGu": "Chikada",
    "villageCount": 61
  },
  {
    "code": 3911,
    "id": "narmada_dediapada",
    "districtCode": 452,
    "districtId": "narmada",
    "districtNameEn": "Narmada",
    "districtNameGu": "નર્મદા",
    "nameEn": "Dediapada",
    "nameGu": "Dediapada",
    "villageCount": 153
  },
  {
    "code": 6029,
    "id": "narmada_garudeshwar",
    "districtCode": 452,
    "districtId": "narmada",
    "districtNameEn": "Narmada",
    "districtNameGu": "નર્મદા",
    "nameEn": "Garudeshwar",
    "nameGu": "Garudeshwar",
    "villageCount": 94
  },
  {
    "code": 3910,
    "id": "narmada_nandod",
    "districtCode": 452,
    "districtId": "narmada",
    "districtNameEn": "Narmada",
    "districtNameGu": "નર્મદા",
    "nameEn": "Nandod",
    "nameGu": "Nandod",
    "villageCount": 112
  },
  {
    "code": 3912,
    "id": "narmada_sagbara",
    "districtCode": 452,
    "districtId": "narmada",
    "districtNameEn": "Narmada",
    "districtNameGu": "નર્મદા",
    "nameEn": "Sagbara",
    "nameGu": "Sagbara",
    "villageCount": 98
  },
  {
    "code": 3909,
    "id": "narmada_tilakwada",
    "districtCode": 452,
    "districtId": "narmada",
    "districtNameEn": "Narmada",
    "districtNameGu": "નર્મદા",
    "nameEn": "Tilakwada",
    "nameGu": "Tilakwada",
    "villageCount": 97
  },
  {
    "code": 3926,
    "id": "navsari_bansda",
    "districtCode": 453,
    "districtId": "navsari",
    "districtNameEn": "Navsari",
    "districtNameGu": "નવસારી",
    "nameEn": "Bansda",
    "nameGu": "Bansda",
    "villageCount": 96
  },
  {
    "code": 3925,
    "id": "navsari_chikhli",
    "districtCode": 453,
    "districtId": "navsari",
    "districtNameEn": "Navsari",
    "districtNameGu": "નવસારી",
    "nameEn": "Chikhli",
    "nameGu": "Chikhli",
    "villageCount": 73
  },
  {
    "code": 3924,
    "id": "navsari_gandevi",
    "districtCode": 453,
    "districtId": "navsari",
    "districtNameEn": "Navsari",
    "districtNameGu": "નવસારી",
    "nameEn": "Gandevi",
    "nameGu": "Gandevi",
    "villageCount": 69
  },
  {
    "code": 3923,
    "id": "navsari_jalalpore",
    "districtCode": 453,
    "districtId": "navsari",
    "districtNameEn": "Navsari",
    "districtNameGu": "નવસારી",
    "nameEn": "Jalalpore",
    "nameGu": "Jalalpore",
    "villageCount": 77
  },
  {
    "code": 6195,
    "id": "navsari_khergam",
    "districtCode": 453,
    "districtId": "navsari",
    "districtNameEn": "Navsari",
    "districtNameGu": "નવસારી",
    "nameEn": "Khergam",
    "nameGu": "Khergam",
    "villageCount": 22
  },
  {
    "code": 3922,
    "id": "navsari_navsari",
    "districtCode": 453,
    "districtId": "navsari",
    "districtNameEn": "Navsari",
    "districtNameGu": "નવસારી",
    "nameEn": "Navsari",
    "nameGu": "Navsari",
    "villageCount": 78
  },
  {
    "code": 3887,
    "id": "panchmahal_ghoghamba",
    "districtCode": 454,
    "districtId": "panchmahal",
    "districtNameEn": "Panch Mahals",
    "districtNameGu": "પંચમહાલ",
    "nameEn": "Ghoghamba",
    "nameGu": "Ghoghamba",
    "villageCount": 100
  },
  {
    "code": 7598,
    "id": "panchmahal_godharacity",
    "districtCode": 454,
    "districtId": "panchmahal",
    "districtNameEn": "Panch Mahals",
    "districtNameGu": "પંચમહાલ",
    "nameEn": "Godharacity",
    "nameGu": "Godharacity",
    "villageCount": 0
  },
  {
    "code": 3885,
    "id": "panchmahal_godhra",
    "districtCode": 454,
    "districtId": "panchmahal",
    "districtNameEn": "Panch Mahals",
    "districtNameGu": "પંચમહાલ",
    "nameEn": "Godhra",
    "nameGu": "Godhra",
    "villageCount": 125
  },
  {
    "code": 3888,
    "id": "panchmahal_halol",
    "districtCode": 454,
    "districtId": "panchmahal",
    "districtNameEn": "Panch Mahals",
    "districtNameGu": "પંચમહાલ",
    "nameEn": "Halol",
    "nameGu": "Halol",
    "villageCount": 134
  },
  {
    "code": 3889,
    "id": "panchmahal_jambughoda",
    "districtCode": 454,
    "districtId": "panchmahal",
    "districtNameEn": "Panch Mahals",
    "districtNameGu": "પંચમહાલ",
    "nameEn": "Jambughoda",
    "nameGu": "Jambughoda",
    "villageCount": 55
  },
  {
    "code": 3886,
    "id": "panchmahal_kalol",
    "districtCode": 454,
    "districtId": "panchmahal",
    "districtNameEn": "Panch Mahals",
    "districtNameGu": "પંચમહાલ",
    "nameEn": "Kalol",
    "nameGu": "Kalol",
    "villageCount": 75
  },
  {
    "code": 3884,
    "id": "panchmahal_morwa_(hadaf)",
    "districtCode": 454,
    "districtId": "panchmahal",
    "districtNameEn": "Panch Mahals",
    "districtNameGu": "પંચમહાલ",
    "nameEn": "Morwa (Hadaf)",
    "nameGu": "Morwa (Hadaf)",
    "villageCount": 55
  },
  {
    "code": 3883,
    "id": "panchmahal_shehera",
    "districtCode": 454,
    "districtId": "panchmahal",
    "districtNameEn": "Panch Mahals",
    "districtNameGu": "પંચમહાલ",
    "nameEn": "Shehera",
    "nameGu": "Shehera",
    "villageCount": 95
  },
  {
    "code": 3750,
    "id": "patan_chanasma",
    "districtCode": 455,
    "districtId": "patan",
    "districtNameEn": "Patan",
    "districtNameGu": "પાટણ",
    "nameEn": "Chanasma",
    "nameGu": "Chanasma",
    "villageCount": 61
  },
  {
    "code": 3748,
    "id": "patan_harij",
    "districtCode": 455,
    "districtId": "patan",
    "districtNameEn": "Patan",
    "districtNameGu": "પાટણ",
    "nameEn": "Harij",
    "nameGu": "Harij",
    "villageCount": 46
  },
  {
    "code": 3747,
    "id": "patan_patan",
    "districtCode": 455,
    "districtId": "patan",
    "districtNameEn": "Patan",
    "districtNameGu": "પાટણ",
    "nameEn": "Patan",
    "nameGu": "Patan",
    "villageCount": 65
  },
  {
    "code": 7433,
    "id": "patan_patan_city",
    "districtCode": 455,
    "districtId": "patan",
    "districtNameEn": "Patan",
    "districtNameGu": "પાટણ",
    "nameEn": "Patan City",
    "nameGu": "Patan City",
    "villageCount": 8
  },
  {
    "code": 3745,
    "id": "patan_radhanpur",
    "districtCode": 455,
    "districtId": "patan",
    "districtNameEn": "Patan",
    "districtNameGu": "પાટણ",
    "nameEn": "Radhanpur",
    "nameGu": "Radhanpur",
    "villageCount": 56
  },
  {
    "code": 3749,
    "id": "patan_sami",
    "districtCode": 455,
    "districtId": "patan",
    "districtNameEn": "Patan",
    "districtNameGu": "પાટણ",
    "nameEn": "Sami",
    "nameGu": "Sami",
    "villageCount": 58
  },
  {
    "code": 3744,
    "id": "patan_santalpur",
    "districtCode": 455,
    "districtId": "patan",
    "districtNameEn": "Patan",
    "districtNameGu": "પાટણ",
    "nameEn": "Santalpur",
    "nameGu": "Santalpur",
    "villageCount": 72
  },
  {
    "code": 6196,
    "id": "patan_saraswati",
    "districtCode": 455,
    "districtId": "patan",
    "districtNameEn": "Patan",
    "districtNameGu": "પાટણ",
    "nameEn": "Saraswati",
    "nameGu": "Saraswati",
    "villageCount": 73
  },
  {
    "code": 6197,
    "id": "patan_shankheshvar",
    "districtCode": 455,
    "districtId": "patan",
    "districtNameEn": "Patan",
    "districtNameGu": "પાટણ",
    "nameEn": "Shankheshvar",
    "nameGu": "Shankheshvar",
    "villageCount": 36
  },
  {
    "code": 3746,
    "id": "patan_sidhpur",
    "districtCode": 455,
    "districtId": "patan",
    "districtNameEn": "Patan",
    "districtNameGu": "પાટણ",
    "nameEn": "Sidhpur",
    "nameGu": "Sidhpur",
    "villageCount": 56
  },
  {
    "code": 3824,
    "id": "porbandar_kutiyana",
    "districtCode": 456,
    "districtId": "porbandar",
    "districtNameEn": "Porbandar",
    "districtNameGu": "પોરબંદર",
    "nameEn": "Kutiyana",
    "nameGu": "Kutiyana",
    "villageCount": 51
  },
  {
    "code": 7445,
    "id": "porbandar_porabandar_city",
    "districtCode": 456,
    "districtId": "porbandar",
    "districtNameEn": "Porbandar",
    "districtNameGu": "પોરબંદર",
    "nameEn": "Porabandar City",
    "nameGu": "Porabandar City",
    "villageCount": 2
  },
  {
    "code": 3822,
    "id": "porbandar_porbandar",
    "districtCode": 456,
    "districtId": "porbandar",
    "districtNameEn": "Porbandar",
    "districtNameGu": "પોરબંદર",
    "nameEn": "Porbandar",
    "nameGu": "Porbandar",
    "villageCount": 77
  },
  {
    "code": 3823,
    "id": "porbandar_ranavav",
    "districtCode": 456,
    "districtId": "porbandar",
    "districtNameEn": "Porbandar",
    "districtNameGu": "પોરબંદર",
    "nameEn": "Ranavav",
    "nameGu": "Ranavav",
    "villageCount": 60
  },
  {
    "code": 3810,
    "id": "rajkot_dhoraji",
    "districtCode": 457,
    "districtId": "rajkot",
    "districtNameEn": "Rajkot",
    "districtNameGu": "રાજકોટ",
    "nameEn": "Dhoraji",
    "nameGu": "ધોરાજી",
    "villageCount": 37
  },
  {
    "code": 3807,
    "id": "rajkot_gondal",
    "districtCode": 457,
    "districtId": "rajkot",
    "districtNameEn": "Rajkot",
    "districtNameGu": "રાજકોટ",
    "nameEn": "Gondal",
    "nameGu": "ગોંડલ",
    "villageCount": 81
  },
  {
    "code": 7439,
    "id": "rajkot_gondal_city",
    "districtCode": 457,
    "districtId": "rajkot",
    "districtNameEn": "Rajkot",
    "districtNameGu": "રાજકોટ",
    "nameEn": "Gondal City",
    "nameGu": "Gondal City",
    "villageCount": 7
  },
  {
    "code": 3808,
    "id": "rajkot_jamkandorna",
    "districtCode": 457,
    "districtId": "rajkot",
    "districtNameEn": "Rajkot",
    "districtNameGu": "રાજકોટ",
    "nameEn": "Jamkandorna",
    "nameGu": "Jamkandorna",
    "villageCount": 47
  },
  {
    "code": 3806,
    "id": "rajkot_jasdan",
    "districtCode": 457,
    "districtId": "rajkot",
    "districtNameEn": "Rajkot",
    "districtNameGu": "રાજકોટ",
    "nameEn": "Jasdan",
    "nameGu": "Jasdan",
    "villageCount": 60
  },
  {
    "code": 3811,
    "id": "rajkot_jetpur",
    "districtCode": 457,
    "districtId": "rajkot",
    "districtNameEn": "Rajkot",
    "districtNameGu": "રાજકોટ",
    "nameEn": "Jetpur",
    "nameGu": "જેતપુર",
    "villageCount": 48
  },
  {
    "code": 7440,
    "id": "rajkot_jetpur_city",
    "districtCode": 457,
    "districtId": "rajkot",
    "districtNameEn": "Rajkot",
    "districtNameGu": "રાજકોટ",
    "nameEn": "Jetpur City",
    "nameGu": "Jetpur City",
    "villageCount": 9
  },
  {
    "code": 3805,
    "id": "rajkot_kotda_sangani",
    "districtCode": 457,
    "districtId": "rajkot",
    "districtNameEn": "Rajkot",
    "districtNameGu": "રાજકોટ",
    "nameEn": "Kotda Sangani",
    "nameGu": "Kotda Sangani",
    "villageCount": 41
  },
  {
    "code": 3804,
    "id": "rajkot_lodhika",
    "districtCode": 457,
    "districtId": "rajkot",
    "districtNameEn": "Rajkot",
    "districtNameGu": "રાજકોટ",
    "nameEn": "Lodhika",
    "nameGu": "Lodhika",
    "villageCount": 38
  },
  {
    "code": 3802,
    "id": "rajkot_paddhari",
    "districtCode": 457,
    "districtId": "rajkot",
    "districtNameEn": "Rajkot",
    "districtNameGu": "રાજકોટ",
    "nameEn": "Paddhari",
    "nameGu": "Paddhari",
    "villageCount": 58
  },
  {
    "code": 3803,
    "id": "rajkot_rajkot",
    "districtCode": 457,
    "districtId": "rajkot",
    "districtNameEn": "Rajkot",
    "districtNameGu": "રાજકોટ",
    "nameEn": "Rajkot",
    "nameGu": "રાજકોટ",
    "villageCount": 103
  },
  {
    "code": 6520,
    "id": "rajkot_rajkot_east",
    "districtCode": 457,
    "districtId": "rajkot",
    "districtNameEn": "Rajkot",
    "districtNameGu": "રાજકોટ",
    "nameEn": "Rajkot East",
    "nameGu": "Rajkot East",
    "villageCount": 7
  },
  {
    "code": 6524,
    "id": "rajkot_rajkot_south",
    "districtCode": 457,
    "districtId": "rajkot",
    "districtNameEn": "Rajkot",
    "districtNameGu": "રાજકોટ",
    "nameEn": "Rajkot South",
    "nameGu": "Rajkot South",
    "villageCount": 11
  },
  {
    "code": 6523,
    "id": "rajkot_rajkot_west",
    "districtCode": 457,
    "districtId": "rajkot",
    "districtNameEn": "Rajkot",
    "districtNameGu": "રાજકોટ",
    "nameEn": "Rajkot West",
    "nameGu": "Rajkot West",
    "villageCount": 11
  },
  {
    "code": 3809,
    "id": "rajkot_upleta",
    "districtCode": 457,
    "districtId": "rajkot",
    "districtNameEn": "Rajkot",
    "districtNameGu": "રાજકોટ",
    "nameEn": "Upleta",
    "nameGu": "ઉપલેટા",
    "villageCount": 57
  },
  {
    "code": 6198,
    "id": "rajkot_vinchchiya",
    "districtCode": 457,
    "districtId": "rajkot",
    "districtNameEn": "Rajkot",
    "districtNameGu": "રાજકોટ",
    "nameEn": "Vinchchiya",
    "nameGu": "Vinchchiya",
    "villageCount": 46
  },
  {
    "code": 3766,
    "id": "sabarkantha_himatnagar",
    "districtCode": 458,
    "districtId": "sabarkantha",
    "districtNameEn": "Sabar Kantha",
    "districtNameGu": "સાબરકાંઠા",
    "nameEn": "Himatnagar",
    "nameGu": "Himatnagar",
    "villageCount": 155
  },
  {
    "code": 3763,
    "id": "sabarkantha_idar",
    "districtCode": 458,
    "districtId": "sabarkantha",
    "districtNameEn": "Sabar Kantha",
    "districtNameGu": "સાબરકાંઠા",
    "nameEn": "Idar",
    "nameGu": "Idar",
    "villageCount": 144
  },
  {
    "code": 3760,
    "id": "sabarkantha_khedbrahma",
    "districtCode": 458,
    "districtId": "sabarkantha",
    "districtNameEn": "Sabar Kantha",
    "districtNameGu": "સાબરકાંઠા",
    "nameEn": "Khedbrahma",
    "nameGu": "Khedbrahma",
    "villageCount": 81
  },
  {
    "code": 6088,
    "id": "sabarkantha_poshina",
    "districtCode": 458,
    "districtId": "sabarkantha",
    "districtNameEn": "Sabar Kantha",
    "districtNameGu": "સાબરકાંઠા",
    "nameEn": "Poshina",
    "nameGu": "Poshina",
    "villageCount": 59
  },
  {
    "code": 3767,
    "id": "sabarkantha_prantij",
    "districtCode": 458,
    "districtId": "sabarkantha",
    "districtNameEn": "Sabar Kantha",
    "districtNameGu": "સાબરકાંઠા",
    "nameEn": "Prantij",
    "nameGu": "Prantij",
    "villageCount": 65
  },
  {
    "code": 3768,
    "id": "sabarkantha_talod",
    "districtCode": 458,
    "districtId": "sabarkantha",
    "districtNameEn": "Sabar Kantha",
    "districtNameGu": "સાબરકાંઠા",
    "nameEn": "Talod",
    "nameGu": "Talod",
    "villageCount": 75
  },
  {
    "code": 3762,
    "id": "sabarkantha_vadali",
    "districtCode": 458,
    "districtId": "sabarkantha",
    "districtNameEn": "Sabar Kantha",
    "districtNameGu": "સાબરકાંઠા",
    "nameEn": "Vadali",
    "nameGu": "Vadali",
    "villageCount": 57
  },
  {
    "code": 3761,
    "id": "sabarkantha_vijaynagar",
    "districtCode": 458,
    "districtId": "sabarkantha",
    "districtNameEn": "Sabar Kantha",
    "districtNameGu": "સાબરકાંઠા",
    "nameEn": "Vijaynagar",
    "nameGu": "Vijaynagar",
    "villageCount": 87
  },
  {
    "code": 7600,
    "id": "surat_abrama",
    "districtCode": 459,
    "districtId": "surat",
    "districtNameEn": "Surat",
    "districtNameGu": "સુરત",
    "nameEn": "Abrama",
    "nameGu": "Abrama",
    "villageCount": 11
  },
  {
    "code": 6518,
    "id": "surat_adajan",
    "districtCode": 459,
    "districtId": "surat",
    "districtNameEn": "Surat",
    "districtNameGu": "સુરત",
    "nameEn": "Adajan",
    "nameGu": "Adajan",
    "villageCount": 17
  },
  {
    "code": 7552,
    "id": "surat_ambika",
    "districtCode": 459,
    "districtId": "surat",
    "districtNameEn": "Surat",
    "districtNameGu": "સુરત",
    "nameEn": "Ambika",
    "nameGu": "Ambika",
    "villageCount": 29
  },
  {
    "code": 7553,
    "id": "surat_areth",
    "districtCode": 459,
    "districtId": "surat",
    "districtNameEn": "Surat",
    "districtNameGu": "સુરત",
    "nameEn": "Areth",
    "nameGu": "Areth",
    "villageCount": 38
  },
  {
    "code": 3940,
    "id": "surat_bardoli",
    "districtCode": 459,
    "districtId": "surat",
    "districtNameEn": "Surat",
    "districtNameGu": "સુરત",
    "nameEn": "Bardoli",
    "nameGu": "બારડોલી",
    "villageCount": 87
  },
  {
    "code": 3938,
    "id": "surat_chorasi",
    "districtCode": 459,
    "districtId": "surat",
    "districtNameEn": "Surat",
    "districtNameGu": "સુરત",
    "nameEn": "Chorasi",
    "nameGu": "ચોર્યાસી",
    "villageCount": 35
  },
  {
    "code": 3936,
    "id": "surat_kamrej",
    "districtCode": 459,
    "districtId": "surat",
    "districtNameEn": "Surat",
    "districtNameGu": "સુરત",
    "nameEn": "Kamrej",
    "nameGu": "કામરેજ",
    "villageCount": 61
  },
  {
    "code": 6519,
    "id": "surat_katargam",
    "districtCode": 459,
    "districtId": "surat",
    "districtNameEn": "Surat",
    "districtNameGu": "સુરત",
    "nameEn": "Katargam",
    "nameGu": "Katargam",
    "villageCount": 19
  },
  {
    "code": 3941,
    "id": "surat_mahuva",
    "districtCode": 459,
    "districtId": "surat",
    "districtNameEn": "Surat",
    "districtNameGu": "સુરત",
    "nameEn": "Mahuva",
    "nameGu": "મહુવા",
    "villageCount": 40
  },
  {
    "code": 3937,
    "id": "surat_majura",
    "districtCode": 459,
    "districtId": "surat",
    "districtNameEn": "Surat",
    "districtNameGu": "સુરત",
    "nameEn": "Majura",
    "nameGu": "Majura",
    "villageCount": 25
  },
  {
    "code": 3935,
    "id": "surat_mandvi",
    "districtCode": 459,
    "districtId": "surat",
    "districtNameEn": "Surat",
    "districtNameGu": "સુરત",
    "nameEn": "Mandvi",
    "nameGu": "માંડવી",
    "villageCount": 113
  },
  {
    "code": 3933,
    "id": "surat_mangrol",
    "districtCode": 459,
    "districtId": "surat",
    "districtNameEn": "Surat",
    "districtNameGu": "સુરત",
    "nameEn": "Mangrol",
    "nameGu": "માંગરોળ",
    "villageCount": 92
  },
  {
    "code": 3932,
    "id": "surat_olpad",
    "districtCode": 459,
    "districtId": "surat",
    "districtNameEn": "Surat",
    "districtNameGu": "સુરત",
    "nameEn": "Olpad",
    "nameGu": "ઓલપાડ",
    "villageCount": 106
  },
  {
    "code": 3939,
    "id": "surat_palsana",
    "districtCode": 459,
    "districtId": "surat",
    "districtNameEn": "Surat",
    "districtNameGu": "સુરત",
    "nameEn": "Palsana",
    "nameGu": "પલસાણા",
    "villageCount": 49
  },
  {
    "code": 6521,
    "id": "surat_puna",
    "districtCode": 459,
    "districtId": "surat",
    "districtNameEn": "Surat",
    "districtNameGu": "સુરત",
    "nameEn": "Puna",
    "nameGu": "Puna",
    "villageCount": 18
  },
  {
    "code": 6522,
    "id": "surat_udhna",
    "districtCode": 459,
    "districtId": "surat",
    "districtNameEn": "Surat",
    "districtNameGu": "સુરત",
    "nameEn": "Udhna",
    "nameGu": "Udhna",
    "villageCount": 19
  },
  {
    "code": 3934,
    "id": "surat_umarpada",
    "districtCode": 459,
    "districtId": "surat",
    "districtNameEn": "Surat",
    "districtNameGu": "સુરત",
    "nameEn": "Umarpada",
    "nameGu": "ઉમરપાડા",
    "villageCount": 64
  },
  {
    "code": 3794,
    "id": "surendranagar_chotila",
    "districtCode": 460,
    "districtId": "surendranagar",
    "districtNameEn": "Surendranagar",
    "districtNameGu": "સુરેન્દ્રનગર",
    "nameEn": "Chotila",
    "nameGu": "Chotila",
    "villageCount": 84
  },
  {
    "code": 3796,
    "id": "surendranagar_chuda",
    "districtCode": 460,
    "districtId": "surendranagar",
    "districtNameEn": "Surendranagar",
    "districtNameGu": "સુરેન્દ્રનગર",
    "nameEn": "Chuda",
    "nameGu": "Chuda",
    "villageCount": 36
  },
  {
    "code": 3790,
    "id": "surendranagar_dasada",
    "districtCode": 460,
    "districtId": "surendranagar",
    "districtNameEn": "Surendranagar",
    "districtNameGu": "સુરેન્દ્રનગર",
    "nameEn": "Dasada",
    "nameGu": "Dasada",
    "villageCount": 89
  },
  {
    "code": 3789,
    "id": "surendranagar_dhrangadhra",
    "districtCode": 460,
    "districtId": "surendranagar",
    "districtNameEn": "Surendranagar",
    "districtNameGu": "સુરેન્દ્રનગર",
    "nameEn": "Dhrangadhra",
    "nameGu": "Dhrangadhra",
    "villageCount": 65
  },
  {
    "code": 3791,
    "id": "surendranagar_lakhtar",
    "districtCode": 460,
    "districtId": "surendranagar",
    "districtNameEn": "Surendranagar",
    "districtNameGu": "સુરેન્દ્રનગર",
    "nameEn": "Lakhtar",
    "nameGu": "Lakhtar",
    "villageCount": 43
  },
  {
    "code": 3797,
    "id": "surendranagar_limbdi",
    "districtCode": 460,
    "districtId": "surendranagar",
    "districtNameEn": "Surendranagar",
    "districtNameGu": "સુરેન્દ્રનગર",
    "nameEn": "Limbdi",
    "nameGu": "Limbdi",
    "villageCount": 60
  },
  {
    "code": 3793,
    "id": "surendranagar_muli",
    "districtCode": 460,
    "districtId": "surendranagar",
    "districtNameEn": "Surendranagar",
    "districtNameGu": "સુરેન્દ્રનગર",
    "nameEn": "Muli",
    "nameGu": "Muli",
    "villageCount": 54
  },
  {
    "code": 3795,
    "id": "surendranagar_sayla",
    "districtCode": 460,
    "districtId": "surendranagar",
    "districtNameEn": "Surendranagar",
    "districtNameGu": "સુરેન્દ્રનગર",
    "nameEn": "Sayla",
    "nameGu": "Sayla",
    "villageCount": 71
  },
  {
    "code": 7442,
    "id": "surendranagar_surendranagar_city",
    "districtCode": 460,
    "districtId": "surendranagar",
    "districtNameEn": "Surendranagar",
    "districtNameGu": "સુરેન્દ્રનગર",
    "nameEn": "Surendranagar City",
    "nameGu": "Surendranagar City",
    "villageCount": 2
  },
  {
    "code": 6037,
    "id": "surendranagar_thangadh",
    "districtCode": 460,
    "districtId": "surendranagar",
    "districtNameEn": "Surendranagar",
    "districtNameGu": "સુરેન્દ્રનગર",
    "nameEn": "Thangadh",
    "nameGu": "Thangadh",
    "villageCount": 29
  },
  {
    "code": 3792,
    "id": "surendranagar_wadhwan",
    "districtCode": 460,
    "districtId": "surendranagar",
    "districtNameEn": "Surendranagar",
    "districtNameGu": "સુરેન્દ્રનગર",
    "nameEn": "Wadhwan",
    "nameGu": "Wadhwan",
    "villageCount": 46
  },
  {
    "code": 3905,
    "id": "vadodara_dabhoi",
    "districtCode": 461,
    "districtId": "vadodara",
    "districtNameEn": "Vadodara",
    "districtNameGu": "વડોદરા",
    "nameEn": "Dabhoi",
    "nameGu": "ડભોઇ",
    "villageCount": 120
  },
  {
    "code": 6035,
    "id": "vadodara_desar",
    "districtCode": 461,
    "districtId": "vadodara",
    "districtNameEn": "Vadodara",
    "districtNameGu": "વડોદરા",
    "nameEn": "Desar",
    "nameGu": "ડેસર",
    "villageCount": 49
  },
  {
    "code": 3907,
    "id": "vadodara_karjan",
    "districtCode": 461,
    "districtId": "vadodara",
    "districtNameEn": "Vadodara",
    "districtNameGu": "વડોદરા",
    "nameEn": "Karjan",
    "nameGu": "કરજણ",
    "villageCount": 94
  },
  {
    "code": 3906,
    "id": "vadodara_padra",
    "districtCode": 461,
    "districtId": "vadodara",
    "districtNameEn": "Vadodara",
    "districtNameGu": "વડોદરા",
    "nameEn": "Padra",
    "nameGu": "પાદરા",
    "villageCount": 83
  },
  {
    "code": 3897,
    "id": "vadodara_savli",
    "districtCode": 461,
    "districtId": "vadodara",
    "districtNameEn": "Vadodara",
    "districtNameGu": "વડોદરા",
    "nameEn": "Savli",
    "nameGu": "સાવલી",
    "villageCount": 89
  },
  {
    "code": 3908,
    "id": "vadodara_sinor",
    "districtCode": 461,
    "districtId": "vadodara",
    "districtNameEn": "Vadodara",
    "districtNameGu": "વડોદરા",
    "nameEn": "Sinor",
    "nameGu": "શિનોર",
    "villageCount": 41
  },
  {
    "code": 6529,
    "id": "vadodara_vadodara_east",
    "districtCode": 461,
    "districtId": "vadodara",
    "districtNameEn": "Vadodara",
    "districtNameGu": "વડોદરા",
    "nameEn": "Vadodara East",
    "nameGu": "Vadodara East",
    "villageCount": 8
  },
  {
    "code": 6527,
    "id": "vadodara_vadodara_north",
    "districtCode": 461,
    "districtId": "vadodara",
    "districtNameEn": "Vadodara",
    "districtNameGu": "વડોદરા",
    "nameEn": "Vadodara North",
    "nameGu": "Vadodara North",
    "villageCount": 10
  },
  {
    "code": 3898,
    "id": "vadodara_vadodara_rural",
    "districtCode": 461,
    "districtId": "vadodara",
    "districtNameEn": "Vadodara",
    "districtNameGu": "વડોદરા",
    "nameEn": "Vadodara Rural",
    "nameGu": "Vadodara Rural",
    "villageCount": 98
  },
  {
    "code": 6526,
    "id": "vadodara_vadodara_south",
    "districtCode": 461,
    "districtId": "vadodara",
    "districtNameEn": "Vadodara",
    "districtNameGu": "વડોદરા",
    "nameEn": "Vadodara South",
    "nameGu": "Vadodara South",
    "villageCount": 9
  },
  {
    "code": 6528,
    "id": "vadodara_vadodara_west",
    "districtCode": 461,
    "districtId": "vadodara",
    "districtNameEn": "Vadodara",
    "districtNameGu": "વડોદરા",
    "nameEn": "Vadodara West",
    "nameGu": "Vadodara West",
    "villageCount": 9
  },
  {
    "code": 3899,
    "id": "vadodara_vaghodia",
    "districtCode": 461,
    "districtId": "vadodara",
    "districtNameEn": "Vadodara",
    "districtNameGu": "વડોદરા",
    "nameEn": "Vaghodia",
    "nameGu": "વાઘોડિયા",
    "villageCount": 96
  },
  {
    "code": 3928,
    "id": "valsad_dharampur",
    "districtCode": 462,
    "districtId": "valsad",
    "districtNameEn": "Valsad",
    "districtNameGu": "વલસાડ",
    "nameEn": "Dharampur",
    "nameGu": "Dharampur",
    "villageCount": 109
  },
  {
    "code": 3930,
    "id": "valsad_kaprada",
    "districtCode": 462,
    "districtId": "valsad",
    "districtNameEn": "Valsad",
    "districtNameGu": "વલસાડ",
    "nameEn": "Kaprada",
    "nameGu": "Kaprada",
    "villageCount": 100
  },
  {
    "code": 7547,
    "id": "valsad_nanapodha",
    "districtCode": 462,
    "districtId": "valsad",
    "districtNameEn": "Valsad",
    "districtNameGu": "વલસાડ",
    "nameEn": "Nanapodha",
    "nameGu": "Nanapodha",
    "villageCount": 49
  },
  {
    "code": 7601,
    "id": "valsad_pardi",
    "districtCode": 462,
    "districtId": "valsad",
    "districtNameEn": "Valsad",
    "districtNameGu": "વલસાડ",
    "nameEn": "Pardi",
    "nameGu": "Pardi",
    "villageCount": 46
  },
  {
    "code": 3931,
    "id": "valsad_umbergaon",
    "districtCode": 462,
    "districtId": "valsad",
    "districtNameEn": "Valsad",
    "districtNameGu": "વલસાડ",
    "nameEn": "Umbergaon",
    "nameGu": "Umbergaon",
    "villageCount": 50
  },
  {
    "code": 3927,
    "id": "valsad_valsad",
    "districtCode": 462,
    "districtId": "valsad",
    "districtNameEn": "Valsad",
    "districtNameGu": "વલસાડ",
    "nameEn": "Valsad",
    "nameGu": "Valsad",
    "villageCount": 105
  },
  {
    "code": 7599,
    "id": "valsad_valsad_city",
    "districtCode": 462,
    "districtId": "valsad",
    "districtNameEn": "Valsad",
    "districtNameGu": "વલસાડ",
    "nameEn": "Valsad City",
    "nameGu": "Valsad City",
    "villageCount": 0
  },
  {
    "code": 6031,
    "id": "valsad_vapi",
    "districtCode": 462,
    "districtId": "valsad",
    "districtNameEn": "Valsad",
    "districtNameGu": "વલસાડ",
    "nameEn": "Vapi",
    "nameGu": "Vapi",
    "villageCount": 15
  },
  {
    "code": 7596,
    "id": "valsad_vapi_city",
    "districtCode": 462,
    "districtId": "valsad",
    "districtNameEn": "Valsad",
    "districtNameGu": "વલસાડ",
    "nameEn": "Vapi City",
    "nameGu": "Vapi City",
    "villageCount": 0
  },
  {
    "code": 6200,
    "id": "tapi_dolvan",
    "districtCode": 641,
    "districtId": "tapi",
    "districtNameEn": "Tapi",
    "districtNameGu": "તાપી",
    "nameEn": "Dolvan",
    "nameGu": "Dolvan",
    "villageCount": 58
  },
  {
    "code": 6169,
    "id": "tapi_kukarmunda",
    "districtCode": 641,
    "districtId": "tapi",
    "districtNameEn": "Tapi",
    "districtNameGu": "તાપી",
    "nameEn": "Kukarmunda",
    "nameGu": "Kukarmunda",
    "villageCount": 51
  },
  {
    "code": 3942,
    "id": "tapi_nizar",
    "districtCode": 641,
    "districtId": "tapi",
    "districtNameEn": "Tapi",
    "districtNameGu": "તાપી",
    "nameEn": "Nizar",
    "nameGu": "Nizar",
    "villageCount": 35
  },
  {
    "code": 3944,
    "id": "tapi_songadh",
    "districtCode": 641,
    "districtId": "tapi",
    "districtNameEn": "Tapi",
    "districtNameGu": "તાપી",
    "nameEn": "Songadh",
    "nameGu": "Songadh",
    "villageCount": 124
  },
  {
    "code": 3943,
    "id": "tapi_uchchhal",
    "districtCode": 641,
    "districtId": "tapi",
    "districtNameEn": "Tapi",
    "districtNameGu": "તાપી",
    "nameEn": "Uchchhal",
    "nameGu": "Uchchhal",
    "villageCount": 55
  },
  {
    "code": 7550,
    "id": "tapi_ukai",
    "districtCode": 641,
    "districtId": "tapi",
    "districtNameEn": "Tapi",
    "districtNameGu": "તાપી",
    "nameEn": "Ukai",
    "nameGu": "Ukai",
    "villageCount": 58
  },
  {
    "code": 3946,
    "id": "tapi_valod",
    "districtCode": 641,
    "districtId": "tapi",
    "districtNameEn": "Tapi",
    "districtNameGu": "તાપી",
    "nameEn": "Valod",
    "nameGu": "Valod",
    "villageCount": 40
  },
  {
    "code": 3945,
    "id": "tapi_vyara",
    "districtCode": 641,
    "districtId": "tapi",
    "districtNameEn": "Tapi",
    "districtNameGu": "તાપી",
    "nameEn": "Vyara",
    "nameGu": "Vyara",
    "villageCount": 92
  },
  {
    "code": 6020,
    "id": "chhotaudepur_bodeli",
    "districtCode": 668,
    "districtId": "chhotaudepur",
    "districtNameEn": "Chhotaudepur",
    "districtNameGu": "છોટાઉદેપુર",
    "nameEn": "Bodeli",
    "nameGu": "Bodeli",
    "villageCount": 152
  },
  {
    "code": 3901,
    "id": "chhotaudepur_chhota_udaipur",
    "districtCode": 668,
    "districtId": "chhotaudepur",
    "districtNameEn": "Chhotaudepur",
    "districtNameGu": "છોટાઉદેપુર",
    "nameEn": "Chhota Udaipur",
    "nameGu": "Chhota Udaipur",
    "villageCount": 146
  },
  {
    "code": 3900,
    "id": "chhotaudepur_jetpur_pavi",
    "districtCode": 668,
    "districtId": "chhotaudepur",
    "districtNameEn": "Chhotaudepur",
    "districtNameGu": "છોટાઉદેપુર",
    "nameEn": "Jetpur Pavi",
    "nameGu": "Jetpur Pavi",
    "villageCount": 88
  },
  {
    "code": 7551,
    "id": "chhotaudepur_kadval",
    "districtCode": 668,
    "districtId": "chhotaudepur",
    "districtNameEn": "Chhotaudepur",
    "districtNameGu": "છોટાઉદેપુર",
    "nameEn": "Kadval",
    "nameGu": "Kadval",
    "villageCount": 44
  },
  {
    "code": 3902,
    "id": "chhotaudepur_kavant",
    "districtCode": 668,
    "districtId": "chhotaudepur",
    "districtNameEn": "Chhotaudepur",
    "districtNameGu": "છોટાઉદેપુર",
    "nameEn": "Kavant",
    "nameGu": "Kavant",
    "villageCount": 134
  },
  {
    "code": 3903,
    "id": "chhotaudepur_nasvadi",
    "districtCode": 668,
    "districtId": "chhotaudepur",
    "districtNameEn": "Chhotaudepur",
    "districtNameGu": "છોટાઉદેપુર",
    "nameEn": "Nasvadi",
    "nameGu": "Nasvadi",
    "villageCount": 222
  },
  {
    "code": 3904,
    "id": "chhotaudepur_sankheda",
    "districtCode": 668,
    "districtId": "chhotaudepur",
    "districtNameEn": "Chhotaudepur",
    "districtNameGu": "છોટાઉદેપુર",
    "nameEn": "Sankheda",
    "nameGu": "Sankheda",
    "villageCount": 118
  },
  {
    "code": 3871,
    "id": "mahisagar_balasinor",
    "districtCode": 669,
    "districtId": "mahisagar",
    "districtNameEn": "Mahisagar",
    "districtNameGu": "મહીસાગર",
    "nameEn": "Balasinor",
    "nameGu": "Balasinor",
    "villageCount": 48
  },
  {
    "code": 7546,
    "id": "mahisagar_godhar",
    "districtCode": 669,
    "districtId": "mahisagar",
    "districtNameEn": "Mahisagar",
    "districtNameGu": "મહીસાગર",
    "nameEn": "Godhar",
    "nameGu": "Godhar",
    "villageCount": 50
  },
  {
    "code": 3880,
    "id": "mahisagar_kadana",
    "districtCode": 669,
    "districtId": "mahisagar",
    "districtNameEn": "Mahisagar",
    "districtNameGu": "મહીસાગર",
    "nameEn": "Kadana",
    "nameGu": "Kadana",
    "villageCount": 136
  },
  {
    "code": 3879,
    "id": "mahisagar_khanpur",
    "districtCode": 669,
    "districtId": "mahisagar",
    "districtNameEn": "Mahisagar",
    "districtNameGu": "મહીસાગર",
    "nameEn": "Khanpur",
    "nameGu": "Khanpur",
    "villageCount": 86
  },
  {
    "code": 7556,
    "id": "mahisagar_kothmba",
    "districtCode": 669,
    "districtId": "mahisagar",
    "districtNameEn": "Mahisagar",
    "districtNameGu": "મહીસાગર",
    "nameEn": "Kothmba",
    "nameGu": "Kothmba",
    "villageCount": 50
  },
  {
    "code": 3882,
    "id": "mahisagar_lunawada",
    "districtCode": 669,
    "districtId": "mahisagar",
    "districtNameEn": "Mahisagar",
    "districtNameGu": "મહીસાગર",
    "nameEn": "Lunawada",
    "nameGu": "Lunawada",
    "villageCount": 195
  },
  {
    "code": 3881,
    "id": "mahisagar_santrampur",
    "districtCode": 669,
    "districtId": "mahisagar",
    "districtNameEn": "Mahisagar",
    "districtNameGu": "મહીસાગર",
    "nameEn": "Santrampur",
    "nameGu": "Santrampur",
    "villageCount": 104
  },
  {
    "code": 3870,
    "id": "mahisagar_virpur",
    "districtCode": 669,
    "districtId": "mahisagar",
    "districtNameEn": "Mahisagar",
    "districtNameGu": "મહીસાગર",
    "nameEn": "Virpur",
    "nameGu": "Virpur",
    "villageCount": 54
  },
  {
    "code": 3772,
    "id": "aravalli_bayad",
    "districtCode": 672,
    "districtId": "aravalli",
    "districtNameEn": "Arvalli",
    "districtNameGu": "અરવલ્લી",
    "nameEn": "Bayad",
    "nameGu": "Bayad",
    "villageCount": 82
  },
  {
    "code": 3764,
    "id": "aravalli_bhiloda",
    "districtCode": 672,
    "districtId": "aravalli",
    "districtNameEn": "Arvalli",
    "districtNameGu": "અરવલ્લી",
    "nameEn": "Bhiloda",
    "nameGu": "Bhiloda",
    "villageCount": 81
  },
  {
    "code": 3770,
    "id": "aravalli_dhansura",
    "districtCode": 672,
    "districtId": "aravalli",
    "districtNameEn": "Arvalli",
    "districtNameGu": "અરવલ્લી",
    "nameEn": "Dhansura",
    "nameGu": "Dhansura",
    "villageCount": 73
  },
  {
    "code": 3771,
    "id": "aravalli_malpur",
    "districtCode": 672,
    "districtId": "aravalli",
    "districtNameEn": "Arvalli",
    "districtNameGu": "અરવલ્લી",
    "nameEn": "Malpur",
    "nameGu": "Malpur",
    "villageCount": 100
  },
  {
    "code": 3765,
    "id": "aravalli_meghraj",
    "districtCode": 672,
    "districtId": "aravalli",
    "districtNameEn": "Arvalli",
    "districtNameGu": "અરવલ્લી",
    "nameEn": "Meghraj",
    "nameGu": "Meghraj",
    "villageCount": 130
  },
  {
    "code": 3769,
    "id": "aravalli_modasa",
    "districtCode": 672,
    "districtId": "aravalli",
    "districtNameEn": "Arvalli",
    "districtNameGu": "અરવલ્લી",
    "nameEn": "Modasa",
    "nameGu": "Modasa",
    "villageCount": 107
  },
  {
    "code": 7559,
    "id": "aravalli_sathamba",
    "districtCode": 672,
    "districtId": "aravalli",
    "districtNameEn": "Arvalli",
    "districtNameGu": "અરવલ્લી",
    "nameEn": "Sathamba",
    "nameGu": "Sathamba",
    "villageCount": 43
  },
  {
    "code": 7548,
    "id": "aravalli_shamlaji",
    "districtCode": 672,
    "districtId": "aravalli",
    "districtNameEn": "Arvalli",
    "districtNameGu": "અરવલ્લી",
    "nameEn": "Shamlaji",
    "nameGu": "Shamlaji",
    "villageCount": 73
  },
  {
    "code": 3788,
    "id": "morbi_halvad",
    "districtCode": 673,
    "districtId": "morbi",
    "districtNameEn": "Morbi",
    "districtNameGu": "મોરબી",
    "nameEn": "Halvad",
    "nameGu": "હળવદ",
    "villageCount": 67
  },
  {
    "code": 3798,
    "id": "morbi_maliya",
    "districtCode": 673,
    "districtId": "morbi",
    "districtNameEn": "Morbi",
    "districtNameGu": "મોરબી",
    "nameEn": "Maliya",
    "nameGu": "માળિયા",
    "villageCount": 46
  },
  {
    "code": 7443,
    "id": "morbi_morbi_city",
    "districtCode": 673,
    "districtId": "morbi",
    "districtNameEn": "Morbi",
    "districtNameGu": "મોરબી",
    "nameEn": "Morbi City",
    "nameGu": "Morbi City",
    "villageCount": 3
  },
  {
    "code": 3799,
    "id": "morbi_morvi",
    "districtCode": 673,
    "districtId": "morbi",
    "districtNameEn": "Morbi",
    "districtNameGu": "મોરબી",
    "nameEn": "Morvi",
    "nameGu": "Morvi",
    "villageCount": 94
  },
  {
    "code": 3800,
    "id": "morbi_tankara",
    "districtCode": 673,
    "districtId": "morbi",
    "districtNameEn": "Morbi",
    "districtNameGu": "મોરબી",
    "nameEn": "Tankara",
    "nameGu": "ટંકારા",
    "villageCount": 42
  },
  {
    "code": 3801,
    "id": "morbi_wankaner",
    "districtCode": 673,
    "districtId": "morbi",
    "districtNameEn": "Morbi",
    "districtNameGu": "મોરબી",
    "nameEn": "Wankaner",
    "nameGu": "વાંકાનેર",
    "villageCount": 101
  },
  {
    "code": 3820,
    "id": "devbhumi_dwarka_bhanvad",
    "districtCode": 674,
    "districtId": "devbhumi_dwarka",
    "districtNameEn": "Devbhumi Dwarka",
    "districtNameGu": "દેવભૂમિ દ્વારકા",
    "nameEn": "Bhanvad",
    "nameGu": "Bhanvad",
    "villageCount": 97
  },
  {
    "code": 3819,
    "id": "devbhumi_dwarka_kalyanpur",
    "districtCode": 674,
    "districtId": "devbhumi_dwarka",
    "districtNameEn": "Devbhumi Dwarka",
    "districtNameGu": "દેવભૂમિ દ્વારકા",
    "nameEn": "Kalyanpur",
    "nameGu": "Kalyanpur",
    "villageCount": 68
  },
  {
    "code": 3813,
    "id": "devbhumi_dwarka_khambhalia",
    "districtCode": 674,
    "districtId": "devbhumi_dwarka",
    "districtNameEn": "Devbhumi Dwarka",
    "districtNameGu": "દેવભૂમિ દ્વારકા",
    "nameEn": "Khambhalia",
    "nameGu": "Khambhalia",
    "villageCount": 93
  },
  {
    "code": 3812,
    "id": "devbhumi_dwarka_okhamandal",
    "districtCode": 674,
    "districtId": "devbhumi_dwarka",
    "districtNameEn": "Devbhumi Dwarka",
    "districtNameGu": "દેવભૂમિ દ્વારકા",
    "nameEn": "Okhamandal",
    "nameGu": "Okhamandal",
    "villageCount": 45
  },
  {
    "code": 6199,
    "id": "gir_somnath_gir_gadhda",
    "districtCode": 675,
    "districtId": "gir_somnath",
    "districtNameEn": "Gir Somnath",
    "districtNameGu": "ગીર સોમનાથ",
    "nameEn": "Gir Gadhda",
    "nameGu": "Gir Gadhda",
    "villageCount": 141
  },
  {
    "code": 3837,
    "id": "gir_somnath_kodinar",
    "districtCode": 675,
    "districtId": "gir_somnath",
    "districtNameEn": "Gir Somnath",
    "districtNameGu": "ગીર સોમનાથ",
    "nameEn": "Kodinar",
    "nameGu": "Kodinar",
    "villageCount": 61
  },
  {
    "code": 3835,
    "id": "gir_somnath_patan_veraval",
    "districtCode": 675,
    "districtId": "gir_somnath",
    "districtNameEn": "Gir Somnath",
    "districtNameGu": "ગીર સોમનાથ",
    "nameEn": "Patan-Veraval",
    "nameGu": "Patan-Veraval",
    "villageCount": 53
  },
  {
    "code": 3836,
    "id": "gir_somnath_sutrapada",
    "districtCode": 675,
    "districtId": "gir_somnath",
    "districtNameEn": "Gir Somnath",
    "districtNameGu": "ગીર સોમનાથ",
    "nameEn": "Sutrapada",
    "nameGu": "Sutrapada",
    "villageCount": 47
  },
  {
    "code": 3834,
    "id": "gir_somnath_talala",
    "districtCode": 675,
    "districtId": "gir_somnath",
    "districtNameEn": "Gir Somnath",
    "districtNameGu": "ગીર સોમનાથ",
    "nameEn": "Talala",
    "nameGu": "Talala",
    "villageCount": 98
  },
  {
    "code": 3838,
    "id": "gir_somnath_una",
    "districtCode": 675,
    "districtId": "gir_somnath",
    "districtNameEn": "Gir Somnath",
    "districtNameGu": "ગીર સોમનાથ",
    "nameEn": "Una",
    "nameGu": "Una",
    "villageCount": 83
  },
  {
    "code": 7446,
    "id": "gir_somnath_veraval_city",
    "districtCode": 675,
    "districtId": "gir_somnath",
    "districtNameEn": "Gir Somnath",
    "districtNameGu": "ગીર સોમનાથ",
    "nameEn": "Veraval City",
    "nameGu": "Veraval City",
    "villageCount": 2
  },
  {
    "code": 3786,
    "id": "botad_barwala",
    "districtCode": 676,
    "districtId": "botad",
    "districtNameEn": "Botad",
    "districtNameGu": "બોટાદ",
    "nameEn": "Barwala",
    "nameGu": "Barwala",
    "villageCount": 25
  },
  {
    "code": 3850,
    "id": "botad_botad",
    "districtCode": 676,
    "districtId": "botad",
    "districtNameEn": "Botad",
    "districtNameGu": "બોટાદ",
    "nameEn": "Botad",
    "nameGu": "Botad",
    "villageCount": 52
  },
  {
    "code": 7435,
    "id": "botad_botad_city",
    "districtCode": 676,
    "districtId": "botad",
    "districtNameEn": "Botad",
    "districtNameGu": "બોટાદ",
    "nameEn": "Botad City",
    "nameGu": "Botad City",
    "villageCount": 1
  },
  {
    "code": 3852,
    "id": "botad_gadhada",
    "districtCode": 676,
    "districtId": "botad",
    "districtNameEn": "Botad",
    "districtNameGu": "બોટાદ",
    "nameEn": "Gadhada",
    "nameGu": "Gadhada",
    "villageCount": 76
  },
  {
    "code": 3785,
    "id": "botad_ranpur",
    "districtCode": 676,
    "districtId": "botad",
    "districtNameEn": "Botad",
    "districtNameGu": "બોટાદ",
    "nameEn": "Ranpur",
    "nameGu": "Ranpur",
    "villageCount": 36
  },
  {
    "code": 3742,
    "id": "vav_tharad_bhabhar",
    "districtCode": 789,
    "districtId": "vav_tharad",
    "districtNameEn": "Vav-Tharad",
    "districtNameGu": "વાવ-થરાદ",
    "nameEn": "Bhabhar",
    "nameGu": "Bhabhar",
    "villageCount": 53
  },
  {
    "code": 3741,
    "id": "vav_tharad_deodar",
    "districtCode": 789,
    "districtId": "vav_tharad",
    "districtNameEn": "Vav-Tharad",
    "districtNameGu": "વાવ-થરાદ",
    "nameEn": "Deodar",
    "nameGu": "Deodar",
    "villageCount": 64
  },
  {
    "code": 7544,
    "id": "vav_tharad_dharnidhar",
    "districtCode": 789,
    "districtId": "vav_tharad",
    "districtNameEn": "Vav-Tharad",
    "districtNameGu": "વાવ-થરાદ",
    "nameEn": "Dharnidhar",
    "nameGu": "Dharnidhar",
    "villageCount": 44
  },
  {
    "code": 6168,
    "id": "vav_tharad_lakhani",
    "districtCode": 789,
    "districtId": "vav_tharad",
    "districtNameEn": "Vav-Tharad",
    "districtNameGu": "વાવ-થરાદ",
    "nameEn": "Lakhani",
    "nameGu": "Lakhani",
    "villageCount": 53
  },
  {
    "code": 7543,
    "id": "vav_tharad_raah",
    "districtCode": 789,
    "districtId": "vav_tharad",
    "districtNameEn": "Vav-Tharad",
    "districtNameGu": "વાવ-થરાદ",
    "nameEn": "Raah",
    "nameGu": "Raah",
    "villageCount": 32
  },
  {
    "code": 6166,
    "id": "vav_tharad_suigam",
    "districtCode": 789,
    "districtId": "vav_tharad",
    "districtNameEn": "Vav-Tharad",
    "districtNameGu": "વાવ-થરાદ",
    "nameEn": "Suigam",
    "nameGu": "Suigam",
    "villageCount": 43
  },
  {
    "code": 3733,
    "id": "vav_tharad_tharad",
    "districtCode": 789,
    "districtId": "vav_tharad",
    "districtNameEn": "Vav-Tharad",
    "districtNameGu": "વાવ-થરાદ",
    "nameEn": "Tharad",
    "nameGu": "Tharad",
    "villageCount": 93
  },
  {
    "code": 3732,
    "id": "vav_tharad_vav",
    "districtCode": 789,
    "districtId": "vav_tharad",
    "districtNameEn": "Vav-Tharad",
    "districtNameGu": "વાવ-થરાદ",
    "nameEn": "Vav",
    "nameGu": "Vav",
    "villageCount": 36
  }
];

// ========================================================
// 3. GHOGHA TALUKA VILLAGES (48 VILLAGES FROM NOTEBOOK & LGD)
// ========================================================
export const GHOGHA_48_VILLAGES: MasterVillage[] = [
  {
    "code": "516291",
    "id": "ghogha_516291",
    "nameEn": "Avaniya",
    "nameGu": "અવાણિયા",
    "subDistrictCode": 3855,
    "districtCode": 443,
    "category": "Rural",
    "status": "Inhabitant",
    "venueGu": "અવાણિયા સરકારી પ્રાથમિક શાળા",
    "venueEn": "Avaniya Primary School",
    "households": 180,
    "population": 900,
    "femalePopulation": 441,
    "beneficiaries": 45,
    "applications": 56,
    "approved": 41,
    "disbursedLakhs": 8.1,
    "anganwadis": 1,
    "coordinates": {
      "x": 50,
      "y": 40
    }
  },
  {
    "code": "516305",
    "id": "ghogha_516305",
    "nameEn": "Badi",
    "nameGu": "આડી / બડી",
    "subDistrictCode": 3855,
    "districtCode": 443,
    "category": "Rural",
    "status": "Inhabitant",
    "venueGu": "બડી કન્યા પ્રાથમિક શાળા",
    "venueEn": "Badi Girls Primary School",
    "households": 203,
    "population": 1015,
    "femalePopulation": 497,
    "beneficiaries": 62,
    "applications": 77,
    "approved": 57,
    "disbursedLakhs": 11.2,
    "anganwadis": 2,
    "coordinates": {
      "x": 95,
      "y": 40
    }
  },
  {
    "code": "516315",
    "id": "ghogha_516315",
    "nameEn": "Banbhaniya",
    "nameGu": "ભાંભણિયા",
    "subDistrictCode": 3855,
    "districtCode": 443,
    "category": "Rural",
    "status": "Inhabitant",
    "venueGu": "ભાંભણિયા ગ્રામ પંચાયત કેન્દ્ર",
    "venueEn": "Banbhaniya Panchayat Bhawan",
    "households": 226,
    "population": 1130,
    "femalePopulation": 553,
    "beneficiaries": 79,
    "applications": 98,
    "approved": 72,
    "disbursedLakhs": 14.2,
    "anganwadis": 3,
    "coordinates": {
      "x": 140,
      "y": 40
    }
  },
  {
    "code": "516287",
    "id": "ghogha_516287",
    "nameEn": "Bhandar",
    "nameGu": "ભંડારીયા",
    "subDistrictCode": 3855,
    "districtCode": 443,
    "category": "Rural",
    "status": "Inhabitant",
    "venueGu": "ભંડારીયા હાઈસ્કૂલ",
    "venueEn": "Bhandariya High School",
    "households": 249,
    "population": 1245,
    "femalePopulation": 610,
    "beneficiaries": 96,
    "applications": 120,
    "approved": 88,
    "disbursedLakhs": 17.3,
    "anganwadis": 1,
    "coordinates": {
      "x": 185,
      "y": 40
    }
  },
  {
    "code": "516333",
    "id": "ghogha_516333",
    "nameEn": "Bhankhal",
    "nameGu": "ભણખલ",
    "subDistrictCode": 3855,
    "districtCode": 443,
    "category": "Rural",
    "status": "Inhabitant",
    "venueGu": "ભણખલ પ્રાથમિક શાળા",
    "venueEn": "Bhankhal Primary School",
    "households": 272,
    "population": 1360,
    "femalePopulation": 666,
    "beneficiaries": 113,
    "applications": 141,
    "approved": 103,
    "disbursedLakhs": 20.3,
    "anganwadis": 2,
    "coordinates": {
      "x": 230,
      "y": 40
    }
  },
  {
    "code": "516321",
    "id": "ghogha_516321",
    "nameEn": "Bhavanipara",
    "nameGu": "ભવાનીપુરા",
    "subDistrictCode": 3855,
    "districtCode": 443,
    "category": "Rural",
    "status": "Inhabitant",
    "venueGu": "ભવાનીપુરા આંગણવાડી કેન્દ્ર",
    "venueEn": "Bhavanipura Anganwadi",
    "households": 295,
    "population": 1475,
    "femalePopulation": 722,
    "beneficiaries": 130,
    "applications": 162,
    "approved": 119,
    "disbursedLakhs": 23.4,
    "anganwadis": 3,
    "coordinates": {
      "x": 275,
      "y": 40
    }
  },
  {
    "code": "516288",
    "id": "ghogha_516288",
    "nameEn": "Bhikada",
    "nameGu": "ભીખડા",
    "subDistrictCode": 3855,
    "districtCode": 443,
    "category": "Rural",
    "status": "Inhabitant",
    "venueGu": "ભીખડા ગ્રામ વિકાસ મંચ",
    "venueEn": "Bhikada Community Center",
    "households": 318,
    "population": 1590,
    "femalePopulation": 779,
    "beneficiaries": 147,
    "applications": 183,
    "approved": 135,
    "disbursedLakhs": 26.5,
    "anganwadis": 1,
    "coordinates": {
      "x": 320,
      "y": 40
    }
  },
  {
    "code": "516327",
    "id": "ghogha_516327",
    "nameEn": "Chaniyala",
    "nameGu": "ચાણિયાળા",
    "subDistrictCode": 3855,
    "districtCode": 443,
    "category": "Rural",
    "status": "Inhabitant",
    "venueGu": "ચાણિયાળા પ્રાથમિક શાળા",
    "venueEn": "Chaniyala Primary School",
    "households": 341,
    "population": 1705,
    "femalePopulation": 835,
    "beneficiaries": 164,
    "applications": 205,
    "approved": 150,
    "disbursedLakhs": 29.5,
    "anganwadis": 2,
    "coordinates": {
      "x": 365,
      "y": 40
    }
  },
  {
    "code": "516322",
    "id": "ghogha_516322",
    "nameEn": "Chhaya",
    "nameGu": "છાયા",
    "subDistrictCode": 3855,
    "districtCode": 443,
    "category": "Rural",
    "status": "Inhabitant",
    "venueGu": "છાયા ગ્રામ પંચાયત હોલ",
    "venueEn": "Chhaya Panchayat Hall",
    "households": 364,
    "population": 1820,
    "femalePopulation": 891,
    "beneficiaries": 181,
    "applications": 226,
    "approved": 166,
    "disbursedLakhs": 32.6,
    "anganwadis": 3,
    "coordinates": {
      "x": 50,
      "y": 85
    }
  },
  {
    "code": "516332",
    "id": "ghogha_516332",
    "nameEn": "Garibpura",
    "nameGu": "ગરીબપુરા",
    "subDistrictCode": 3855,
    "districtCode": 443,
    "category": "Rural",
    "status": "Inhabitant",
    "venueGu": "ગરીબપુરા સખી મંડળ ભવન",
    "venueEn": "Garibpura Sakhi Mandal Center",
    "households": 387,
    "population": 1935,
    "femalePopulation": 948,
    "beneficiaries": 198,
    "applications": 247,
    "approved": 182,
    "disbursedLakhs": 35.6,
    "anganwadis": 1,
    "coordinates": {
      "x": 95,
      "y": 85
    }
  },
  {
    "code": "516334",
    "id": "ghogha_516334",
    "nameEn": "Ghogha (Ct)",
    "nameGu": "ઘોઘા નગરપાલિકા",
    "subDistrictCode": 3855,
    "districtCode": 443,
    "category": "Rural",
    "status": "Inhabitant",
    "venueGu": "ઘોઘા સામુદાયિક આરોગ્ય કેન્દ્ર (CHC)",
    "venueEn": "Ghogha Community Health Center",
    "households": 410,
    "population": 2050,
    "femalePopulation": 1004,
    "beneficiaries": 215,
    "applications": 268,
    "approved": 197,
    "disbursedLakhs": 38.7,
    "anganwadis": 2,
    "coordinates": {
      "x": 140,
      "y": 85
    }
  },
  {
    "code": "516331",
    "id": "ghogha_516331",
    "nameEn": "Goriyali",
    "nameGu": "ગોરિયાળી",
    "subDistrictCode": 3855,
    "districtCode": 443,
    "category": "Rural",
    "status": "Inhabitant",
    "venueGu": "ગોરિયાળી પ્રાથમિક શાળા",
    "venueEn": "Goriyali Primary School",
    "households": 433,
    "population": 2165,
    "femalePopulation": 1060,
    "beneficiaries": 52,
    "applications": 65,
    "approved": 47,
    "disbursedLakhs": 9.4,
    "anganwadis": 3,
    "coordinates": {
      "x": 185,
      "y": 85
    }
  },
  {
    "code": "516306",
    "id": "ghogha_516306",
    "nameEn": "Hoidad",
    "nameGu": "હોઇદડ",
    "subDistrictCode": 3855,
    "districtCode": 443,
    "category": "Rural",
    "status": "Inhabitant",
    "venueGu": "હોઇદડ ગ્રામ પંચાયત કેન્દ્ર",
    "venueEn": "Hoidad Panchayat Center",
    "households": 456,
    "population": 2280,
    "femalePopulation": 1117,
    "beneficiaries": 69,
    "applications": 86,
    "approved": 63,
    "disbursedLakhs": 12.4,
    "anganwadis": 1,
    "coordinates": {
      "x": 230,
      "y": 85
    }
  },
  {
    "code": "516297",
    "id": "ghogha_516297",
    "nameEn": "Juna Padar",
    "nameGu": "જુના પાદર",
    "subDistrictCode": 3855,
    "districtCode": 443,
    "category": "Rural",
    "status": "Inhabitant",
    "venueGu": "જુના પાદર પ્રાથમિક શાળા",
    "venueEn": "Juna Padar Primary School",
    "households": 479,
    "population": 2395,
    "femalePopulation": 1173,
    "beneficiaries": 86,
    "applications": 107,
    "approved": 79,
    "disbursedLakhs": 15.5,
    "anganwadis": 2,
    "coordinates": {
      "x": 275,
      "y": 85
    }
  },
  {
    "code": "516289",
    "id": "ghogha_516289",
    "nameEn": "Kankot",
    "nameGu": "કણકોટ",
    "subDistrictCode": 3855,
    "districtCode": 443,
    "category": "Rural",
    "status": "Inhabitant",
    "venueGu": "કણકોટ આંગણવાડી કેન્દ્ર",
    "venueEn": "Kankot Anganwadi",
    "households": 502,
    "population": 2510,
    "femalePopulation": 1229,
    "beneficiaries": 103,
    "applications": 128,
    "approved": 94,
    "disbursedLakhs": 18.5,
    "anganwadis": 3,
    "coordinates": {
      "x": 320,
      "y": 85
    }
  },
  {
    "code": "516330",
    "id": "ghogha_516330",
    "nameEn": "Kantala",
    "nameGu": "કંટાળા",
    "subDistrictCode": 3855,
    "districtCode": 443,
    "category": "Rural",
    "status": "Inhabitant",
    "venueGu": "કંટાળા પ્રાથમિક શાળા",
    "venueEn": "Kantala Primary School",
    "households": 525,
    "population": 2625,
    "femalePopulation": 1286,
    "beneficiaries": 120,
    "applications": 150,
    "approved": 110,
    "disbursedLakhs": 21.6,
    "anganwadis": 1,
    "coordinates": {
      "x": 365,
      "y": 85
    }
  },
  {
    "code": "516311",
    "id": "ghogha_516311",
    "nameEn": "Kareda",
    "nameGu": "કરદેજ / કરેડા",
    "subDistrictCode": 3855,
    "districtCode": 443,
    "category": "Rural",
    "status": "Inhabitant",
    "venueGu": "કરેડા હાઈસ્કૂલ",
    "venueEn": "Kareda High School",
    "households": 548,
    "population": 2740,
    "femalePopulation": 1342,
    "beneficiaries": 137,
    "applications": 171,
    "approved": 126,
    "disbursedLakhs": 24.7,
    "anganwadis": 2,
    "coordinates": {
      "x": 50,
      "y": 130
    }
  },
  {
    "code": "516298",
    "id": "ghogha_516298",
    "nameEn": "Khantadi",
    "nameGu": "ખારડી / ખાંટડી",
    "subDistrictCode": 3855,
    "districtCode": 443,
    "category": "Rural",
    "status": "Inhabitant",
    "venueGu": "ખાંટડી ગ્રામ પંચાયત",
    "venueEn": "Khantadi Panchayat",
    "households": 571,
    "population": 2855,
    "femalePopulation": 1398,
    "beneficiaries": 154,
    "applications": 192,
    "approved": 141,
    "disbursedLakhs": 27.7,
    "anganwadis": 3,
    "coordinates": {
      "x": 95,
      "y": 130
    }
  },
  {
    "code": "516300",
    "id": "ghogha_516300",
    "nameEn": "Kharakadi",
    "nameGu": "ખરકડી",
    "subDistrictCode": 3855,
    "districtCode": 443,
    "category": "Rural",
    "status": "Inhabitant",
    "venueGu": "ખરકડી પ્રાથમિક શાળા",
    "venueEn": "Kharakadi Primary School",
    "households": 594,
    "population": 2970,
    "femalePopulation": 1455,
    "beneficiaries": 171,
    "applications": 213,
    "approved": 157,
    "disbursedLakhs": 30.8,
    "anganwadis": 1,
    "coordinates": {
      "x": 140,
      "y": 130
    }
  },
  {
    "code": "516307",
    "id": "ghogha_516307",
    "nameEn": "Kuda",
    "nameGu": "કુડા",
    "subDistrictCode": 3855,
    "districtCode": 443,
    "category": "Rural",
    "status": "Inhabitant",
    "venueGu": "કુડા સરકારી પ્રાથમિક શાળા",
    "venueEn": "Kuda Primary School",
    "households": 617,
    "population": 3085,
    "femalePopulation": 1511,
    "beneficiaries": 188,
    "applications": 235,
    "approved": 172,
    "disbursedLakhs": 33.8,
    "anganwadis": 2,
    "coordinates": {
      "x": 185,
      "y": 130
    }
  },
  {
    "code": "516329",
    "id": "ghogha_516329",
    "nameEn": "Kukad",
    "nameGu": "કુકડ",
    "subDistrictCode": 3855,
    "districtCode": 443,
    "category": "Rural",
    "status": "Inhabitant",
    "venueGu": "કુકડ ગ્રામ વિકાસ કેન્દ્ર",
    "venueEn": "Kukad Village Center",
    "households": 190,
    "population": 950,
    "femalePopulation": 465,
    "beneficiaries": 205,
    "applications": 256,
    "approved": 188,
    "disbursedLakhs": 36.9,
    "anganwadis": 3,
    "coordinates": {
      "x": 230,
      "y": 130
    }
  },
  {
    "code": "516326",
    "id": "ghogha_516326",
    "nameEn": "Lakadiya",
    "nameGu": "લાકડીયા",
    "subDistrictCode": 3855,
    "districtCode": 443,
    "category": "Rural",
    "status": "Inhabitant",
    "venueGu": "લાકડીયા પ્રાથમિક શાળા",
    "venueEn": "Lakadiya Primary School",
    "households": 213,
    "population": 1065,
    "femalePopulation": 521,
    "beneficiaries": 222,
    "applications": 277,
    "approved": 204,
    "disbursedLakhs": 40.0,
    "anganwadis": 1,
    "coordinates": {
      "x": 275,
      "y": 130
    }
  },
  {
    "code": "516290",
    "id": "ghogha_516290",
    "nameEn": "Lakhanka",
    "nameGu": "લાખણકા",
    "subDistrictCode": 3855,
    "districtCode": 443,
    "category": "Rural",
    "status": "Inhabitant",
    "venueGu": "લાખણકા ઉચ્ચતર માધ્યમિક શાળા",
    "venueEn": "Lakhanka Higher Secondary School",
    "households": 236,
    "population": 1180,
    "femalePopulation": 578,
    "beneficiaries": 59,
    "applications": 73,
    "approved": 54,
    "disbursedLakhs": 10.6,
    "anganwadis": 2,
    "coordinates": {
      "x": 320,
      "y": 130
    }
  },
  {
    "code": "516309",
    "id": "ghogha_516309",
    "nameEn": "Malekvadar",
    "nameGu": "માલેકવદર",
    "subDistrictCode": 3855,
    "districtCode": 443,
    "category": "Rural",
    "status": "Inhabitant",
    "venueGu": "માલેકવદર આંગણવાડી",
    "venueEn": "Malekvadar Anganwadi",
    "households": 259,
    "population": 1295,
    "femalePopulation": 634,
    "beneficiaries": 76,
    "applications": 95,
    "approved": 69,
    "disbursedLakhs": 13.7,
    "anganwadis": 3,
    "coordinates": {
      "x": 365,
      "y": 130
    }
  },
  {
    "code": "516293",
    "id": "ghogha_516293",
    "nameEn": "Malpar",
    "nameGu": "માલપર",
    "subDistrictCode": 3855,
    "districtCode": 443,
    "category": "Rural",
    "status": "Inhabitant",
    "venueGu": "માલપર પ્રાથમિક શાળા",
    "venueEn": "Malpar Primary School",
    "households": 282,
    "population": 1410,
    "femalePopulation": 690,
    "beneficiaries": 93,
    "applications": 116,
    "approved": 85,
    "disbursedLakhs": 16.7,
    "anganwadis": 1,
    "coordinates": {
      "x": 50,
      "y": 175
    }
  },
  {
    "code": "516294",
    "id": "ghogha_516294",
    "nameEn": "Mamsa",
    "nameGu": "મામસા",
    "subDistrictCode": 3855,
    "districtCode": 443,
    "category": "Rural",
    "status": "Inhabitant",
    "venueGu": "મામસા ગ્રામ પંચાયત હોલ",
    "venueEn": "Mamsa Panchayat Hall",
    "households": 305,
    "population": 1525,
    "femalePopulation": 747,
    "beneficiaries": 110,
    "applications": 137,
    "approved": 101,
    "disbursedLakhs": 19.8,
    "anganwadis": 2,
    "coordinates": {
      "x": 95,
      "y": 175
    }
  },
  {
    "code": "516317",
    "id": "ghogha_516317",
    "nameEn": "Morchand",
    "nameGu": "મોરચંદ",
    "subDistrictCode": 3855,
    "districtCode": 443,
    "category": "Rural",
    "status": "Inhabitant",
    "venueGu": "મોરચંદ હાઈસ્કૂલ",
    "venueEn": "Morchand High School",
    "households": 328,
    "population": 1640,
    "femalePopulation": 803,
    "beneficiaries": 127,
    "applications": 158,
    "approved": 116,
    "disbursedLakhs": 22.9,
    "anganwadis": 3,
    "coordinates": {
      "x": 140,
      "y": 175
    }
  },
  {
    "code": "516312",
    "id": "ghogha_516312",
    "nameEn": "Mota Khokhara",
    "nameGu": "મોટા ખોખરા",
    "subDistrictCode": 3855,
    "districtCode": 443,
    "category": "Rural",
    "status": "Inhabitant",
    "venueGu": "મોટા ખોખરા પ્રાથમિક આરોગ્ય કેન્દ્ર (PHC)",
    "venueEn": "Mota Khokhara PHC",
    "households": 351,
    "population": 1755,
    "femalePopulation": 859,
    "beneficiaries": 144,
    "applications": 180,
    "approved": 132,
    "disbursedLakhs": 25.9,
    "anganwadis": 1,
    "coordinates": {
      "x": 185,
      "y": 175
    }
  },
  {
    "code": "516301",
    "id": "ghogha_516301",
    "nameEn": "Nana Khokhara",
    "nameGu": "નાના ખોખરા",
    "subDistrictCode": 3855,
    "districtCode": 443,
    "category": "Rural",
    "status": "Inhabitant",
    "venueGu": "નાના ખોખરા આંગણવાડી કેન્દ્ર",
    "venueEn": "Nana Khokhara Anganwadi",
    "households": 374,
    "population": 1870,
    "femalePopulation": 916,
    "beneficiaries": 161,
    "applications": 201,
    "approved": 148,
    "disbursedLakhs": 29.0,
    "anganwadis": 2,
    "coordinates": {
      "x": 230,
      "y": 175
    }
  },
  {
    "code": "516318",
    "id": "ghogha_516318",
    "nameEn": "Nathugadh",
    "nameGu": "નાથુગઢ",
    "subDistrictCode": 3855,
    "districtCode": 443,
    "category": "Rural",
    "status": "Inhabitant",
    "venueGu": "નાથુગઢ પ્રાથમિક શાળા",
    "venueEn": "Nathugadh Primary School",
    "households": 397,
    "population": 1985,
    "femalePopulation": 972,
    "beneficiaries": 178,
    "applications": 222,
    "approved": 163,
    "disbursedLakhs": 32.0,
    "anganwadis": 3,
    "coordinates": {
      "x": 275,
      "y": 175
    }
  },
  {
    "code": "516328",
    "id": "ghogha_516328",
    "nameEn": "Navagam(Nana)",
    "nameGu": "નવાગામ (નાના)",
    "subDistrictCode": 3855,
    "districtCode": 443,
    "category": "Rural",
    "status": "Inhabitant",
    "venueGu": "નવાગામ પ્રાથમિક શાળા",
    "venueEn": "Navagam Primary School",
    "households": 420,
    "population": 2100,
    "femalePopulation": 1029,
    "beneficiaries": 195,
    "applications": 243,
    "approved": 179,
    "disbursedLakhs": 35.1,
    "anganwadis": 1,
    "coordinates": {
      "x": 320,
      "y": 175
    }
  },
  {
    "code": "516295",
    "id": "ghogha_516295",
    "nameEn": "Nesvad",
    "nameGu": "નેસવડ",
    "subDistrictCode": 3855,
    "districtCode": 443,
    "category": "Rural",
    "status": "Inhabitant",
    "venueGu": "નેસવડ ગ્રામ પંચાયત",
    "venueEn": "Nesvad Panchayat",
    "households": 443,
    "population": 2215,
    "femalePopulation": 1085,
    "beneficiaries": 212,
    "applications": 265,
    "approved": 195,
    "disbursedLakhs": 38.2,
    "anganwadis": 2,
    "coordinates": {
      "x": 365,
      "y": 175
    }
  },
  {
    "code": "516324",
    "id": "ghogha_516324",
    "nameEn": "Odarka",
    "nameGu": "Odarka",
    "subDistrictCode": 3855,
    "districtCode": 443,
    "category": "Rural",
    "status": "Inhabitant",
    "venueGu": "Odarka પંચાયત ભવન",
    "venueEn": "Odarka Community Hall",
    "households": 466,
    "population": 2330,
    "femalePopulation": 1141,
    "beneficiaries": 49,
    "applications": 61,
    "approved": 45,
    "disbursedLakhs": 8.8,
    "anganwadis": 3,
    "coordinates": {
      "x": 50,
      "y": 220
    }
  },
  {
    "code": "516310",
    "id": "ghogha_516310",
    "nameEn": "Padva",
    "nameGu": "પડવા",
    "subDistrictCode": 3855,
    "districtCode": 443,
    "category": "Rural",
    "status": "Inhabitant",
    "venueGu": "પડવા સરકારી પ્રાથમિક શાળા",
    "venueEn": "Padva Government School",
    "households": 489,
    "population": 2445,
    "femalePopulation": 1198,
    "beneficiaries": 66,
    "applications": 82,
    "approved": 60,
    "disbursedLakhs": 11.9,
    "anganwadis": 1,
    "coordinates": {
      "x": 95,
      "y": 220
    }
  },
  {
    "code": "516314",
    "id": "ghogha_516314",
    "nameEn": "Paniyala",
    "nameGu": "પાણીયાળા",
    "subDistrictCode": 3855,
    "districtCode": 443,
    "category": "Rural",
    "status": "Inhabitant",
    "venueGu": "પાણીયાળા પંચાયત ઘર",
    "venueEn": "Paniyala Panchayat Ghar",
    "households": 512,
    "population": 2560,
    "femalePopulation": 1254,
    "beneficiaries": 83,
    "applications": 103,
    "approved": 76,
    "disbursedLakhs": 14.9,
    "anganwadis": 2,
    "coordinates": {
      "x": 140,
      "y": 220
    }
  },
  {
    "code": "516313",
    "id": "ghogha_516313",
    "nameEn": "Piparala",
    "nameGu": "Piparala",
    "subDistrictCode": 3855,
    "districtCode": 443,
    "category": "Rural",
    "status": "Inhabitant",
    "venueGu": "Piparala પંચાયત ભવન",
    "venueEn": "Piparala Community Hall",
    "households": 535,
    "population": 2675,
    "femalePopulation": 1310,
    "beneficiaries": 100,
    "applications": 125,
    "approved": 92,
    "disbursedLakhs": 18.0,
    "anganwadis": 3,
    "coordinates": {
      "x": 185,
      "y": 220
    }
  },
  {
    "code": "516308",
    "id": "ghogha_516308",
    "nameEn": "Piram",
    "nameGu": "Piram",
    "subDistrictCode": 3855,
    "districtCode": 443,
    "category": "Rural",
    "status": "Inhabitant",
    "venueGu": "Piram પંચાયત ભવન",
    "venueEn": "Piram Community Hall",
    "households": 558,
    "population": 2790,
    "femalePopulation": 1367,
    "beneficiaries": 117,
    "applications": 146,
    "approved": 107,
    "disbursedLakhs": 21.1,
    "anganwadis": 1,
    "coordinates": {
      "x": 230,
      "y": 220
    }
  },
  {
    "code": "516323",
    "id": "ghogha_516323",
    "nameEn": "Pithalpur",
    "nameGu": "પીઠલપુર",
    "subDistrictCode": 3855,
    "districtCode": 443,
    "category": "Rural",
    "status": "Inhabitant",
    "venueGu": "પીઠલપુર પ્રાથમિક શાળા",
    "venueEn": "Pithalpur Primary School",
    "households": 581,
    "population": 2905,
    "femalePopulation": 1423,
    "beneficiaries": 134,
    "applications": 167,
    "approved": 123,
    "disbursedLakhs": 24.1,
    "anganwadis": 2,
    "coordinates": {
      "x": 275,
      "y": 220
    }
  },
  {
    "code": "516304",
    "id": "ghogha_516304",
    "nameEn": "Rajpara",
    "nameGu": "રાજપરા",
    "subDistrictCode": 3855,
    "districtCode": 443,
    "category": "Rural",
    "status": "Inhabitant",
    "venueGu": "રાજપરા હાઈસ્કૂલ",
    "venueEn": "Rajpara High School",
    "households": 604,
    "population": 3020,
    "femalePopulation": 1479,
    "beneficiaries": 151,
    "applications": 188,
    "approved": 138,
    "disbursedLakhs": 27.2,
    "anganwadis": 3,
    "coordinates": {
      "x": 320,
      "y": 220
    }
  },
  {
    "code": "516299",
    "id": "ghogha_516299",
    "nameEn": "Samadhiyala",
    "nameGu": "સમઢીયાળા",
    "subDistrictCode": 3855,
    "districtCode": 443,
    "category": "Rural",
    "status": "Inhabitant",
    "venueGu": "સમઢીયાળા આંગણવાડી કેન્દ્ર",
    "venueEn": "Samadhiyala Anganwadi",
    "households": 627,
    "population": 3135,
    "femalePopulation": 1536,
    "beneficiaries": 168,
    "applications": 210,
    "approved": 154,
    "disbursedLakhs": 30.2,
    "anganwadis": 1,
    "coordinates": {
      "x": 365,
      "y": 220
    }
  },
  {
    "code": "516316",
    "id": "ghogha_516316",
    "nameEn": "Sanodar",
    "nameGu": "સાણોદર",
    "subDistrictCode": 3855,
    "districtCode": 443,
    "category": "Rural",
    "status": "Inhabitant",
    "venueGu": "સાણોદર લોકભારતી કેન્દ્ર",
    "venueEn": "Sanodar Lokbharati Center",
    "households": 200,
    "population": 1000,
    "femalePopulation": 490,
    "beneficiaries": 185,
    "applications": 231,
    "approved": 170,
    "disbursedLakhs": 33.3,
    "anganwadis": 2,
    "coordinates": {
      "x": 50,
      "y": 265
    }
  },
  {
    "code": "516319",
    "id": "ghogha_516319",
    "nameEn": "Sarvadar",
    "nameGu": "Sarvadar",
    "subDistrictCode": 3855,
    "districtCode": 443,
    "category": "Rural",
    "status": "Inhabitant",
    "venueGu": "Sarvadar પંચાયત ભવન",
    "venueEn": "Sarvadar Community Hall",
    "households": 223,
    "population": 1115,
    "femalePopulation": 546,
    "beneficiaries": 202,
    "applications": 252,
    "approved": 185,
    "disbursedLakhs": 36.4,
    "anganwadis": 3,
    "coordinates": {
      "x": 95,
      "y": 265
    }
  },
  {
    "code": "516292",
    "id": "ghogha_516292",
    "nameEn": "Tagdi",
    "nameGu": "Tagdi",
    "subDistrictCode": 3855,
    "districtCode": 443,
    "category": "Rural",
    "status": "Inhabitant",
    "venueGu": "Tagdi પંચાયત ભવન",
    "venueEn": "Tagdi Community Hall",
    "households": 246,
    "population": 1230,
    "femalePopulation": 602,
    "beneficiaries": 219,
    "applications": 273,
    "approved": 201,
    "disbursedLakhs": 39.4,
    "anganwadis": 1,
    "coordinates": {
      "x": 140,
      "y": 265
    }
  },
  {
    "code": "516325",
    "id": "ghogha_516325",
    "nameEn": "Tanasa",
    "nameGu": "Tanasa",
    "subDistrictCode": 3855,
    "districtCode": 443,
    "category": "Rural",
    "status": "Inhabitant",
    "venueGu": "Tanasa પંચાયત ભવન",
    "venueEn": "Tanasa Community Hall",
    "households": 269,
    "population": 1345,
    "femalePopulation": 659,
    "beneficiaries": 56,
    "applications": 70,
    "approved": 51,
    "disbursedLakhs": 10.1,
    "anganwadis": 2,
    "coordinates": {
      "x": 185,
      "y": 265
    }
  },
  {
    "code": "516302",
    "id": "ghogha_516302",
    "nameEn": "Trambak",
    "nameGu": "ત્રંબક",
    "subDistrictCode": 3855,
    "districtCode": 443,
    "category": "Rural",
    "status": "Inhabitant",
    "venueGu": "ત્રંબક ઉચ્ચ પ્રાથમિક શાળા",
    "venueEn": "Trambak Upper Primary School",
    "households": 292,
    "population": 1460,
    "femalePopulation": 715,
    "beneficiaries": 73,
    "applications": 91,
    "approved": 67,
    "disbursedLakhs": 13.1,
    "anganwadis": 3,
    "coordinates": {
      "x": 230,
      "y": 265
    }
  },
  {
    "code": "516303",
    "id": "ghogha_516303",
    "nameEn": "Ukharala",
    "nameGu": "Ukharala",
    "subDistrictCode": 3855,
    "districtCode": 443,
    "category": "Rural",
    "status": "Inhabitant",
    "venueGu": "Ukharala પંચાયત ભવન",
    "venueEn": "Ukharala Community Hall",
    "households": 315,
    "population": 1575,
    "femalePopulation": 771,
    "beneficiaries": 90,
    "applications": 112,
    "approved": 82,
    "disbursedLakhs": 16.2,
    "anganwadis": 1,
    "coordinates": {
      "x": 275,
      "y": 265
    }
  },
  {
    "code": "516296",
    "id": "ghogha_516296",
    "nameEn": "Valukad",
    "nameGu": "વાલુકડ",
    "subDistrictCode": 3855,
    "districtCode": 443,
    "category": "Rural",
    "status": "Inhabitant",
    "venueGu": "વાલુકડ કન્યા છાત્રાલય",
    "venueEn": "Valukad Girls Hostel",
    "households": 338,
    "population": 1690,
    "femalePopulation": 828,
    "beneficiaries": 107,
    "applications": 133,
    "approved": 98,
    "disbursedLakhs": 19.3,
    "anganwadis": 2,
    "coordinates": {
      "x": 320,
      "y": 265
    }
  },
  {
    "code": "516320",
    "id": "ghogha_516320",
    "nameEn": "Vavdi",
    "nameGu": "વાવડી",
    "subDistrictCode": 3855,
    "districtCode": 443,
    "category": "Rural",
    "status": "Inhabitant",
    "venueGu": "વાવડી પ્રાથમિક શાળા",
    "venueEn": "Vavdi Primary School",
    "households": 361,
    "population": 1805,
    "femalePopulation": 884,
    "beneficiaries": 124,
    "applications": 155,
    "approved": 114,
    "disbursedLakhs": 22.3,
    "anganwadis": 3,
    "coordinates": {
      "x": 365,
      "y": 265
    }
  }
];

// ========================================================
// 4. NOTEBOOK WOMEN WELFARE SCHEMES REGISTRY
// ========================================================
export const NOTEBOOK_WOMEN_SCHEMES: NotebookScheme[] = [
  {
    "id": "SCH-WOMEN-01",
    "nameEn": "Pradhan Mantri Matru Vandana Yojana (PMMVY)",
    "nameGu": "પ્રધાનમંત્રી માતૃ વંદના યોજના",
    "notebookCategory": "Government Scheme for Women",
    "categoryGu": "મહિલા કલ્યાણ યોજના",
    "benefit": "₹5,000 for first child, ₹6,000 for second girl child via DBT",
    "benefitGu": "પ્રથમ બાળક માટે ₹૫,૦૦૦, બીજી દીકરી માટે ₹૬,૦૦૦ સીધા બેંક ખાતામાં",
    "target": "Pregnant women & lactating mothers",
    "targetGu": "સગર્ભા અને ધાત્રી માતાઓ",
    "activeBeneficiaries": 168400,
    "disbursedCr": 138.2
  },
  {
    "id": "SCH-WOMEN-02",
    "nameEn": "Stand-Up India Scheme for Women",
    "nameGu": "સ્ટેન્ડ અપ ઇન્ડિયા સ્કીમ",
    "notebookCategory": "Government Scheme for Women Entrepreneurs",
    "categoryGu": "મહિલા ઉદ્યોગસાહસિકતા યોજના",
    "benefit": "Bank loans between ₹10 Lakh and ₹1 Crore for greenfield enterprise",
    "benefitGu": "નવો ઉદ્યોગ સ્થાપવા ₹૧૦ લાખ થી ₹૧ કરોડ સુધીની બેંક લોન સહાય",
    "target": "Women entrepreneurs launching manufacturing, services, or trading",
    "targetGu": "નવો વ્યવસાય કે સર્વિસ શરૂ કરતી મહિલા સાહસિકો",
    "activeBeneficiaries": 42100,
    "disbursedCr": 412.5
  },
  {
    "id": "SCH-WOMEN-03",
    "nameEn": "Pradhan Mantri MUDRA Yojana (Shishu/Kishore/Tarun)",
    "nameGu": "પ્રધાનમંત્રી મુદ્રા યોજના (મહિલા અગ્રતા)",
    "notebookCategory": "Government Scheme for Women Entrepreneurs",
    "categoryGu": "નાના વેપાર અને ધંધા લોન યોજના",
    "benefit": "Collateral-free micro loans up to ₹10 Lakhs (Shishu ₹50k, Kishore ₹5L, Tarun ₹10L)",
    "benefitGu": "કોઈપણ ગેરંટી વગર ₹૧૦ લાખ સુધીની મુદ્રા લોન (શિશુ, કિશોર, તરુણ)",
    "target": "Women running small shops, tailoring, food, cottage crafts",
    "targetGu": "સિવણકામ, ગૃહઉદ્યોગ, કરિયાણું, બ્યુટી પાર્લર ચલાવતી બહેનો",
    "activeBeneficiaries": 284500,
    "disbursedCr": 890.0
  },
  {
    "id": "SCH-WOMEN-04",
    "nameEn": "Beti Bachao, Beti Padhao (BBBP)",
    "nameGu": "બેટી બચાવો, બેટી પઢાવો",
    "notebookCategory": "Government Scheme for Women",
    "categoryGu": "દીકરી શિક્ષણ અને સંરક્ષણ અભિયાન",
    "benefit": "Gender ratio monitoring, education kits, merit scholarships",
    "benefitGu": "દીકરી જન્મદર પ્રોત્સાહન, શૈક્ષણિક કીટ અને શિષ્યવૃત્તિ",
    "target": "Girl child from birth to secondary school education",
    "targetGu": "જન્મથી ૧૨મા ધોરણ સુધીની દીકરીઓ",
    "activeBeneficiaries": 184500,
    "disbursedCr": 78.4
  },
  {
    "id": "SCH-WOMEN-05",
    "nameEn": "Sukanya Samriddhi Yojana (SSY)",
    "nameGu": "સુકન્યા સમૃદ્ધિ યોજના",
    "notebookCategory": "Government Scheme for Housewife & Mothers",
    "categoryGu": "દીકરી ભવિષ્ય બચત યોજના",
    "benefit": "High interest 8.2% tax-free savings account in Post Office / Bank",
    "benefitGu": "વાર્ષિક ૮.૨% વ્યાજ સાથે ટેક્સ-ફ્રી બચત ખાતું (પોસ્ટ ઓફિસ/બેંક)",
    "target": "Mothers opening savings accounts for girl child below 10 years",
    "targetGu": "૧૦ વર્ષથી નાની દીકરી ધરાવતી માતાઓ",
    "activeBeneficiaries": 312400,
    "disbursedCr": 540.0
  },
  {
    "id": "SCH-WOMEN-06",
    "nameEn": "Mahila Samriddhi Yojana (MSY)",
    "nameGu": "મહિલા સમૃદ્ધિ યોજના",
    "notebookCategory": "Government Scheme for Women Entrepreneurs",
    "categoryGu": "પછાત વર્ગ મહિલા આર્થિક સમૃદ્ધિ",
    "benefit": "Direct micro-finance up to ₹1,40,000 at concessional 4% interest rate",
    "benefitGu": "માત્ર ૪% રાહત દરે ₹૧,૪૦,૦૦૦ સુધીની ધિરાણ સહાય",
    "target": "Backward classes and rural women artisans",
    "targetGu": "ગ્રામીણ કારીગર બહેનો અને સ્વરોજગારી મહિલાઓ",
    "activeBeneficiaries": 96200,
    "disbursedCr": 112.8
  },
  {
    "id": "SCH-WOMEN-07",
    "nameEn": "Mukhyamantri Mahila Utkarsh Yojana (MMUY)",
    "nameGu": "મુખ્યમંત્રી મહિલા ઉત્કર્ષ યોજના",
    "notebookCategory": "Government Scheme for Housewife & Sakhi Mandals",
    "categoryGu": "મહિલા જૂથ શૂન્ય ટકા વ્યાજ ધિરાણ",
    "benefit": "₹1 Lakh zero-percent interest loan to Joint Liability Earning Groups (JLEG)",
    "benefitGu": "૧૦ બહેનોના જૂથને ૦% વ્યાજે ₹૧ લાખની સહાય (સરકાર વ્યાજ ચૂકવે છે)",
    "target": "Urban & rural women groups / housewives / Sakhi Mandals",
    "targetGu": "ગૃહિણીઓ, સખી મંડળો અને મહિલા સ્વ-સહાય જૂથો",
    "activeBeneficiaries": 415000,
    "disbursedCr": 650.0
  }
];

// ========================================================
// 5. LOOKUP HELPERS
// ========================================================
function normalizeHierarchyKey(value: string): string {
  return value.toLocaleLowerCase().normalize("NFKC").replace(/[^\p{L}\p{N}]/gu, "");
}

export function getSubdistrictsForDistrict(districtCodeOrId: number | string): MasterSubdistrict[] {
  if (typeof districtCodeOrId === "number") {
    return MASTER_SUBDISTRICTS.filter((s) => s.districtCode === districtCodeOrId);
  }
  const normalized = normalizeHierarchyKey(districtCodeOrId);
  const d = MASTER_DISTRICTS.find(
    (dist) =>
      normalizeHierarchyKey(dist.id) === normalized ||
      normalizeHierarchyKey(dist.nameEn) === normalized ||
      normalizeHierarchyKey(dist.nameGu) === normalized ||
      normalizeHierarchyKey(dist.officialNo) === normalized
  );
  if (!d) return [];
  return MASTER_SUBDISTRICTS.filter((s) => s.districtCode === d.code);
}

export function getDistrictByCodeOrId(identifier: number | string): MasterDistrict | undefined {
  if (typeof identifier === "number") {
    return MASTER_DISTRICTS.find((d) => d.code === identifier);
  }
  const normalized = normalizeHierarchyKey(identifier);
  return MASTER_DISTRICTS.find(
    (d) =>
      normalizeHierarchyKey(d.id) === normalized ||
      normalizeHierarchyKey(d.nameEn) === normalized ||
      normalizeHierarchyKey(d.nameGu) === normalized ||
      normalizeHierarchyKey(d.officialNo) === normalized
  );
}
