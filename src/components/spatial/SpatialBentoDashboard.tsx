"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, BookOpenCheck, Building2, Map as MapIcon, Percent, Rows3 } from "lucide-react";
import { localizeText, type AppLanguage } from "@/lib/i18n";
import { AnimatedNumber } from "@/components/motion/AnimatedNumber";
import { KpiCard } from "@/components/ui/KpiCard";
import { ErrorState } from "@/components/ui/ErrorState";
import { CardSkeleton, Skeleton } from "@/components/ui/Skeleton";
import { DataBadge } from "@/components/ui/DataBadge";

interface SpatialBentoDashboardProps {
  gu: boolean;
  lang: AppLanguage;
  fy?: string;
  /** Number of talukas in the master hierarchy (real boundary data, not demo). */
  talukaCount: number;
  onNavigate: (view: "map" | "schemes" | "wizard" | "saved" | "settings") => void;
  onSelectScheme?: (name: string) => void;
}

type Activity = Partial<Record<StatusKey, number>>;
type StatusKey = "approved" | "serviceDelivered" | "activityRecorded" | "pending" | "documentsPending" | "rejected" | "notApplied";

type Overview = {
  status: string;
  meta: { referenceDate: string; locationCount: number; districtCount: number; schemeCount: number; sourceRows: number };
  data: {
    schemes: Array<{ id: string; nameEn: string; nameGu: string; count: number; activity: Activity }>;
    districts: Array<{ districtCode: string; nameEn: string; nameGu: string; locationCount: number; sampleRows: number }>;
  };
};

const STATUS: Array<{ key: StatusKey; color: string }> = [
  { key: "approved", color: "var(--dx-teal)" },
  { key: "serviceDelivered", color: "#7b61a8" },
  { key: "activityRecorded", color: "#5b6b7f" },
  { key: "pending", color: "var(--dx-saffron-fill)" },
  { key: "documentsPending", color: "var(--dx-blue)" },
  { key: "rejected", color: "var(--dx-red)" },
  { key: "notApplied", color: "var(--dx-grey)" },
];

