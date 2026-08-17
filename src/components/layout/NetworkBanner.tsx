"use client";

import { useNetworkStatus } from "@/hooks/use-network-status";
import { WifiOff } from "lucide-react";

export function NetworkBanner() {
  const isOnline = useNetworkStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-center gap-2.5 bg-amber-500 px-4 py-2.5 text-white text-xs font-semibold shadow-lg">
      <WifiOff className="h-4 w-4 shrink-0" />
      <span>You are offline. Data is safe — syncing automatically when you reconnect.</span>
    </div>
  );
}
