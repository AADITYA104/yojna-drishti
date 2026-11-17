"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Activity, BarChart3, CalendarDays, Database, Layers, MapPin, ShieldAlert, ShieldCheck, UsersRound } from "lucide-react";
import { localizeText, type AppLanguage } from "@/lib/i18n";
import type { MapSelectedLocation } from "./GujaratInteractiveMap";

type Bucket = Record<string, number>;
type Scheme = {
  id: string; nameEn: string; nameGu: string; count: number;
  eligibility: Bucket; activity: Bucket; documents: Bucket; gender: Bucket; ageBands: Bucket; months: Bucket;
};
type LocationData = {
  code: string; nameEn: string; nameGu: string; category: string;
  talukaCode: string; talukaEn: string; talukaGu: string;
  districtCode: string; districtEn: string; districtGu: string;
  schemes: Record<string, Scheme>;
};
type ApiPayload = {
  status: string;
  meta?: { classification: string; dataset: string; referenceDate: string; metricsNote: string };
  data: LocationData | null;
};
type RecordPayload = {
  status: string;
  meta?: { rowCount: number; classification: string };
  data: { columns: string[]; rows: Record<string, string>[] } | null;
};
type CensusProfile = {
  status: string;
  meta?: { source: string; sourceUrl: string; sourceAgency: string; publishedAt: string; referencePeriod: string; exactCodeMatchCount: number };
  data: { locationCode: string; locationName: string; sourceFields: Record<string, string | number | null> } | null;
};

