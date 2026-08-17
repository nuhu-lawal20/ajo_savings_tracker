"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";

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

  async function handleJoin() {
    if (!isLoggedIn) {
      router.push(`/login?next=/join/${inviteCode}`);
      return;
    }

    setLoading(true);
    setErrorMessage(null);

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
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 text-xs font-medium">
          {errorMessage}
        </div>
      )}

      <Button
        onClick={handleJoin}
        disabled={loading}
        className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-600/25"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Joining Circle...
          </>
        ) : (
          <>
            {isLoggedIn ? "Accept Invitation & Join Circle" : "Sign In to Accept Invitation"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
}
