import { getVillageSchemes, ALL_AVAILABLE_SCHEMES, type VillageSchemeAssignment } from "./village-scheme-demo";

export interface VillageBeneficiaryRecord {
  id: string;
  nameGu: string;
  nameEn: string;
  age: number;
  genderGu: string;
  categoryGu: string;
  categoryEn: string;
  schemeId: string;
  schemeNameGu: string;
  schemeNameEn: string;
  benefitAmountGu: string;
  status: "approved" | "in_progress" | "pending_docs";
  statusGu: string;
  statusEn: string;
  dbtAccount: string;
  utrNumber: string;
  applicationDate: string;
  disbursedDate: string;
  anganwadiCenterGu: string;
  remarksGu: string;
  remarksEn: string;
}

const FIRST_NAMES = [
  { gu: "ગીતાબેન", en: "Gitaben" },
  { gu: "શારદાબેન", en: "Shardaben" },
  { gu: "હંસાબેન", en: "Hansaben" },
  { gu: "મીનાબેન", en: "Minaben" },
  { gu: "કંચનબેન", en: "Kanchanben" },
  { gu: "અલ્પાબેન", en: "Alpaben" },
  { gu: "સંગીતાબેન", en: "Sangeetaben" },
  { gu: "ભાવનાબેન", en: "Bhavnaben" },
  { gu: "રેખાબેન", en: "Rekhaben" },
  { gu: "દક્ષાબેન", en: "Dakshaben" },
  { gu: "જશોદાબેન", en: "Jashodaben" },
  { gu: "કૈલાશબેન", en: "Kailashben" },
  { gu: "આશાબેન", en: "Ashaben" },
  { gu: "રંજનબેન", en: "Ranjanben" },
  { gu: "પૂજાબેન", en: "Pujaben" },
  { gu: "કોકિલાબેન", en: "Kokilaben" },
  { gu: "લલિતાબેન", en: "Lalitaben" },
  { gu: "મંજુલાબેન", en: "Manjulaben" },
  { gu: "ચેતનાબેન", en: "Chetnaben" },
  { gu: "જ્યોત્સનાબેન", en: "Jyotsnaben" },
];

const MIDDLE_NAMES = [
  { gu: "રમેશભાઈ", en: "Rameshbhai" },
  { gu: "બાબુભાઈ", en: "Babubhai" },
  { gu: "વિનુભાઈ", en: "Vinubhai" },
  { gu: "ભરતભાઈ", en: "Bharatbhai" },
  { gu: "ધીરુભાઈ", en: "Dhirubhai" },
  { gu: "પ્રવીણભાઈ", en: "Pravinbhai" },
  { gu: "દીપકભાઈ", en: "Deepakbhai" },
  { gu: "કાનજીભાઈ", en: "Kanjibhai" },
  { gu: "જયંતિભાઈ", en: "Jayantibhai" },
  { gu: "હરેશભાઈ", en: "Hareshbhai" },
  { gu: "નરેશભાઈ", en: "Nareshbhai" },
  { gu: "મગનભાઈ", en: "Maganbhai" },
];

const LAST_NAMES = [
  { gu: "મકવાણા", en: "Makwana" },
  { gu: "સોલંકી", en: "Solanki" },
  { gu: "પટેલ", en: "Patel" },
  { gu: "રાઠોડ", en: "Rathod" },
  { gu: "ચૌહાણ", en: "Chauhan" },
  { gu: "પરમાર", en: "Parmar" },
  { gu: "વાઘેલા", en: "Vaghela" },
  { gu: "જોશી", en: "Joshi" },
  { gu: "ગોહિલ", en: "Gohil" },
  { gu: "બારૈયા", en: "Baraiya" },
  { gu: "ડાભી", en: "Dabhi" },
  { gu: "જાદવ", en: "Jadav" },
  { gu: "ત્રિવેદી", en: "Trivedi" },
  { gu: "ચાવડા", en: "Chavda" },
];

const BANKS = [
  "SBI (સ્ટેટ બેંક)",
  "BoB (બેંક ઓફ બરોડા)",
  "IPPB (પોસ્ટ પેમેન્ટ્સ બેંક)",
  "Saurashtra Gramin Bank",
  "HDFC Bank",
  "Axis Bank",
];

function pseudoRandom(seed: number): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function stringToSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) || 12345;
}

/**
 * Returns complete, granular beneficiary register for any village in Gujarat
 */
