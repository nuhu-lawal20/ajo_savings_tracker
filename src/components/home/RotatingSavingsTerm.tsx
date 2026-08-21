"use client";

import { useEffect, useState } from "react";

interface TermItem {
  word: string;
  language: string;
}

const TERMS: TermItem[] = [
  { word: "Adashe", language: "Hausa" },
  { word: "Ajo", language: "Yoruba" },
  { word: "Esusu", language: "Igbo" },
  { word: "Savings", language: "English" },
];

export function RotatingSavingsTerm() {
  const [index, setIndex] = useState(0);
  const [flipState, setFlipState] = useState<"idle" | "flipping">("idle");

  useEffect(() => {
    const timer = setInterval(() => {
      setFlipState("flipping");

      setTimeout(() => {
        setIndex((prev) => (prev + 1) % TERMS.length);
        setFlipState("idle");
      }, 220);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const current = TERMS[index];

  return (
    <div className="inline-flex items-center gap-1.5 sm:gap-2.5 pl-1.5 sm:pl-2.5 align-middle select-none">
      {/* Digital Flip Container */}
      <span
        className="inline-block relative overflow-hidden"
        style={{ perspective: "800px" }}
      >
        <span
          className={`inline-block text-white font-black transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            flipState === "flipping"
              ? "opacity-0 -translate-y-4 rotate-x-90 scale-95"
              : "opacity-100 translate-y-0 rotate-x-0 scale-100"
          }`}
          style={{
            transformStyle: "preserve-3d",
            willChange: "transform, opacity",
          }}
        >
          {current.word}
        </span>
      </span>

      {/* Language Micro-Badge */}
      <span
        className={`inline-flex items-center self-center text-[8px] sm:text-[9px] font-black uppercase tracking-widest px-1.5 sm:px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-300 border border-sky-400/30 shadow-xs backdrop-blur-md transition-all duration-200 shrink-0 ${
          flipState === "flipping" ? "opacity-30 scale-95" : "opacity-100 scale-100"
        }`}
      >
        {current.language}
      </span>
    </div>
  );
}
