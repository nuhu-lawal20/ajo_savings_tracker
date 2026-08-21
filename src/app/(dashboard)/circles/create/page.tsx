"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Loader2, Sparkles, ShieldCheck, ShieldAlert } from "lucide-react";
import { KycVerificationModal } from "@/components/profile/KycVerificationModal";

export default function CreateCirclePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [needsKyc, setNeedsKyc] = useState(false);
  const [requiredTier, setRequiredTier] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number>(5000);
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly">("monthly");
  const [maxMembers, setMaxMembers] = useState<number>(5);

  const totalPayoutPerRound = amount * maxMembers;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setNeedsKyc(false);
    setRequiredTier(null);

    try {
      const res = await fetch("/api/circles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          contributionAmount: amount,
          frequency,
          maxMembers,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setErrorMessage(data.error || "Failed to create circle");
        if (data.requiredTier || data.error?.toLowerCase().includes("identity verification") || data.error?.toLowerCase().includes("tier")) {
          setNeedsKyc(true);
          setRequiredTier(data.requiredTier || (data.error?.includes("Tier 2") ? 2 : 1));
        }
        return;
      }

      // Redirect to circle detail
      router.push(`/circles/${data.circle.id}`);
    } catch (err: any) {
      setLoading(false);
      setErrorMessage(err.message || "An unexpected error occurred");
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-[#e1e8f0] dark:border-sky-500/20">
        <Link href="/circles">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-sky-50 dark:hover:bg-sky-500/10">
            <ArrowLeft className="h-4 w-4 text-slate-700 dark:text-slate-200" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Create a New Savings Circle
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Set up an automated Adashe rotation for family, colleagues, or trusted peers.
          </p>
        </div>
      </div>

      <Card className="border-[#e1e8f0] dark:border-sky-500/20 bg-card shadow-sm rounded-3xl overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Circle Configuration</CardTitle>
          <CardDescription className="text-xs">
            Organizing a pool requires verified identity. Tier 1 (BVN/NIN): Max ₦1M pool • Tier 2 (Gov ID & Biometrics): Max ₦10M pool • Tier 3 (CAC): Unlimited.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {errorMessage && (
            <div className="mb-5 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-500/40 text-amber-900 dark:text-amber-200 text-xs font-semibold space-y-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span className="font-bold text-sm">
                  {errorMessage.includes("Segregation of Duties")
                    ? "Administrator Policy Notice"
                    : requiredTier === 3 || errorMessage.includes("Tier 3") || errorMessage.includes("10,000,000")
                    ? "Tier 2 Total Pool Limit Exceeded (Max ₦10M)"
                    : requiredTier === 2 || errorMessage.includes("Tier 2") || errorMessage.includes("1,000,000")
                    ? "Tier 1 Total Pool Limit Exceeded (Max ₦1M)"
                    : "Identity Verification Required"}
                </span>
              </div>
              <p className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-200/90 font-medium">
                {errorMessage}
              </p>
              {errorMessage.includes("Segregation of Duties") ? (
                <div className="pt-1">
                  <Link href="/admin">
                    <Button className="w-full rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs">
                      Return to Admin Console
                    </Button>
                  </Link>
                </div>
              ) : requiredTier === 3 || errorMessage.includes("Tier 3") || errorMessage.includes("10,000,000") ? (
                <div className="pt-1">
                  <KycVerificationModal
                    currentTier={2}
                    triggerText="Verify CAC Document (Unlock Tier 3 - Unlimited)"
                    triggerVariant="full-button"
                    className="bg-[#0284C7] hover:bg-[#0369A1] text-white"
                  />
                </div>
              ) : requiredTier === 2 || errorMessage.includes("Tier 2") || errorMessage.includes("1,000,000") ? (
                <div className="pt-1">
                  <KycVerificationModal
                    currentTier={1}
                    triggerText="Verify Gov ID & Biometrics (Unlock Tier 2 - ₦10M)"
                    triggerVariant="full-button"
                    className="bg-[#0284C7] hover:bg-[#0369A1] text-white"
                  />
                </div>
              ) : (
                <div className="pt-1">
                  <KycVerificationModal
                    currentTier={0}
                    triggerText="Verify BVN / NIN (Unlock Tier 1 - ₦1M)"
                    triggerVariant="full-button"
                    className="bg-[#0284C7] hover:bg-[#0369A1] text-white"
                  />
                </div>
              )}
            </div>
          )}



          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Circle Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground" htmlFor="name">
                Circle Name
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Kaduna Techies Adashe 2026"
                required
                disabled={loading}
                className="h-11 rounded-2xl"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground" htmlFor="desc">
                Description (Optional)
              </label>
              <Input
                id="desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Monthly rent and emergency reserve pool"
                disabled={loading}
                className="h-11 rounded-2xl"
              />
            </div>

            {/* Contribution Amount & Max Members */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground" htmlFor="amount">
                    Contribution per Member (₦)
                  </label>
                  <span className="text-[10px] text-muted-foreground font-medium">
                    Max ₦100k for Tier 1
                  </span>
                </div>
                <Input
                  id="amount"
                  type="number"
                  min={1000}
                  step={1000}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  required
                  disabled={loading}
                  className="h-11 rounded-2xl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground" htmlFor="members">
                  Max Members (2 - 20)
                </label>
                <Input
                  id="members"
                  type="number"
                  min={2}
                  max={20}
                  value={maxMembers}
                  onChange={(e) => setMaxMembers(Number(e.target.value))}
                  required
                  disabled={loading}
                  className="h-11 rounded-2xl"
                />
              </div>
            </div>

            {/* Frequency Selection */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">
                Rotation Frequency
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(["daily", "weekly", "monthly"] as const).map((freq) => (
                  <button
                    key={freq}
                    type="button"
                    onClick={() => setFrequency(freq)}
                    className={`h-11 rounded-2xl border text-xs font-bold uppercase transition-colors ${
                      frequency === freq
                        ? "bg-[#0284C7] text-white border-[#0284C7] shadow-sm"
                        : "bg-muted/40 border-border text-foreground hover:bg-muted"
                    }`}
                  >
                    {freq}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary Box */}
            <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-500/20 space-y-2 text-xs">
              <div className="flex items-center justify-between text-[#0F2744] dark:text-sky-200">
                <span className="font-semibold flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-[#0284C7]" />
                  Estimated Round Payout:
                </span>
                <span className="text-base font-extrabold text-[#0284C7] dark:text-sky-300">₦{totalPayoutPerRound.toLocaleString()}</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Each round, 1 member receives the pooled ₦{totalPayoutPerRound.toLocaleString()}. Total cycle completes in {maxMembers} {frequency} rounds.
              </p>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={loading || !name}
                className="w-full h-12 bg-[#0284C7] hover:bg-[#0369A1] text-white font-semibold text-sm shadow-md shadow-sky-600/25 rounded-full transition-all hover:scale-[1.01]"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Savings Circle...
                  </>
                ) : (
                  <>
                    Create Circle & Generate Invite Link
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
