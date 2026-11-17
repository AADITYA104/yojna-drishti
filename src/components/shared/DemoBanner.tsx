"use client";

import React from "react";
import { Info, ShieldAlert, ArrowRight } from "lucide-react";
import type { AppLanguage } from "@/lib/i18n";

interface DemoBannerProps {
  gu: boolean;
  lang?: AppLanguage;
  onExploreData?: () => void;
}

export function DemoBanner({ gu, lang = gu ? "gu" : "en", onExploreData }: DemoBannerProps) {
  return (
    <div className="demo-banner-gov">
      <div className="demo-symbol-gov">
        <Info size={16} />
      </div>
      <div className="demo-text-gov">
        <strong>
          {gu
            ? "ડેમો પૂર્વદર્શન · સરકારી આંકડા જોડાયેલા નથી"
            : "DEMO PREVIEW · OFFICIAL METRIC FEED NOT CONNECTED"}
        </strong>
        <span>
          {gu
            ? "ગામની સીમાઓમાં Survey of India/NWICનો મે 2025નો પ્રકાશિત source code match હોય ત્યાં વપરાય છે; 2011 Census profile ઐતિહાસિક છે, હાલનો નથી. લાભાર્થી, આવક, ચુકવણી કે યોજના-coverageનો official feed જોડાયેલો નથી; demo આંકડા સરકારી આંકડા નથી."
            : lang === "hi"
              ? "गाँव की सीमाओं में Survey of India/NWIC का मई 2025 में प्रकाशित स्रोत वहीं उपयोग होता है जहाँ कोड मेल खाते हैं; 2011 Census प्रोफ़ाइल ऐतिहासिक है, वर्तमान नहीं। लाभार्थी, आय, भुगतान या योजना कवरेज का आधिकारिक फ़ीड जुड़ा नहीं है; डेमो आँकड़े सरकारी आँकड़े नहीं हैं।"
              : "Village boundaries use Survey of India/NWIC’s May 2025 publication where codes match; the 2011 Census profile is historical, not current. No official beneficiary, income, payment, or scheme-coverage feed is connected. Demo figures are not government statistics."}
        </span>
      </div>
      {onExploreData && (
        <button className="demo-btn-gov" onClick={onExploreData} title="View data pipeline status">
          <span>{gu ? "ડેટા સ્થિતિ" : lang === "hi" ? "डेटा स्थिति" : "Data Pipeline"}</span>
          <ArrowRight size={14} />
        </button>
      )}
    </div>
  );
}
