"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { KadasheLogo } from "@/components/ui/kadashe-logo";
import { Button } from "@/components/ui/button";
import { WifiOff, RefreshCw, ArrowLeft, ShieldCheck, Database } from "lucide-react";
import { getOfflineCircles, type LocalCircle } from "@/lib/local-db";

export default function OfflinePage() {
  const [isRetrying, setIsRetrying] = useState(false);
  const [cachedCircles, setCachedCircles] = useState<LocalCircle[]>([]);
  const [isCheckingDB, setIsCheckingDB] = useState(true);

  useEffect(() => {
    async function loadCached() {
      try {
        const circles = await getOfflineCircles();
        setCachedCircles(circles || []);
      } catch (err) {
        console.warn("Could not read offline circles from Dexie:", err);
      } finally {
        setIsCheckingDB(false);
      }
    }
    loadCached();
  }, []);

  function handleRetry() {
    setIsRetrying(true);
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  }

  return (
    <div className="min-h-screen bg-[#071322] text-white flex flex-col justify-between p-4 sm:p-8 select-none">
      {/* Header */}
      <header className="flex items-center justify-between max-w-lg mx-auto w-full pt-4">
        <KadasheLogo size="md" variant="dark-bg" />
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[11px] font-black">
          <WifiOff className="h-3.5 w-3.5" />
          <span>Offline Mode</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto w-full py-8 text-center space-y-6">
        {/* Offline Glowing Icon Box */}
        <div className="relative inline-block mx-auto">
          <div className="absolute -inset-2 bg-amber-500/20 rounded-full blur-xl animate-pulse" />
          <div className="relative h-20 w-20 rounded-2xl bg-gradient-to-br from-[#0F2744] to-[#035388] border border-amber-400/40 flex items-center justify-center shadow-xl mx-auto">
            <WifiOff className="h-9 w-9 text-amber-400" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black tracking-tight text-white">
            No Internet Connection
          </h1>
          <p className="text-xs sm:text-sm text-sky-200/80 leading-relaxed font-medium">
            Kadashe is running in offline mode. Your offline data and queued actions are safely preserved on your device.
          </p>
        </div>

        {/* Offline Actions */}
        <div className="space-y-3 pt-2">
          <Button
            onClick={handleRetry}
            disabled={isRetrying}
            className="w-full h-11 bg-gradient-to-r from-[#0F2744] via-[#0284C7] to-[#38BDF8] hover:from-[#0A1C33] hover:to-[#0284C7] text-white font-black text-xs shadow-lg shadow-sky-500/30 rounded-full flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${isRetrying ? "animate-spin" : ""}`} />
            <span>{isRetrying ? "Checking Connection..." : "Retry Connection"}</span>
          </Button>

          <Link href="/dashboard" className="block">
            <Button
              variant="outline"
              className="w-full h-11 border-sky-500/30 bg-sky-950/40 hover:bg-sky-900/50 text-sky-200 hover:text-white font-bold text-xs rounded-full flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Go to Cached Dashboard</span>
            </Button>
          </Link>
        </div>

        {/* Cached Data Snapshot */}
        {cachedCircles.length > 0 && (
          <div className="p-4 rounded-2xl bg-sky-950/50 border border-sky-400/20 text-left space-y-2.5">
            <div className="flex items-center gap-1.5 text-sky-300 text-xs font-black">
              <Database className="h-3.5 w-3.5" />
              <span>Cached Circles on Device ({cachedCircles.length})</span>
            </div>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {cachedCircles.map((circle) => (
                <div
                  key={circle.id}
                  className="p-2 rounded-xl bg-[#071322] border border-sky-500/20 flex items-center justify-between text-xs"
                >
                  <span className="font-bold text-white truncate">{circle.name}</span>
                  <span className="text-sky-300 font-semibold text-[11px] shrink-0 ml-2">
                    ₦{circle.contribution_amount?.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Offline Safety Assurance */}
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-400/30 flex items-center gap-3 text-left">
          <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
          <p className="text-[11px] text-emerald-200/90 font-medium">
            <strong>Zero Data Loss:</strong> Contributions and circle actions taken offline will automatically synchronize the moment you reconnect.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-[10px] text-sky-200/50 pb-2">
        Kadashe Offline-First PWA • Version 1.1.0
      </footer>
    </div>
  );
}