const copy = {
  gu: {
    badge: "નમૂનો · DEMO",
    tag: "નમૂના ડેટા · જાહેર પૂર્વદર્શન",
    title: "ગુજરાતની મહિલા યોજનાઓ ક્યાં સુધી પહોંચી?",
    lead: "રાજ્યથી જિલ્લો, તાલુકો અને ગામ સુધી — દરેક યોજનાની સ્થિતિ એક જ જગ્યાએ જુઓ.",
    openMap: "નકશો ખોલો",
    openSchemes: "યોજનાઓ જુઓ",
    ladderTitle: "ગુજરાતનું વહીવટી માળખું",
    steps: ["ગુજરાત રાજ્ય", "જિલ્લા", "તાલુકા", "ગામ અને શહેર"],
    kpiRows: "નમૂના પંક્તિઓ",
    kpiRowsSub: "ડેમો રેકોર્ડ; લાભાર્થીની સંખ્યા નથી",
    kpiSchemes: "યોજનાઓ",
    kpiSchemesSub: "નમૂના ડેટાસેટમાં સમાવેલ",
    kpiApproved: "મંજૂર પંક્તિઓનો હિસ્સો",
    kpiApprovedSub: "મંજૂરીની સ્થિતિ નોંધતી {n} યોજનાઓમાં",
    schemeTitle: "યોજનાવાર સ્થિતિ",
    schemeNote: "દરેક પટ્ટી એક યોજનાની નમૂના પંક્તિઓની સ્થિતિ બતાવે છે.",
    districtTitle: "જિલ્લાવાર નમૂના પંક્તિઓ",
    districtNote: "સૌથી વધુ પંક્તિઓવાળા ૮ જિલ્લા.",
    rows: "પંક્તિઓ",
    places: "સ્થળો",
    status: { approved: "મંજૂર", serviceDelivered: "સેવા અપાઈ", activityRecorded: "પ્રવૃત્તિ નોંધાઈ", pending: "પ્રક્રિયામાં", documentsPending: "દસ્તાવેજ બાકી", rejected: "નામંજૂર", notApplied: "અરજી નથી" },
    source: "સ્રોત: જાહેર પૂર્વદર્શન નમૂના ડેટા. બધા આંકડા કૃત્રિમ છે.",
    ref: "સંદર્ભ તારીખ",
    allDistricts: "નકશામાં બધા જિલ્લા જુઓ",
    errorTitle: "વિશ્લેષણ હાલમાં ઉપલબ્ધ નથી",
    errorMsg: "ડેશબોર્ડનો ડેટા લોડ થઈ શક્યો નથી. ઇન્ટરનેટ તપાસી ફરી પ્રયાસ કરો.",
    retry: "ફરી પ્રયાસ કરો",
    loading: "ડેશબોર્ડ લોડ થાય છે",
  },
  hi: {
    badge: "नमूना · DEMO",
    tag: "नमूना डेटा · सार्वजनिक पूर्वावलोकन",
    title: "गुजरात की महिला योजनाएँ कहाँ तक पहुँचीं?",
    lead: "राज्य से जिला, तालुका और गाँव तक — हर योजना की स्थिति एक ही जगह देखें।",
    openMap: "नक्शा खोलें",
    openSchemes: "योजनाएँ देखें",
    ladderTitle: "गुजरात की प्रशासनिक संरचना",
    steps: ["गुजरात राज्य", "जिले", "तालुका", "गाँव और शहर"],
    kpiRows: "नमूना पंक्तियाँ",
    kpiRowsSub: "डेमो रिकॉर्ड; लाभार्थियों की संख्या नहीं",
    kpiSchemes: "योजनाएँ",
    kpiSchemesSub: "नमूना डेटासेट में शामिल",
    kpiApproved: "स्वीकृत पंक्तियों का हिस्सा",
    kpiApprovedSub: "स्वीकृति दर्ज करने वाली {n} योजनाओं में",
    schemeTitle: "योजनावार स्थिति",
    schemeNote: "हर पट्टी एक योजना की नमूना पंक्तियों की स्थिति दिखाती है।",
    districtTitle: "जिलेवार नमूना पंक्तियाँ",
    districtNote: "सबसे अधिक पंक्तियों वाले ८ जिले।",
    rows: "पंक्तियाँ",
    places: "स्थान",
    status: { approved: "स्वीकृत", serviceDelivered: "सेवा दी गई", activityRecorded: "गतिविधि दर्ज", pending: "प्रक्रिया में", documentsPending: "दस्तावेज़ बाकी", rejected: "अस्वीकृत", notApplied: "आवेदन नहीं" },
    source: "स्रोत: सार्वजनिक पूर्वावलोकन नमूना डेटा। सभी आँकड़े कृत्रिम हैं।",
    ref: "संदर्भ तिथि",
    allDistricts: "नक्शे पर सभी जिले देखें",
    errorTitle: "विश्लेषण अभी उपलब्ध नहीं है",
    errorMsg: "डैशबोर्ड का डेटा लोड नहीं हो सका। इंटरनेट जाँचकर फिर कोशिश करें।",
    retry: "फिर कोशिश करें",
    loading: "डैशबोर्ड लोड हो रहा है",
  },
  en: {
    badge: "Sample · DEMO",
    tag: "Sample data · Public preview",
    title: "How far have Gujarat's women schemes reached?",
    lead: "From the state to district, taluka and village: see where every scheme stands, in one place.",
    openMap: "Open the map",
    openSchemes: "Browse schemes",
    ladderTitle: "Gujarat's administrative structure",
    steps: ["Gujarat state", "Districts", "Talukas", "Villages and towns"],
    kpiRows: "Sample rows",
    kpiRowsSub: "Demo records, not a count of people",
    kpiSchemes: "Schemes",
    kpiSchemesSub: "Included in the sample dataset",
    kpiApproved: "Share of approved rows",
    kpiApprovedSub: "Across the {n} schemes that record approval",
    schemeTitle: "Status by scheme",
    schemeNote: "Each bar shows the status of one scheme's sample rows.",
    districtTitle: "Sample rows by district",
    districtNote: "The 8 districts with the most rows.",
    rows: "rows",
    places: "places",
    status: { approved: "Approved", serviceDelivered: "Service delivered", activityRecorded: "Activity recorded", pending: "In process", documentsPending: "Documents pending", rejected: "Rejected", notApplied: "Not applied" },
    source: "Source: public preview sample data. Every figure is synthetic.",
    ref: "Reference date",
    allDistricts: "See all districts on the map",
    errorTitle: "Analytics are unavailable",
    errorMsg: "The dashboard data could not be loaded. Check your connection and try again.",
    retry: "Try again",
    loading: "Loading dashboard",
  },
} as const;

