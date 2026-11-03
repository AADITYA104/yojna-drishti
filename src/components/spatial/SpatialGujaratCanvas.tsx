import React from "react";
import { GUJARAT_DISTRICT_POLYGONS } from "@/lib/gujarat-svg-paths";

interface CityNode {
  name: string;
  nameGu: string;
  x: number;
  y: number;
}

const HIGHLIGHT_NODES: CityNode[] = [
  { name: "Gandhinagar", nameGu: "ગાંધીનગર", x: 690, y: 235 },
  { name: "Ahmedabad", nameGu: "અમદાવાદ", x: 635, y: 285 },
  { name: "Bhavnagar", nameGu: "ભાવનગર", x: 575, y: 470 },
  { name: "Surat", nameGu: "સુરત", x: 745, y: 525 },
  { name: "Rajkot", nameGu: "રાજકોટ", x: 425, y: 400 },
  { name: "Vadodara", nameGu: "વડોદરા", x: 765, y: 400 },
  { name: "Kutch", nameGu: "કચ્છ", x: 300, y: 190 },
];

export function SpatialGujaratCanvas({ gu = true }: { gu?: boolean }) {
  return (
    <div className="spatial-bg-canvas" aria-hidden="true">
      {/* 1. Deep atmospheric Slate-Teal canvas */}
      <div className="spatial-slate-teal-mesh" />

      {/* Subdued Gujarat watermark artwork */}
      <div className="spatial-art-backdrop" />

      {/* Static map watermark; interactive map controls live in the map view. */}
      <div className="spatial-svg-parallax-wrap">
        <svg
          viewBox="20 20 910 680"
          className="spatial-gujarat-svg"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <radialGradient id="district-base-fill" cx="50%" cy="45%" r="65%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.035" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.005" />
            </radialGradient>
          </defs>

          {/* District outlines */}
          <g className="spatial-districts-group">
            {GUJARAT_DISTRICT_POLYGONS.map((district) => (
              <path
                key={district.name}
                d={district.path}
                className="spatial-district-vector"
                fill="url(#district-base-fill)"
                stroke="rgba(255, 255, 255, 0.12)"
                strokeWidth="1.2"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            ))}
          </g>

          {/* Connective Data Mesh (Subtle Lines between key centres) */}
          <g className="spatial-network-lines" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.8" strokeDasharray="3 4">
            <line x1="690" y1="235" x2="635" y2="285" />
            <line x1="635" y1="285" x2="575" y2="470" />
            <line x1="635" y1="285" x2="765" y2="400" />
            <line x1="765" y1="400" x2="745" y2="525" />
            <line x1="635" y1="285" x2="425" y2="400" />
            <line x1="425" y1="400" x2="300" y2="190" />
            <line x1="425" y1="400" x2="575" y2="470" />
          </g>

          {/* Static location labels */}
          {HIGHLIGHT_NODES.map((node) => (
            <g key={node.name} transform={`translate(${node.x}, ${node.y})`} className="spatial-node-group">
              <circle r="5" fill="rgba(255, 255, 255, 0.16)" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
              <circle r="2" fill="rgba(255, 255, 255, 0.72)" />
              {/* Node City Label */}
              <text
                x="12"
                y="4"
                fill="rgba(255, 255, 255, 0.75)"
                fontSize="11"
                fontFamily="inherit"
                fontWeight="600"
                letterSpacing="0.03em"
                className="spatial-node-label"
              >
                {gu ? node.nameGu : node.name}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Atmospheric depth vignette & spatial lighting */}
      <div className="spatial-vignette-overlay" />
    </div>
  );
}
