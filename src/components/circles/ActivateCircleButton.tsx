"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, Play } from "lucide-react";

export function ActivateCircleButton({
  circleId,
  memberCount,
}: {
  circleId: string;
  memberCount: number;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleStart() {
    if (memberCount < 2) {
      alert("At least 2 members are required before starting the rotation.");
      return;
    }

    if (!confirm("Are you ready to activate this circle and begin Round 1 contributions?")) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/circles/${circleId}/start`, {
        method: "PATCH",
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        alert(data.error || "Failed to start circle");
        return;
      }

      router.refresh();
    } catch (err: any) {
      setLoading(false);
      alert(err.message || "An unexpected error occurred");
    }
  }

  return (
    <Button
      onClick={handleStart}
      disabled={loading || memberCount < 2}
      className="bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs shadow-sm shadow-sky-600/25 rounded-full px-4 h-9"
    >
      {loading ? (
        <>
          <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
          Activating...
        </>
      ) : (
        <>
          <Play className="mr-1.5 h-3.5 w-3.5" />
          Activate Circle
        </>
      )}
    </Button>
  );
}
