"use client";

import { useState } from "react";
import { ArrowUpRight, X, AlertCircle, ShieldCheck, KeyRound, Loader2, CheckCircle2 } from "lucide-react";

interface WithdrawModalProps {
  availableBalance: number;
  bankAccountName: string;
  bankAccountNumber: string;
}

export function WithdrawModal({ availableBalance, bankAccountName, bankAccountNumber }: WithdrawModalProps) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // OTP step state
  const [step, setStep] = useState<"amount" | "otp">("amount");
  const [otp, setOtp] = useState("");
  const [transferCode, setTransferCode] = useState("");
  const [transferReference, setTransferReference] = useState("");

  async function handleWithdraw() {
    const numAmount = Number(amount);
    if (!numAmount || numAmount < 500) {
      setError("Minimum withdrawal is ₦500");
      return;
    }
    if (numAmount > availableBalance) {
      setError(`Insufficient balance. Available: ₦${availableBalance.toLocaleString()}`);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/wallet/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: numAmount }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Withdrawal failed. Please try again.");
        setLoading(false);
        return;
      }

      // Check if Paystack requires OTP (Transfer 2FA)
      if (data.requires_otp) {
        setTransferCode(data.transfer_code || "");
        setTransferReference(data.reference || "");
        setStep("otp");
        setLoading(false);
        return;
      }

      setSuccess(data.message || "Withdrawal successful!");
      setTimeout(() => {
        setOpen(false);
        window.location.reload();
      }, 1500);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  async function handleFinalizeOtp() {
    if (!otp || otp.trim().length < 4) {
      setError("Please enter the verification code sent to your phone");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/wallet/withdraw/finalize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transfer_code: transferCode,
          reference: transferReference,
          otp: otp.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid OTP code. Please check and try again.");
        setLoading(false);
        return;
      }

      setSuccess(data.message || "Withdrawal verified and settled!");
      setTimeout(() => {
        setOpen(false);
        window.location.reload();
      }, 1500);
    } catch {
      setError("Network error finalizing transfer.");
      setLoading(false);
    }
  }

  function resetModal() {
    setOpen(false);
    setStep("amount");
    setAmount("");
    setOtp("");
    setError("");
    setSuccess("");
    setLoading(false);
  }

  const maskedAccount = `•••• •••• ${bankAccountNumber.slice(-4)}`;

  return (
    <>
      <button
        onClick={() => {
          setOpen(true);
          setStep("amount");
          setError("");
          setSuccess("");
        }}
        className="h-9 px-4 rounded-full bg-white/15 hover:bg-white/25 text-white font-black text-xs border border-white/30 transition-all flex items-center gap-1.5 cursor-pointer"
      >
        <ArrowUpRight className="h-3.5 w-3.5" />
        Withdraw
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-[#071322] shadow-2xl border border-[#e1e8f0] dark:border-sky-500/20 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#e1e8f0] dark:border-sky-500/20">
              <div>
                <h2 className="text-base font-black text-slate-900 dark:text-white">
                  {step === "otp" ? "Authorize Withdrawal" : "Withdraw to Bank"}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {step === "otp" ? "Enter Paystack SMS verification code" : "Instant Paystack NIP Transfer"}
                </p>
              </div>
              <button
                onClick={resetModal}
                disabled={loading}
                className="h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-sky-950/40 flex items-center justify-center text-muted-foreground transition-colors cursor-pointer disabled:opacity-40"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* STEP 1: AMOUNT INPUT */}
              {step === "amount" && (
                <>
                  {/* Destination bank */}
                  <div className="p-3.5 rounded-2xl bg-[#f4f7fb] dark:bg-sky-950/30 border border-[#e1e8f0] dark:border-sky-500/20 space-y-1">
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Destination Account</p>
                    <p className="text-sm font-black text-slate-900 dark:text-white">{bankAccountName}</p>
                    <p className="text-xs text-muted-foreground">{maskedAccount}</p>
                  </div>

                  {/* Available balance */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground font-semibold">Available Balance</span>
                    <span className="font-black text-slate-900 dark:text-white">₦{availableBalance.toLocaleString()}</span>
                  </div>

                  {/* Amount input */}
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-slate-500">₦</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => { setAmount(e.target.value); setError(""); }}
                      placeholder="0.00"
                      min="500"
                      max={availableBalance}
                      className="w-full h-12 pl-8 pr-4 rounded-2xl border border-[#e1e8f0] dark:border-sky-500/30 bg-white dark:bg-sky-950/30 text-sm font-black text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0284C7]/50"
                    />
                  </div>

                  <button
                    onClick={() => setAmount(String(availableBalance))}
                    className="text-xs font-bold text-[#0284C7] hover:underline cursor-pointer"
                  >
                    Withdraw all (₦{availableBalance.toLocaleString()})
                  </button>

                  {error && (
                    <div className="flex items-center gap-2 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 p-3">
                      <AlertCircle className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                      <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">{error}</p>
                    </div>
                  )}

                  {success && (
                    <div className="flex items-center gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 p-3">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{success}</p>
                    </div>
                  )}

                  <button
                    onClick={handleWithdraw}
                    disabled={loading || !amount || !!success}
                    className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#0F2744] to-[#0284C7] hover:from-[#0284C7] hover:to-[#38BDF8] text-white font-black text-sm shadow-md transition-all hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                        <span>Initiating Transfer…</span>
                      </>
                    ) : success ? (
                      "✓ Withdrawal Initiated"
                    ) : (
                      `Withdraw ₦${Number(amount || 0).toLocaleString()}`
                    )}
                  </button>
                </>
              )}

              {/* STEP 2: PAYSTACK TRANSFER OTP INPUT */}
              {step === "otp" && (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-500/30 text-xs space-y-1">
                    <p className="font-bold text-[#0F2744] dark:text-sky-300 flex items-center gap-1.5">
                      <KeyRound className="h-4 w-4 text-[#0284C7]" />
                      Paystack 2FA Verification
                    </p>
                    <p className="text-muted-foreground text-[11px]">
                      Enter the authorization code sent via SMS to your phone to release ₦{Number(amount).toLocaleString()} to {bankAccountName}.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Authorization Code (OTP)
                    </label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => { setOtp(e.target.value); setError(""); }}
                      placeholder="e.g. 054293"
                      maxLength={8}
                      className="w-full h-12 px-4 rounded-2xl border border-[#e1e8f0] dark:border-sky-500/30 bg-white dark:bg-sky-950/30 text-base font-mono font-bold tracking-widest text-center text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0284C7]/50"
                    />
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 p-3">
                      <AlertCircle className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                      <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">{error}</p>
                    </div>
                  )}

                  {success && (
                    <div className="flex items-center gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 p-3">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{success}</p>
                    </div>
                  )}

                  <button
                    onClick={handleFinalizeOtp}
                    disabled={loading || !otp || !!success}
                    className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#0F2744] to-[#0284C7] hover:from-[#0284C7] hover:to-[#38BDF8] text-white font-black text-sm shadow-md transition-all hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                        <span>Authorizing Transfer…</span>
                      </>
                    ) : success ? (
                      "✓ Transfer Authorized"
                    ) : (
                      "Authorize & Finalize Transfer"
                    )}
                  </button>

                  <button
                    onClick={() => setStep("amount")}
                    disabled={loading}
                    className="w-full text-center text-xs font-bold text-muted-foreground hover:text-slate-900 dark:hover:text-white"
                  >
                    ← Change Amount
                  </button>
                </div>
              )}

              <p className="text-[11px] text-muted-foreground text-center">
                <ShieldCheck className="inline h-3 w-3 mr-1 text-sky-500" />
                Protected by 2-Factor Authentication
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
