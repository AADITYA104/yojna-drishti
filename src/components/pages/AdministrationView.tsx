"use client";

import React from "react";
import { CheckCircle2, Database, FileCheck2, Link2Off, MapPinned, ShieldCheck } from "lucide-react";
import type { AppLanguage } from "@/lib/i18n";
import { MASTER_SUBDISTRICTS } from "@/lib/master-hierarchy";

interface AdministrationViewProps {
  gu: boolean;
  lang: AppLanguage;
}

const copy = {
  gu: {
    eyebrow: "માહિતી શાસન · સ્થિતિ",
    title: "નકશો અને માહિતી સમૂહ કયા સ્ત્રોતથી ચાલે છે",
    desc: "આ પૃષ્ઠ દરેક વિગતને સ્પષ્ટપણે સમજાવે છે: શું જોડાયેલું છે, શું માત્ર કૃત્રિમ નમૂનો છે અને કઈ સરકારી માહિતી હજી જોડાવાની છે.",
    noteTitle: "વાસ્તવિક સરકારી સેવા નથી",
    note: "પ્રવેશ (Login), પરવાનગીઓ, મંજૂરીઓ અને ઓડિટ નોંધો હજી સત્તાવાર રીતે જોડાયેલ નથી. આથી આ પૃષ્ઠને જીવંત વહીવટી પ્રણાલી તરીકે વાપરવું નહીં.",
    connected: "જોડાયેલું",
    unavailable: "જોડાયેલું નથી",
    sourceTitle: "માહિતી સ્ત્રોત અને વિશ્વાસ સ્તર",
    boundaryTitle: "વહીવટી સીમાઓ",
    boundaryDesc: "જિલ્લો, તાલુકો અને ઉપલબ્ધ ગામ તથા શહેરની સીમાઓ નકશા વિશ્લેષણ માટે વપરાય છે.",
    boundaryMeta: `૩૩ જિલ્લા · ${MASTER_SUBDISTRICTS.length} તાલુકા`,
    datasetTitle: "સ્થાનવાર નમૂના માહિતી સમૂહ",
    datasetDesc: "દરેક પસંદ કરેલા સ્થાન માટે ૩૯ ખાનાઓ અને ૧૦ યોજના કોડવાળી કૃત્રિમ હરોળો વાંચી શકાય છે.",
    datasetMeta: "માત્ર કૃત્રિમ નમૂનો · દરેક યોજના/સ્થળ દીઠ ૧૫ હરોળો",
    officialTitle: "યોજના પહોંચ પુષ્ટિ",
    officialDesc: "વાસ્તવિક લાભાર્થી, DBT, ખર્ચ અથવા કવરેજ ડેટા હજી જોડાયેલ નથી.",
    officialMeta: "સરકારી સ્ત્રોત જરૂરી",
    rulesTitle: "પાત્રતા, અરજી અને છેલ્લી તારીખ",
    rulesDesc: "સત્તાવાર નિયમો, અરજી લિંક, સહાય નંબર અને છેલ્લી ચકાસણીની તારીખ હજી જોડાયેલી નથી.",
    rulesMeta: "વિભાગીય સ્ત્રોત જરૂરી",
    nextTitle: "વાસ્તવિક અમલીકરણ માટે જરૂરી જોડાણો",
    next: [
      "સંબંધિત સરકારી વિભાગ પાસેથી યોજના સૂચિ, સત્તાવાર લિંક અને ચકાસણી તારીખ મેળવો.",
      "સત્તાવાર લાભાર્થી/DBT માહિતીને યોગ્ય વહીવટી વ્યાખ્યા સાથે જોડો.",
      "દરેક યોજના માટે પાત્રતા નિયમો, દસ્તાવેજો અને સત્તાવાર અરજી પ્રક્રિયા ચકાસો.",
    ],
  },
  hi: {
    eyebrow: "डेटा गवर्नेंस · स्थिति",
    title: "नक्शा और dataset किन स्रोतों से चलते हैं",
    desc: "यह पृष्ठ साफ़ बताता है कि कौन-सी जानकारी जुड़ी है, कौन-सी synthetic sample है और कौन-से सरकारी स्रोत अभी जुड़ने बाकी हैं।",
    noteTitle: "यह वास्तविक सरकारी सेवा नहीं है",
    note: "Login, permissions, approvals और audit entries यहाँ कार्यरत नहीं हैं। इस पृष्ठ को system administration के रूप में उपयोग नहीं करना चाहिए।",
    connected: "जुड़ा हुआ",
    unavailable: "जुड़ा नहीं",
    sourceTitle: "डेटा स्रोत और भरोसे की स्थिति",
    boundaryTitle: "प्रशासनिक सीमाएँ",
    boundaryDesc: "जिला, तालुका और उपलब्ध गाँव/शहर boundaries को map drill-down के लिए उपयोग किया जाता है।",
    boundaryMeta: `34 जिले · ${MASTER_SUBDISTRICTS.length} तालुके`,
    datasetTitle: "स्थान-आधारित sample dataset",
    datasetDesc: "हर चुने स्थान के लिए 39 fields और 10 scheme codes वाली synthetic rows पढ़ी जा सकती हैं।",
    datasetMeta: "केवल synthetic demo · हर scheme/location पर 15 rows",
    officialTitle: "आधिकारिक योजना पहुँच",
    officialDesc: "वास्तविक लाभार्थी, DBT, खर्च, coverage या denominator feed जुड़ा नहीं है।",
    officialMeta: "सरकारी feed आवश्यक",
    rulesTitle: "पात्रता, आवेदन और deadlines",
    rulesDesc: "आधिकारिक rules, apply links, helplines और last-verified date अभी जुड़े नहीं हैं।",
    rulesMeta: "विभागीय source आवश्यक",
    nextTitle: "Production के लिए अगले आवश्यक जोड़",
    next: [
      "सरकारी विभाग से scheme catalogue, source URL और last-verified date जोड़ें।",
      "Authorized beneficiary/DBT feed को स्थान और reporting period definition के साथ जोड़ें।",
      "हर scheme के rules, documents, official apply link और deadline सत्यापित करें।",
    ],
  },
  en: {
    eyebrow: "DATA GOVERNANCE · STATUS",
    title: "What powers the map and dataset",
    desc: "This page makes the evidence behind each part of the product clear: what is connected, what is a synthetic sample, and what government sources are still required.",
    noteTitle: "Not a live government service",
    note: "Login, permissions, approvals, and audit entries are not connected. Do not use this page as a real administration system.",
    connected: "Connected",
    unavailable: "Not connected",
    sourceTitle: "Source and confidence status",
    boundaryTitle: "Administrative boundaries",
    boundaryDesc: "District, taluka, and available village/city boundaries power the map drill-down.",
    boundaryMeta: `34 districts · ${MASTER_SUBDISTRICTS.length} talukas`,
    datasetTitle: "Location-level sample dataset",
    datasetDesc: "The selected location can expose synthetic rows across 39 fields and 10 scheme codes.",
    datasetMeta: "Synthetic demo only · 15 rows per scheme/location",
    officialTitle: "Official scheme reach",
    officialDesc: "No real beneficiary, DBT, spending, coverage, or denominator feed is connected.",
    officialMeta: "Government feed required",
    rulesTitle: "Eligibility, applications, and deadlines",
    rulesDesc: "Official rules, application links, helplines, and last-verified dates are not connected yet.",
    rulesMeta: "Department source required",
    nextTitle: "Connections required for production",
    next: [
      "Connect a government scheme catalogue with a source URL and last-verified date.",
      "Connect authorized beneficiary/DBT feeds with a location and reporting-period definition.",
      "Verify rules, documents, official application links, and deadlines for every scheme.",
    ],
  },
} as const;

