"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUpAction } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Loader2, ShieldCheck, Sparkles } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

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

    // On success, redirect to verify page with email pre-filled
    router.push(`/verify?email=${encodeURIComponent(email)}&mode=signup`);
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-background">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Logo Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-2xl shadow-md shadow-emerald-600/25">
              A
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-foreground">Alajo</span>
          </Link>
          <p className="text-xs text-muted-foreground font-medium">Nigerian Digital Rotating Savings Circle</p>
        </div>

        {/* Signup Card */}
        <Card className="border-border/60 bg-card shadow-lg shadow-black/5">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold tracking-tight">Create your account</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Enter your details to start saving with programmatic trust
            </CardDescription>
          </CardHeader>
          <CardContent>
            {errorMessage && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 text-xs font-medium">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground" htmlFor="fullName">
                  Full Name
                </label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="e.g. Aminu Bello"
                  required
                  disabled={loading}
                  className="h-11 border-border focus-visible:ring-emerald-500"
                />
                {fieldErrors.fullName && (
                  <p className="text-[11px] text-red-600 dark:text-red-400 font-medium">{fieldErrors.fullName[0]}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground" htmlFor="email">
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  disabled={loading}
                  className="h-11 border-border focus-visible:ring-emerald-500"
                />
                {fieldErrors.email && (
                  <p className="text-[11px] text-red-600 dark:text-red-400 font-medium">{fieldErrors.email[0]}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground" htmlFor="phone">
                  Phone Number
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="08012345678 or +2348012345678"
                  required
                  disabled={loading}
                  className="h-11 border-border focus-visible:ring-emerald-500"
                />
                {fieldErrors.phone && (
                  <p className="text-[11px] text-red-600 dark:text-red-400 font-medium">{fieldErrors.phone[0]}</p>
                )}
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-md shadow-emerald-600/25"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending Verification Code...
                    </>
                  ) : (
                    <>
                      Continue with Email OTP
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center text-xs text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
                Sign in here
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Security badge footer */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground font-medium">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>Passwordless & Secured by Supabase OTP</span>
        </div>
      </div>
    </div>
  );
}