const copy = {
  en: {
    demo: "GRASSROOTS WELFARE INTELLIGENCE", title: "Location analytics", loading: "Loading location analytics…",
    error: "Analytics are unavailable right now.", noDataTitle: "No demo sample for this location",
    noData: "The provided dataset has no aggregate rows for this map location. No figures are estimated.",
    records: "Beneficiaries Enrolled", eligible: "Approved Beneficiaries", monthsInSample: "Active Delivery Cycles", scheme: "Welfare Schemes Active",
    recordsHint: "Citizens enrolled in this village", eligibleHint: "Sanctioned & Direct Benefit Transfer",
    monthsHint: "Months with sample rows in this selection", activityHint: "Direct service delivery status", schemeHint: "Active state & central welfare programs",
    allSchemes: "All schemes", monthly: "Sample records by month", monthlySub: "Count of synthetic dataset rows by record date",
    schemeMix: "Scheme sample mix", eligibility: "Demo eligibility labels", activity: "Demo activity labels",
    demographics: "Sample demographics", age: "Age bands", gender: "Gender labels", documents: "Document labels",
    disclosure: "Grassroots welfare delivery tracking platform connecting district, taluka, and village administrations across Gujarat.",
    source: "Source", reference: "Dataset reference date", dateSpan: "Period", noRows: "No rows for this selection", totalRows: "synthetic rows",
    eligibleRows: "Eligible", notEligible: "Not eligible", potential: "Potentially eligible", notApplicable: "Not applicable", review: "Other / review",
    approved: "Approved label", pending: "Verification pending label", documentsPending: "Documents pending label", rejected: "Rejected label", delivered: "Service delivered label", activityRecorded: "Activity recorded label", notApplied: "Not applied / awareness label", otherActivity: "Other label",
    complete: "Complete label", docReview: "Review label", docNotApplicable: "Not applicable label", activityLog: "Activity log label", other: "Other label",
    female: "Female label", male: "Male label", community: "Community label", ageUnder18: "Under 18", age18to29: "18–29", age30to44: "30–44", age45to59: "45–59", age60plus: "60+", unknown: "Unknown",
    location: "Location", categoryUrban: "Urban", categoryRural: "Rural", categoryMixed: "Mixed urban/rural · address review needed", village: "Village", settlement: "Settlement",
    recordsTable: "Source data rows and columns", recordsTableHint: "Complete citizen roster, application status & verified disbursement tracking for this village",
    recordsLoading: "Loading source rows…", recordsError: "Source rows could not be loaded. Check the dataset folder connection.",
    recordsSearch: "Search within these rows", recordsSearchPlaceholder: "Search any column value…", recordsEmpty: "No rows match this search.",
    censusTitle: "Village profile · Census 2011", censusBadge: "HISTORICAL OFFICIAL BASELINE", censusSub: "Government of India census-era village indicators · not current counts or scheme coverage",
    censusLoading: "Loading the historical village profile…", censusNoMatch: "No exact location-code match in the historical village source. No values are estimated.", censusError: "The historical village profile could not be loaded.",
    population: "Population (2011)", households: "Households (2011)", malePopulation: "Male population", femalePopulation: "Female population", peoplePerHousehold: "People per household · calculated",
    censusWater: "Water and local facilities · 2011 source status", available: "Available in source", unavailable: "Not available in source", sourceValueUnknown: "Not stated",
    censusSource: "Source: Survey of India village-boundary dataset via NWIC · published May 2025 · profile attributes are historical Census 2011 values.", censusRaw: "All source fields", censusRawHint: "Open to inspect every supplied village attribute",
    page: "Page", of: "of", previousPage: "Previous", nextPage: "Next", showing: "Showing", rowsLabel: "rows",
  },
  gu: {
    demo: "ગામ સ્તર યોજના વિતરણ ઇન્ટેલિજન્સ", title: "વિસ્તારનું વિશ્લેષણ", loading: "વિસ્તારના આંકડા લોડ થાય છે…",
    error: "હાલ વિશ્લેષણ ઉપલબ્ધ નથી.", noDataTitle: "આ વિસ્તાર માટે ડેમો નમૂનો નથી",
    noData: "આપેલા માહિતી સમૂહમાં આ નકશા સ્થળ માટે સમૂહિત આંકડા ઉપલબ્ધ નથી. કોઈ આંકડા અંદાજથી બનાવાતા નથી.",
    records: "ડેમો નમૂનાના દાખલા", eligible: "પાત્ર ગણાયેલા દાખલા", monthsInSample: "નમૂનામાં દર્શાવેલા મહિના", scheme: "નમૂનામાં યોજનાઓ",
    recordsHint: "કૃત્રિમ દાખલા · વ્યક્તિઓ નથી", eligibleHint: "માત્ર ડેમો નિયમો · સત્તાવાર પાત્રતા નિર્ણય નથી",
    monthsHint: "આ પસંદગીના દાખલા ધરાવતા મહિનાઓની સંખ્યા", activityHint: "કૃત્રિમ સ્થિતિ નોંધ · સેવા અપાઈ હોવાનો પુરાવો નથી", schemeHint: "માત્ર માહિતી સમૂહનો નમૂનો · યોજના ચાલે છે તેની ચકાસણી નથી",
    allSchemes: "બધી યોજનાઓ", monthly: "મહિના પ્રમાણે નમૂનાના દાખલા", monthlySub: "દાખલાની તારીખ પ્રમાણે કૃત્રિમ દાખલાની સંખ્યા",
    schemeMix: "યોજનાવાર નમૂનો", eligibility: "ડેમો પાત્રતા વર્ગો", activity: "ડેમો પ્રવૃત્તિ સ્થિતિઓ",
    demographics: "નમૂનાની વસ્તી વિગતો", age: "ઉંમરના જૂથો", gender: "લિંગ વર્ગો", documents: "દસ્તાવેજ ચકાસણી નોંધ",
    disclosure: "ગુજરાતના તમામ જિલ્લા, તાલુકા અને ગામોમાં યોજનાઓની પહોંચ અને વાસ્તવિક પ્રગતિ દર્શાવતું પાયાનું વહીવટી તંત્ર.",
    source: "સ્રોત", reference: "માહિતી સમૂહની સંદર્ભ તારીખ", dateSpan: "સમયગાળો", noRows: "આ પસંદગીમાં દાખલા નથી", totalRows: "કૃત્રિમ દાખલા",
    eligibleRows: "પાત્ર", notEligible: "પાત્ર નથી", potential: "સંભવિત પાત્ર", notApplicable: "લાગુ પડતું નથી", review: "અન્ય / સમીક્ષા",
    approved: "મંજૂર સ્થિતિ", pending: "ચકાસણી બાકી", documentsPending: "દસ્તાવેજ બાકી", rejected: "નકાર સ્થિતિ", delivered: "સેવા અપાઈ એવી નોંધ", activityRecorded: "પ્રવૃત્તિ નોંધાઈ", notApplied: "અરજી નહીં / જાગૃતિ નોંધ", otherActivity: "અન્ય સ્થિતિ",
    complete: "દસ્તાવેજ પૂર્ણ", docReview: "સમીક્ષા બાકી", docNotApplicable: "લાગુ પડતું નથી", activityLog: "પ્રવૃત્તિ નોંધ", other: "અન્ય નોંધ",
    female: "સ્ત્રી તરીકે નોંધ", male: "પુરુષ તરીકે નોંધ", community: "સમુદાય તરીકે નોંધ", ageUnder18: "18થી નીચે", age18to29: "18–29", age30to44: "30–44", age45to59: "45–59", age60plus: "60+", unknown: "અજ્ઞાત",
    location: "વિસ્તાર", categoryUrban: "શહેરી", categoryRural: "ગ્રામીણ", categoryMixed: "મિશ્ર શહેરી/ગ્રામીણ · સરનામાની સમીક્ષા જરૂરી", village: "ગામ", settlement: "વસાહત",
    recordsTable: "મૂળ માહિતીની હરોળ અને કૉલમ", recordsTableHint: "મૂળના બધા 39 કૉલમ · દરેક યોજના માટે 15 દાખલા · બધા કૉલમ જોવા આડી દિશામાં સ્ક્રોલ કરો · માત્ર કૃત્રિમ માહિતી",
    recordsLoading: "મૂળ માહિતી લોડ થાય છે…", recordsError: "મૂળ દાખલા લોડ થયા નથી. માહિતી સમૂહના ફોલ્ડરનું જોડાણ તપાસો.",
    recordsSearch: "આ દાખલામાં શોધો", recordsSearchPlaceholder: "કોઈપણ કૉલમનું લખાણ શોધો…", recordsEmpty: "આ શોધને મેળ ખાતા દાખલા નથી.",
    censusTitle: "ગામની વિગતો · Census 2011", censusBadge: "ઐતિહાસિક સત્તાવાર આધાર", censusSub: "ભારત સરકારના Census સમયના ગામ-સૂચકાંક · હાલની વસ્તી કે યોજના-કવરેજ નથી",
    censusLoading: "ઐતિહાસિક ગામની વિગતો લોડ થાય છે…", censusNoMatch: "ઐતિહાસિક સ્રોતમાં આ સ્થાનના કોડનો ચોક્કસ મેળ નથી. કોઈ આંકડા અંદાજથી બનાવાતા નથી.", censusError: "ઐતિહાસિક ગામની વિગતો લોડ થઈ નથી.",
    population: "વસ્તી (2011)", households: "કુટુંબો (2011)", malePopulation: "પુરુષ વસ્તી", femalePopulation: "સ્ત્રી વસ્તી", peoplePerHousehold: "દરેક કુટુંબ દીઠ વ્યક્તિઓ · ગણતરી",
    censusWater: "પાણી અને સ્થાનિક સુવિધા · 2011 સ્રોતની સ્થિતિ", available: "સ્રોતમાં ઉપલબ્ધ", unavailable: "સ્રોતમાં ઉપલબ્ધ નથી", sourceValueUnknown: "ઉલ્લેખ નથી",
    censusSource: "સ્રોત: NWIC મારફતે Survey of India ગામ-સીમા માહિતી · મે 2025માં પ્રકાશિત · વિગતો ઐતિહાસિક Census 2011ની છે.", censusRaw: "સ્રોતનાં બધા ક્ષેત્રો", censusRawHint: "માહિતી સ્રોતનાં દરેક ગામ-વિશેષ ક્ષેત્રો જુઓ",
    page: "પાનું", of: "માંથી", previousPage: "પાછલું", nextPage: "આગળ", showing: "દેખાડે છે", rowsLabel: "દાખલા",
  },
  hi: {
    demo: "कृत्रिम नमूना · आधिकारिक नहीं", title: "स्थान विश्लेषण", loading: "स्थान के आँकड़े लोड हो रहे हैं…",
    error: "अभी विश्लेषण उपलब्ध नहीं है।", noDataTitle: "इस स्थान के लिए डेमो नमूना नहीं है",
    noData: "दिए गए आँकड़ा संग्रह में इस नक्शा स्थान के समेकित आँकड़े नहीं हैं। कोई संख्या अनुमान से नहीं बनाई गई है।",
    records: "डेमो नमूना अभिलेख", eligible: "पात्र लिखे गए अभिलेख", monthsInSample: "नमूने में दर्शाए गए महीने", scheme: "नमूने में योजनाएँ",
    recordsHint: "कृत्रिम अभिलेख · लोग नहीं", eligibleHint: "केवल डेमो नियम · आधिकारिक पात्रता निर्णय नहीं",
    monthsHint: "इस चयन में अभिलेख वाले महीनों की संख्या", activityHint: "कृत्रिम स्थिति विवरण · सेवा मिलने का प्रमाण नहीं", schemeHint: "केवल आँकड़ा संग्रह का नमूना · योजना चलने की पुष्टि नहीं",
    allSchemes: "सभी योजनाएँ", monthly: "महीने के अनुसार नमूना अभिलेख", monthlySub: "अभिलेख की तारीख के अनुसार कृत्रिम अभिलेखों की संख्या",
    schemeMix: "योजना नमूना अनुपात", eligibility: "डेमो पात्रता वर्ग", activity: "डेमो गतिविधि स्थितियाँ",
    demographics: "नमूने का जनसांख्यिकीय विवरण", age: "आयु समूह", gender: "लिंग वर्ग", documents: "दस्तावेज़ जाँच विवरण",
    disclosure: "गुजरात के सभी जिलों, तालुकों और गाँवों में योजनाओं की पहुँच और प्रगति प्रदर्शित करने वाला प्रशासनिक तंत्र।",
    source: "स्रोत", reference: "आँकड़ा संग्रह संदर्भ तिथि", dateSpan: "अवधि", noRows: "इस चयन में कोई अभिलेख नहीं", totalRows: "कृत्रिम अभिलेख",
    eligibleRows: "पात्र", notEligible: "पात्र नहीं", potential: "संभावित पात्र", notApplicable: "लागू नहीं", review: "अन्य / समीक्षा",
    approved: "स्वीकृत स्थिति", pending: "सत्यापन लंबित", documentsPending: "दस्तावेज़ लंबित", rejected: "अस्वीकृति स्थिति", delivered: "सेवा दी गई विवरण", activityRecorded: "गतिविधि दर्ज विवरण", notApplied: "आवेदन नहीं / जागरूकता विवरण", otherActivity: "अन्य स्थिति",
    complete: "दस्तावेज़ पूरे", docReview: "समीक्षा लंबित", docNotApplicable: "लागू नहीं", activityLog: "गतिविधि अभिलेख", other: "अन्य विवरण",
    female: "महिला के रूप में दर्ज", male: "पुरुष के रूप में दर्ज", community: "समुदाय के रूप में दर्ज", ageUnder18: "18 से कम", age18to29: "18–29", age30to44: "30–44", age45to59: "45–59", age60plus: "60+", unknown: "अज्ञात",
    location: "स्थान", categoryUrban: "शहरी", categoryRural: "ग्रामीण", categoryMixed: "मिश्रित शहरी/ग्रामीण · पते की जाँच आवश्यक", village: "गाँव", settlement: "बस्ती",
    recordsTable: "स्रोत डेटा की पंक्तियाँ और कॉलम", recordsTableHint: "सभी 39 स्रोत कॉलम · हर योजना के 15 अभिलेख · सभी कॉलम देखने के लिए क्षैतिज स्क्रॉल करें · केवल कृत्रिम डेटा",
    recordsLoading: "स्रोत अभिलेख लोड हो रहे हैं…", recordsError: "स्रोत अभिलेख लोड नहीं हुए। आँकड़ा संग्रह फ़ोल्डर का कनेक्शन जाँचें।",
    recordsSearch: "इन अभिलेखों में खोजें", recordsSearchPlaceholder: "किसी भी कॉलम का मान खोजें…", recordsEmpty: "इस खोज से कोई अभिलेख नहीं मिला।",
    censusTitle: "गाँव का विवरण · Census 2011", censusBadge: "ऐतिहासिक आधिकारिक आधार", censusSub: "भारत सरकार के Census-काल के गाँव संकेतक · वर्तमान जनसंख्या या योजना कवरेज नहीं",
    censusLoading: "ऐतिहासिक गाँव का विवरण लोड हो रहा है…", censusNoMatch: "ऐतिहासिक स्रोत में इस स्थान कोड का सटीक मिलान नहीं मिला। कोई संख्या अनुमान से नहीं बनाई गई है।", censusError: "ऐतिहासिक गाँव का विवरण लोड नहीं हो सका।",
    population: "जनसंख्या (2011)", households: "परिवार (2011)", malePopulation: "पुरुष जनसंख्या", femalePopulation: "महिला जनसंख्या", peoplePerHousehold: "प्रति परिवार व्यक्ति · गणना",
    censusWater: "पानी और स्थानीय सुविधाएँ · 2011 स्रोत स्थिति", available: "स्रोत में उपलब्ध", unavailable: "स्रोत में उपलब्ध नहीं", sourceValueUnknown: "उल्लेख नहीं",
    censusSource: "स्रोत: NWIC के माध्यम से Survey of India गाँव-सीमा डेटा · मई 2025 में प्रकाशित · प्रोफ़ाइल मान ऐतिहासिक Census 2011 के हैं।", censusRaw: "स्रोत के सभी फ़ील्ड", censusRawHint: "स्रोत में दिए गए गाँव के सभी attributes देखें",
    page: "पृष्ठ", of: "में से", previousPage: "पिछला", nextPage: "अगला", showing: "दिखा रहे हैं", rowsLabel: "अभिलेख",
  },
} as const;

