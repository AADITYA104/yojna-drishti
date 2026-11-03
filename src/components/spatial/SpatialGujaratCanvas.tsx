"use client";

import React, { useEffect, useRef, useState } from "react";
import { GUJARAT_DISTRICT_POLYGONS } from "@/lib/gujarat-svg-paths";

interface CityNode {
  name: string;
  nameGu: string;
  x: number;
  y: number;
  schemes: number;
}

const HIGHLIGHT_NODES: CityNode[] = [
  { name: "Gandhinagar", nameGu: "ગાંધીનગર", x: 690, y: 235, schemes: 285 },
  { name: "Ahmedabad", nameGu: "અમદાવાદ", x: 635, y: 285, schemes: 240 },
  { name: "Bhavnagar", nameGu: "ભાવનગર", x: 575, y: 470, schemes: 185 },
  { name: "Surat", nameGu: "સુરત", x: 745, y: 525, schemes: 210 },
  { name: "Rajkot", nameGu: "રાજકોટ", x: 425, y: 400, schemes: 195 },
  { name: "Vadodara", nameGu: "વડોદરા", x: 765, y: 400, schemes: 175 },
  { name: "Kutch", nameGu: "કચ્છ", x: 300, y: 190, schemes: 130 },
];

export function SpatialGujaratCanvas({ gu = true }: { gu?: boolean }) {
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const dx = (e.clientX - cx) / cx;
        const dy = (e.clientY - cy) / cy;
        // Max 12px smooth parallax
        setParallax({ x: dx * 12, y: dy * 12 });
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="spatial-bg-canvas" aria-hidden="true">
      {/* 1. Deep atmospheric Slate-Teal canvas */}
      <div className="spatial-slate-teal-mesh" />

      {/* Gujarat Vibrant Heritage Artwork Layer (user's uploaded Gujarat map) */}
      <div className="spatial-art-backdrop" />

      {/* 2. Interactive Gujarat SVG Map Layer with subtle mouse-parallax */}
      <div
        className="spatial-svg-parallax-wrap"
        style={{
          transform: `translate3d(${parallax.x}px, ${parallax.y}px, 0)`,
          transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <svg
          viewBox="20 20 910 680"
          className="spatial-gujarat-svg"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Subtle glow filter for nodes */}
            <filter id="spatial-node-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Soft linear gradient for district subtle fills */}
            <linearGradient id="district-base-fill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.02" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.005" />
            </linearGradient>
          </defs>

          {/* 33/34 District Outlines with clean 1.2px stroke */}
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
          <g className="spatial-network-lines" stroke="rgba(56, 189, 248, 0.14)" strokeWidth="0.8" strokeDasharray="3 4">
            <line x1="690" y1="235" x2="635" y2="285" />
            <line x1="635" y1="285" x2="575" y2="470" />
            <line x1="635" y1="285" x2="765" y2="400" />
            <line x1="765" y1="400" x2="745" y2="525" />
            <line x1="635" y1="285" x2="425" y2="400" />
            <line x1="425" y1="400" x2="300" y2="190" />
            <line x1="425" y1="400" x2="575" y2="470" />
          </g>

          {/* Subtle Glowing Breathing Data Nodes */}
          {HIGHLIGHT_NODES.map((node) => (
            <g key={node.name} transform={`translate(${node.x}, ${node.y})`} className="spatial-node-group">
              {/* Outer pulsing ring with 4s breathing animation */}
              <circle
                r="16"
                fill="none"
                stroke="#38BDF8"
                strokeWidth="1"
                className="spatial-node-pulse-ring"
              />
              {/* Middle soft beacon */}
              <circle
                r="8"
                fill="rgba(56, 189, 248, 0.25)"
                filter="url(#spatial-node-glow)"
              />
              {/* Center solid core */}
              <circle
                r="3.5"
                fill="#ffffff"
              />
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
