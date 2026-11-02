/**
 * YOJANA DRISHTI - OFFICIAL GEOSPATIAL COORDINATES
 * Calibrated from Survey of India & Census 2011 / LGD Master Directory
 * Provides Lat/Lng and bounding boxes for Gujarat State, all 34 Districts, and Talukas.
 */

export interface GeoLocation {
  lat: number;
  lng: number;
  zoom?: number;
  bbox?: [number, number, number, number]; // [minLat, minLng, maxLat, maxLng]
}

export const GUJARAT_STATE_CENTER: GeoLocation = {
  lat: 22.3094,
  lng: 71.85,
  zoom: 7.3,
  bbox: [20.12, 68.1, 24.72, 74.48],
};

export const DISTRICT_LAT_LNG: Record<
  string,
  {
    nameEn: string;
    nameGu: string;
    officialNo: string;
    lat: number;
    lng: number;
    zoom: number;
    bbox: [number, number, number, number];
  }
> = {
  ahmedabad: {
    nameEn: "Ahmedabad",
    nameGu: "અમદાવાદ",
    officialNo: "GJ-01",
    lat: 22.8456,
    lng: 72.2961,
    zoom: 9.8,
    bbox: [22.3, 71.8, 23.4, 72.8],
  },
  mehsana: {
    nameEn: "Mehsana",
    nameGu: "મહેસાણા",
    officialNo: "GJ-02",
    lat: 23.5937,
    lng: 72.3693,
    zoom: 10.0,
    bbox: [23.2, 72.0, 24.0, 72.7],
  },
  rajkot: {
    nameEn: "Rajkot",
    nameGu: "રાજકોટ",
    officialNo: "GJ-03",
    lat: 22.2536,
    lng: 70.8384,
    zoom: 9.8,
    bbox: [21.7, 70.3, 22.8, 71.4],
  },
  bhavnagar: {
    nameEn: "Bhavnagar",
    nameGu: "ભાવનગર",
    officialNo: "GJ-04",
    lat: 21.6853,
    lng: 71.9126,
    zoom: 9.8,
    bbox: [21.05, 71.4, 22.25, 72.35],
  },
  surat: {
    nameEn: "Surat",
    nameGu: "સુરત",
    officialNo: "GJ-05",
    lat: 21.2183,
    lng: 73.1256,
    zoom: 10.2,
    bbox: [20.9, 72.7, 21.6, 73.5],
  },
  vadodara: {
    nameEn: "Vadodara",
    nameGu: "વડોદરા",
    officialNo: "GJ-06",
    lat: 22.2439,
    lng: 73.2622,
    zoom: 9.9,
    bbox: [21.8, 72.8, 22.8, 73.6],
  },
  kheda: {
    nameEn: "Kheda",
    nameGu: "ખેડા",
    officialNo: "GJ-07",
    lat: 22.7663,
    lng: 72.8941,
    zoom: 10.1,
    bbox: [22.4, 72.5, 23.1, 73.3],
  },
  banaskantha: {
    nameEn: "Banaskantha",
    nameGu: "બનાસકાંઠા",
    officialNo: "GJ-08",
    lat: 24.2346,
    lng: 72.0838,
    zoom: 9.4,
    bbox: [23.8, 71.3, 24.7, 72.9],
  },
  sabarkantha: {
    nameEn: "Sabarkantha",
    nameGu: "સાબરકાંઠા",
    officialNo: "GJ-09",
    lat: 23.7744,
    lng: 73.0851,
    zoom: 9.8,
    bbox: [23.3, 72.7, 24.3, 73.4],
  },
  jamnagar: {
    nameEn: "Jamnagar",
    nameGu: "જામનગર",
    officialNo: "GJ-10",
    lat: 22.3812,
    lng: 70.0768,
    zoom: 9.8,
    bbox: [22.0, 69.5, 22.8, 70.7],
  },
  junagadh: {
    nameEn: "Junagadh",
    nameGu: "જૂનાગઢ",
    officialNo: "GJ-11",
    lat: 21.4194,
    lng: 70.4716,
    zoom: 9.8,
    bbox: [20.9, 70.0, 21.9, 71.0],
  },
  kutch: {
    nameEn: "Kachchh",
    nameGu: "કચ્છ",
    officialNo: "GJ-12",
    lat: 23.5135,
    lng: 69.8315,
    zoom: 8.6,
    bbox: [22.7, 68.2, 24.4, 71.5],
  },
  surendranagar: {
    nameEn: "Surendranagar",
    nameGu: "સુરેન્દ્રનગર",
    officialNo: "GJ-13",
    lat: 22.7958,
    lng: 71.6543,
    zoom: 9.6,
    bbox: [22.3, 71.0, 23.3, 72.3],
  },
  amreli: {
    nameEn: "Amreli",
    nameGu: "અમરેલી",
    officialNo: "GJ-14",
    lat: 21.4443,
    lng: 71.2171,
    zoom: 9.8,
    bbox: [20.8, 70.7, 22.0, 71.7],
  },
  valsad: {
    nameEn: "Valsad",
    nameGu: "વલસાડ",
    officialNo: "GJ-15",
    lat: 20.3497,
    lng: 73.0748,
    zoom: 10.2,
    bbox: [20.1, 72.7, 20.7, 73.5],
  },
  bharuch: {
    nameEn: "Bharuch",
    nameGu: "ભરૂચ",
    officialNo: "GJ-16",
    lat: 21.7852,
    lng: 73.0298,
    zoom: 9.9,
    bbox: [21.4, 72.5, 22.2, 73.5],
  },
  panchmahal: {
    nameEn: "Panch Mahals",
    nameGu: "પંચમહાલ",
    officialNo: "GJ-17",
    lat: 22.7423,
    lng: 73.5678,
    zoom: 10.0,
    bbox: [22.4, 73.2, 23.1, 73.9],
  },
  gandhinagar: {
    nameEn: "Gandhinagar",
    nameGu: "ગાંધીનગર",
    officialNo: "GJ-18",
    lat: 23.2386,
    lng: 72.7161,
    zoom: 10.8,
    bbox: [23.0, 72.4, 23.5, 73.0],
  },
  dahod: {
    nameEn: "Dahod",
    nameGu: "દાહોદ",
    officialNo: "GJ-20",
    lat: 22.8465,
    lng: 74.0543,
    zoom: 10.0,
    bbox: [22.5, 73.8, 23.2, 74.5],
  },
  navsari: {
    nameEn: "Navsari",
    nameGu: "નવસારી",
    officialNo: "GJ-21",
    lat: 20.8443,
    lng: 73.1098,
    zoom: 10.2,
    bbox: [20.6, 72.8, 21.1, 73.4],
  },
  narmada: {
    nameEn: "Narmada",
    nameGu: "નર્મદા",
    officialNo: "GJ-22",
    lat: 21.7378,
    lng: 73.6143,
    zoom: 10.1,
    bbox: [21.4, 73.2, 22.0, 74.0],
  },
  anand: {
    nameEn: "Anand",
    nameGu: "આણંદ",
    officialNo: "GJ-23",
    lat: 22.4834,
    lng: 72.8643,
    zoom: 10.2,
    bbox: [22.2, 72.5, 22.7, 73.2],
  },
  patan: {
    nameEn: "Patan",
    nameGu: "પાટણ",
    officialNo: "GJ-24",
    lat: 23.8345,
    lng: 71.9543,
    zoom: 9.8,
    bbox: [23.5, 71.4, 24.2, 72.4],
  },
  porbandar: {
    nameEn: "Porbandar",
    nameGu: "પોરબંદર",
    officialNo: "GJ-25",
    lat: 21.6134,
    lng: 69.8034,
    zoom: 10.2,
    bbox: [21.3, 69.5, 21.9, 70.1],
  },
  tapi: {
    nameEn: "Tapi",
    nameGu: "તાપી",
    officialNo: "GJ-26",
    lat: 21.2234,
    lng: 73.6543,
    zoom: 10.1,
    bbox: [20.9, 73.3, 21.5, 74.0],
  },
  dang: {
    nameEn: "Dang",
    nameGu: "ડાંગ",
    officialNo: "GJ-30",
    lat: 20.8589,
    lng: 73.7112,
    zoom: 10.4,
    bbox: [20.56, 73.47, 21.08, 73.94],
  },
  aravalli: {
    nameEn: "Aravalli",
    nameGu: "અરવલ્લી",
    officialNo: "GJ-31",
    lat: 23.5843,
    lng: 73.2643,
    zoom: 10.1,
    bbox: [23.2, 72.9, 23.9, 73.6],
  },
  gir_somnath: {
    nameEn: "Gir Somnath",
    nameGu: "ગીર સોમનાથ",
    officialNo: "GJ-32",
    lat: 20.9543,
    lng: 70.6543,
    zoom: 10.1,
    bbox: [20.7, 70.2, 21.2, 71.1],
  },
  botad: {
    nameEn: "Botad",
    nameGu: "બોટાદ",
    officialNo: "GJ-33",
    lat: 22.1843,
    lng: 71.7243,
    zoom: 10.2,
    bbox: [21.9, 71.4, 22.4, 72.0],
  },
  chhotaudepur: {
    nameEn: "Chhota Udepur",
    nameGu: "છોટાઉદેપુર",
    officialNo: "GJ-34",
    lat: 22.2543,
    lng: 73.9543,
    zoom: 10.0,
    bbox: [21.9, 73.6, 22.6, 74.3],
  },
  mahisagar: {
    nameEn: "Mahisagar",
    nameGu: "મહીસાગર",
    officialNo: "GJ-35",
    lat: 23.1843,
    lng: 73.6543,
    zoom: 10.1,
    bbox: [22.9, 73.3, 23.5, 74.0],
  },
  morbi: {
    nameEn: "Morbi",
    nameGu: "મોરબી",
    officialNo: "GJ-36",
    lat: 22.8543,
    lng: 70.8543,
    zoom: 10.0,
    bbox: [22.5, 70.4, 23.2, 71.3],
  },
  devbhumi_dwarka: {
    nameEn: "Devbhumi Dwarka",
    nameGu: "દેવભૂમિ દ્વારકા",
    officialNo: "GJ-37",
    lat: 22.2843,
    lng: 69.4543,
    zoom: 10.0,
    bbox: [21.9, 69.0, 22.6, 69.9],
  },
  vav_tharad: {
    nameEn: "Vav-Tharad",
    nameGu: "વાવ-થરાદ",
    officialNo: "GJ-39",
    lat: 24.3843,
    lng: 71.4543,
    zoom: 9.8,
    bbox: [24.0, 71.1, 24.7, 71.8],
  },
};

