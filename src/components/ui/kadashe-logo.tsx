import React, { useId } from "react";
import Link from "next/link";

interface KadasheLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  withLink?: boolean;
  href?: string;
  variant?: "auto" | "dark-bg" | "light-bg" | "white";
}

export function KadasheLogo({
  className = "",
  size = "md",
  withLink = false,
  href = "/",
}: KadasheLogoProps) {
  const uniqueId = useId().replace(/:/g, "");
  
  const sizeMap = {
    sm: { height: 28, width: 75 },
    md: { height: 38, width: 102 },
    lg: { height: 50, width: 135 },
    xl: { height: 64, width: 172 },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const topGradId = `kdTopGrad-${uniqueId}`;
  const legGradId = `kdLegGrad-${uniqueId}`;
  const dasheGradId = `kdDasheGrad-${uniqueId}`;

  const logoSvg = (
    <div className={`inline-flex items-center select-none ${className}`}>
      <svg
        width={currentSize.width}
        height={currentSize.height}
        viewBox="0 0 148 68"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        <defs>
          {/* TOP TIER: Vibrant Electric Cyan to Azure Gradient */}
          <linearGradient id={topGradId} x1="0%" y1="0%" x2="100%" y2="60%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="65%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#0369A1" />
          </linearGradient>

          {/* SHARED 'A' EXTENDING LEG: Dynamic Luminous Sweep */}
          <linearGradient id={legGradId} x1="0%" y1="0%" x2="40%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="50%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#60A5FA" />
          </linearGradient>

          {/* BOTTOM TIER: Textured Multi-Tonal Dark Blue with Luminous Cobalt & Ice Highlights */}
          <linearGradient id={dasheGradId} x1="0%" y1="0%" x2="30%" y2="100%">
            <stop offset="0%" stopColor="#BAE6FD" />
            <stop offset="25%" stopColor="#60A5FA" />
            <stop offset="60%" stopColor="#2563EB" />
            <stop offset="85%" stopColor="#1E3A8A" />
            <stop offset="100%" stopColor="#0F2744" />
          </linearGradient>
        </defs>

        {/* TOP TIER: KAD */}
        <g fill={`url(#${topGradId})`}>
          {/* K */}
          <path d="M4 6 H11 V15.5 L19.5 6 H28 L17.5 17.5 L28.5 28 H19.5 L11 19 V28 H4 Z" />
          
          {/* A */}
          <path d="M32 28 L40.5 6 H48.5 L57 28 H50 L48.2 23 H40.8 L39 28 H32 Z M42.2 18 H46.8 L44.5 11 Z" />
          
          {/* D */}
          <path d="M62 6 H72.5 C79 6 83.5 10 83.5 17 C83.5 24 79 28 72.5 28 H62 Z M69 11.5 V22.5 H72.5 C75.5 22.5 77 20.5 77 17 C77 13.5 75.5 11.5 72.5 11.5 Z" />
        </g>

        {/* TOP TIER: SHARED 'A' WITH DYNAMIC EXTENDING LEG */}
        <g>
          {/* A Letterform */}
          <path
            d="M98 28 L106.5 6 H114.5 L123 28 H116.5 L114.8 23 H106.2 L104.5 28 H98 Z M107.8 18 H113.2 L110.5 11 Z"
            fill={`url(#${topGradId})`}
          />
          {/* Elegant Diagonal Leg sweeping down to bottom right */}
          <path
            d="M115 14 L126.5 58"
            stroke={`url(#${legGradId})`}
            strokeWidth="3.2"
            strokeLinecap="round"
          />
        </g>

        {/* BOTTOM TIER: DASHE with Gradient Depth & Texture */}
        <g fill={`url(#${dasheGradId})`}>
          {/* D */}
          <path d="M4 38 H14.5 C21 38 25.5 42 25.5 49 C25.5 56 21 60 14.5 60 H4 Z M11 43.5 V54.5 H14.5 C17.5 54.5 19 52.5 19 49 C19 45.5 17.5 43.5 14.5 43.5 Z" />
          
          {/* A */}
          <path d="M29 60 L37.5 38 H45.5 L54 60 H47 L45.2 55 H37.8 L36 60 H29 Z M39.2 50 H43.8 L41.5 43 Z" />
          
          {/* S */}
          <path d="M57 56.5 L61.5 54.8 C62.2 56.2 63.8 57 66 57 C68.2 57 69.8 56.2 69.8 54.8 C69.8 53.4 68.5 52.6 64.5 51.5 C60 50.3 57.5 48.5 57.5 44.5 C57.5 40.2 61.2 38 66 38 C70.5 38 74 40.2 74.8 44.2 L70.2 45.4 C69.6 43.5 68.2 42.4 66 42.4 C64 42.4 62.5 43.2 62.5 44.4 C62.5 45.6 63.8 46.2 67.5 47.3 C72 48.5 74.8 50.2 74.8 54.5 C74.8 59 71 61.2 66 61.2 C61 61.2 57.5 58.8 57 56.5 Z" />
          
          {/* H */}
          <path d="M78 38 H85 V46.5 H94 V38 H101 V60 H94 V52 H85 V60 H78 Z" />
          
          {/* E */}
          <path d="M105 38 H118 V43.5 H111.5 V46.5 H117 V51.5 H111.5 V54.5 H118.5 V60 H105 Z" />
        </g>
      </svg>
    </div>
  );

  if (withLink) {
    return (
      <Link href={href} className="inline-flex items-center transition-opacity hover:opacity-90">
        {logoSvg}
      </Link>
    );
  }

  return logoSvg;
}
