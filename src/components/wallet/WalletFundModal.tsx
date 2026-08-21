"use client";

import { useState } from "react";
import { ArrowDownLeft, X, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";

interface WalletFundModalProps {
  onSuccess?: (amount: number) => void;
}

export function WalletFundModal({ onSuccess }: WalletFundModalProps) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const quickAmounts = [1000, 5000, 10000, 25000, 50000, 100000];

  async function verifyPayment(reference: string, numAmount: number) {
    setVerifying(true);
    try {
      const verifyRes = await fetch("/api/wallet/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference }),
      });
      const verifyData = await verifyRes.json();

      if (verifyRes.ok) {
        setSuccessMsg(`₦${numAmount.toLocaleString()} credited to your wallet!`);
        onSuccess?.(numAmount);
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } else {
        setError(verifyData.error || "Payment was declined or cancelled.");
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch {
      window.location.reload();
    } finally {
      setVerifying(false);
      setLoading(false);
    }
  }

  async function handleFund() {
    const numAmount = Number(amount);
    if (!numAmount || numAmount < 500) {
      setError("Minimum top-up is ₦500");
      return;
    }
    if (numAmount > 500000) {
      setError("Maximum top-up is ₦500,000");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
      if (!publicKey) {
        setError("Paystack configuration missing. Please check API keys.");
        setLoading(false);
        return;
      }

      // 1. Create pending ledger transaction on server
      const res = await fetch("/api/wallet/fund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: numAmount }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Failed to initiate payment");
        setLoading(false);
        return;
      }

      // 2. Ensure Paystack inline script is loaded
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
          script.onerror = () => reject(new Error("Failed to load Paystack payment gateway"));
          document.body.appendChild(script);
        });
      };

      await loadScript();

      // 3. Initialize Paystack Popup with standard sync function
      const paystack = (window as any).PaystackPop;
      const handler = paystack.setup({
        key: publicKey,
        email: data.email,
        amount: data.amount, // in kobo
        ref: data.reference,
        currency: "NGN",
        metadata: {
          custom_fields: [
            {
              display_name: "Purpose",
              variable_name: "purpose",
              value: "Kadashe Wallet Top-Up",
            },
            {
              display_name: "Member Name",
              variable_name: "member_name",
              value: data.metadata?.full_name || "Kadashe Member",
            },
          ],
        },
        callback: function (response: any) {
          const ref = response?.reference || data.reference;
          verifyPayment(ref, numAmount);
        },
        onClose: function () {
          setLoading(false);
          // Check if user cancelled or declined
          fetch("/api/wallet/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reference: data.reference }),
          }).finally(() => {
            window.location.reload();
          });
        },
      });

      handler.openIframe();
    } catch (err: any) {
      setError(err?.message || "Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => {
          setOpen(true);
          setError("");
          setSuccessMsg("");
        }}
        className="h-9 px-4 rounded-full bg-white hover:bg-sky-50 text-[#0F2744] font-black text-xs shadow-md transition-all hover:scale-[1.02] flex items-center gap-1.5 cursor-pointer"
      >
        <ArrowDownLeft className="h-3.5 w-3.5" />
        Fund Wallet
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-[#071322] shadow-2xl border border-[#e1e8f0] dark:border-sky-500/20 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#e1e8f0] dark:border-sky-500/20">
              <div>
                <h2 className="text-base font-black text-slate-900 dark:text-white">Fund Wallet</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Secure · Instant · Paystack Escrow</p>
              </div>
              <button
                onClick={() => {
                  if (!loading && !verifying) setOpen(false);
                }}
                disabled={loading || verifying}
                className="h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-sky-950/40 flex items-center justify-center text-muted-foreground transition-colors cursor-pointer disabled:opacity-40"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Quick amount buttons */}
              <div>
                <p className="text-xs font-bold text-muted-foreground mb-2">Quick amounts</p>
                <div className="flex flex-wrap gap-2">
                  {quickAmounts.map((a) => (
                    <button
                      key={a}
                      onClick={() => setAmount(String(a))}
                      className={`h-8 px-3 rounded-full text-xs font-black transition-all cursor-pointer border ${
                        amount === String(a)
                          ? "bg-[#0284C7] text-white border-[#0284C7]"
                          : "bg-[#f4f7fb] dark:bg-sky-950/40 text-slate-700 dark:text-sky-200 border-[#e1e8f0] dark:border-sky-500/20 hover:border-[#0284C7]"
                      }`}
                    >
                      ₦{a.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom amount */}
              <div>
                <p className="text-xs font-bold text-muted-foreground mb-1.5">Or enter custom amount</p>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-slate-500">₦</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      setError("");
                    }}
                    placeholder="0.00"
                    min="500"
                    max="500000"
                    className="w-full h-12 pl-8 pr-4 rounded-2xl border border-[#e1e8f0] dark:border-sky-500/30 bg-white dark:bg-sky-950/30 text-sm font-black text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0284C7]/50"
                  />
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">Min ₦500 · Max ₦500,000</p>
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 p-3">
                  <AlertCircle className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                  <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">{error}</p>
                </div>
              )}

              {successMsg && (
                <div className="flex items-center gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 p-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <p className="text-xs font-black text-emerald-700 dark:text-emerald-300">{successMsg}</p>
                </div>
              )}

              <button
                onClick={handleFund}
                disabled={loading || verifying || !amount}
                className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#0F2744] to-[#0284C7] hover:from-[#0284C7] hover:to-[#38BDF8] text-white font-black text-sm shadow-md transition-all hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
              >
                {verifying ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>Settling Wallet Balance…</span>
                  </>
                ) : loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>Opening Paystack Escrow…</span>
                  </>
                ) : (
                  `Fund ₦${Number(amount || 0).toLocaleString()}`
                )}
              </button>

              <p className="text-[11px] text-muted-foreground text-center">
                100% Secure via Paystack • Test mode active
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
