"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyOtpAction, signInWithOtpAction } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CheckCircle2, KeyRound, Loader2, RotateCcw } from "lucide-react";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") ?? "";
  const mode = searchParams.get("mode") ?? "login";

  const [email, setEmail] = useState(initialEmail);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleVerify(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("token", token);

    try {
      const result = await verifyOtpAction(formData);
      setLoading(false);

      if (!result.success) {
        setErrorMessage(result.message ?? "Verification failed. Please try again.");
        return;
      }

      // Success -> redirect to Dashboard
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setLoading(false);
      console.error("Verification error:", err);
      setErrorMessage(
        err?.message?.includes("fetch") || err?.name === "TypeError"
          ? "Network connection issue. Please check your internet connection and try again."
          : (err?.message ?? "An unexpected error occurred during verification.")
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
        setErrorMessage(result.message ?? "Could not resend code. Please try again later.");
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
    <Card className="glass-vault border-border/40 shadow-xl">
      <CardHeader className="space-y-1 text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <KeyRound className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">Enter Verification Code</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          We sent a 6-digit code to <span className="font-semibold text-foreground">{email || "your email"}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 text-xs font-medium">
            {errorMessage}
          </div>
        )}

        {resendSuccess && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-300 text-xs font-medium flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4" />
            <span>A fresh verification code has been dispatched to your email!</span>
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          {!initialEmail && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground" htmlFor="email">
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
                className="h-11 border-border focus-visible:ring-emerald-500"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground" htmlFor="token">
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
              className="h-14 text-center text-2xl font-mono tracking-widest border-border focus-visible:ring-emerald-500"
              autoFocus
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={loading || token.length < 6}
              className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-md shadow-emerald-600/25"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying Token...
                </>
              ) : (
                <>
                  Verify & Access Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground pt-3 border-t border-border">
          <button
            type="button"
            onClick={handleResend}
            disabled={resending || !email}
            className="inline-flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400 hover:underline disabled:opacity-50"
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

          <Link href={mode === "signup" ? "/signup" : "/login"} className="hover:underline">
            Use a different email
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function VerifyPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-background">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-2xl shadow-md shadow-emerald-600/25">
              A
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-foreground">Alajo</span>
          </Link>
        </div>

        <Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground">Loading verification screen...</div>}>
          <VerifyContent />
        </Suspense>
      </div>
    </div>
  );
}
