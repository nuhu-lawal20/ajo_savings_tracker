"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if already dismissed in this session
    const alreadyDismissed = sessionStorage.getItem("kadashe-install-dismissed");
    if (alreadyDismissed) return;

    // Check if already installed (display-mode: standalone)
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    function handler(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    }

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!visible || dismissed) return null;

  async function handleInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setVisible(false);
    setDeferredPrompt(null);
  }

  function handleDismiss() {
    setDismissed(true);
    setVisible(false);
    sessionStorage.setItem("kadashe-install-dismissed", "true");
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[99] sm:left-auto sm:right-4 sm:w-80 rounded-2xl bg-card border border-border shadow-xl p-4 space-y-3 animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#0F2744] to-[#0284C7] border border-sky-500/30 flex flex-col items-center justify-center font-black leading-none text-white text-[10px] shadow-md shrink-0">
            <span className="text-sky-300 font-extrabold text-[9px]">KADA</span>
            <span className="text-white font-black text-[9px]">DASHE</span>
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">Install Kadashe</p>
            <p className="text-xs text-muted-foreground">Works offline — add to home screen</p>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-muted-foreground hover:text-foreground transition-colors mt-0.5"
          aria-label="Dismiss install prompt"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <Button
        onClick={handleInstall}
        className="w-full bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-semibold gap-1.5 rounded-full h-9"
      >
        <Download className="h-3.5 w-3.5" />
        Add Kadashe to Home Screen
      </Button>
    </div>
  );
}
