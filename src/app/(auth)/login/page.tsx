"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithOtpAction, signInWithPasswordAction } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KadasheLogo } from "@/components/ui/kadashe-logo";
import {
  ArrowRight,
  Loader2,
  ShieldCheck,
  Mail,
  Lock,
  Sparkles,
  Shield,
  User,
  CheckCircle2,
  KeyRound,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<"password" | "otp">("password");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  // Quick fill helper for Evaluators & Supervisors
  function handleQuickFill(email: string, pass: string) {
    setEmailInput(email);
    setPasswordInput(pass);
    setAuthMode("password");
    setErrorMessage(null);
  }

  async function handlePasswordSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setFieldErrors({});

    const formData = new FormData();
    formData.append("email", emailInput);
    formData.append("password", passwordInput);

    try {
      const result = await signInWithPasswordAction(formData);
      setLoading(false);

      if (!result.success) {
        setErrorMessage(result.message || "Invalid credentials.");
        return;
      }

      // Check if helper admin or regular member and redirect
      if (emailInput.includes("moderator")) {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    } catch (err: any) {
      setLoading(false);
      setErrorMessage(err?.message || "Failed to sign in. Please check your credentials.");
    }
  }

  async function handleOtpSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setFieldErrors({});

    const formData = new FormData();
    formData.append("email", emailInput);

    try {
      const result = await signInWithOtpAction(formData);
      setLoading(false);

      if (!result.success) {
        if (result.errors) {
          setFieldErrors(result.errors);
        }
        if (result.message) {
          setErrorMessage(result.message);
        }
        return;
      }

      router.push(`/verify?email=${encodeURIComponent(emailInput)}&mode=login`);
    } catch (err: any) {
      setLoading(false);
      setErrorMessage(err?.message || "An unexpected error occurred.");
    }
  }

  const isNoAccountError =
    errorMessage?.toLowerCase().includes("no registered account") ||
    errorMessage?.toLowerCase().includes("no account found");

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-10">
      <div className="w-full max-w-md space-y-5">
        {/* Brand Logo Header */}
        <div className="flex flex-col items-center text-center space-y-1.5">
          <KadasheLogo withLink size="lg" variant="dark-bg" />
          <p className="text-xs text-sky-300 font-black uppercase tracking-wider">
            Traditional Adashe. Programmatic Trust.
          </p>
        </div>

        {/* 3MTT Supervisor & Evaluator Fast-Pass Card */}
        <div className="p-4 rounded-3xl bg-[#071322]/90 border border-amber-500/40 shadow-xl text-white space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-amber-400" />
                3MTT Capstone Evaluator Access
              </Badge>
            </div>
            <span className="text-[10px] text-amber-200/80 font-bold">1-Click Login</span>
          </div>

          <p className="text-[11px] text-amber-100/90 leading-relaxed font-medium">
            Pre-seeded test accounts with confirmed KYC and live savings circles for supervisor evaluation:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
            {/* 1. Helper Admin */}
            <button
              type="button"
              onClick={() => handleQuickFill("moderator1@kadashe.ng", "KadasheAdmin2026!")}
              className="p-2.5 rounded-2xl bg-sky-950/80 hover:bg-sky-900 border border-sky-500/30 text-left transition-all group"
            >
              <div className="flex items-center gap-1 text-[11px] font-black text-sky-300 group-hover:text-white">
                <Shield className="h-3 w-3 text-sky-400" />
                Helper Admin 1
              </div>
              <p className="text-[10px] text-muted-foreground truncate">moderator1@kadashe.ng</p>
              <span className="inline-block mt-1 text-[9px] px-1.5 py-0.2 rounded-md bg-sky-500/20 text-sky-300 font-bold">Admin Console</span>
            </button>

            {/* 2. Amina (Organizer) */}
            <button
              type="button"
              onClick={() => handleQuickFill("amina@kadashe.ng", "KadasheTest2026!")}
              className="p-2.5 rounded-2xl bg-emerald-950/40 hover:bg-emerald-950/80 border border-emerald-500/30 text-left transition-all group"
            >
              <div className="flex items-center gap-1 text-[11px] font-black text-emerald-300 group-hover:text-white">
                <User className="h-3 w-3 text-emerald-400" />
                Amina (Organizer)
              </div>
              <p className="text-[10px] text-muted-foreground truncate">amina@kadashe.ng</p>
              <span className="inline-block mt-1 text-[9px] px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-300 font-bold">Turn #2 • Paid</span>
            </button>

            {/* 3. Babajide (Turn #1) */}
            <button
              type="button"
              onClick={() => handleQuickFill("babajide@kadashe.ng", "KadasheTest2026!")}
              className="p-2.5 rounded-2xl bg-sky-950/80 hover:bg-sky-900 border border-sky-500/30 text-left transition-all group"
            >
              <div className="flex items-center gap-1 text-[11px] font-black text-sky-300 group-hover:text-white">
                <User className="h-3 w-3 text-sky-400" />
                Babajide Adeleke
              </div>
              <p className="text-[10px] text-muted-foreground truncate">babajide@kadashe.ng</p>
              <span className="inline-block mt-1 text-[9px] px-1.5 py-0.2 rounded-md bg-sky-500/20 text-sky-300 font-bold">Turn #1 (90 pts)</span>
            </button>

            {/* 4. Musa Danladi */}
            <button
              type="button"
              onClick={() => handleQuickFill("musa@kadashe.ng", "KadasheTest2026!")}
              className="p-2.5 rounded-2xl bg-sky-950/80 hover:bg-sky-900 border border-sky-500/30 text-left transition-all group"
            >
              <div className="flex items-center gap-1 text-[11px] font-black text-sky-300 group-hover:text-white">
                <User className="h-3 w-3 text-sky-400" />
                Musa Danladi
              </div>
              <p className="text-[10px] text-muted-foreground truncate">musa@kadashe.ng</p>
              <span className="inline-block mt-1 text-[9px] px-1.5 py-0.2 rounded-md bg-sky-500/20 text-sky-300 font-bold">Turn #3 • Paid</span>
            </button>

            {/* 5. Emeka Okafor (Paid) */}
            <button
              type="button"
              onClick={() => handleQuickFill("emeka@kadashe.ng", "KadasheTest2026!")}
              className="p-2.5 rounded-2xl bg-sky-950/80 hover:bg-sky-900 border border-sky-500/30 text-left transition-all group"
            >
              <div className="flex items-center gap-1 text-[11px] font-black text-sky-300 group-hover:text-white">
                <User className="h-3 w-3 text-sky-400" />
                Emeka Okafor
              </div>
              <p className="text-[10px] text-muted-foreground truncate">emeka@kadashe.ng</p>
              <span className="inline-block mt-1 text-[9px] px-1.5 py-0.2 rounded-md bg-sky-500/20 text-sky-300 font-bold">Turn #4 • Paid</span>
            </button>

            {/* 6. Chinedu Eze (Unpaid) */}
            <button
              type="button"
              onClick={() => handleQuickFill("chinedu@kadashe.ng", "KadasheTest2026!")}
              className="p-2.5 rounded-2xl bg-amber-950/50 hover:bg-amber-900/70 border border-amber-500/40 text-left transition-all group"
            >
              <div className="flex items-center gap-1 text-[11px] font-black text-amber-300 group-hover:text-white">
                <User className="h-3 w-3 text-amber-400" />
                Chinedu Eze
              </div>
              <p className="text-[10px] text-muted-foreground truncate">chinedu@kadashe.ng</p>
              <span className="inline-block mt-1 text-[9px] px-1.5 py-0.2 rounded-md bg-amber-500/20 text-amber-300 font-bold">Turn #5 • Unpaid ⏳</span>
            </button>
          </div>

          <div className="p-2 rounded-xl bg-amber-950/60 border border-amber-500/30 text-[10px] text-amber-200/90 font-medium leading-normal flex items-start gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>Security Protocol:</strong> Super Admin master credentials remain air-gapped from evaluator demo access to preserve infrastructure segregation of duties.
            </span>
          </div>
        </div>

        {/* Login Card */}
        <Card className="rounded-3xl bg-[#071322]/95 border border-sky-400/35 shadow-2xl backdrop-blur-xl text-white">
          <CardHeader className="space-y-1 text-center pb-3">
            <CardTitle className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Sign in to Kadashe
            </CardTitle>
            <CardDescription className="text-xs text-sky-100/90 font-medium">
              Choose your authentication method
            </CardDescription>

            {/* Auth Mode Tabs */}
            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-sky-950/80 border border-sky-500/20 mt-3 text-xs">
              <button
                type="button"
                onClick={() => {
                  setAuthMode("password");
                  setErrorMessage(null);
                }}
                className={`py-2 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 ${
                  authMode === "password"
                    ? "bg-[#0284C7] text-white shadow-xs"
                    : "text-muted-foreground hover:text-white"
                }`}
              >
                <KeyRound className="h-3.5 w-3.5" />
                Password (Demo)
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMode("otp");
                  setErrorMessage(null);
                }}
                className={`py-2 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 ${
                  authMode === "otp"
                    ? "bg-[#0284C7] text-white shadow-xs"
                    : "text-muted-foreground hover:text-white"
                }`}
              >
                <Mail className="h-3.5 w-3.5" />
                Email OTP
              </button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {errorMessage && (
              <div
                className={`p-3.5 rounded-2xl border text-xs font-semibold space-y-2 transition-all animate-in fade-in duration-200 ${
                  isNoAccountError
                    ? "bg-amber-950/80 border-amber-500/50 text-amber-200"
                    : "bg-red-950/70 border-red-500/50 text-red-200"
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className="text-sm shrink-0">⚠️</span>
                  <div className="space-y-0.5">
                    <p className="font-extrabold text-[12px] text-white">
                      {isNoAccountError ? "Account Not Found" : "Authentication Notice"}
                    </p>
                    <p className="text-[11px] leading-relaxed text-amber-100/90 font-medium">
                      {errorMessage}
                    </p>
                  </div>
                </div>

                {isNoAccountError && (
                  <Link
                    href={`/signup?email=${encodeURIComponent(emailInput)}`}
                    className="flex items-center justify-between w-full p-2.5 rounded-xl bg-gradient-to-r from-[#0F2744] to-[#0284C7] hover:from-[#0A1C33] hover:to-[#0369A1] text-white text-[11px] font-black shadow-sm transition-all"
                  >
                    <span>Create Account with {emailInput || "this email"}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>
            )}

            {/* PASSWORD LOGIN FORM */}
            {authMode === "password" ? (
              <form onSubmit={handlePasswordSubmit} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-sky-200" htmlFor="email-pass">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 h-4 w-4 text-sky-400/70" />
                    <Input
                      id="email-pass"
                      type="email"
                      value={emailInput}
                      onChange={(e) => {
                        setEmailInput(e.target.value);
                        if (errorMessage) setErrorMessage(null);
                      }}
                      placeholder="you@example.com"
                      required
                      disabled={loading}
                      className="h-10 pl-10 bg-sky-950/70 border-sky-500/35 text-white placeholder:text-sky-300/40 text-xs rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-sky-200" htmlFor="password-field">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 h-4 w-4 text-sky-400/70" />
                    <Input
                      id="password-field"
                      type="password"
                      value={passwordInput}
                      onChange={(e) => {
                        setPasswordInput(e.target.value);
                        if (errorMessage) setErrorMessage(null);
                      }}
                      placeholder="••••••••••••"
                      required
                      disabled={loading}
                      className="h-10 pl-10 bg-sky-950/70 border-sky-500/35 text-white placeholder:text-sky-300/40 text-xs rounded-xl"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 bg-gradient-to-r from-[#0F2744] via-[#0284C7] to-[#38BDF8] hover:from-[#0A1C33] hover:to-[#0284C7] text-white font-black text-xs rounded-full shadow-lg shadow-sky-500/30"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" />
                        Authenticating...
                      </>
                    ) : (
                      <>
                        Sign In with Password
                        <ArrowRight className="ml-2 h-4 w-4 text-white" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            ) : (
              /* OTP LOGIN FORM */
              <form onSubmit={handleOtpSubmit} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-sky-200" htmlFor="email-otp">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 h-4 w-4 text-sky-400/70" />
                    <Input
                      id="email-otp"
                      type="email"
                      value={emailInput}
                      onChange={(e) => {
                        setEmailInput(e.target.value);
                        if (errorMessage) setErrorMessage(null);
                      }}
                      placeholder="you@example.com"
                      required
                      disabled={loading}
                      className="h-10 pl-10 bg-sky-950/70 border-sky-500/35 text-white placeholder:text-sky-300/40 text-xs rounded-xl"
                    />
                  </div>
                  {fieldErrors.email && (
                    <p className="text-[11px] text-red-400 font-semibold">{fieldErrors.email[0]}</p>
                  )}
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 bg-gradient-to-r from-[#0F2744] via-[#0284C7] to-[#38BDF8] hover:from-[#0A1C33] hover:to-[#0284C7] text-white font-black text-xs rounded-full shadow-lg shadow-sky-500/30"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" />
                        Sending 6-Digit Code...
                      </>
                    ) : (
                      <>
                        Send 6-Digit One-Time Code
                        <ArrowRight className="ml-2 h-4 w-4 text-white" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}

            <div className="mt-4 text-center text-xs text-sky-200/90 font-medium">
              Don&apos;t have an account yet?{" "}
              <Link href={`/signup${emailInput ? `?email=${encodeURIComponent(emailInput)}` : ""}`} className="font-extrabold text-sky-300 hover:text-white underline-offset-4 hover:underline transition-colors">
                Create an account
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Security badge footer */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-sky-300/90 font-medium">
          <ShieldCheck className="h-4 w-4 text-sky-400" />
          <span>Protected with Automated Vault Security & Anti-Fraud Locks</span>
        </div>
      </div>
    </div>
  );
}

