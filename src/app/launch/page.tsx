"use client";

/**
 * PWA Launch Gateway Page
 *
 * This is the sole entry-point for the installed PWA (start_url: "/launch").
 * It MUST be a fully static, zero-async client page so Android/iOS WebAPK
 * never receives a failed server response on a cold/slow startup network.
 *
 * Render → paint → THEN redirect client-side, giving the OS time to
 * confirm "the app opened successfully" before any network work happens.
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { KadasheLogo } from "@/components/ui/kadashe-logo";

export default function LaunchPage() {
  const router = useRouter();

  useEffect(() => {
    // Tiny delay so the splash frame is painted first — prevents blank-flash crash
    const timer = setTimeout(() => {
      try {
        router.replace("/dashboard");
      } catch {
        // If router fails for any reason, fallback to hard navigation
        if (typeof window !== "undefined") {
          window.location.replace("/dashboard");
        }
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-[#071322] gap-6 select-none"
      aria-label="Kadashe is loading"
    >
      {/* Logo */}
      <div className="animate-[fade-in_0.5s_ease-out_forwards]">
        <KadasheLogo size="xl" variant="dark-bg" />
      </div>

      {/* Spinner ring */}
      <div className="relative h-10 w-10">
        <div className="absolute inset-0 rounded-full border-2 border-sky-500/20" />
        <div className="absolute inset-0 rounded-full border-t-2 border-sky-400 animate-spin" />
      </div>

      <p className="text-xs text-sky-400/60 font-semibold tracking-widest uppercase">
        Loading…
      </p>
    </div>
  );
}
