import { z } from "zod";

// ==========================================
// Authentication Schemas
// ==========================================
export const SignUpSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(80),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^(?:\+234|0)[789]\d{9}$/, "Invalid Nigerian phone number (+234... or 080...)"),
});

export const LoginOtpSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const VerifyOtpSchema = z.object({
  email: z.string().email("Invalid email address"),
  token: z.string().length(6, "OTP token must be exactly 6 digits"),
});

// ==========================================
// Circle Management Schemas
// ==========================================
export const CreateCircleSchema = z.object({
  name: z.string().min(3, "Circle name must be at least 3 characters").max(50),
  description: z.string().max(300).optional(),
  contributionAmount: z.number().min(1000, "Minimum contribution is ₦1,000"),
  frequency: z.enum(["daily", "weekly", "monthly"]),
  maxMembers: z.number().int().min(2, "Minimum members is 2").max(20, "Maximum members is 20"),
});

export const JoinCircleSchema = z.object({
  inviteCode: z.string().min(6, "Invalid invite code"),
});

// ==========================================
// Contribution & Payment Schemas
// ==========================================
export const MakeContributionSchema = z.object({
  circleId: z.string().uuid("Invalid circle ID"),
  amount: z.number().positive("Amount must be greater than zero"),
});

export type SignUpInput = z.infer<typeof SignUpSchema>;
export type LoginOtpInput = z.infer<typeof LoginOtpSchema>;
export type VerifyOtpInput = z.infer<typeof VerifyOtpSchema>;
export type CreateCircleInput = z.infer<typeof CreateCircleSchema>;
export type JoinCircleInput = z.infer<typeof JoinCircleSchema>;
export type MakeContributionInput = z.infer<typeof MakeContributionSchema>;
