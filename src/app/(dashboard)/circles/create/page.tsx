"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, CircleDollarSign, Loader2, ShieldCheck, Sparkles } from "lucide-react";

export default function CreateCirclePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number>(10000);
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly">("monthly");
  const [maxMembers, setMaxMembers] = useState<number>(5);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Total cycle payout calculation
  const totalPayoutPerRound = amount * maxMembers;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/circles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          contributionAmount: Number(amount),
          frequency,
          maxMembers: Number(maxMembers),
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setErrorMessage(data.error || "Failed to create savings circle");
        return;
      }

      router.push(`/circles/${data.circle.id}`);
    } catch (err: any) {
      setLoading(false);
      setErrorMessage(err.message || "An unexpected error occurred");
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/circles">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Create a Savings Circle</h1>
          <p className="text-xs text-muted-foreground">
            Set up contribution amount, payout cycle, and generate your invite code
          </p>
        </div>
      </div>

      <Card className="border-border/60 bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Circle Configuration</CardTitle>
          <CardDescription className="text-xs">
            As the circle creator, you are assigned Payout Position #1 by default.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {errorMessage && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 text-xs font-medium">
              {errorMessage}
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
                placeholder="e.g. Lagos Techies Ajo 2026"
                required
                disabled={loading}
                className="h-11"
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
                className="h-11"
              />
            </div>

            {/* Contribution Amount & Max Members */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground" htmlFor="amount">
                  Contribution per Member (₦)
                </label>
                <Input
                  id="amount"
                  type="number"
                  min={1000}
                  step={1000}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  required
                  disabled={loading}
                  className="h-11"
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
                  className="h-11"
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
                    className={`h-11 rounded-lg border text-xs font-bold uppercase transition-colors ${
                      frequency === freq
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                        : "bg-muted/40 border-border text-foreground hover:bg-muted"
                    }`}
                  >
                    {freq}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary Box */}
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 space-y-2 text-xs">
              <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-200">
                <span className="font-semibold flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  Estimated Round Payout:
                </span>
                <span className="text-base font-extrabold">₦{totalPayoutPerRound.toLocaleString()}</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Each round, 1 member receives the pooled ₦{totalPayoutPerRound.toLocaleString()}. Total cycle completes in {maxMembers} {frequency} rounds.
              </p>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={loading || !name}
                className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-600/25"
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
