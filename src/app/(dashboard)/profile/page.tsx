import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, User, Mail, Phone, Award, CheckCircle2, TrendingUp, AlertTriangle } from "lucide-react";

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

  const trustScore = profile?.trust_score ?? 50;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Trust Profile & Identity</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Your reputation score dictates rotation priority and platform trust.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Profile Card */}
        <div className="space-y-6">
          <Card className="border-border/60 bg-card shadow-sm">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto h-20 w-20 rounded-full bg-emerald-600 flex items-center justify-center text-white text-2xl font-bold mb-3 shadow-md shadow-emerald-600/30">
                {profile?.full_name?.charAt(0)?.toUpperCase() ?? "U"}
              </div>
              <CardTitle className="text-lg font-bold">{profile?.full_name}</CardTitle>
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
                  Account Type
                </span>
                <span className="font-semibold text-emerald-600">Member</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: AI Trust Score Engine Breakdown (2 columns) */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-border/60 bg-card shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-emerald-600" />
                    AI Trust Score: {trustScore} / 100
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Calculated by automated Postgres algorithm on every rotation cycle
                  </CardDescription>
                </div>
                <Badge
                  className={`text-xs px-3 py-1 font-bold ${
                    trustScore >= 70
                      ? "bg-emerald-600 text-white"
                      : trustScore >= 40
                      ? "bg-amber-600 text-white"
                      : "bg-red-600 text-white"
                  }`}
                >
                  {trustScore >= 70 ? "Excellent" : trustScore >= 40 ? "Good" : "Needs Improvement"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 transition-all duration-500 rounded-full"
                    style={{ width: `${trustScore}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground font-semibold">
                  <span>0 (High Risk)</span>
                  <span>50 (New Member Default)</span>
                  <span>100 (Verified Leader)</span>
                </div>
              </div>

              {/* Scoring Factors */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Trust Score Factors
                </h4>
                
                <div className="space-y-2">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 text-xs">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold">On-Time Contributions (+5 pts each)</p>
                      <p className="text-muted-foreground text-[11px]">
                        Paying your rotation share on or before the due date boosts your score.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 text-xs">
                    <TrendingUp className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold">Completed Circle Cycles (+10 pts each)</p>
                      <p className="text-muted-foreground text-[11px]">
                        Participating in a circle from start to finish with zero missed rounds.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 text-xs">
                    <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold">Defaulted / Late Payment (-25 pts)</p>
                      <p className="text-muted-foreground text-[11px]">
                        Defaulting on a round locks you into later payout slots in future circles.
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