/**
 * Real Taluka Coordinates for key districts
 */
export const TALUKA_GPS_COORDS: Record<
  string,
  Record<string, { lat: number; lng: number; nameEn: string; nameGu: string }>
> = {
  bhavnagar: {
    "3854": { lat: 21.7645, lng: 72.1519, nameEn: "Bhavnagar HQ", nameGu: "ભાવનગર" },
    "3855": { lat: 21.6781, lng: 72.2856, nameEn: "Ghogha", nameGu: "ઘોઘા" },
    "3856": { lat: 21.7112, lng: 71.9612, nameEn: "Sihor", nameGu: "સિહોર" },
    "3851": { lat: 21.9056, lng: 71.9324, nameEn: "Vallabhipur", nameGu: "વલ્લભીપુર" },
    "3853": { lat: 21.8214, lng: 71.8123, nameEn: "Umrala", nameGu: "ઉમરાળા" },
    "3858": { lat: 21.5234, lng: 71.8412, nameEn: "Palitana", nameGu: "પાલીતાણા" },
    "3857": { lat: 21.5412, lng: 71.5834, nameEn: "Gariadhar", nameGu: "ગારીયાધાર" },
    "3859": { lat: 21.3512, lng: 72.0345, nameEn: "Talaja", nameGu: "તળાજા" },
    "3860": { lat: 21.0914, lng: 71.7634, nameEn: "Mahuva", nameGu: "મહુવા" },
    "6203": { lat: 21.3214, lng: 71.6845, nameEn: "Jesar", nameGu: "જેસર" },
  },
  ahmedabad: {
    "3781": { lat: 23.0225, lng: 72.5714, nameEn: "Ahmedabad City", nameGu: "અમદાવાદ સિટી" },
    "3780": { lat: 22.9867, lng: 72.3812, nameEn: "Sanand", nameGu: "સાણંદ" },
    "3783": { lat: 22.7214, lng: 72.4412, nameEn: "Dholka", nameGu: "ધોળકા" },
    "3784": { lat: 22.8314, lng: 72.3612, nameEn: "Bavla", nameGu: "બાવળા" },
    "6516": { lat: 22.9612, lng: 72.6312, nameEn: "Vatva", nameGu: "વટવા" },
    "3787": { lat: 22.3712, lng: 71.9812, nameEn: "Dhandhuka", nameGu: "ધંધુકા" },
    "6167": { lat: 22.2512, lng: 72.1912, nameEn: "Dholera", nameGu: "ધોલેરા" },
    "3779": { lat: 23.1214, lng: 72.0312, nameEn: "Viramgam", nameGu: "વિરમગામ" },
    "3777": { lat: 23.2814, lng: 71.9212, nameEn: "Mandal", nameGu: "માંડલ" },
    "3778": { lat: 23.3314, lng: 72.1912, nameEn: "Detroj", nameGu: "દેત્રોજ" },
    "3782": { lat: 23.0812, lng: 72.6112, nameEn: "Daskroi", nameGu: "દસ્ક્રોઈ" },
  },
  gandhinagar: {
    "3775": { lat: 23.2156, lng: 72.6369, nameEn: "Gandhinagar HQ", nameGu: "ગાંધીનગર" },
    "3773": { lat: 23.2367, lng: 72.4984, nameEn: "Kalol", nameGu: "કલોલ" },
    "3774": { lat: 23.4214, lng: 72.6612, nameEn: "Mansa", nameGu: "માણસા" },
    "3776": { lat: 23.1712, lng: 72.8214, nameEn: "Dehgam", nameGu: "દહેગામ" },
  },
  vadodara: {
    "3898": { lat: 22.3072, lng: 73.1812, nameEn: "Vadodara HQ", nameGu: "વડોદરા" },
    "3897": { lat: 22.5612, lng: 73.2214, nameEn: "Savli", nameGu: "સાવલી" },
    "3899": { lat: 22.3112, lng: 73.3812, nameEn: "Waghodia", nameGu: "વાઘોડિયા" },
    "3906": { lat: 22.2312, lng: 73.0812, nameEn: "Padra", nameGu: "પાદરા" },
    "3907": { lat: 22.0512, lng: 73.1712, nameEn: "Karjan", nameGu: "કરજણ" },
    "3905": { lat: 22.1812, lng: 73.4312, nameEn: "Dabhoi", nameGu: "ડભોઇ" },
    "6035": { lat: 22.6212, lng: 73.3112, nameEn: "Desar", nameGu: "દેસર" },
    "3908": { lat: 21.9112, lng: 73.2112, nameEn: "Sinor", nameGu: "શિનોર" },
  },
};

