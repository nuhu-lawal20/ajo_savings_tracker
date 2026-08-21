"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { KycVerificationModal } from "@/components/profile/KycVerificationModal";
import { ArrowRight, Loader2, ShieldAlert } from "lucide-react";

export function JoinCircleButton({
  inviteCode,
  isLoggedIn,
}: {
  inviteCode: string;
  isLoggedIn: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [needsKyc, setNeedsKyc] = useState(false);

  async function handleJoin() {
    if (!isLoggedIn) {
      router.push(`/login?next=/join/${inviteCode}`);
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setNeedsKyc(false);

    try {
      const res = await fetch("/api/circles/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteCode }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setErrorMessage(data.error || "Failed to join circle");
        if (data.requiredTier || data.error?.toLowerCase().includes("kyc")) {
          setNeedsKyc(true);
        }
        return;
      }

      router.push(`/circles/${data.circleId}`);
    } catch (err: any) {
      setLoading(false);
      setErrorMessage(err.message || "An unexpected error occurred");
    }
  }

  return (
    <div className="space-y-3 w-full">
      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-500/30 text-amber-800 dark:text-amber-200 text-xs font-medium space-y-2">
          <div className="flex items-center gap-1.5 font-bold">
            <ShieldAlert className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>Verification Required</span>
          </div>
          <p className="text-[11px] leading-relaxed">{errorMessage}</p>
          {needsKyc && (
            <div className="pt-1">
              <KycVerificationModal
                currentTier={1}
                triggerText="Verify Identity (Unlock Tier 1 & Join)"
                triggerVariant="full-button"
                className="bg-[#0284C7] hover:bg-[#0369A1] text-white"
              />

            </div>
          )}
        </div>
      )}

      {!needsKyc && (
        <Button
          onClick={handleJoin}
          disabled={loading}
          className="w-full h-12 bg-gradient-to-r from-[#0F2744] via-[#0284C7] to-[#38BDF8] hover:from-[#0A1C33] hover:to-[#0284C7] text-white font-black text-sm shadow-md shadow-sky-600/25 rounded-full transition-all hover:scale-[1.01]"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" />
              Joining Circle...
            </>
          ) : (
            <>
              {isLoggedIn ? "Accept Invitation & Join Circle" : "Sign In to Accept Invitation"}
              <ArrowRight className="ml-2 h-4 w-4 text-white" />
            </>
          )}
        </Button>
      )}
    </div>
  );
}