const localeOf = (lang: AppLanguage) => (lang === "gu" ? "gu-IN" : lang === "hi" ? "hi-IN" : "en-IN");
const fmt = (n: number, lang: AppLanguage) => new Intl.NumberFormat(localeOf(lang)).format(n);
const fmtDate = (iso: string, lang: AppLanguage) => {
  const d = new Date(`${iso}T00:00:00`);
  return Number.isNaN(d.getTime()) ? iso : new Intl.DateTimeFormat(localeOf(lang), { day: "numeric", month: "long", year: "numeric" }).format(d);
};

/** Adds `dx-in` once the element is on screen so bars can grow exactly when they are seen. */
function useInView<T extends HTMLElement>(ready: boolean) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!ready || !el) return;
    const io = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, [ready]);
  return [ref, seen] as const;
}

export function SpatialBentoDashboard({ lang, talukaCount, onNavigate }: SpatialBentoDashboardProps) {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const text = copy[lang];
  const [schemeRef, schemeSeen] = useInView<HTMLElement>(Boolean(overview));
  const [districtRef, districtSeen] = useInView<HTMLElement>(Boolean(overview));

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/v1/analytics/overview", { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("overview unavailable");
        return (await response.json()) as Overview;
      })
      .then((payload) => {
        if (payload.status !== "success") throw new Error("overview unavailable");
        setOverview(payload);
      })
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) setFailed(true);
      });
    return () => controller.abort();
  }, [attempt]);

  const retry = useCallback(() => {
    setFailed(false);
    setOverview(null);
    setAttempt((n) => n + 1);
  }, []);

  const schemes = useMemo(() => overview?.data.schemes ?? [], [overview]);
  const districts = useMemo(() => (overview?.data.districts ?? []).slice().sort((a, b) => b.sampleRows - a.sampleRows).slice(0, 8), [overview]);
  const maxDistrict = Math.max(1, ...districts.map((d) => d.sampleRows));
  const approval = useMemo(() => {
    const tracked = schemes.filter((s) => typeof s.activity.approved === "number");
    const total = tracked.reduce((sum, s) => sum + s.count, 0);
    const approved = tracked.reduce((sum, s) => sum + (s.activity.approved ?? 0), 0);
    return { share: total ? (approved / total) * 100 : 0, schemes: tracked.length };
  }, [schemes]);
  const usedStatuses = useMemo(() => STATUS.filter((st) => schemes.some((s) => (s.activity[st.key] ?? 0) > 0)), [schemes]);
  const nameOf = (item: { nameEn: string; nameGu: string }) => (lang === "gu" ? item.nameGu : localizeText(lang, item.nameEn));
  const ladder = overview
    ? [
        { value: 1, label: text.steps[0] },
        { value: overview.meta.districtCount, label: text.steps[1] },
        { value: talukaCount, label: text.steps[2] },
        { value: overview.meta.locationCount, label: text.steps[3] },
      ]
    : [];

  return (
    <div className="dx">
      <section className="dx-hero" aria-labelledby="dx-title">
        <div className="dx-hero__copy">
          <span className="dx-tag dx-rise" style={{ "--d": 0 } as React.CSSProperties}>
            <Rows3 size={14} aria-hidden="true" />
            {text.tag}
          </span>
          <h1 id="dx-title" className="dx-h1 dx-rise" style={{ "--d": 1 } as React.CSSProperties}>{text.title}</h1>
          <p className="dx-lead dx-rise" style={{ "--d": 2 } as React.CSSProperties}>{text.lead}</p>
          <div className="dx-actions dx-rise" style={{ "--d": 3 } as React.CSSProperties}>
            <button type="button" className="dx-btn dx-btn--primary" onClick={() => onNavigate("map")}>
              <MapIcon size={17} aria-hidden="true" />
              {text.openMap}
              <ArrowRight size={16} aria-hidden="true" />
            </button>
            <button type="button" className="dx-btn dx-btn--ghost" onClick={() => onNavigate("schemes")}>
              {text.openSchemes}
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div aria-label={text.ladderTitle} role="group">
          {overview ? (
            <ol className="dx-ladder">
              {ladder.map((step, index) => (
                <li className="dx-step" key={step.label}>
                  <span className="dx-step__dot" aria-hidden="true">{index === 0 ? <MapIcon size={14} /> : null}</span>
                  <span>
                    <span className="dx-step__value"><AnimatedNumber value={step.value} locale={localeOf(lang)} duration={1000} /></span>
                    <span className="dx-step__label">{step.label}</span>
                  </span>
                </li>
              ))}
            </ol>
          ) : failed ? null : (
            <Skeleton height={240} />
          )}
        </div>
      </section>

      {failed ? (
        <ErrorState title={text.errorTitle} message={text.errorMsg} onRetry={retry} retryLabel={text.retry} />
      ) : !overview ? (
        <div className="dx-kpis" role="status" aria-label={text.loading}>
          <CardSkeleton /><CardSkeleton /><CardSkeleton />
        </div>
      ) : (
        <>
          <section className="dx-kpis" aria-label={text.kpiRows}>
            <KpiCard title={text.kpiRows} value={<AnimatedNumber value={overview.meta.sourceRows} locale={localeOf(lang)} />} sublabel={text.kpiRowsSub} icon={Rows3} badge="DEMO" badgeLabel={text.badge} accent="saffron" />
            <KpiCard title={text.kpiSchemes} value={<AnimatedNumber value={overview.meta.schemeCount} locale={localeOf(lang)} />} sublabel={text.kpiSchemesSub} icon={BookOpenCheck} badge="DEMO" badgeLabel={text.badge} accent="blue" />
            <KpiCard title={text.kpiApproved} value={<AnimatedNumber value={approval.share} decimals={1} suffix="%" locale={localeOf(lang)} />} sublabel={text.kpiApprovedSub.replace("{n}", fmt(approval.schemes, lang))} icon={Percent} badge="DEMO" badgeLabel={text.badge} accent="teal" />
          </section>

          <div className="dx-panels">
            <section ref={schemeRef} className={`dx-panel${schemeSeen ? " dx-in" : ""}`} aria-labelledby="dx-schemes">
              <div className="dx-panel__head">
                <div>
                  <h2 id="dx-schemes" className="dx-h2">{text.schemeTitle}</h2>
                  <p className="dx-note">{text.schemeNote}</p>
                </div>
                <DataBadge type="DEMO" label={text.badge} />
              </div>
              <ul className="dx-legend" aria-hidden="true">
                {usedStatuses.map((s) => (
                  <li key={s.key} style={{ "--c": s.color } as React.CSSProperties}><i />{text.status[s.key]}</li>
                ))}
              </ul>
              <ul className="dx-rows">
                {schemes.map((scheme) => {
                  const total = Math.max(1, usedStatuses.reduce((sum, s) => sum + (scheme.activity[s.key] ?? 0), 0));
                  const summary = usedStatuses.filter((s) => (scheme.activity[s.key] ?? 0) > 0).map((s) => `${text.status[s.key]} ${fmt(scheme.activity[s.key] ?? 0, lang)}`).join(", ");
                  return (
                    <li className="dx-row" key={scheme.id}>
                      <div className="dx-row__top">
                        <span className="dx-row__name">{nameOf(scheme)}</span>
                        <span className="dx-row__meta">{fmt(scheme.count, lang)} {text.rows}</span>
                      </div>
                      <div className="dx-bar" role="img" aria-label={`${nameOf(scheme)}: ${summary}`} title={summary}>
                        {usedStatuses.map((s, i) => {
                          const value = scheme.activity[s.key] ?? 0;
                          return value > 0 ? <i key={s.key} style={{ "--w": `${(value / total) * 100}%`, "--c": s.color, "--i": i } as React.CSSProperties} /> : null;
                        })}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>

            <section ref={districtRef} className={`dx-panel${districtSeen ? " dx-in" : ""}`} aria-labelledby="dx-districts">
              <div className="dx-panel__head">
                <div>
                  <h2 id="dx-districts" className="dx-h2">{text.districtTitle}</h2>
                  <p className="dx-note">{text.districtNote}</p>
                </div>
                <DataBadge type="DEMO" label={text.badge} />
              </div>
              <ul className="dx-rows">
                {districts.map((district, i) => (
                  <li className="dx-row" key={district.districtCode}>
                    <div className="dx-row__top">
                      <span className="dx-row__name">{nameOf(district)}</span>
                      <span className="dx-row__meta">{fmt(district.sampleRows, lang)} {text.rows} · {fmt(district.locationCount, lang)} {text.places}</span>
                    </div>
                    <div className="dx-bar dx-bar--single" aria-hidden="true">
                      <i style={{ "--w": `${Math.max(4, (district.sampleRows / maxDistrict) * 100)}%`, "--c": "var(--dx-navy)", "--i": i } as React.CSSProperties} />
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <footer className="dx-foot">
            <span>{text.source} {text.ref}: {fmtDate(overview.meta.referenceDate, lang)}.</span>
            <button type="button" className="dx-link" onClick={() => onNavigate("map")}>
              <Building2 size={15} aria-hidden="true" />
              {text.allDistricts}
              <ArrowRight size={14} aria-hidden="true" />
            </button>
          </footer>
        </>
      )}
    </div>
  );
}