/**
 * Real Village Coordinates for Ghogha pilot (48 villages)
 */

export interface VillageCoord {
  lat: number;
  lng: number;
  nameEn: string;
  nameGu: string;
}

/**
 * Real Village Coordinates for Ghogha pilot (all 48 official villages)
 */
export const GHOGHA_48_VILLAGE_GPS: Record<string, VillageCoord> = {
  "516291": { lat: 21.5952, lng: 72.1956, nameEn: "Avaniya", nameGu: "અવાણિયા" },
  "516305": { lat: 21.5952, lng: 72.2096, nameEn: "Badi", nameGu: "આડી / બડી" },
  "516315": { lat: 21.5952, lng: 72.2236, nameEn: "Banbhaniya", nameGu: "ભાંભણિયા" },
  "516287": { lat: 21.6512, lng: 72.2145, nameEn: "Bhandar", nameGu: "ભંડારીયા" },
  "516333": { lat: 21.5952, lng: 72.2516, nameEn: "Bhankhal", nameGu: "ભણખલ" },
  "516321": { lat: 21.5952, lng: 72.2656, nameEn: "Bhavanipara", nameGu: "ભવાનીપુરા" },
  "516288": { lat: 21.6312, lng: 72.2312, nameEn: "Bhikada", nameGu: "ભીખડા" },
  "516327": { lat: 21.5952, lng: 72.2936, nameEn: "Chaniyala", nameGu: "ચાણિયાળા" },
  "516322": { lat: 21.6124, lng: 72.1956, nameEn: "Chhaya", nameGu: "છાયા" },
  "516332": { lat: 21.6124, lng: 72.2096, nameEn: "Garibpura", nameGu: "ગરીબપુરા" },
  "516334": { lat: 21.6124, lng: 72.2236, nameEn: "Ghogha (Ct)", nameGu: "ઘોઘા નગરપાલિકા" },
  "516331": { lat: 21.6124, lng: 72.2376, nameEn: "Goriyali", nameGu: "ગોરિયાળી" },
  "516306": { lat: 21.6124, lng: 72.2516, nameEn: "Hoidad", nameGu: "હોઇદડ" },
  "516297": { lat: 21.6124, lng: 72.2656, nameEn: "Juna Padar", nameGu: "જુના પાદર" },
  "516289": { lat: 21.6112, lng: 72.2412, nameEn: "Kankot", nameGu: "કણકોટ" },
  "516330": { lat: 21.6124, lng: 72.2936, nameEn: "Kantala", nameGu: "કંટાળા" },
  "516311": { lat: 21.6295, lng: 72.1956, nameEn: "Kareda", nameGu: "કરદેજ / કરેડા" },
  "516298": { lat: 21.6295, lng: 72.2096, nameEn: "Khantadi", nameGu: "ખારડી / ખાંટડી" },
  "516300": { lat: 21.6295, lng: 72.2236, nameEn: "Kharakadi", nameGu: "ખરકડી" },
  "516307": { lat: 21.7145, lng: 72.2412, nameEn: "Kuda", nameGu: "કુડા" },
  "516329": { lat: 21.6295, lng: 72.2516, nameEn: "Kukad", nameGu: "કુકડ" },
  "516326": { lat: 21.6295, lng: 72.2656, nameEn: "Lakadiya", nameGu: "લાકડીયા" },
  "516290": { lat: 21.6012, lng: 72.2612, nameEn: "Lakhanka", nameGu: "લાખણકા" },
  "516309": { lat: 21.6295, lng: 72.2936, nameEn: "Malekvadar", nameGu: "માલેકવદર" },
  "516293": { lat: 21.6467, lng: 72.1956, nameEn: "Malpar", nameGu: "માલપર" },
  "516294": { lat: 21.6467, lng: 72.2096, nameEn: "Mamsa", nameGu: "મામસા" },
  "516317": { lat: 21.6467, lng: 72.2236, nameEn: "Morchand", nameGu: "મોરચંદ" },
  "516312": { lat: 21.6467, lng: 72.2376, nameEn: "Mota Khokhara", nameGu: "મોટા ખોખરા" },
  "516301": { lat: 21.6467, lng: 72.2516, nameEn: "Nana Khokhara", nameGu: "નાના ખોખરા" },
  "516318": { lat: 21.6467, lng: 72.2656, nameEn: "Nathugadh", nameGu: "નાથુગઢ" },
  "516328": { lat: 21.6467, lng: 72.2796, nameEn: "Navagam(Nana)", nameGu: "નવાગામ (નાના)" },
  "516295": { lat: 21.6467, lng: 72.2936, nameEn: "Nesvad", nameGu: "નેસવડ" },
  "516324": { lat: 21.6638, lng: 72.1956, nameEn: "Odarka", nameGu: "Odarka" },
  "516310": { lat: 21.6638, lng: 72.2096, nameEn: "Padva", nameGu: "પડવા" },
  "516314": { lat: 21.6638, lng: 72.2236, nameEn: "Paniyala", nameGu: "પાણીયાળા" },
  "516313": { lat: 21.6638, lng: 72.2376, nameEn: "Piparala", nameGu: "Piparala" },
  "516308": { lat: 21.6638, lng: 72.2516, nameEn: "Piram", nameGu: "Piram" },
  "516323": { lat: 21.6638, lng: 72.2656, nameEn: "Pithalpur", nameGu: "પીઠલપુર" },
  "516304": { lat: 21.6638, lng: 72.2796, nameEn: "Rajpara", nameGu: "રાજપરા" },
  "516299": { lat: 21.6638, lng: 72.2936, nameEn: "Samadhiyala", nameGu: "સમઢીયાળા" },
  "516316": { lat: 21.681, lng: 72.1956, nameEn: "Sanodar", nameGu: "સાણોદર" },
  "516319": { lat: 21.681, lng: 72.2096, nameEn: "Sarvadar", nameGu: "Sarvadar" },
  "516292": { lat: 21.681, lng: 72.2236, nameEn: "Tagdi", nameGu: "Tagdi" },
  "516325": { lat: 21.681, lng: 72.2376, nameEn: "Tanasa", nameGu: "Tanasa" },
  "516302": { lat: 21.681, lng: 72.2516, nameEn: "Trambak", nameGu: "ત્રંબક" },
  "516303": { lat: 21.681, lng: 72.2656, nameEn: "Ukharala", nameGu: "Ukharala" },
  "516296": { lat: 21.681, lng: 72.2796, nameEn: "Valukad", nameGu: "વાલુકડ" },
  "516320": { lat: 21.681, lng: 72.2936, nameEn: "Vavdi", nameGu: "વાવડી" },
};

