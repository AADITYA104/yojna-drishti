"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BarChart3, Building2, Database, MapPinned, Users, IndianRupee } from "lucide-react";
import { motion } from "framer-motion";
import { localizeText, type AppLanguage } from "@/lib/i18n";
import { KpiCard } from "@/components/ui/KpiCard";
import { ErrorState } from "@/components/ui/ErrorState";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { DataBadge } from "@/components/ui/DataBadge";

interface SpatialBentoDashboardProps {
  gu: boolean;
  lang: AppLanguage;
  fy?: string;
  onNavigate: (view: "map" | "schemes" | "wizard" | "saved" | "settings") => void;
  onSelectScheme?: (name: string) => void;
}

type Overview = {
  status: string;
  meta: {
    classification: string;
    referenceDate: string;
    locationCount: number;
    districtCount: number;
    schemeCount: number;
    sourceRows: number;
  };
  data: {
    schemes: Array<{ id: string; nameEn: string; nameGu: string; count: number }>;
    districts: Array<{
      districtCode: string;
      nameEn: string;
      nameGu: string;
      locationCount: number;
      sampleRows: number;
      schemeCount: number;
    }>;
  };
};

const copy = {
  gu: {
    eyebrow: "ગુજરાત · સરકારી યોજના પહોંચ ડેશબોર્ડ",
    title: "યોજના દૃષ્ટિ",
    subtitle: "મહિલા કલ્યાણ અને સામાજિક સુરક્ષા યોજનાઓની રાજ્યવ્યાપી પહોંચ: ગુજરાત → જિલ્લો → તાલુકો → ગામ.",
    kpiBeneficiaries: "કુલ લક્ષિત લાભાર્થીઓ",
    kpiBeneficiariesSub: "૫ મુખ્ય મહિલા યોજનાઓ અંતર્ગત",
    kpiAid: "કુલ અંદાજિત સહાય રકમ",
    kpiAidSub: "ચાલુ નાણાકીય વર્ષ (ડીબીટી)",
    kpiLocations: "આવરી લેવાયેલ ગામો અને નગરો",
    kpiLocationsSub: "રાજ્યના ૩૩ જિલ્લાઓમાં",
    schemeTitle: "યોજનાવાર પહોંચ સ્થિતિ",
    districtTitle: "જિલ્લાવાર વિશ્લેષણ",
    count: "પંક્તિઓ",
    locations: "સ્થળો",
    openMap: "ગુજરાત નકશો ખોલો",
    openSchemes: "યોજનાઓની યાદી જુઓ",
    loading: "માહિતી સમૂહ વિશ્લેષણ લોડ થાય છે…",
    error: "હાલમાં વિશ્લેષણ ઉપલબ્ધ નથી.",
    source: "સ્રોત: જાહેર પૂર્વદર્શન નમૂના ડેટા · તમામ આંકડા ડેમો તરીકે ચિહ્નિત છે.",
    ref: "સંદર્ભ તારીખ",
    viewAll: "બધા જિલ્લાઓ નકશામાં જુઓ",
  },
  hi: {
    eyebrow: "गुजरात · सरकारी योजना पहुँच डैशबोर्ड",
    title: "योजना दृष्टि",
    subtitle: "महिला कल्याण और सामाजिक सुरक्षा योजनाओं की राज्यव्यापी पहुँच: गुजरात → जिला → तालुका → गाँव।",
    kpiBeneficiaries: "कुल लक्षित लाभार्थी",
    kpiBeneficiariesSub: "५ प्रमुख महिला योजनाओं के अंतर्गत",
    kpiAid: "कुल अनुमानित सहायता राशि",
    kpiAidSub: "चालू वित्तीय वर्ष (डीबीटी)",
    kpiLocations: "कवर किए गए गाँव और शहर",
    kpiLocationsSub: "राज्य के ३३ जिलों में",
    schemeTitle: "योजनावार पहुँच स्थिति",
    districtTitle: "जिलेवार विश्लेषण",
    count: "पंक्तियाँ",
    locations: "स्थान",
    openMap: "गुजरात नक्शा खोलें",
    openSchemes: "योजनाओं की सूची देखें",
    loading: "डेटा संग्रह विश्लेषण लोड हो रहा है…",
    error: "अभी विश्लेषण उपलब्ध नहीं है।",
    source: "स्रोत: सार्वजनिक पूर्वावलोकन नमूना डेटा · सभी आँकड़े डेमो के रूप में चिह्नित हैं।",
    ref: "संदर्भ तिथि",
    viewAll: "सभी जिले नक्शे पर देखें",
  },
  en: {
    eyebrow: "GUJARAT · SCHEME REACH DASHBOARD",
    title: "Yojana Drishti",
    subtitle: "Statewide reach of women welfare schemes: Gujarat → District → Taluka → Village.",
    kpiBeneficiaries: "Target Beneficiaries",
    kpiBeneficiariesSub: "Across 5 core women schemes",
    kpiAid: "Estimated Disbursed Aid",
    kpiAidSub: "Current Financial Year (DBT)",
    kpiLocations: "Covered Villages & Towns",
    kpiLocationsSub: "Across all 33 districts",
    schemeTitle: "Scheme Reach Overview",
    districtTitle: "District Comparison",
    count: "rows",
    locations: "locations",
    openMap: "Open Gujarat Map",
    openSchemes: "Browse Schemes",
    loading: "Loading dataset analytics…",
    error: "Analytics are currently unavailable.",
    source: "Source: Public preview sample data · All figures labelled as DEMO.",
    ref: "Reference date",
    viewAll: "View all districts on map",
  },
} as const;

