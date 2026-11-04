"use client";

import { useMemo, useState } from "react";
import { BarChart3, BookOpen, MapPin, Search, ShieldCheck, Users, Wallet } from "lucide-react";
import { NOTEBOOK_WOMEN_SCHEMES, type NotebookScheme } from "@/lib/master-hierarchy";
import { getVillageSchemeSummary } from "@/lib/village-scheme-demo";

interface VillageSchemeRegisterProps {
  villageCode: string;
  villageNameGu?: string;
  villageNameEn?: string;
  talukaNameGu?: string;
  talukaNameEn?: string;
  districtNameGu?: string;
  districtNameEn?: string;
  gu: boolean;
}

const fmt = (value: number, gu: boolean) =>
  new Intl.NumberFormat(gu ? "gu-IN" : "en-IN").format(value);

function getSchemeInfo(id: string): NotebookScheme | undefined {
  return NOTEBOOK_WOMEN_SCHEMES.find((scheme) => scheme.id === id);
}

export function VillageSchemeRegister({
  villageCode,
  villageNameGu,
  villageNameEn,
  talukaNameGu = "ઘોઘા",
  talukaNameEn = "Ghogha",
  districtNameGu = "ભાવનગર",
  districtNameEn = "Bhavnagar",
  gu,
}: VillageSchemeRegisterProps) {
  const [query, setQuery] = useState("");
  const [selectedSchemeId, setSelectedSchemeId] = useState("all");
  const schemeSummary = useMemo(() => getVillageSchemeSummary(villageCode), [villageCode]);
  const villageName = gu ? villageNameGu : villageNameEn;
  const districtName = gu ? districtNameGu : districtNameEn;
  const talukaName = gu ? talukaNameGu : talukaNameEn;

  const filteredSchemes = useMemo(() => {
    const term = query.trim().toLocaleLowerCase();
    return schemeSummary.schemes.filter((scheme) => {
      if (selectedSchemeId !== "all" && scheme.schemeId !== selectedSchemeId) return false;
      const info = getSchemeInfo(scheme.schemeId);
      if (!term) return true;
      return [
        scheme.schemeNameEn,
        scheme.schemeNameGu,
        info?.target ?? "",
        info?.targetGu ?? "",
        info?.benefit ?? "",
        info?.benefitGu ?? "",
      ].join(" ").toLocaleLowerCase().includes(term);
    });
  }, [query, schemeSummary.schemes, selectedSchemeId]);

  const highestEnrollment = Math.max(1, ...schemeSummary.schemes.map((scheme) => scheme.beneficiaries));
  const coverageAvailable = schemeSummary.schemes.length > 0;

  return (
    <section className="village-scheme-register-card vsa-card" aria-labelledby="vsa-title">
      <div className="vsa-hero">
        {/* Existing Gujarat collage asset; its source resolution is 1024px, so it is not presented as 4K. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/gujarat-vibrant-collage.jpg" alt="ગુજરાતના પ્રાકૃતિક અને સાંસ્કૃતિક સ્થળો" />
        <div className="vsa-hero-overlay" />
        <div className="vsa-hero-content">
          <span className="vsa-eyebrow">
            <MapPin size={13} />
            {gu ? "ગામવાર યોજના પહોંચ" : "VILLAGE SCHEME REACH"}
          </span>
          <h2 id="vsa-title">{villageName || (gu ? "પસંદ કરેલું ગામ" : "Selected village")}</h2>
          <p>{gu ? `${districtName} જિલ્લો · ${talukaName} તાલુકો · LGD ${villageCode}` : `${districtName} District · ${talukaName} Taluka · LGD ${villageCode}`}</p>
        </div>
        <span className="vsa-demo-badge"><ShieldCheck size={13} /> {gu ? "ડેમો આંકડા" : "DEMO DATA"}</span>
      </div>

      <div className="vsa-content">
        <div className="vsa-data-note" role="note">
          <ShieldCheck size={17} />
          <span>
            {gu
              ? "આ આંકડા માત્ર પ્રોટોટાઇપ માટેના ઉદાહરણ છે; સરકારી રીતે ચકાસાયેલા નથી. યોજનાવાર ગણતરીઓમાં એક જ વ્યક્તિ એકથી વધુ યોજનામાં હોઈ શકે છે, એટલે કુલ unique લોકો તરીકે ન ગણવો. પાત્રતા અને લાભની વિગતો પણ સત્તાવાર વિભાગમાં ચકાસો."
              : "Illustrative prototype data only; not verified government records. A person may participate in more than one scheme, so scheme totals are not unique people. Verify eligibility and benefit details with the official department."}
          </span>
        </div>

        {coverageAvailable ? (
          <>
            <div className="vsa-kpis">
              <article className="vsa-kpi vsa-kpi-blue">
                <span><BookOpen size={19} /></span>
                <div><small>{gu ? "ગામમાં દર્શાવેલી યોજનાઓ" : "Schemes shown for village"}</small><strong>{fmt(schemeSummary.schemes.length, gu)}</strong></div>
              </article>
              <article className="vsa-kpi vsa-kpi-teal">
                <span><Users size={19} /></span>
                <div><small>{gu ? "યોજનાવાર ભાગીદારી" : "Scheme participations"}</small><strong>{fmt(schemeSummary.totalSchemeEnrollments, gu)}</strong></div>
              </article>
              <article className="vsa-kpi vsa-kpi-amber">
                <span><Wallet size={19} /></span>
                <div><small>{gu ? "નમૂનાનું કુલ વિતરણ" : "Illustrative disbursement"}</small><strong>₹ {fmt(schemeSummary.totalGrantLakhs, gu)} {gu ? "લાખ" : "lakh"}</strong></div>
              </article>
            </div>

            <div className="vsa-analytics">
              <section className="vsa-panel" aria-labelledby="vsa-chart-title">
                <div className="vsa-panel-heading">
                  <div>
                    <span className="vsa-panel-icon"><BarChart3 size={17} /></span>
                    <h3 id="vsa-chart-title">{gu ? "યોજનાવાર લાભાર્થી ભાગીદારી" : "Scheme-wise beneficiary participation"}</h3>
                  </div>
                  <small>{gu ? "ઉદાહરણ" : "Illustrative"}</small>
                </div>
                <div className="vsa-bars">
                  {schemeSummary.schemes.map((scheme) => {
                    const info = getSchemeInfo(scheme.schemeId);
                    const schemeLabel = gu ? scheme.schemeNameGu : scheme.schemeNameEn;
                    return (
                      <button
                        type="button"
                        key={scheme.schemeId}
                        className={`vsa-bar-row ${selectedSchemeId === scheme.schemeId ? "selected" : ""}`}
                        onClick={() => setSelectedSchemeId(selectedSchemeId === scheme.schemeId ? "all" : scheme.schemeId)}
                        aria-pressed={selectedSchemeId === scheme.schemeId}
                        title={gu ? "આ યોજના પ્રમાણે વિગતો ફિલ્ટર કરો" : "Filter details to this scheme"}
                      >
                        <span className="vsa-bar-label">{schemeLabel}</span>
                        <span className="vsa-bar-track"><i style={{ width: `${Math.max(4, (scheme.beneficiaries / highestEnrollment) * 100)}%` }} /></span>
                        <strong>{scheme.beneficiaries < 10 ? (gu ? "૧૦થી ઓછા" : "<10") : fmt(scheme.beneficiaries, gu)}</strong>
                        <small>{info ? (gu ? info.categoryGu : info.notebookCategory) : ""}</small>
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="vsa-panel vsa-location-panel" aria-labelledby="vsa-location-title">
                <div className="vsa-panel-heading">
                  <div>
                    <span className="vsa-panel-icon"><MapPin size={17} /></span>
                    <h3 id="vsa-location-title">{gu ? "આ માહિતી કયા વિસ્તારની છે?" : "Where does this data apply?"}</h3>
                  </div>
                </div>
                <ol className="vsa-location-steps">
                  <li><span>1</span><div><small>{gu ? "જિલ્લો" : "District"}</small><strong>{districtName}</strong></div></li>
                  <li><span>2</span><div><small>{gu ? "તાલુકો" : "Taluka"}</small><strong>{talukaName}</strong></div></li>
                  <li><span>3</span><div><small>{gu ? "ગામ" : "Village"}</small><strong>{villageName || (gu ? "પસંદ કરેલું ગામ" : "Selected village")}</strong></div></li>
                </ol>
                <p className="vsa-location-caption">
                  {gu ? "ગામના નકશા પરથી પસંદ કરેલી જગ્યાની યોજના-માહિતી." : "Scheme details for the village selected from the map."}
                </p>
              </section>
            </div>

            <div className="vsa-scheme-list-head">
              <div>
                <h3>{gu ? "આ ગામમાં દર્શાવેલી યોજનાઓ" : "Schemes shown for this village"}</h3>
                <p>{gu ? "યોજનાનું નામ, લક્ષિત જૂથ, મળતો લાભ અને નમૂનાની લાભાર્થી ગણતરી." : "Scheme name, target group, stated benefit, and illustrative participant count."}</p>
              </div>
              <label className="vsa-search">
                <Search size={15} />
                <input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder={gu ? "યોજના અથવા લાભ શોધો" : "Search scheme or benefit"} aria-label={gu ? "યોજના અથવા લાભ શોધો" : "Search scheme or benefit"} />
              </label>
            </div>

            <div className="vsa-scheme-grid">
              {filteredSchemes.length ? filteredSchemes.map((scheme) => {
                const info = getSchemeInfo(scheme.schemeId);
                const share = schemeSummary.totalSchemeEnrollments > 0
                  ? Math.round((scheme.beneficiaries / schemeSummary.totalSchemeEnrollments) * 100)
                  : 0;
                return (
                  <article className="vsa-scheme" key={scheme.schemeId}>
                    <div className="vsa-scheme-top">
                      <div><span className="vsa-scheme-category">{info ? (gu ? info.categoryGu : info.notebookCategory) : (gu ? "યોજના" : "Scheme")}</span><h4>{gu ? scheme.schemeNameGu : scheme.schemeNameEn}</h4></div>
                      <span className="vsa-scheme-code">{scheme.schemeId}</span>
                    </div>
                    <div className="vsa-scheme-stats">
                      <div><small>{gu ? "લાભાર્થી ભાગીદારી · ડેમો" : "Participant count · demo"}</small><strong><Users size={15} /> {scheme.beneficiaries < 10 ? (gu ? "૧૦થી ઓછા" : "<10") : fmt(scheme.beneficiaries, gu)}</strong></div>
                      <div><small>{gu ? "વિતરણ · ડેમો" : "Disbursement · demo"}</small><strong><Wallet size={15} /> ₹ {fmt(scheme.grantLakhs, gu)} {gu ? "લાખ" : "lakh"}</strong></div>
                    </div>
                    <div className="vsa-share-line"><span>{gu ? "યોજનાવાર કુલ ભાગીદારીનો હિસ્સો" : "Share of all scheme participations"}</span><b>{share}%</b></div>
                    <div className="vsa-share-track"><i style={{ width: `${share}%` }} /></div>
                    <div className="vsa-detail-block">
                      <small>{gu ? "કોના માટે?" : "Who is it for?"}</small>
                      <p>{info ? (gu ? info.targetGu : info.target) : (gu ? "પાત્રતા વિગતો ઉપલબ્ધ નથી" : "Eligibility details unavailable")}</p>
                    </div>
                    <div className="vsa-detail-block vsa-benefit-block">
                      <small>{gu ? "યોજનામાં દર્શાવેલો લાભ" : "Benefit described in catalogue"}</small>
                      <p>{info ? (gu ? info.benefitGu : info.benefit) : (gu ? "લાભની માહિતી ઉપલબ્ધ નથી" : "Benefit details unavailable")}</p>
                    </div>
                    <div className="vsa-scheme-foot"><MapPin size={14} /> {districtName} · {talukaName} · {villageName || villageCode}</div>
                  </article>
                );
              }) : (
                <div className="vsa-no-results" role="status">{gu ? "આ શોધ માટે કોઈ યોજના મળી નથી." : "No schemes match this search."}</div>
              )}
            </div>
          </>
        ) : (
          <div className="vsa-empty-state">
            <div className="vsa-empty-icon"><MapPin size={22} /></div>
            <div>
              <h3>{gu ? "આ ગામ માટે યોજના-કવરેજ ડેટા ઉપલબ્ધ નથી" : "Scheme coverage data is not available for this village"}</h3>
              <p>{gu ? "હાલમાં માત્ર ઘોઘા તાલુકાના ૪૮ ગામ માટે ઉદાહરણરૂપ coverage દાખલ છે. આ ગામ માટે સત્તાવાર અથવા ચકાસાયેલ લાભાર્થી ગણતરી જોડાયા પછી અહીં વિગતો દેખાશે." : "Illustrative coverage is currently available only for 48 villages in Ghogha taluka. This village’s details will appear once verified scheme and aggregate beneficiary data is connected."}</p>
            </div>
          </div>
        )}

        <footer className="vsa-privacy-note">
          <ShieldCheck size={16} />
          <span>{gu ? "ગોપનીયતા: અહીં વ્યક્તિગત લાભાર્થીનાં નામ, આધાર, મોબાઇલ, બેંક ખાતું કે અરજી નંબર બતાવતા નથી. આ ડેશબોર્ડ aggregate માહિતી માટે છે." : "Privacy: individual names, Aadhaar, mobile, bank account, and application IDs are not shown. This dashboard is for aggregate information."}</span>
        </footer>
      </div>
    </section>
  );
}
