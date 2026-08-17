"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithOtpAction } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Loader2, ShieldCheck, Mail } from "lucide-react";

export default function LoginPage() {
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

    // Redirect to OTP verification screen
    router.push(`/verify?email=${encodeURIComponent(email)}&mode=login`);
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Logo Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg shadow-emerald-600/30 border border-emerald-400/30">
              ₦
            </div>
            <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-emerald-700 to-emerald-950 dark:from-emerald-300 dark:to-white bg-clip-text text-transparent">
              Alajo
            </span>
          </Link>
          <p className="text-xs text-emerald-800 dark:text-emerald-400 font-semibold uppercase tracking-wider">
            Nigerian Digital Rotating Savings Circle
          </p>
        </div>

        {/* Login Card */}
        <Card className="glass-vault border-border/40 shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold tracking-tight">Welcome back</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Sign in with your email address using a secure one-time code
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
                <label className="text-xs font-semibold text-foreground" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    disabled={loading}
                    className="h-11 pl-10 border-border focus-visible:ring-emerald-500"
                  />
                </div>
                {fieldErrors.email && (
                  <p className="text-[11px] text-red-600 dark:text-red-400 font-medium">{fieldErrors.email[0]}</p>
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
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      Send 6-Digit Code
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center text-xs text-muted-foreground">
              Don&apos;t have an account yet?{" "}
              <Link href="/signup" className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
                Create an account
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Security badge footer */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground font-medium">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>Protected with Automated Vault Security & Anti-Fraud Locks</span>
        </div>
      </div>
    </div>
  );
}
