"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyOtpAction, signInWithOtpAction } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KadasheLogo } from "@/components/ui/kadashe-logo";
import { ArrowRight, Loader2, ShieldCheck, KeyRound, RotateCcw, CheckCircle2 } from "lucide-react";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";
  const mode = searchParams.get("mode") || "login";

  const [email, setEmail] = useState(initialEmail);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resendSuccess, setResendSuccess] = useState(false);

  async function handleVerify(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email || !token) {
      setErrorMessage("Please enter both your email address and 6-digit code");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("token", token);
    formData.append("type", "email");

    try {
      const result = await verifyOtpAction(formData);
      setLoading(false);

      if (!result.success) {
        setErrorMessage(result.message || "Invalid or expired token. Please try again.");
        return;
      }

      // Successful verification -> Go to dashboard
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setLoading(false);
      console.error("Verification error:", err);
      setErrorMessage(
        err?.message?.includes("fetch") || err?.name === "TypeError"
          ? "Network connection issue. Please check your internet connection and try again."
          : (err?.message ?? "An unexpected error occurred. Please try again.")
      );
    }
  }

  async function handleResend() {
    if (!email) return;
    setResending(true);
    setErrorMessage(null);
    setResendSuccess(false);

    const formData = new FormData();
    formData.append("email", email);

    try {
      const result = await signInWithOtpAction(formData);
      setResending(false);

      if (!result.success) {
        setErrorMessage(result.message || "Could not resend code. Please try again.");
        return;
      }

      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 5000);
    } catch (err: any) {
      setResending(false);
      console.error("Resend error:", err);
      setErrorMessage(
        err?.message?.includes("fetch") || err?.name === "TypeError"
          ? "Network connection issue. Please check your internet connection and try again."
          : (err?.message ?? "Could not resend code. Please try again later.")
      );
    }
  }

  return (
    <Card className="rounded-3xl bg-[#071322]/95 border border-sky-400/35 shadow-2xl backdrop-blur-xl text-white">
      <CardHeader className="space-y-1 text-center pb-4">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/20 text-sky-300 border border-sky-400/30">
          <KeyRound className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl sm:text-3xl font-black tracking-tight text-white">
          Enter Verification Code
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm text-sky-100/90 font-medium">
          We sent a 6-digit code to <span className="font-bold text-white underline">{email || "your email"}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs font-semibold">
            {errorMessage}
          </div>
        )}

        {resendSuccess && (
          <div className="p-3.5 rounded-2xl bg-sky-950/60 border border-sky-500/40 text-sky-200 text-xs font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-sky-400 shrink-0" />
            <span>A fresh verification code has been dispatched to your email!</span>
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          {!initialEmail && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-sky-200" htmlFor="email">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                disabled={loading}
                className="h-11 bg-sky-950/70 border-sky-500/35 text-white placeholder:text-sky-300/40 focus-visible:ring-sky-400 font-medium rounded-xl"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-sky-200" htmlFor="token">
              6-Digit Security Token
            </label>
            <Input
              id="token"
              name="token"
              type="text"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              value={token}
              onChange={(e) => setToken(e.target.value.replace(/\D/g, ""))}
              placeholder="123456"
              required
              disabled={loading}
              className="h-14 text-center text-2xl sm:text-3xl font-mono tracking-widest bg-sky-950/80 border-sky-500/40 text-white placeholder:text-sky-300/30 focus-visible:ring-sky-400 font-black rounded-xl"
              autoFocus
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={loading || token.length < 6}
              className="w-full h-12 bg-gradient-to-r from-[#0F2744] via-[#0284C7] to-[#38BDF8] hover:from-[#0A1C33] hover:to-[#0284C7] text-white font-black text-sm rounded-full shadow-lg shadow-sky-500/30"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" />
                  Verifying Token...
                </>
              ) : (
                <>
                  Verify & Access Dashboard
                  <ArrowRight className="ml-2 h-4 w-4 text-white" />
                </>
              )}
            </Button>
          </div>
        </form>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-sky-200/90 pt-3 border-t border-sky-500/20">
          <button
            type="button"
            onClick={handleResend}
            disabled={resending || !email}
            className="inline-flex items-center gap-1.5 font-bold text-sky-300 hover:text-white underline-offset-4 hover:underline disabled:opacity-50 transition-colors"
          >
            {resending ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Resending...
              </>
            ) : (
              <>
                <RotateCcw className="h-3.5 w-3.5" />
                Resend code
              </>
            )}
          </button>

          <Link href={mode === "signup" ? "/signup" : "/login"} className="text-sky-300/80 hover:text-white underline-offset-4 hover:underline transition-colors font-medium">
            Use a different email
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function VerifyPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <KadasheLogo withLink size="lg" variant="dark-bg" />
          <p className="text-xs text-sky-300 font-black uppercase tracking-wider">
            Nigerian Smart Rotating Savings (Adashe)
          </p>
        </div>

        <Suspense fallback={<div className="p-8 text-center text-sm text-sky-300">Loading verification screen...</div>}>
          <VerifyContent />
        </Suspense>

        {/* Security badge footer */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-sky-300/90 font-medium">
          <ShieldCheck className="h-4 w-4 text-sky-400" />
          <span>Protected with Automated Vault Security & Anti-Fraud Locks</span>
        </div>
      </div>
    </div>
  );
}