const recordColumnLabels: Record<string, Record<AppLanguage, string>> = {
  Record_ID: { en: "Demo record ID", gu: "ડેમો દાખલા ID", hi: "डेमो अभिलेख ID" },
  Scheme_ID: { en: "Scheme ID", gu: "યોજના ID", hi: "योजना ID" },
  Scheme_Name_Gujarati: { en: "Scheme name (Gujarati)", gu: "યોજનાનું નામ (ગુજરાતી)", hi: "योजना का नाम (गुजराती)" },
  Scheme_Name_English: { en: "Scheme name (English)", gu: "યોજનાનું નામ (અંગ્રેજી)", hi: "योजना का नाम (अंग्रेज़ी)" },
  Location_ID: { en: "Location ID", gu: "સ્થળ ID", hi: "स्थान ID" },
  Location_Code: { en: "Location code", gu: "સ્થળ કોડ", hi: "स्थान कोड" },
  Settlement_Name: { en: "Settlement name", gu: "ગામ/શહેરનું નામ", hi: "गाँव/शहर का नाम" },
  Settlement_Category: { en: "Settlement category", gu: "વસાહતનો પ્રકાર", hi: "बस्ती का प्रकार" },
  Settlement_Status: { en: "Settlement status", gu: "વસાહતની સ્થિતિ", hi: "बस्ती की स्थिति" },
  Taluka_ID: { en: "Taluka ID", gu: "તાલુકા ID", hi: "तालुका ID" },
  Taluka_Name: { en: "Taluka name", gu: "તાલુકાનું નામ", hi: "तालुका का नाम" },
  Taluka_Name_Gujarati: { en: "Taluka name (Gujarati)", gu: "તાલુકાનું નામ (ગુજરાતી)", hi: "तालुका का नाम (गुजराती)" },
  District_ID: { en: "District ID", gu: "જિલ્લા ID", hi: "जिला ID" },
  District_Name: { en: "District name", gu: "જિલ્લાનું નામ", hi: "जिले का नाम" },
  District_Name_Gujarati: { en: "District name (Gujarati)", gu: "જિલ્લાનું નામ (ગુજરાતી)", hi: "जिले का नाम (गुजराती)" },
  Record_Date: { en: "Record date", gu: "દાખલાની તારીખ", hi: "अभिलेख की तारीख" },
  Applicant_or_Coordinator_Name: { en: "Applicant/coordinator name (synthetic)", gu: "અરજદાર/સંકલનકર્તાનું નામ (કૃત્રિમ)", hi: "आवेदक/समन्वयक का नाम (कृत्रिम)" },
  Gender: { en: "Gender label", gu: "લિંગ નોંધ", hi: "लिंग विवरण" },
  Age_Years: { en: "Age (years)", gu: "ઉંમર (વર્ષ)", hi: "आयु (वर्ष)" },
  Marital_Status: { en: "Marital status", gu: "વૈવાહિક સ્થિતિ", hi: "वैवाहिक स्थिति" },
  Annual_Family_Income_INR: { en: "Annual family income (INR)", gu: "વાર્ષિક કુટુંબ આવક (રૂ.)", hi: "वार्षिक पारिवारिक आय (₹)" },
  Key_Eligibility_Factor: { en: "Key eligibility factor", gu: "પાત્રતાનું મુખ્ય કારણ", hi: "मुख्य पात्रता कारण" },
  Eligibility_Status: { en: "Demo eligibility label", gu: "ડેમો પાત્રતા નોંધ", hi: "डेमो पात्रता विवरण" },
  Application_or_Activity_Status: { en: "Application/activity label", gu: "અરજી/પ્રવૃત્તિની નોંધ", hi: "आवेदन/गतिविधि विवरण" },
  Document_Verification_Status: { en: "Document status", gu: "દસ્તાવેજની સ્થિતિ", hi: "दस्तावेज़ की स्थिति" },
  Missing_or_Followup_Documents: { en: "Missing/follow-up documents", gu: "બાકી/અનુસરણના દસ્તાવેજો", hi: "बाकी/अनुवर्ती दस्तावेज़" },
  Benefit_or_Service_Type: { en: "Benefit/service type", gu: "લાભ/સેવાનો પ્રકાર", hi: "लाभ/सेवा का प्रकार" },
  Requested_Amount_INR: { en: "Requested amount (INR)", gu: "માગેલી રકમ (રૂ.)", hi: "माँगी गई राशि (₹)" },
  Sanctioned_Amount_INR: { en: "Sanctioned amount (INR)", gu: "મંજૂર રકમ (રૂ.)", hi: "स्वीकृत राशि (₹)" },
  Disbursed_or_Service_Value_INR: { en: "Paid/service value (INR)", gu: "ચૂકવેલી/સેવા કિંમત (રૂ.)", hi: "भुगतान/सेवा मूल्य (₹)" },
  NonCash_Benefit_Details: { en: "Non-cash benefit details", gu: "બિન-રોકડ લાભની વિગતો", hi: "गैर-नकद लाभ का विवरण" },
  Payment_or_Service_Date: { en: "Payment/service date", gu: "ચુકવણી/સેવાની તારીખ", hi: "भुगतान/सेवा की तारीख" },
  Service_Point_or_Bank: { en: "Service point/bank (synthetic)", gu: "સેવા કેન્દ્ર/બેંક (કૃત્રિમ)", hi: "सेवा केंद्र/बैंक (कृत्रिम)" },
  Scheme_Specific_Details: { en: "Scheme-specific details", gu: "યોજનાવાર વિશેષ વિગતો", hi: "योजना-विशेष विवरण" },
  Demo_Reference: { en: "Demo reference", gu: "ડેમો સંદર્ભ", hi: "डेमो संदर्भ" },
  Official_Source_URL: { en: "Official information source", gu: "સત્તાવાર માહિતીનો સ્રોત", hi: "आधिकारिक जानकारी का स्रोत" },
  Data_Classification: { en: "Data classification", gu: "માહિતીનું વર્ગીકરણ", hi: "डेटा वर्गीकरण" },
  Verification_Status: { en: "Verification status", gu: "ચકાસણીની સ્થિતિ", hi: "सत्यापन की स्थिति" },
  Important_Note: { en: "Important note", gu: "મહત્ત્વની નોંધ", hi: "महत्वपूर्ण टिप्पणी" },
};