export function getVillageBeneficiaryRegister(villageCode: string): VillageBeneficiaryRecord[] {
  const code = villageCode || "516307";
  const seed = stringToSeed(code);
  const rand = pseudoRandom(seed);

  const activeSchemes = getVillageSchemes(code);
  const recordCount = Math.min(28, Math.max(12, Math.floor(rand() * 16) + 14));
  const results: VillageBeneficiaryRecord[] = [];

  for (let i = 0; i < recordCount; i++) {
    const fn = FIRST_NAMES[Math.floor(rand() * FIRST_NAMES.length)];
    const mn = MIDDLE_NAMES[Math.floor(rand() * MIDDLE_NAMES.length)];
    const ln = LAST_NAMES[Math.floor(rand() * LAST_NAMES.length)];
    const age = Math.floor(rand() * 38) + 20;

    const schemeAssignment = activeSchemes[i % activeSchemes.length] || activeSchemes[0];
    const bank = BANKS[Math.floor(rand() * BANKS.length)];
    const acNum = Math.floor(rand() * 8999) + 1000;

    // Status ratio: ~70% approved, 20% in_progress, 10% pending_docs
    const roll = rand();
    let status: "approved" | "in_progress" | "pending_docs" = "approved";
    let statusGu = "મંજૂર & DBT જમા";
    let statusEn = "Approved & Disbursed";
    let remarksGu = "પ્રથમ અને દ્વિતીય હપ્તો ખાતામાં જમા થયેલ છે.";
    let remarksEn = "Installment successfully transferred to bank.";

    if (roll > 0.85) {
      status = "pending_docs";
      statusGu = "આવક દાખલો નવીનીકરણ બાકી";
      statusEn = "Income Certificate Pending";
      remarksGu = "તલાટી કચેરીમાંથી નવો આવક દાખલો રજૂ કરવાનો બાકી છે.";
      remarksEn = "Pending renewal of income certificate from Talati.";
    } else if (roll > 0.65) {
      status = "in_progress";
      statusGu = "કચેરી ચકાસણી હેઠળ";
      statusEn = "Verification In Progress";
      remarksGu = "CDPO કચેરીમાં દસ્તાવેજ ચકાસણી પ્રક્રિયા ચાલુ છે.";
      remarksEn = "Physical documents under review at CDPO office.";
    }

    const day = (i % 27) + 1;
    const month = (i % 11) + 1;
    const appDate = `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/2026`;
    const disbDate = status === "approved" ? `${String(Math.min(28, day + 5)).padStart(2, "0")}/${String(month).padStart(2, "0")}/2026` : "-";

    let benefitGu = "₹૧,૨૫૦ / માસિક પેન્શન";
    if (schemeAssignment.schemeId.includes("VDY") || schemeAssignment.schemeId.includes("BBBP")) {
      benefitGu = "₹૧,૧૦,૦૦૦ (૩ તબક્કામાં સહાય)";
    } else if (schemeAssignment.schemeId.includes("MMY") || schemeAssignment.schemeId.includes("PMMVY")) {
      benefitGu = "₹૫,૦૦૦ DBT + માસિક પોષણ કીટ";
    } else if (schemeAssignment.schemeId.includes("MUDRA") || schemeAssignment.schemeId.includes("WOMEN-02")) {
      benefitGu = "₹૫૦,૦૦૦ લોન સહાય (સબસિડી સાથે)";
    }

    results.push({
      id: `GJ-WCD-${code.slice(-4)}-${String(i + 1).padStart(3, "0")}`,
      nameGu: `${fn.gu} ${mn.gu} ${ln.gu}`,
      nameEn: `${fn.en} ${mn.en} ${ln.en}`,
      age,
      genderGu: "સ્ત્રી",
      categoryGu: age > 45 ? "વિધવા સહાય / ગંગા સ્વરૂપા" : age > 30 ? "મહિલા સાહસિક / ગૃહિણી" : "સગર્ભા માતા / દીકરી",
      categoryEn: age > 45 ? "Widow Assistance" : age > 30 ? "Women Entrepreneur" : "Maternal / Girl Child",
      schemeId: schemeAssignment.schemeId,
      schemeNameGu: schemeAssignment.schemeNameGu,
      schemeNameEn: schemeAssignment.schemeNameEn,
      benefitAmountGu: benefitGu,
      status,
      statusGu,
      statusEn,
      dbtAccount: `${bank} · ****${acNum}`,
      utrNumber: status === "approved" ? `DBT2026GJ${code.slice(-3)}${String(i + 101)}` : "પ્રક્રિયા હેઠળ",
      applicationDate: appDate,
      disbursedDate: disbDate,
      anganwadiCenterGu: `આંગણવાડી કેન્દ્ર નં. ${(i % 3) + 1}`,
      remarksGu,
      remarksEn,
    });
  }

  return results;
}
