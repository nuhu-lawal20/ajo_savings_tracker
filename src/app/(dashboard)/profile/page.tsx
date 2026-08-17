import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, User, Mail, Phone, Award, CheckCircle2, TrendingUp, AlertTriangle } from "lucide-react";
import { TrustScoreGauge } from "@/components/trust/TrustScoreGauge";
import { AvatarUploader } from "@/components/profile/AvatarUploader";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  // Fetch stats for context: total circles & completed contributions
  const { data: memberships } = await supabase
    .from("memberships")
    .select("id, has_paid_current_round, payout_status, circle:circles(status)")
    .eq("user_id", user!.id);

  const { data: confirmedTx } = await supabase
    .from("transactions")
    .select("id", { count: "exact" })
    .eq("user_id", user!.id)
    .eq("status", "confirmed")
    .eq("type", "contribution");

  const trustScore = profile?.trust_score ?? 50;
  const totalCircles = memberships?.length ?? 0;
  const confirmedPayments = confirmedTx?.length ?? 0;
  const completedCircles = memberships?.filter((m: any) => m.circle?.status === "completed").length ?? 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-border/60">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Trust Profile & Identity</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Your AI reputation score determines rotation priority and platform trust tier.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Profile Card with Avatar Upload */}
        <div className="space-y-5">
          <Card className="border-border/60 bg-card shadow-sm">
            <CardHeader className="text-center pb-2">
              <AvatarUploader
                userId={user!.id}
                currentAvatarUrl={profile?.avatar_url ?? null}
                fullName={profile?.full_name ?? ""}
              />
              <CardTitle className="text-lg font-bold mt-3">{profile?.full_name}</CardTitle>
              <CardDescription className="text-xs">{profile?.email}</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-3 text-xs border-t border-border/60">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" />
                  Phone
                </span>
                <span className="font-semibold">{profile?.phone ?? "Not provided"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5" />
                  KYC Tier
                </span>
                <Badge variant="outline" className="text-[10px]">
                  Tier {profile?.kyc_tier ?? 1}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  Circles Joined
                </span>
                <span className="font-bold text-emerald-600">{totalCircles}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Confirmed Payments
                </span>
                <span className="font-bold text-emerald-600">{confirmedPayments}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5" />
                  Completed Cycles
                </span>
                <span className="font-bold text-emerald-600">{completedCircles}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: AI Trust Score Engine */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-border/60 bg-card shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-emerald-600" />
                    AI Trust Score Engine
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Calculated by automated Postgres algorithm on every rotation cycle. Recalculated nightly.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Animated SVG Gauge — centered */}
              <div className="flex justify-center py-2">
                <TrustScoreGauge score={trustScore} size={200} />
              </div>

              {/* Payout Position Eligibility Banner */}
              <div
                className={`flex items-start gap-3 p-4 rounded-xl border text-xs ${
                  trustScore >= 70
                    ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500/30 text-emerald-800 dark:text-emerald-300"
                    : trustScore >= 40
                    ? "bg-amber-50 dark:bg-amber-950/30 border-amber-500/30 text-amber-800 dark:text-amber-300"
                    : "bg-red-50 dark:bg-red-950/30 border-red-500/30 text-red-800 dark:text-red-300"
                }`}
              >
                <ShieldCheck className="h-4 w-4 mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold">
                    {trustScore >= 70
                      ? "Priority Access — First-Come Payout Slots"
                      : trustScore >= 40
                      ? "Standard Access — Middle Rotation Slots"
                      : "Restricted Access — Later Payout Slots Only"}
                  </p>
                  <p className="text-[11px] mt-0.5 opacity-80">
                    {trustScore >= 70
                      ? "Your score of 70+ grants priority choice of any open payout position."
                      : trustScore >= 40
                      ? "Scores 40–69 are assigned middle payout positions automatically."
                      : "Scores below 40 are assigned to the last available payout slots."}
                  </p>
                </div>
              </div>

              {/* Scoring Factors */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  How Your Score is Calculated
                </h4>

                <div className="space-y-2">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 text-xs">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold">On-Time Contributions <span className="text-emerald-600">+5 pts each</span></p>
                      <p className="text-muted-foreground text-[11px]">
                        Paying your rotation share on or before the due date boosts your score each round.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 text-xs">
                    <TrendingUp className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold">Completed Circle Cycles <span className="text-emerald-600">+10 pts each</span></p>
                      <p className="text-muted-foreground text-[11px]">
                        Completing an entire circle from start to finish with zero missed rounds.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 text-xs">
                    <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold">Missed or Late Payment <span className="text-red-600">-25 pts</span></p>
                      <p className="text-muted-foreground text-[11px]">
                        Defaulting on a round permanently locks you into later payout slots in future circles.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
