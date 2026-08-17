"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { SignUpSchema, LoginOtpSchema, VerifyOtpSchema } from "@/lib/validations";

// Initialize Upstash Redis Rate Limiter (5 requests per 15 minutes per IP)
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const otpRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "15 m"),
  prefix: "alajo:ratelimit:otp",
});

async function getClientIp(): Promise<string> {
  try {
    const headerList = await headers();
    const forwardedFor = headerList.get("x-forwarded-for");
    if (forwardedFor) {
      return forwardedFor.split(",")[0].trim();
    }
    const realIp = headerList.get("x-real-ip");
    if (realIp) {
      return realIp;
    }
  } catch {
    // Fallback if headers fail
  }
  return "127.0.0.1";
}

export type AuthActionResult = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

// -----------------------------------------------------------------------------
// 1. Sign Up (Send OTP with metadata)
// -----------------------------------------------------------------------------
export async function signUpAction(formData: FormData): Promise<AuthActionResult> {
  const ip = await getClientIp();

  // Rate Limiter with graceful offline/network fallback
  try {
    const { success: rateLimitOk } = await otpRateLimit.limit(ip);
    if (!rateLimitOk) {
      return {
        success: false,
        message: "Too many sign-up attempts. Please wait 15 minutes before trying again.",
      };
    }
  } catch (rateLimitErr) {
    console.warn("Upstash rate limit check bypassed due to network error:", rateLimitErr);
  }

  const rawData = {
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
  };

  const parsed = SignUpSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { fullName, email, phone } = parsed.data;

  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        data: {
          full_name: fullName,
          phone,
        },
      },
    });

    if (error) {
      return {
        success: false,
        message: error.message || "Failed to send verification code. Please try again.",
      };
    }

    return {
      success: true,
      message: "Verification code sent to your email.",
    };
  } catch (err: any) {
    console.error("Sign up error:", err);
    return {
      success: false,
      message:
        err?.message?.includes("fetch failed") || err?.name === "TypeError"
          ? "Unable to connect to the authentication server. Please check your internet connection and try again."
          : (err?.message ?? "An unexpected error occurred during signup. Please try again."),
    };
  }
}

// -----------------------------------------------------------------------------
// 2. Sign In With OTP (Existing Users)
// -----------------------------------------------------------------------------
export async function signInWithOtpAction(formData: FormData): Promise<AuthActionResult> {
  const ip = await getClientIp();

  // Rate Limiter with graceful offline/network fallback
  try {
    const { success: rateLimitOk } = await otpRateLimit.limit(ip);
    if (!rateLimitOk) {
      return {
        success: false,
        message: "Too many login attempts. Please wait 15 minutes before trying again.",
      };
    }
  } catch (rateLimitErr) {
    console.warn("Upstash rate limit check bypassed due to network error:", rateLimitErr);
  }

  const rawData = {
    email: formData.get("email"),
  };

  const parsed = LoginOtpSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { email } = parsed.data;

  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false, // Only allow existing users on login
      },
    });

    if (error) {
      // If user does not exist, give friendly prompt to signup
      if (error.message.toLowerCase().includes("user not found") || error.status === 400) {
        return {
          success: false,
          message: "No account found with this email. Please sign up first.",
        };
      }
      return {
        success: false,
        message: error.message || "Failed to send login code. Please try again.",
      };
    }

    return {
      success: true,
      message: "6-digit verification code sent to your email.",
    };
  } catch (err: any) {
    console.error("Login OTP error:", err);
    return {
      success: false,
      message:
        err?.message?.includes("fetch failed") || err?.name === "TypeError"
          ? "Unable to connect to the authentication server. Please check your internet connection and try again."
          : (err?.message ?? "An unexpected error occurred during sign in. Please try again."),
    };
  }
}

// -----------------------------------------------------------------------------
// 3. Verify OTP Token
// -----------------------------------------------------------------------------
export async function verifyOtpAction(formData: FormData): Promise<AuthActionResult> {
  const rawData = {
    email: formData.get("email"),
    token: formData.get("token"),
  };

  const parsed = VerifyOtpSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { email, token } = parsed.data;

  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });

    if (error) {
      return {
        success: false,
        message: "Invalid or expired verification code. Please check and try again.",
      };
    }

    return {
      success: true,
    };
  } catch (err: any) {
    console.error("Verify OTP error:", err);
    return {
      success: false,
      message:
        err?.message?.includes("fetch failed") || err?.name === "TypeError"
          ? "Unable to reach the verification server. Please check your connection and try again."
          : (err?.message ?? "An unexpected error occurred during verification."),
    };
  }
}

// -----------------------------------------------------------------------------
// 4. Sign Out
// -----------------------------------------------------------------------------
export async function signOutAction() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch (err) {
    console.error("Sign out error:", err);
  }
  redirect("/login");
}
