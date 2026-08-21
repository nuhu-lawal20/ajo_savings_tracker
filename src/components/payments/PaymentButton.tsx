"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  Wallet,
  ShieldCheck,
  Loader2,
  X,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function PaymentButton({
  circleId,
  amount,
  email,
  circleName,
  membershipId,
  roundNumber = 1,
}: {
  circleId: string;
  amount: number;
  email: string;
  circleName: string;
  membershipId?: string;
  roundNumber?: number;
}) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [walletLoading, setWalletLoading] = useState(false);
  const [availableBalance, setAvailableBalance] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Fetch available wallet balance when modal opens
  useEffect(() => {
    if (modalOpen) {
      setError(null);
      setSuccessMsg(null);
      fetch("/api/wallet/withdraw")
        .then((res) => res.json())
        .then((data) => {
          if (typeof data.available_balance === "number") {
            setAvailableBalance(data.available_balance);
          }
        })
        .catch(() => setAvailableBalance(0));
    }
  }, [modalOpen]);

  // Handle Pay from Wallet Balance
  async function handlePayFromWallet() {
    if (availableBalance === null || availableBalance < amount) {
      setError(`Insufficient wallet balance (₦${(availableBalance ?? 0).toLocaleString()}). Top up or pay with Paystack.`);
      return;
    }

    setWalletLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/contributions/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          circle_id: circleId,
          amount,
          round_number: roundNumber,
          membership_id: membershipId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Wallet payment failed. Please try again.");
        setWalletLoading(false);
        return;
      }

      setSuccessMsg(data.message || "Contribution paid successfully from wallet!");
      setTimeout(() => {
        setModalOpen(false);
        window.location.reload();
      }, 1500);
    } catch {
      setError("Network error processing wallet payment.");
      setWalletLoading(false);
    }
  }

  // Handle Pay via Paystack Gateway
  async function handlePayViaPaystack() {
    setLoading(true);
    setError(null);

    try {
      // 1. Create pending transaction on backend to generate secure reference
      const res = await fetch("/api/contributions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          circleId,
          amount,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to initialize payment gateway");
        setLoading(false);
        return;
      }

      const { reference } = data;
      const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

      if (!publicKey) {
        setError("Payment gateway configuration error.");
        setLoading(false);
        return;
      }

      // Check if PaystackPop is loaded
      const loadScript = () => {
        return new Promise<void>((resolve, reject) => {
          if ((window as any).PaystackPop) {
            resolve();
            return;
          }
          const script = document.createElement("script");
          script.src = "https://js.paystack.co/v1/inline.js";
          script.async = true;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Failed to load secure payment gateway"));
          document.body.appendChild(script);
        });
      };

      await loadScript();

      const handler = (window as any).PaystackPop.setup({
        key: publicKey,
        email: email,
        amount: amount * 100, // In kobo
        currency: "NGN",
        ref: reference,
        metadata: {
          custom_fields: [
            {
              display_name: "Circle Name",
              variable_name: "circle_name",
              value: circleName,
            },
          ],
        },
        callback: function () {
          fetch("/api/contributions/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reference }),
          }).finally(() => {
            setLoading(false);
            setModalOpen(false);
            window.location.reload();
          });
        },
        onClose: function () {
          setLoading(false);
          if (reference) {
            fetch("/api/contributions/cancel", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ reference }),
            }).catch(() => {});
          }
        },
      });

      handler.openIframe();
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "An unexpected error occurred during checkout");
    }
  }

  const hasSufficientWalletBalance = (availableBalance ?? 0) >= amount;

  return (
    <>
      <Button
        onClick={() => setModalOpen(true)}
        className="bg-gradient-to-r from-[#0F2744] to-[#0284C7] hover:from-[#0284C7] hover:to-[#38BDF8] text-white font-black text-xs shadow-md shadow-sky-600/25 rounded-full px-5 h-10 transition-all hover:scale-105 cursor-pointer"
      >
        <CreditCard className="mr-1.5 h-4 w-4 text-sky-300" />
        Pay ₦{amount.toLocaleString()}
      </Button>

      {/* ── PAYMENT METHOD CHOOSER MODAL ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#071322] shadow-2xl border border-[#e1e8f0] dark:border-sky-500/20 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-[#e1e8f0] dark:border-sky-500/20">
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-[#0284C7]" />
                  Choose Payment Source
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Contributing ₦{amount.toLocaleString()} to {circleName} (Round #{roundNumber})
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                disabled={loading || walletLoading}
                className="h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-sky-950/40 flex items-center justify-center text-muted-foreground transition-colors cursor-pointer disabled:opacity-40"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-4">
              {error && (
                <div className="flex items-center gap-2 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 p-3.5 text-xs text-rose-600 dark:text-rose-400 font-semibold">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {successMsg && (
                <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 p-3.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* ── OPTION 1: KADASHE WALLET BALANCE ── */}
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  hasSufficientWalletBalance
                    ? "bg-sky-50/70 dark:bg-sky-950/30 border-sky-300 dark:border-sky-500/40 shadow-xs"
                    : "bg-slate-50 dark:bg-sky-950/10 border-slate-200 dark:border-sky-500/15 opacity-85"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-[#0284C7] text-white flex items-center justify-center shrink-0">
                      <Wallet className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-black text-slate-900 dark:text-white">
                          Kadashe Wallet Balance
                        </p>
                        <Badge className="bg-sky-500/20 text-[#0284C7] dark:text-sky-300 border-0 text-[9px] font-black px-1.5 py-0">
                          Instant • 0 Fee
                        </Badge>
                      </div>
                      <p className="text-xs font-bold text-slate-700 dark:text-sky-200 mt-0.5">
                        Available:{" "}
                        <span className="text-[#0284C7] dark:text-sky-400 font-black">
                          {availableBalance !== null
                            ? `₦${availableBalance.toLocaleString()}`
                            : "Loading balance..."}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-sky-200/60 dark:border-sky-500/20 flex items-center justify-between">
                  {hasSufficientWalletBalance ? (
                    <Button
                      onClick={handlePayFromWallet}
                      disabled={walletLoading || loading || !!successMsg}
                      className="w-full h-10 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-black text-xs shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {walletLoading ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          <span>Debiting Wallet…</span>
                        </>
                      ) : (
                        <>
                          <span>Pay ₦{amount.toLocaleString()} from Wallet</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </>
                      )}
                    </Button>
                  ) : (
                    <div className="w-full flex items-center justify-between text-xs text-muted-foreground">
                      <span>Insufficient wallet funds</span>
                      <a
                        href="/wallet"
                        className="text-xs font-bold text-[#0284C7] hover:underline"
                      >
                        Top up wallet →
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* ── OPTION 2: PAYSTACK GATEWAY (Card, Transfer, USSD) ── */}
              <div className="p-4 rounded-2xl bg-white dark:bg-sky-950/20 border border-[#e1e8f0] dark:border-sky-500/20 hover:border-[#0284C7] transition-all space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-sky-950/40 text-slate-700 dark:text-sky-300 flex items-center justify-center shrink-0">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-900 dark:text-white">
                      Pay with Bank Card or Direct Transfer
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Secured by Paystack (Mastercard, Visa, Verve, NIP Bank Transfer)
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handlePayViaPaystack}
                  disabled={loading || walletLoading || !!successMsg}
                  variant="outline"
                  className="w-full h-10 rounded-xl border-[#0F2744] dark:border-sky-500/40 text-slate-900 dark:text-white font-black text-xs hover:bg-slate-50 dark:hover:bg-sky-950/40 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Opening Gateway…</span>
                    </>
                  ) : (
                    <>
                      <span>Pay ₦{amount.toLocaleString()} via Paystack</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </Button>
              </div>

              <p className="text-[11px] text-muted-foreground text-center font-medium pt-1">
                <ShieldCheck className="inline h-3 w-3 mr-1 text-[#0284C7]" />
                Zero-custody automated escrow · Instant cryptographic receipt
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
