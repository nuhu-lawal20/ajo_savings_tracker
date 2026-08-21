"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signUpAction } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KadasheLogo } from "@/components/ui/kadashe-logo";
import { ArrowRight, Loader2, ShieldCheck, User, Mail, Phone } from "lucide-react";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultEmail = searchParams.get("email") || "";

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [email, setEmail] = useState(defaultEmail);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);
    const submittedEmail = (formData.get("email") as string) || email;

    try {
      const result = await signUpAction(formData);
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

      // Redirect to OTP verification screen
      router.push(`/verify?email=${encodeURIComponent(submittedEmail)}&mode=signup`);
    } catch (err: any) {
      setLoading(false);
      console.error("Signup submission error:", err);
      setErrorMessage(
        err?.message?.includes("fetch") || err?.name === "TypeError"
          ? "Network connection issue. Please check your internet connection and try again."
          : (err?.message ?? "An unexpected error occurred. Please try again.")
      );
    }
  }

  return (
    <Card className="rounded-3xl bg-[#071322]/95 border border-sky-400/35 shadow-2xl backdrop-blur-xl text-white">
      <CardHeader className="space-y-1 text-center pb-4">
        <CardTitle className="text-2xl sm:text-3xl font-black tracking-tight text-white">
          Create your account
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm text-sky-100/90 font-medium">
          Enter your details to start saving with programmatic trust
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs font-semibold">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-sky-200" htmlFor="fullName">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 h-4 w-4 text-sky-400/70" />
              <Input
                id="fullName"
                name="fullName"
                placeholder="e.g. Aminu Bello"
                required
                disabled={loading}
                className="h-11 pl-10 bg-sky-950/70 border-sky-500/35 text-white placeholder:text-sky-300/40 focus-visible:ring-sky-400 font-medium rounded-xl"
              />
            </div>
            {fieldErrors.fullName && (
              <p className="text-[11px] text-red-400 font-semibold">{fieldErrors.fullName[0]}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-sky-200" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-sky-400/70" />
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                disabled={loading}
                className="h-11 pl-10 bg-sky-950/70 border-sky-500/35 text-white placeholder:text-sky-300/40 focus-visible:ring-sky-400 font-medium rounded-xl"
              />
            </div>
            {fieldErrors.email && (
              <p className="text-[11px] text-red-400 font-semibold">{fieldErrors.email[0]}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-sky-200" htmlFor="phone">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-sky-400/70" />
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="08012345678 or +2348012345678"
                required
                disabled={loading}
                className="h-11 pl-10 bg-sky-950/70 border-sky-500/35 text-white placeholder:text-sky-300/40 focus-visible:ring-sky-400 font-medium rounded-xl"
              />
            </div>
            {fieldErrors.phone && (
              <p className="text-[11px] text-red-400 font-semibold">{fieldErrors.phone[0]}</p>
            )}
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-[#0F2744] via-[#0284C7] to-[#38BDF8] hover:from-[#0A1C33] hover:to-[#0284C7] text-white font-black text-sm rounded-full shadow-lg shadow-sky-500/30"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" />
                  Sending Verification Code...
                </>
              ) : (
                <>
                  Continue with Email OTP
                  <ArrowRight className="ml-2 h-4 w-4 text-white" />
                </>
              )}
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center text-xs text-sky-200/90 font-medium">
          Already have an account?{" "}
          <Link href="/login" className="font-extrabold text-sky-300 hover:text-white underline-offset-4 hover:underline transition-colors">
            Sign in here
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Logo Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <KadasheLogo withLink size="lg" variant="dark-bg" />
          <p className="text-xs text-sky-300 font-black uppercase tracking-wider">
            Nigerian Smart Rotating Savings (Adashe)
          </p>
        </div>

        {/* Signup Card wrapped in Suspense for searchParams */}
        <Suspense fallback={<div className="text-center text-xs text-muted-foreground">Loading form...</div>}>
          <SignupForm />
        </Suspense>

        {/* Security badge footer */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-sky-300/90 font-medium">
          <ShieldCheck className="h-4 w-4 text-sky-400" />
          <span>Passwordless & Secured with One-Time Code</span>
        </div>
      </div>
    </div>
  );
}