const number = (value: number, lang: AppLanguage) =>
  new Intl.NumberFormat(lang === "gu" ? "gu-IN" : lang === "hi" ? "hi-IN" : "en-IN").format(value);

export function SpatialBentoDashboard({ lang, onNavigate }: SpatialBentoDashboardProps) {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [failed, setFailed] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const text = copy[lang];

  useEffect(() => {
    let active = true;
    fetch("/api/v1/analytics/overview", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("overview unavailable");
        return response.json() as Promise<Overview>;
      })
      .then((payload) => {
        if (!active) return;
        if (payload.status !== "success") throw new Error("overview unavailable");
        setOverview(payload);
      })
      .catch(() => {
        if (active) setFailed(true);
      });
    return () => {
      active = false;
    };
  }, [retryCount]);

  const handleRetry = () => {
    setFailed(false);
    setOverview(null);
    setRetryCount((c) => c + 1);
  };

  const topSchemes = useMemo(() => (overview?.data.schemes ?? []).slice().sort((a, b) => b.count - a.count), [overview]);
  const topDistricts = useMemo(() => (overview?.data.districts ?? []).slice(0, 8), [overview]);
  const maxScheme = Math.max(1, ...topSchemes.map((item) => item.count));
  const maxDistrict = Math.max(1, ...topDistricts.map((item) => item.sampleRows));

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <motion.header
        className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 md:p-8"
        style={{
          backgroundColor: "var(--color-surface, rgba(255, 255, 255, 0.07))",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid var(--color-border, rgba(255, 255, 255, 0.14))",
          borderRadius: "var(--radius-lg, 16px)",
          boxShadow: "var(--shadow-sm, 0 2px 8px -2px rgba(0, 0, 0, 0.35))",
        }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full"
            style={{
              backgroundColor: "rgba(217, 119, 6, 0.15)",
              color: "#F59E0B",
              border: "1px solid rgba(245, 158, 11, 0.30)",
            }}
          >
            <MapPinned size={14} />
            <span>{text.eyebrow}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            {text.title}
          </h1>
          <p className="text-sm md:text-base text-white/75 leading-relaxed">
            {text.subtitle}
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2.5 font-semibold text-sm transition-all"
            style={{
              backgroundColor: "var(--color-accent, #D97706)",
              color: "#FFFFFF",
              borderRadius: "var(--radius-sm, 8px)",
              boxShadow: "0 2px 8px rgba(217, 119, 6, 0.35)",
            }}
            onClick={() => onNavigate("map")}
          >
            <MapPinned size={16} />
            <span>{text.openMap}</span>
            <ArrowRight size={15} />
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2.5 font-medium text-sm transition-all text-white/90 hover:text-white"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              border: "1px solid var(--color-border, rgba(255, 255, 255, 0.14))",
              borderRadius: "var(--radius-sm, 8px)",
            }}
            onClick={() => onNavigate("schemes")}
          >
            <span>{text.openSchemes}</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </motion.header>

      {/* 3 Core KPI Row */}
      {overview ? (
        <section
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
          aria-label={text.title}
        >
          <KpiCard
            title={text.kpiBeneficiaries}
            value={number(overview.meta.sourceRows * 12, lang)}
            sublabel={text.kpiBeneficiariesSub}
            icon={Users}
            badge="DEMO"
            accent="saffron"
          />
          <KpiCard
            title={text.kpiAid}
            value={`₹ ${lang === "gu" ? "૮૪.૫૦ કરોડ" : lang === "hi" ? "८४.५० करोड़" : "84.50 Cr"}`}
            sublabel={text.kpiAidSub}
            icon={IndianRupee}
            badge="DEMO"
            accent="green"
          />
          <KpiCard
            title={text.kpiLocations}
            value={number(overview.meta.locationCount, lang)}
            sublabel={text.kpiLocationsSub}
            icon={Building2}
            badge="DEMO"
            accent="teal"
          />
        </section>
      ) : failed ? (
        <ErrorState
          title={text.error}
          message={text.source}
          onRetry={handleRetry}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      )}

      {/* Analytics Charts & District Comparison */}
      {overview && (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Scheme breakdown */}
          <article
            className="p-6 space-y-4"
            style={{
              backgroundColor: "var(--color-surface, rgba(255, 255, 255, 0.07))",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid var(--color-border, rgba(255, 255, 255, 0.14))",
              borderRadius: "var(--radius-lg, 16px)",
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <span className="text-xs uppercase font-semibold text-amber-400">
                  {overview.meta.schemeCount} · {lang === "gu" ? "યોજનાઓ" : "Schemes"}
                </span>
                <h2 className="text-lg font-bold text-white mt-0.5">
                  {text.schemeTitle}
                </h2>
              </div>
              <DataBadge type="DEMO" />
            </div>

            <div className="space-y-3 pt-1">
              {topSchemes.map((scheme) => (
                <div key={scheme.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs md:text-sm">
                    <span className="text-white/85 font-medium">
                      {lang === "gu" ? scheme.nameGu : localizeText(lang, scheme.nameEn)}
                    </span>
                    <span className="font-semibold text-white/95">
                      {number(scheme.count, lang)}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden bg-white/10">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.max(4, (scheme.count / maxScheme) * 100)}%`,
                        backgroundColor: "var(--color-accent-light, #F59E0B)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>

          {/* District Comparison */}
          <article
            className="p-6 space-y-4"
            style={{
              backgroundColor: "var(--color-surface, rgba(255, 255, 255, 0.07))",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid var(--color-border, rgba(255, 255, 255, 0.14))",
              borderRadius: "var(--radius-lg, 16px)",
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <span className="text-xs uppercase font-semibold text-cyan-400">
                  {overview.meta.districtCount} · {lang === "gu" ? "જિલ્લાઓ" : "Districts"}
                </span>
                <h2 className="text-lg font-bold text-white mt-0.5">
                  {text.districtTitle}
                </h2>
              </div>
              <DataBadge type="DEMO" />
            </div>

            <div className="space-y-3 pt-1">
              {topDistricts.map((district) => (
                <div key={district.districtCode} className="space-y-1">
                  <div className="flex items-center justify-between text-xs md:text-sm">
                    <span className="text-white/85 font-medium">
                      {lang === "gu" ? district.nameGu : localizeText(lang, district.nameEn)}
                    </span>
                    <span className="text-xs text-white/60">
                      {number(district.sampleRows, lang)} {text.count} · {number(district.locationCount, lang)} {text.locations}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden bg-white/10">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.max(4, (district.sampleRows / maxDistrict) * 100)}%`,
                        backgroundColor: "var(--color-success, #15803D)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>
      )}

      {/* Footer Info & Disclaimer */}
      {overview && (
        <footer className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-white/60 pt-2 border-t border-white/10">
          <span>{text.source}</span>
          <div className="flex items-center gap-4">
            <span>{text.ref}: {overview.meta.referenceDate}</span>
            <button
              type="button"
              className="text-amber-400 hover:underline inline-flex items-center gap-1 font-medium"
              onClick={() => onNavigate("map")}
            >
              <span>{text.viewAll}</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </footer>
      )}
    </div>
  );
}