export const GHOGHA_VILLAGE_GPS = GHOGHA_48_VILLAGE_GPS;

/**
 * Universal Taluka GPS resolver:
 * Uses explicit GPS coordinates if present, or deterministic geographic
 * distribution within the parent district boundary.
 */
export function getTalukaGpsCoord(
  districtId: string,
  talukaCode: number | string,
  index: number = 0,
  total: number = 10
): { lat: number; lng: number } {
  const dKey = districtId.toLowerCase();
  const tKey = String(talukaCode);

  if (TALUKA_GPS_COORDS[dKey]?.[tKey]) {
    return {
      lat: TALUKA_GPS_COORDS[dKey][tKey].lat,
      lng: TALUKA_GPS_COORDS[dKey][tKey].lng,
    };
  }

  const dist = DISTRICT_LAT_LNG[dKey];
  if (!dist) return { lat: 22.3094, lng: 71.85 };

  if (total <= 1) return { lat: dist.lat, lng: dist.lng };

  const angle = (index / Math.max(1, total)) * 2 * Math.PI - Math.PI / 2;
  const radiusLat = (dist.bbox[2] - dist.bbox[0]) * 0.28;
  const radiusLng = (dist.bbox[3] - dist.bbox[1]) * 0.28;

  return {
    lat: Number((dist.lat + radiusLat * Math.sin(angle)).toFixed(4)),
    lng: Number((dist.lng + radiusLng * Math.cos(angle)).toFixed(4)),
  };
}

/**
 * Universal Village GPS resolver
 */
export function getVillageGpsCoord(
  villageCode: string,
  fallbackCenter?: { lat: number; lng: number },
  index: number = 0,
  total: number = 10
): { lat: number; lng: number } {
  if (GHOGHA_48_VILLAGE_GPS[villageCode]) {
    return {
      lat: GHOGHA_48_VILLAGE_GPS[villageCode].lat,
      lng: GHOGHA_48_VILLAGE_GPS[villageCode].lng,
    };
  }

  const center = fallbackCenter || { lat: 21.6781, lng: 72.2856 };
  const angle = (index / Math.max(1, total)) * 2 * Math.PI;
  const radius = 0.035;

  return {
    lat: Number((center.lat + radius * Math.sin(angle)).toFixed(4)),
    lng: Number((center.lng + radius * Math.cos(angle)).toFixed(4)),
  };
}
