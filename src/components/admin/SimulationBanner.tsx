"use client";

import { useRouter } from "next/navigation";
import { Shield, Eye, X, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SimulationBannerProps {
  simulatedUser: {
    id: string;
    full_name: string;
    email: string;
  };
}

export function SimulationBanner({ simulatedUser }: SimulationBannerProps) {
  const router = useRouter();

  async function handleExit() {
    await fetch("/api/admin/simulate", { method: "DELETE" });
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 px-4 py-2 text-xs font-black flex flex-col sm:flex-row items-center justify-between gap-2 shadow-xl sticky top-0 z-50 border-b border-amber-600/30 animate-in slide-in-from-top-2">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="h-5 px-2 rounded-full bg-slate-950 text-amber-300 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
          <Eye className="h-3 w-3" />
          Simulation Mode
        </span>
        <span className="font-extrabold text-slate-900">
          Viewing as: {simulatedUser.full_name} ({simulatedUser.email})
        </span>
        <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-medium text-slate-900/80 bg-amber-600/20 px-2 py-0.5 rounded-md">
          <Lock className="h-2.5 w-2.5" /> Read-Only Preview (Tamper-Proof)
        </span>
      </div>

      <button
        onClick={handleExit}
        className="px-3.5 py-1 bg-slate-950 hover:bg-slate-900 text-amber-300 font-black text-xs rounded-full flex items-center gap-1 shadow-sm transition-all hover:scale-105 shrink-0"
      >
        <span>Exit Simulation</span>
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
