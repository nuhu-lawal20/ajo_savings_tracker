import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AvatarUploader } from "@/components/profile/AvatarUploader";
import { KycVerificationModal } from "@/components/profile/KycVerificationModal";
import { TrustScoreGauge } from "@/components/trust/TrustScoreGauge";
import { SignOutButton } from "@/components/layout/SignOutButton";
import {
  ShieldCheck,
  Award,
  Crown,
  ChevronRight,
  Receipt,
  Sliders,
  Headphones,
  CheckCircle2,
  Lock,
  ArrowRight,
  TrendingUp,
  LogOut,
  Wallet,
  Sparkles,
  Building2,
  Camera,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  const adminDb = createAdminClient();

  // Fetch memberships & counts
  const { data: memberships } = await adminDb
    .from("memberships")
    .select("*, circle:circles!memberships_circle_id_fkey(*)")
    .eq("user_id", user!.id);

  // Fetch user transactions & wallet entries
  const [{ data: transactions }, { data: walletEntries }] = await Promise.all([
    adminDb
      .from("transactions")
      .select("*")
      .eq("user_id", user!.id),
    adminDb
      .from("wallet_ledger")
      .select("*")
      .eq("user_id", user!.id),
  ]);

  const isSuperAdmin = profile?.admin_role === "super_admin" || (profile?.is_admin && profile?.admin_role !== "helper_admin");
  const isHelperAdmin = profile?.admin_role === "helper_admin";
  const isAdmin = isSuperAdmin || isHelperAdmin;
  const trustScore = isAdmin ? 100 : (profile?.trust_score ?? 50);
  const kycTier = profile?.kyc_tier ?? 1;
  const isVerified = isAdmin || kycTier >= 2;

  const totalCircles = memberships?.length ?? 0;
  const confirmedPayments =
    transactions?.filter((t: any) => t.type === "contribution" && t.status === "confirmed")?.length ?? 0;

  const displayName = profile?.full_name || user?.email?.split("@")[0] || "Member";

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-12">
      
      {/* ========================================================================= */}
      {/* 1. CLEAN PROFILE HEADER                                                   */}
      {/* ========================================================================= */}
      <Card className="rounded-3xl border border-[#e1e8f0] dark:border-sky-500/20 bg-white dark:bg-[#071322] shadow-sm overflow-hidden">
        <CardContent className="p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="shrink-0">
              <AvatarUploader
                userId={user!.id}
                currentAvatarUrl={profile?.avatar_url ?? null}
                fullName={displayName}
              />
            </div>

            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight truncate">
                  {displayName}
                </h1>
                {isSuperAdmin ? (
                  <Badge className="bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Crown className="h-3 w-3 text-amber-500" />
                    Super Admin
                  </Badge>
                ) : isHelperAdmin ? (
                  <Badge className="bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-400/40 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3 text-[#0284C7] dark:text-sky-400" />
                    Helper Admin
                  </Badge>
                ) : kycTier >= 3 ? (
                  <Badge className="bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border-0 text-[10px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Tier 3 CAC
                  </Badge>
                ) : kycTier === 2 ? (
                  <Badge className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-0 text-[10px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Tier 2 Biometric
                  </Badge>
                ) : kycTier === 1 ? (
                  <Badge className="bg-sky-100 dark:bg-sky-500/20 text-[#0284C7] dark:text-sky-300 border-0 text-[10px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Award className="h-3 w-3" />
                    Tier 1 Verified
                  </Badge>
                ) : (
                  <Badge className="bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-0 text-[10px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Award className="h-3 w-3" />
                    Unverified
                  </Badge>
                )}
              </div>

              <p className="text-xs text-muted-foreground font-medium truncate">
                {profile?.phone || profile?.email || user?.email}
              </p>
            </div>
          </div>

          {/* Quick Stats Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 border-t border-[#e1e8f0]/60 dark:border-sky-500/15">
            <div className="p-2.5 rounded-2xl bg-[#f4f7fb] dark:bg-sky-950/30 text-center">
              <span className="text-[10px] text-muted-foreground font-semibold">Circles Joined</span>
              <p className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                {totalCircles}
              </p>
            </div>

            <div className="p-2.5 rounded-2xl bg-[#f4f7fb] dark:bg-sky-950/30 text-center">
              <span className="text-[10px] text-muted-foreground font-semibold">Payments Made</span>
              <p className="text-sm font-black text-[#0F2744] dark:text-sky-400 mt-0.5">
                {confirmedPayments}
              </p>
            </div>

            <div className="p-2.5 rounded-2xl bg-[#f4f7fb] dark:bg-sky-950/30 text-center col-span-2 sm:col-span-1">
              <span className="text-[10px] text-muted-foreground font-semibold">Trust Score</span>
              <p className="text-sm font-black text-[#0284C7] dark:text-sky-400 mt-0.5">
                {trustScore}/100
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ========================================================================= */}
      {/* 2. SECURITY & KYC VERIFICATION CARD                                       */}
      {/* ========================================================================= */}
      <div className={`relative rounded-3xl p-5 shadow-sm space-y-3.5 overflow-hidden text-white ${
        isSuperAdmin
          ? "bg-gradient-to-br from-[#0F2744] via-[#221703] to-amber-950/90 border border-amber-500/30"
          : "bg-gradient-to-br from-[#0F2744] to-[#0284C7] border border-sky-500/20"
      }`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              {isSuperAdmin ? (
                <Crown className="h-5 w-5 text-amber-300" />
              ) : isHelperAdmin ? (
                <ShieldCheck className="h-5 w-5 text-sky-200" />
              ) : (
                <ShieldCheck className="h-5 w-5 text-white" />
              )}
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">
                {isSuperAdmin
                  ? "Super Admin Account Authority"
                  : isHelperAdmin
                  ? "Helper Admin (Platform Moderator)"
                  : kycTier >= 3
                  ? "Tier 3 CAC Verified"
                  : kycTier === 2
                  ? "Tier 2 Biometric & Gov ID Verified"
                  : kycTier === 1
                  ? "Tier 1 Verified (BVN / NIN)"
                  : "Identity Verification Required"}
              </h3>
              <p className="text-[11px] text-sky-100/90 font-medium">
                {isSuperAdmin
                  ? "Master platform credentials active. Full circle oversight, helper admin provisioning, and escrow authority enabled."
                  : isHelperAdmin
                  ? "Operational moderator staff credentials active. Member trust score auditing and circle fraud freeze controls enabled."
                  : kycTier >= 3
                  ? "Your Corporate Affairs Commission (CAC) registration is verified. You have UNLIMITED circle pool limits."
                  : kycTier === 2
                  ? "Your Government ID and facial biometrics are verified. You can create pools up to ₦10,000,000, or verify CAC for unlimited pool amounts."
                  : kycTier === 1
                  ? "Your 11-digit BVN/NIN is verified. You can create pools up to ₦1,000,000, or upgrade to Tier 2 for pools up to ₦10,000,000."
                  : "Verify your BVN or NIN to become Tier 1 Verified and unlock circle creation up to ₦1,000,000."}
              </p>
            </div>
          </div>

          {isSuperAdmin ? (
            <Badge className="bg-amber-400/25 text-amber-200 border-amber-300/40 text-[10px] font-black shrink-0">
              Master Admin
            </Badge>
          ) : isHelperAdmin ? (
            <Badge className="bg-sky-400/25 text-sky-200 border-sky-300/40 text-[10px] font-black shrink-0">
              Moderator
            </Badge>
          ) : kycTier >= 3 ? (
            <Badge className="bg-purple-500/25 text-purple-200 border-purple-400/40 text-[10px] font-black shrink-0">
              Tier 3 CAC
            </Badge>
          ) : kycTier === 2 ? (
            <Badge className="bg-emerald-500/25 text-emerald-200 border-emerald-400/40 text-[10px] font-black shrink-0">
              Tier 2 Biometric
            </Badge>
          ) : kycTier === 1 ? (
            <Badge className="bg-sky-500/25 text-sky-200 border-sky-400/40 text-[10px] font-black shrink-0">
              Tier 1 Verified
            </Badge>
          ) : (
            <Badge className="bg-amber-500/25 text-amber-200 border-amber-400/40 text-[10px] font-black shrink-0">
              Unverified
            </Badge>
          )}
        </div>

        {isAdmin ? (
          <div className="pt-1">
            <Link
              href="/admin"
              className="flex items-center justify-between w-full h-11 px-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs rounded-2xl transition-all"
            >
              <span>{isSuperAdmin ? "Open Super Admin Console" : "Open Moderator Console"}</span>
              <ChevronRight className="h-4 w-4 text-white" />
            </Link>
          </div>
        ) : (
          <div className="pt-1">
            <KycVerificationModal
              currentTier={kycTier}
              triggerVariant="full-button"
              triggerText={
                kycTier === 2
                  ? "Upgrade to Tier 3 (Verify CAC Registration)"
                  : kycTier === 1
                  ? "Upgrade to Tier 2 (Verify Gov ID & Biometrics)"
                  : "Verify BVN / NIN (Unlock Tier 1 - ₦1M)"
              }
            />
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. SETTINGS & ACCOUNT ACTIONS CARD                                        */}
      {/* ========================================================================= */}
      <Card className="rounded-3xl border border-[#e1e8f0] dark:border-sky-500/20 bg-white dark:bg-[#071322] shadow-sm divide-y divide-[#e1e8f0]/60 dark:divide-sky-500/15 overflow-hidden">
        
        {/* Item 1: Unified Personal Transaction Statement */}
        <Link
          href="/dashboard"
          className="p-4 sm:p-5 flex items-center justify-between hover:bg-[#f4f7fb]/70 dark:hover:bg-sky-950/30 transition-colors group"
        >
          <div className="flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-2xl bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Receipt className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                Wallet Ledger & Receipts
              </p>
              <p className="text-[11px] text-muted-foreground font-medium">
                Immutable record of deposits, circle payouts, and receipts
              </p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-[#0284C7] group-hover:translate-x-0.5 transition-all shrink-0" />
        </Link>

        {/* Item 2: Account Limits & KYC Tier */}
        <div className="p-4 sm:p-5 flex items-center justify-between hover:bg-[#f4f7fb]/70 dark:hover:bg-sky-950/30 transition-colors">
          <div className="flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-2xl bg-blue-50 dark:bg-blue-500/15 text-[#0F2744] dark:text-sky-400 flex items-center justify-center shrink-0">
              <Sliders className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                Account Limits & KYC Status
              </p>
              <p className="text-[11px] text-muted-foreground font-medium">
                {isSuperAdmin
                  ? "Super Admin: Master platform authorization (Full governance)"
                  : isHelperAdmin
                  ? "Helper Admin: Operational risk & moderation authorization"
                  : kycTier >= 3
                  ? "Tier 3: Unlimited total pool payout (CAC Registration Verified)"
                  : kycTier === 2
                  ? "Tier 2: Max ₦10,000,000 total pool payout (Gov ID & Biometrics Verified)"
                  : kycTier === 1
                  ? "Tier 1: Max ₦1,000,000 total pool payout (BVN / NIN Verified)"
                  : "Unverified: View Only (Verification required to create or join circles)"}
              </p>
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            {isSuperAdmin ? (
              <Badge className="bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-0 text-[10px] font-bold">
                Master Admin
              </Badge>
            ) : isHelperAdmin ? (
              <Badge className="bg-sky-100 dark:bg-sky-500/20 text-[#0284C7] dark:text-sky-300 border-0 text-[10px] font-bold">
                Moderator
              </Badge>
            ) : kycTier >= 3 ? (
              <Badge className="bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border-0 text-[10px] font-bold">
                Tier 3 Active
              </Badge>
            ) : kycTier === 2 ? (
              <>
                <Badge className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-0 text-[10px] font-bold">
                  Tier 2 Active
                </Badge>
                <KycVerificationModal
                  currentTier={2}
                  triggerVariant="badge"
                  triggerText="Upgrade to T3"
                  className="bg-purple-600 hover:bg-purple-700 text-white text-[9px] font-black px-2.5 py-1 rounded-full cursor-pointer shadow-xs"
                />
              </>
            ) : kycTier === 1 ? (
              <>
                <Badge className="bg-sky-100 dark:bg-sky-500/20 text-[#0284C7] dark:text-sky-300 border-0 text-[10px] font-bold">
                  Tier 1 Active
                </Badge>
                <KycVerificationModal
                  currentTier={1}
                  triggerVariant="badge"
                  triggerText="Upgrade to T2"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-[9px] font-black px-2.5 py-1 rounded-full cursor-pointer shadow-xs"
                />
              </>
            ) : (
              <KycVerificationModal
                currentTier={0}
                triggerVariant="badge"
                triggerText="Verify BVN / NIN"
                className="bg-[#0284C7] hover:bg-[#0369A1] text-white text-[9px] font-black px-2.5 py-1 rounded-full cursor-pointer shadow-xs"
              />
            )}
          </div>
        </div>

        {/* Item 3: Admin Console (if Admin) */}
        {isAdmin && (
          <Link
            href="/admin"
            className="p-4 sm:p-5 flex items-center justify-between hover:bg-[#f4f7fb]/70 dark:hover:bg-sky-950/30 transition-colors group"
          >
            <div className="flex items-center gap-3.5">
              <div className={`h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 ${
                isSuperAdmin
                  ? "bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400"
                  : "bg-sky-50 dark:bg-sky-500/15 text-[#0284C7] dark:text-sky-400"
              }`}>
                {isSuperAdmin ? <Crown className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
              </div>
              <div>
                <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                  {isSuperAdmin ? "Super Admin Governance" : "Platform Moderation Console"}
                </p>
                <p className="text-[11px] text-muted-foreground font-medium">
                  {isSuperAdmin
                    ? "Manage helper admins, freeze/unfreeze circles, and audit nationwide ledgers"
                    : "Inspect user trust dossiers, monitor savings pools, and freeze fraudulent circles"}
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-[#0284C7] group-hover:translate-x-0.5 transition-all shrink-0" />
          </Link>
        )}

        {/* Item 4: Sign Out Button (Mobile & Desktop) */}
        <SignOutButton variant="list-item" />
      </Card>

      {/* ========================================================================= */}
      {/* 4. AI TRUST SCORE ENGINE                                                  */}
      {/* ========================================================================= */}
      <Card className="rounded-3xl border border-[#e1e8f0] dark:border-sky-500/20 bg-white dark:bg-[#071322] shadow-sm">
        <CardHeader className="pb-2 border-b border-[#e1e8f0]/60 dark:border-sky-500/15">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-[#0284C7] dark:text-sky-400" />
            <CardTitle className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
              AI Reputation & Trust Score Engine
            </CardTitle>
          </div>
          <CardDescription className="text-xs">
            Determines early payout slot priority and risk limits.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <div className="flex justify-center py-2">
            <TrustScoreGauge score={trustScore} size={180} />
          </div>

          <div
            className={`p-4 rounded-2xl border text-xs ${
              trustScore >= 70
                ? "bg-sky-50 dark:bg-sky-950/30 border-sky-500/30 text-[#0F2744] dark:text-sky-300"
                : trustScore >= 40
                ? "bg-amber-50 dark:bg-amber-950/30 border-amber-500/30 text-amber-800 dark:text-amber-300"
                : "bg-red-50 dark:bg-red-950/30 border-red-500/30 text-red-800 dark:text-red-300"
            }`}
          >
            <p className="font-extrabold text-xs">
              {trustScore >= 70
                ? "🌟 Priority Access: Position #1 Payouts Unlocked"
                : trustScore >= 40
                ? "Standard Access: Middle Rotation Positions"
                : "Restricted Access: Later Payout Positions Only"}
            </p>
            <p className="text-[11px] mt-0.5 opacity-85">
              {trustScore >= 70
                ? "Your high credit standing allows you to claim early rotation turns."
                : "Complete more rounds on time or verify CAC business registration to boost your reputation."}
            </p>
          </div>

          {/* Reputation Factor Breakdown */}
          <div className="space-y-3 pt-2 border-t border-[#e1e8f0]/60 dark:border-sky-500/15">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Trust Score Drivers & Verification Boosts
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Driver 1: Tier 1 BVN/NIN */}
              <div className="p-3 rounded-2xl bg-[#f4f7fb] dark:bg-sky-950/40 border border-[#e1e8f0]/60 dark:border-sky-500/20 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-sky-500/15 text-[#0284C7] dark:text-sky-400 flex items-center justify-center shrink-0">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-900 dark:text-white">Tier 1: BVN / NIN</p>
                    <p className="text-[10px] text-muted-foreground">Identity verified (Max ₦1M)</p>
                  </div>
                </div>
                {kycTier >= 1 ? (
                  <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border-0 text-[10px] font-black">
                    +15 pts ✓
                  </Badge>
                ) : (
                  <KycVerificationModal
                    currentTier={0}
                    triggerVariant="badge"
                    triggerText="Verify (+15 pts)"
                    className="bg-[#0284C7] hover:bg-[#0369A1] text-white text-[9px] font-black px-2.5 py-1 rounded-full cursor-pointer"
                  />
                )}
              </div>

              {/* Driver 2: Tier 2 Gov ID & Biometrics */}
              <div className="p-3 rounded-2xl bg-[#f4f7fb] dark:bg-sky-950/40 border border-[#e1e8f0]/60 dark:border-sky-500/20 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Camera className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-900 dark:text-white">Tier 2: Biometrics & ID</p>
                    <p className="text-[10px] text-muted-foreground">Gov ID & selfie (Max ₦10M)</p>
                  </div>
                </div>
                {kycTier >= 2 ? (
                  <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border-0 text-[10px] font-black">
                    +15 pts ✓
                  </Badge>
                ) : (
                  <KycVerificationModal
                    currentTier={1}
                    triggerVariant="badge"
                    triggerText="Upgrade (+15 pts)"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-[9px] font-black px-2.5 py-1 rounded-full cursor-pointer"
                  />
                )}
              </div>

              {/* Driver 3: Tier 3 CAC Registration */}
              <div className="p-3 rounded-2xl bg-[#f4f7fb] dark:bg-sky-950/40 border border-[#e1e8f0]/60 dark:border-sky-500/20 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-900 dark:text-white">Tier 3: CAC Document</p>
                    <p className="text-[10px] text-muted-foreground">Corporate proof (Unlimited)</p>
                  </div>
                </div>
                {kycTier >= 3 ? (
                  <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border-0 text-[10px] font-black">
                    +10 pts ✓
                  </Badge>
                ) : (
                  <KycVerificationModal
                    currentTier={kycTier}
                    triggerVariant="badge"
                    triggerText="Upgrade (+10 pts)"
                    className="bg-purple-600 hover:bg-purple-700 text-white text-[9px] font-black px-2.5 py-1 rounded-full cursor-pointer"
                  />
                )}
              </div>

              {/* Driver 4: On-Time Contributions */}
              <div className="p-3 rounded-2xl bg-[#f4f7fb] dark:bg-sky-950/40 border border-[#e1e8f0]/60 dark:border-sky-500/20 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-blue-500/15 text-[#0F2744] dark:text-sky-400 flex items-center justify-center shrink-0">
                    <Receipt className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-900 dark:text-white">On-Time Payments</p>
                    <p className="text-[10px] text-muted-foreground">{confirmedPayments} confirmed on-time payments</p>
                  </div>
                </div>
                <Badge className="bg-sky-500/20 text-[#0284C7] dark:text-sky-300 border-0 text-[10px] font-black">
                  +{Math.min(confirmedPayments * 5, 20)} / 20 pts
                </Badge>
              </div>

              {/* Driver 5: Zero Default Record */}
              <div className="p-3 rounded-2xl bg-[#f4f7fb] dark:bg-sky-950/40 border border-[#e1e8f0]/60 dark:border-sky-500/20 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-900 dark:text-white">Zero Defaults</p>
                    <p className="text-[10px] text-muted-foreground">Clean escrow standing</p>
                  </div>
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border-0 text-[10px] font-black">
                  +10 pts ✓
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
