"use client";

import React from "react";
import { Info, ShieldAlert, ArrowRight } from "lucide-react";

interface DemoBannerProps {
  gu: boolean;
  onExploreData?: () => void;
}

export function DemoBanner({ gu, onExploreData }: DemoBannerProps) {
  return (
    <div className="demo-banner-gov">
      <div className="demo-symbol-gov">
        <Info size={16} />
      </div>
      <div className="demo-text-gov">
        <strong>
          {gu
            ? "ડેમો પૂર્વદર્શન · કાલ્પનિક સિન્થેટિક આંકડા"
            : "DEMO PREVIEW · SYNTHETIC ACCURATE ARCHITECTURE"}
        </strong>
        <span>
          {gu
            ? "તમામ વહીવટી સ્તરો (રાજ્ય, ૩૪ જિલ્લા, તાલુકા, અને ઘોઘાના ૪૮ ગામો) વાસ્તવિક LGD માળખા પર આધારિત છે. સત્તાવાર સરકારી API જોડાય ત્યાં સુધી આંકડા પૂર્વદર્શન માટે છે."
            : "All administrative levels (State, 34 Districts, Talukas, and 48 Ghogha Villages) follow real LGD hierarchy. Aggregate statistics are synthetic until official departmental APIs are connected."}
        </span>
      </div>
      {onExploreData && (
        <button className="demo-btn-gov" onClick={onExploreData} title="View data pipeline status">
          <span>{gu ? "ડેટા સ્થિતિ" : "Data Pipeline"}</span>
          <ArrowRight size={14} />
        </button>
      )}
    </div>
  );
}