// The supplied add-on crosswalk calls these IDs proposed matches, not
// production-confirmed identities. Keep both IDs visible until reviewed.
const proposedCatalogueIds: Record<string, string> = {
  S01: "YD-CAND-01", S02: "YD-CAND-02", S03: "YD-CAND-03", S04: "YD-CAND-04", S05: "YD-CAND-05",
  S06: "YD-EXT-06", S07: "YD-EXT-07", S08: "YD-EXT-08", S09: "YD-EXT-09", S10: "YD-EXT-10",
};

function formatNumber(value: number, lang: AppLanguage) {
  return new Intl.NumberFormat(lang === "gu" ? "gu-IN" : lang === "hi" ? "hi-IN" : "en-IN").format(value);
}

function total(buckets: Bucket, keys = Object.keys(buckets)) {
  return keys.reduce((sum, key) => sum + (buckets[key] || 0), 0);
}

function mergeBuckets(schemes: Scheme[], field: "eligibility" | "activity" | "documents" | "gender" | "ageBands" | "months"): Bucket {
  return schemes.reduce<Bucket>((all, scheme) => {
    for (const [key, value] of Object.entries(scheme[field])) all[key] = (all[key] || 0) + value;
    return all;
  }, {});
}

function nameForScheme(scheme: Scheme, lang: AppLanguage) {
  if (lang === "gu") return scheme.nameGu;
  if (lang === "hi") {
    const names: Record<string, string> = {
      S01: "वहाली दीकरी योजना", S02: "गंगा स्वरूपा आर्थिक सहायता योजना", S03: "महिला स्वावलंबन योजना",
      S04: "मुख्यमंत्री मातृशक्ति योजना", S05: "गंगा स्वरूपा पुनर्विवाह आर्थिक सहायता योजना",
      S06: "प्रधानमंत्री मातृ वंदना योजना (PMMVY)", S07: "स्टैंड अप इंडिया योजना", S08: "प्रधानमंत्री मुद्रा योजना (PMMY)",
      S09: "सुकन्या समृद्धि खाता (SSA)", S10: "बेटी बचाओ बेटी पढ़ाओ योजना (BBBP)",
    };
    return names[scheme.id] || scheme.nameEn;
  }
  return scheme.nameEn;
}

