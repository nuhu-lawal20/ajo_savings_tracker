"use client";

import { useEffect, useRef } from "react";

interface TrustScoreGaugeProps {
  score: number; // 0–100
  size?: number;
}

function getTrustColor(score: number) {
  if (score >= 70) return { stroke: "#059669", label: "Excellent", text: "text-emerald-600 dark:text-emerald-400" };
  if (score >= 40) return { stroke: "#d97706", label: "Moderate", text: "text-amber-600 dark:text-amber-400" };
  return { stroke: "#dc2626", label: "Building", text: "text-red-600 dark:text-red-400" };
}

export function TrustScoreGauge({ score, size = 180 }: TrustScoreGaugeProps) {
  const arcRef = useRef<SVGPathElement>(null);

  const center = size / 2;
  const radius = size * 0.38;
  const strokeW = size * 0.085;

  // Describe a semicircle arc (left to right, bottom up)
  const startAngle = 210; // degrees
  const totalArc = 300;   // degrees sweep
  const endAngle = startAngle + (score / 100) * totalArc;

  function polarToCart(cx: number, cy: number, r: number, deg: number) {
    const rad = ((deg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  function describeArc(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
    const s = polarToCart(cx, cy, r, startDeg);
    const e = polarToCart(cx, cy, r, endDeg);
    const largeArc = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 1 ${e.x} ${e.y}`;
  }

  const trackPath = describeArc(center, center, radius, startAngle, startAngle + totalArc);
  const scorePath = score > 0 ? describeArc(center, center, radius, startAngle, endAngle) : "";
  const { stroke, label, text } = getTrustColor(score);

  // Animate arc draw on mount
  useEffect(() => {
    const el = arcRef.current;
    if (!el || score === 0) return;
    const length = el.getTotalLength();
    el.style.strokeDasharray = `${length}`;
    el.style.strokeDashoffset = `${length}`;
    el.style.transition = "none";
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = "stroke-dashoffset 1.4s cubic-bezier(0.4, 0, 0.2, 1)";
        el.style.strokeDashoffset = "0";
      });
    });
  }, [score]);

  return (
    <div className="flex flex-col items-center gap-3">
      <svg
        width={size}
        height={size * 0.72}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
        aria-label={`Trust Score: ${score} out of 100 — ${label}`}
      >
        {/* Track */}
        <path
          d={trackPath}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeW}
          strokeLinecap="round"
          className="text-muted/40"
        />
        {/* Animated score arc */}
        {scorePath && (
          <path
            ref={arcRef}
            d={scorePath}
            fill="none"
            stroke={stroke}
            strokeWidth={strokeW}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 6px ${stroke}60)` }}
          />
        )}
        {/* Center score number */}
        <text
          x={center}
          y={center + radius * 0.15}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={size * 0.22}
          fontWeight="800"
          fill="currentColor"
          className="fill-foreground"
        >
          {score}
        </text>
        <text
          x={center}
          y={center + radius * 0.52}
          textAnchor="middle"
          fontSize={size * 0.085}
          fill="currentColor"
          className="fill-muted-foreground"
          fontWeight="500"
        >
          / 100
        </text>
      </svg>

      {/* Label */}
      <div className="text-center">
        <p className={`text-sm font-extrabold ${text}`}>{label} Trust</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          {score >= 70
            ? "Qualifies for priority payout positions"
            : score >= 40
            ? "Mid-range payout positions available"
            : "Building reputation — later payout slots assigned"}
        </p>
      </div>
    </div>
  );
}
