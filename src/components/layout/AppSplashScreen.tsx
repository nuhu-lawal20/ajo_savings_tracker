"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function AppSplashScreen() {
  const [showSplash, setShowSplash] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    let hasShown = false;
    try {
      hasShown = sessionStorage.getItem("kadashe_splash_shown") === "1";
    } catch {
      // Ignore storage restrictions
    }
    
    // Show splash briefly on initial app load / PWA launch
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        setShowSplash(false);
        try {
          sessionStorage.setItem("kadashe_splash_shown", "1");
        } catch {
          // Ignore storage restrictions
        }
      }, 400); // 400ms fade duration
    }, hasShown ? 200 : 900);

    return () => clearTimeout(timer);
  }, []);

  if (!showSplash) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#071322] transition-opacity duration-500 ease-out ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      aria-hidden="true"
    >
      {/* Ambient background glow */}
      <div className="absolute h-80 w-80 rounded-full bg-sky-500/20 blur-[120px] pointer-events-none" />
      <div className="absolute h-80 w-80 rounded-full bg-emerald-500/15 blur-[120px] pointer-events-none translate-y-12" />

      <div className="relative flex flex-col items-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
        {/* KAD A DASHE Logo App Icon */}
        <div className="relative group">
          <div className="absolute -inset-2 rounded-[32px] bg-gradient-to-r from-sky-400 via-emerald-400 to-sky-400 opacity-50 blur-lg animate-pulse" />
          <div className="relative h-28 w-28 sm:h-32 sm:w-32 rounded-[28px] overflow-hidden border border-sky-400/40 shadow-2xl bg-[#071322] flex items-center justify-center p-2.5">
            <Image
              src="/icons/icon-512.png"
              alt="KAD A DASHE App Icon"
              width={128}
              height={128}
              priority
              className="object-contain h-full w-full"
            />
          </div>
        </div>

        {/* Brand Typography */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center justify-center gap-1.5">
            <span>KAD</span>
            <span className="bg-gradient-to-r from-sky-400 via-emerald-400 to-sky-300 bg-clip-text text-transparent">
              ASHE
            </span>
          </h1>
          <p className="text-[11px] sm:text-xs text-sky-200/80 font-medium tracking-wide uppercase">
            Traditional Adashe • Programmatic Trust
          </p>
        </div>

        {/* Sleek Progress Shimmer Line */}
        <div className="w-36 h-1 rounded-full bg-sky-950/80 overflow-hidden border border-sky-500/20">
          <div className="h-full w-full bg-gradient-to-r from-sky-400 via-emerald-400 to-sky-400 animate-[shimmer_1.2s_infinite_linear] rounded-full" />
        </div>
      </div>
    </div>
  );
}