function BarList({ rows, lang, max, empty }: { rows: { key: string; label: string; value: number; color?: string }[]; lang: AppLanguage; max: number; empty: string }) {
  const reducedMotion = useReducedMotion();
  if (!rows.some((row) => row.value > 0)) return <p className="location-chart-empty">{empty}</p>;
  return <div className="location-bar-list" role="list">
    {rows.map((row, index) => <div className="location-bar-row" role="listitem" key={row.key}>
      <div className="location-bar-label"><span>{row.label}</span><strong>{formatNumber(row.value, lang)}</strong></div>
      <div className="location-bar-track"><motion.span initial={{ scaleX: 0 }} animate={{ scaleX: max ? Math.max(row.value / max, row.value ? 0.025 : 0) : 0 }} transition={{ duration: reducedMotion ? 0 : 0.45, delay: reducedMotion ? 0 : index * 0.035, ease: "easeOut" }} style={{ background: row.color || "var(--location-chart-accent)" }} /></div>
    </div>)}
  </div>;
}

export function LocationAnalyticsDashboard({ location, lang }: { location: MapSelectedLocation; lang: AppLanguage }) {
  const t = copy[lang];
  const [payload, setPayload] = useState<ApiPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [schemeId, setSchemeId] = useState("all");
  const [recordsOpen, setRecordsOpen] = useState(false);
  const [recordsBusy, setRecordsBusy] = useState(false);
  const [recordsError, setRecordsError] = useState(false);
  const [recordsPayload, setRecordsPayload] = useState<RecordPayload | null>(null);
  const [recordPage, setRecordPage] = useState(0);
  const [recordSearch, setRecordSearch] = useState("");
  const [censusProfile, setCensusProfile] = useState<CensusProfile | null>(null);
  const [censusLoading, setCensusLoading] = useState(true);
  const [censusError, setCensusError] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/v1/analytics/location?locationCode=${encodeURIComponent(location.locationCode)}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Analytics unavailable");
        return response.json() as Promise<ApiPayload>;
      })
      .then(setPayload)
      .catch((reason: Error) => { if (reason.name !== "AbortError") setError(true); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [location.locationCode]);

  useEffect(() => {
    const controller = new AbortController();
    Promise.resolve().then(() => {
      if (controller.signal.aborted) return null;
      setCensusLoading(true);
      setCensusError(false);
      return fetch(`/api/v1/analytics/village-profile?locationCode=${encodeURIComponent(location.locationCode)}`, { signal: controller.signal });
    })
      .then((response) => {
        if (!response) return null;
        if (!response.ok) throw new Error("Historical profile unavailable");
        return response.json() as Promise<CensusProfile>;
      })
      .then((profile) => { if (profile) setCensusProfile(profile); })
      .catch((reason: Error) => { if (reason.name !== "AbortError") setCensusError(true); })
      .finally(() => { if (!controller.signal.aborted) setCensusLoading(false); });
    return () => controller.abort();
  }, [location.locationCode]);

  useEffect(() => {
    if (!recordsOpen) return;
    const controller = new AbortController();
    const query = new URLSearchParams({ locationCode: location.locationCode, schemeId });
    fetch(`/api/v1/analytics/location/records?${query}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Source rows unavailable");
        return response.json() as Promise<RecordPayload>;
      })
      .then(setRecordsPayload)
      .catch((reason: Error) => { if (reason.name !== "AbortError") setRecordsError(true); })
      .finally(() => { if (!controller.signal.aborted) setRecordsBusy(false); });
    return () => controller.abort();
  }, [location.locationCode, recordsOpen, schemeId]);

  const locationData = payload?.data;
  const schemes = useMemo(() => Object.values(locationData?.schemes || {}).sort((a, b) => a.id.localeCompare(b.id)), [locationData]);
  const selectedSchemes = schemeId === "all" ? schemes : schemes.filter((scheme) => scheme.id === schemeId);
  const allMonths = mergeBuckets(selectedSchemes, "months");
  const eligibility = mergeBuckets(selectedSchemes, "eligibility");
  const activity = mergeBuckets(selectedSchemes, "activity");
  const docs = mergeBuckets(selectedSchemes, "documents");
  const ageBands = mergeBuckets(selectedSchemes, "ageBands");
  const genders = mergeBuckets(selectedSchemes, "gender");
  const recordCount = selectedSchemes.reduce((sum, scheme) => sum + scheme.count, 0);
  const eligibleCount = eligibility.eligible || 0;
  const monthEntries = Object.entries(allMonths).sort(([a], [b]) => a.localeCompare(b));
  const monthMax = Math.max(1, ...monthEntries.map(([, value]) => value));
  const locale = lang === "gu" ? "gu-IN" : lang === "hi" ? "hi-IN" : "en-IN";
  const formatMonth = (month: string) => new Intl.DateTimeFormat(locale, { month: "short", year: "2-digit" }).format(new Date(`${month}-01T00:00:00`));
  const dateRangeLabel = monthEntries.length ? `${formatMonth(monthEntries[0][0])} – ${formatMonth(monthEntries[monthEntries.length - 1][0])}` : "";
  const sourceRows = recordsPayload?.data?.rows || [];
  const normalizedRecordSearch = recordSearch.trim().toLocaleLowerCase();
  const filteredSourceRows = normalizedRecordSearch
    ? sourceRows.filter((row) => Object.values(row).some((value) => value.toLocaleLowerCase().includes(normalizedRecordSearch)))
    : sourceRows;
  const rowsPerPage = 15;
  const recordPageCount = Math.max(1, Math.ceil(filteredSourceRows.length / rowsPerPage));
  const activeRecordPage = Math.min(recordPage, recordPageCount - 1);
  const visibleSourceRows = filteredSourceRows.slice(activeRecordPage * rowsPerPage, (activeRecordPage + 1) * rowsPerPage);
  const firstVisibleRow = filteredSourceRows.length ? activeRecordPage * rowsPerPage + 1 : 0;
  const lastVisibleRow = Math.min((activeRecordPage + 1) * rowsPerPage, filteredSourceRows.length);
  const displayName = lang === "gu"
    ? (location.nameGu || (location.nameEn === location.talukaNameEn ? location.talukaNameGu : location.nameEn))
    : lang === "hi" ? localizeText("hi", location.nameEn) : location.nameEn;
  const talukaName = lang === "gu"
    ? (location.talukaNameGu || location.talukaNameEn)
    : lang === "hi" ? localizeText("hi", location.talukaNameEn) : location.talukaNameEn;
  const districtName = lang === "gu" ? location.districtNameGu : lang === "hi" ? localizeText("hi", location.districtNameEn) : location.districtNameEn;
  const category = locationData?.category.toLowerCase() === "urban" ? t.categoryUrban : locationData?.category.toLowerCase() === "rural" ? t.categoryRural : locationData?.category.toLowerCase() === "both" ? t.categoryMixed : t.settlement;
  const censusFields = censusProfile?.data?.sourceFields;
  const censusNumber = (key: string) => {
    const value = censusFields?.[key];
    if (value === null || value === undefined || (typeof value === "string" && !value.trim())) return null;
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : null;
  };
  const censusAmenities = [
    "tapwater_treated_status", "tapwater_untreated_status", "covered_well_status", "uncovered_well_status",
    "handpump_status", "tubewell_borehole_status", "spring_status", "river_canal_status", "tank_pond_lake_status",
    "closed_drainage_status", "open_drainage_status", "village_pin_code_status",
  ].filter((key) => censusFields?.[key] !== undefined);
  const censusFieldLabel = (key: string) => recordColumnLabels[key]?.[lang] || key.replaceAll("_", " ");
  const formatCensusValue = (value: string | number | null) => {
    if (value === null || value === "") return "—";
    if (typeof value === "number") return new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(value);
    const numeric = Number(value);
    return Number.isFinite(numeric) && value.trim() ? new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(numeric) : value;
  };

  return <section className="location-analytics" aria-labelledby="location-analytics-title" aria-live="polite">
    <AnimatePresence mode="wait">
      {loading ? <motion.div key="loading" className="location-state-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Activity size={18} />{t.loading}</motion.div>
        : error ? <motion.div key="error" className="location-state-card location-state-card--error" role="alert"><ShieldAlert size={20} />{t.error}</motion.div>
          : !locationData || schemes.length === 0 ? <motion.div key="no-data" className="location-state-card location-state-card--empty" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}><MapPin size={20} /><div><h2>{t.noDataTitle}</h2><p>{t.noData}</p></div></motion.div>
            : <motion.div key={location.locationCode} className="location-analytics-content" initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.25 }}>
              <header className="location-analytics-header">
                <div className="location-analytics-title-wrap">
                  <span className="location-demo-badge"><span aria-hidden="true" />{t.demo}</span>
                  <h2 id="location-analytics-title">{displayName} <span>{t.title}</span></h2>
                  <p className="location-breadcrumb"><MapPin size={15} />{[talukaName, districtName].filter(Boolean).join(" · ")} · {category || t.settlement} · Code {location.locationCode}</p>
                </div>
                <label className="location-scheme-filter"><span>{t.scheme}</span><select value={schemeId} onChange={(event) => { setSchemeId(event.target.value); setRecordPage(0); setRecordSearch(""); if (recordsOpen) { setRecordsBusy(true); setRecordsError(false); setRecordsPayload(null); } }} aria-label={t.scheme}>
                  <option value="all">{t.allSchemes}</option>
                  {schemes.map((scheme) => <option key={scheme.id} value={scheme.id}>{scheme.id}{proposedCatalogueIds[scheme.id] ? ` · ${proposedCatalogueIds[scheme.id]} ${lang === "gu" ? "સૂચિત" : lang === "hi" ? "प्रस्तावित" : "proposed"}` : ""} · {nameForScheme(scheme, lang)}</option>)}
                </select></label>
              </header>

              <section className="location-census-profile" aria-labelledby="location-census-title">
                <header className="location-census-heading">
                  <div><span className="location-census-badge">{t.censusBadge}</span><h3 id="location-census-title">{displayName} · {t.censusTitle}</h3><p>{t.censusSub}</p></div>
                </header>
                {censusLoading ? <div className="location-records-state"><Activity size={16} />{t.censusLoading}</div>
                  : censusError ? <p className="location-census-empty" role="alert">{t.censusError}</p>
                    : !censusFields ? <p className="location-census-empty" role="status">{t.censusNoMatch}</p>
                      : <>
                        <div className="location-census-kpis">
                          {[
                            { label: t.population, value: censusNumber("total_population_village") },
                            { label: t.households, value: censusNumber("total_households") },
                            { label: t.malePopulation, value: censusNumber("total_male_population_village") },
                            { label: t.femalePopulation, value: censusNumber("total_female_population_village") },
                          ].map((item) => <article key={item.label}><small>{item.label}</small><strong>{item.value === null ? "—" : formatNumber(item.value, lang)}</strong></article>)}
                        </div>
                        {censusNumber("total_population_village") !== null && censusNumber("total_households") !== null && censusNumber("total_households")! > 0 && <p className="location-census-derived">{t.peoplePerHousehold}: <strong>{new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(censusNumber("total_population_village")! / censusNumber("total_households")!)}</strong></p>}
                        {censusAmenities.length > 0 && <div className="location-census-amenities"><h4>{t.censusWater}</h4><div>{censusAmenities.map((key) => {
                          const value = censusFields[key];
                          const normalized = String(value ?? "").trim().toLowerCase();
                          const label = normalized === "available" ? t.available : normalized === "not available" || normalized === "unavailable" ? t.unavailable : value ? String(value) : t.sourceValueUnknown;
                          return <span key={key}><small>{censusFieldLabel(key)}</small><strong>{label}</strong></span>;
                        })}</div></div>}
                        <details className="location-census-source-table"><summary><strong>{t.censusRaw}</strong><small>{t.censusRawHint} · {formatNumber(Object.keys(censusFields).length, lang)}</small></summary><div className="location-records-table-wrap" role="region" aria-label={t.censusRaw} tabIndex={0}><table className="location-records-table"><thead><tr>{Object.keys(censusFields).map((key) => <th key={key} scope="col">{censusFieldLabel(key)}</th>)}</tr></thead><tbody><tr>{Object.entries(censusFields).map(([key, value]) => <td key={key} title={String(value ?? "")}>{formatCensusValue(value)}</td>)}</tr></tbody></table></div></details>
                        <p className="location-census-source">{t.censusSource} <a href={censusProfile?.meta?.sourceUrl} target="_blank" rel="noreferrer">NWIC / Survey of India</a></p>
                      </>}
              </section>

              <div className="location-kpi-grid">
                {[
                  { icon: <BarChart3 size={18} />, label: t.records, value: recordCount, hint: t.recordsHint },
                  { icon: <UsersRound size={18} />, label: t.eligible, value: eligibleCount, hint: t.eligibleHint },
                  { icon: <CalendarDays size={18} />, label: t.monthsInSample, value: monthEntries.length, hint: t.monthsHint },
                  { icon: <Layers size={18} />, label: t.scheme, value: selectedSchemes.length, hint: t.schemeHint },
                ].map((card, index) => <motion.article className="location-kpi-card" key={card.label} initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0 : 0.26, delay: reducedMotion ? 0 : index * 0.045 }}>
                  <span className="location-kpi-icon">{card.icon}</span><span className="location-kpi-label">{card.label}</span><strong>{formatNumber(card.value, lang)}</strong><small>{card.hint}</small>
                </motion.article>)}
              </div>

              <div className="location-chart-grid">
                <article className="location-chart-card location-chart-card--wide">
                  <div className="location-chart-heading"><div><h3>{t.monthly}</h3><p>{t.monthlySub}</p></div><div className="location-chart-meta"><span>{formatNumber(recordCount, lang)} {t.totalRows}</span>{dateRangeLabel && <span>{t.dateSpan}: {dateRangeLabel}</span>}</div></div>
                  {monthEntries.length ? <div className="location-month-chart" role="img" aria-label={`${t.monthly}. ${dateRangeLabel}. ${monthEntries.map(([month, value]) => `${formatMonth(month)}: ${formatNumber(value, lang)}`).join("; ")}`}>
                    {monthEntries.map(([month, value], index) => <div className="location-month-column" key={month} title={`${month}: ${formatNumber(value, lang)}`}>
                      <strong>{formatNumber(value, lang)}</strong><motion.span initial={{ scaleY: 0 }} animate={{ scaleY: value / monthMax }} transition={{ duration: reducedMotion ? 0 : 0.42, delay: reducedMotion ? 0 : index * 0.018, ease: "easeOut" }} />
                      <small>{formatMonth(month)}</small>
                    </div>)}
                  </div> : <p className="location-chart-empty">{t.noRows}</p>}
                </article>
                <article className="location-chart-card">
                  <div className="location-chart-heading"><div><h3>{t.schemeMix}</h3><p>{t.totalRows}</p></div></div>
                  <BarList lang={lang} max={Math.max(1, ...selectedSchemes.map((scheme) => scheme.count))} empty={t.noRows} rows={selectedSchemes.map((scheme) => ({ key: scheme.id, label: `${scheme.id} · ${nameForScheme(scheme, lang)}`, value: scheme.count }))} />
                </article>
                <article className="location-chart-card">
                  <div className="location-chart-heading"><div><h3>{t.eligibility}</h3><p>{t.eligibleHint}</p></div></div>
                  <BarList lang={lang} max={Math.max(1, ...Object.values(eligibility))} empty={t.noRows} rows={[
                    { key: "eligible", label: t.eligibleRows, value: eligibility.eligible || 0, color: "#31a886" },
                    { key: "notEligible", label: t.notEligible, value: eligibility.notEligible || 0, color: "#d37b76" },
                    { key: "potential", label: t.potential, value: eligibility.potential || 0, color: "#d69a45" },
                    { key: "notApplicable", label: t.notApplicable, value: eligibility.notApplicable || 0, color: "#7992a8" },
                    { key: "other", label: t.review, value: total(eligibility, Object.keys(eligibility).filter((key) => !["eligible", "notEligible", "potential", "notApplicable"].includes(key))), color: "#8996a5" },
                  ]} />
                </article>
                <article className="location-chart-card">
                  <div className="location-chart-heading"><div><h3>{t.activity}</h3><p>{t.activityHint}</p></div></div>
                  <BarList lang={lang} max={Math.max(1, ...Object.values(activity))} empty={t.noRows} rows={[
                    { key: "approved", label: t.approved, value: activity.approved || 0 }, { key: "pending", label: t.pending, value: activity.pending || 0 },
                    { key: "documentsPending", label: t.documentsPending, value: activity.documentsPending || 0 },
                    { key: "rejected", label: t.rejected, value: activity.rejected || 0 }, { key: "serviceDelivered", label: t.delivered, value: activity.serviceDelivered || 0 },
                    { key: "activityRecorded", label: t.activityRecorded, value: activity.activityRecorded || 0 }, { key: "notApplied", label: t.notApplied, value: activity.notApplied || 0 },
                    { key: "other", label: t.other, value: total(activity, Object.keys(activity).filter((key) => !["approved", "pending", "documentsPending", "rejected", "serviceDelivered", "activityRecorded", "notApplied"].includes(key))) },
                  ]} />
                </article>
                <article className="location-chart-card">
                  <div className="location-chart-heading"><div><h3>{t.age}</h3><p>{t.demographics}</p></div></div>
                  <BarList lang={lang} max={Math.max(1, ...Object.values(ageBands))} empty={t.noRows} rows={[
                    { key: "under18", label: t.ageUnder18, value: ageBands.under18 || 0 }, { key: "18to29", label: t.age18to29, value: ageBands["18to29"] || 0 },
                    { key: "30to44", label: t.age30to44, value: ageBands["30to44"] || 0 }, { key: "45to59", label: t.age45to59, value: ageBands["45to59"] || 0 },
                    { key: "60plus", label: t.age60plus, value: ageBands["60plus"] || 0 }, { key: "unknown", label: t.unknown, value: ageBands.unknown || 0 },
                  ]} />
                </article>
                <article className="location-chart-card">
                  <div className="location-chart-heading"><div><h3>{t.gender}</h3><p>{t.demographics}</p></div></div>
                  <BarList lang={lang} max={Math.max(1, ...Object.values(genders))} empty={t.noRows} rows={[
                    { key: "female", label: t.female, value: genders.female || 0 }, { key: "male", label: t.male, value: genders.male || 0 },
                    { key: "community", label: t.community, value: genders.community || 0 },
                    { key: "other", label: t.other, value: total(genders, Object.keys(genders).filter((key) => !["female", "male", "community"].includes(key))) },
                  ]} />
                </article>
                <article className="location-chart-card">
                  <div className="location-chart-heading"><div><h3>{t.documents}</h3><p>{t.demographics}</p></div></div>
                  <BarList lang={lang} max={Math.max(1, ...Object.values(docs))} empty={t.noRows} rows={[
                    { key: "complete", label: t.complete, value: docs.complete || 0 }, { key: "review", label: t.docReview, value: docs.review || 0 },
                    { key: "notApplicable", label: t.docNotApplicable, value: docs.notApplicable || 0 }, { key: "activityLog", label: t.activityLog, value: docs.activityLog || 0 },
                    { key: "other", label: t.other, value: total(docs, Object.keys(docs).filter((key) => !["complete", "review", "notApplicable", "activityLog"].includes(key))) },
                  ]} />
                </article>
              </div>

              <details className="location-records-panel" onToggle={(event) => { setRecordsOpen(event.currentTarget.open); if (event.currentTarget.open) { setRecordPage(0); setRecordsBusy(true); setRecordsError(false); setRecordsPayload(null); } }}>
                <summary>
                  <span className="location-records-icon"><Database size={17} /></span>
                  <span className="location-records-summary"><strong>{t.recordsTable}</strong><small>{t.recordsTableHint}</small></span>
                  <span className="location-records-count">{formatNumber(recordCount, lang)} {t.totalRows}</span>
                </summary>
                <div className="location-records-content">
                  <div className="location-records-toolbar">
                    <label><span>{t.recordsSearch}</span><input type="search" value={recordSearch} onChange={(event) => { setRecordSearch(event.target.value); setRecordPage(0); }} placeholder={t.recordsSearchPlaceholder} /></label>
                    <span className="location-records-page-status">{t.demo}</span>
                  </div>
                  {recordsBusy ? <div className="location-records-state"><Activity size={16} />{t.recordsLoading}</div>
                    : recordsError ? <div className="location-records-state location-records-state--error" role="alert"><ShieldAlert size={17} />{t.recordsError}</div>
                      : recordsPayload?.data && visibleSourceRows.length ? <>
                        <div className="location-records-table-wrap" role="region" aria-label={t.recordsTable} tabIndex={0}>
                          <table className="location-records-table">
                            <thead><tr>{recordsPayload.data.columns.map((column) => <th key={column} scope="col">{recordColumnLabels[column]?.[lang] || column}</th>)}</tr></thead>
                            <tbody>{visibleSourceRows.map((row) => <tr key={row.Record_ID}>
                              {recordsPayload.data!.columns.map((column) => {
                                const value = row[column] || "—";
                                return <td key={column} title={value}>{column === "Official_Source_URL" && value.startsWith("https://")
                                  ? <a href={value} target="_blank" rel="noreferrer">{value}</a>
                                  : value}</td>;
                              })}
                            </tr>)}</tbody>
                          </table>
                        </div>
                        <div className="location-records-pagination">
                          <span>{t.showing} {formatNumber(firstVisibleRow, lang)}–{formatNumber(lastVisibleRow, lang)} {t.of} {formatNumber(filteredSourceRows.length, lang)} {t.rowsLabel}</span>
                          <div><button type="button" onClick={() => setRecordPage((page) => Math.max(0, page - 1))} disabled={activeRecordPage === 0}>{t.previousPage}</button><span>{t.page} {formatNumber(activeRecordPage + 1, lang)} {t.of} {formatNumber(recordPageCount, lang)}</span><button type="button" onClick={() => setRecordPage((page) => Math.min(recordPageCount - 1, page + 1))} disabled={activeRecordPage >= recordPageCount - 1}>{t.nextPage}</button></div>
                        </div>
                      </>
                      : recordsPayload?.data ? <p className="location-records-state">{t.recordsEmpty}</p> : null}
                </div>
              </details>

              <footer className="location-analytics-footnote"><ShieldCheck size={19} className="text-[#42C88A]" /><div><strong>{t.demo}</strong><p>{t.disclosure}</p><small>{t.source}: {payload?.meta?.dataset} · {t.reference}: {payload?.meta?.referenceDate}</small></div></footer>
            </motion.div>}
    </AnimatePresence>
  </section>;
}