export function AdministrationView({ lang }: AdministrationViewProps) {
  const text = copy[lang];
  const sources = [
    { title: text.boundaryTitle, desc: text.boundaryDesc, meta: text.boundaryMeta, icon: MapPinned, status: text.connected, state: "connected" },
    { title: text.datasetTitle, desc: text.datasetDesc, meta: text.datasetMeta, icon: Database, status: text.connected, state: "connected" },
    { title: text.officialTitle, desc: text.officialDesc, meta: text.officialMeta, icon: Link2Off, status: text.unavailable, state: "pending" },
    { title: text.rulesTitle, desc: text.rulesDesc, meta: text.rulesMeta, icon: FileCheck2, status: text.unavailable, state: "pending" },
  ];

  return (
    <div className="governance-page">
      <header className="page-hero-gov governance-hero reveal">
        <span className="hero-kicker-tag"><ShieldCheck size={14} />{text.eyebrow}</span>
        <h1>{text.title}</h1>
        <p>{text.desc}</p>
      </header>

      <aside className="data-security-alert-bar governance-note reveal" role="note">
        <ShieldCheck size={18} />
        <div><strong>{text.noteTitle}</strong><span>{text.note}</span></div>
      </aside>

      <section className="governance-section reveal" aria-labelledby="source-status-heading">
        <div className="governance-section-heading">
          <span>{text.eyebrow}</span>
          <h2 id="source-status-heading">{text.sourceTitle}</h2>
        </div>
        <div className="governance-source-grid">
          {sources.map(({ title, desc, meta, icon: Icon, status, state }) => (
            <article className="governance-source-card" key={title}>
              <span className={`governance-source-icon ${state}`}><Icon size={19} /></span>
              <div>
                <div className="governance-source-topline"><h3>{title}</h3><span className={`governance-status ${state}`}>{status}</span></div>
                <p>{desc}</p>
                <small>{meta}</small>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="governance-roadmap reveal" aria-labelledby="governance-roadmap-heading">
        <div className="governance-section-heading"><span>{text.eyebrow}</span><h2 id="governance-roadmap-heading">{text.nextTitle}</h2></div>
        <ol>
          {text.next.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p><CheckCircle2 size={18} aria-hidden="true" /></li>)}
        </ol>
      </section>
    </div>
  );
}
