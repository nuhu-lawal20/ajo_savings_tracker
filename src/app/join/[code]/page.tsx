import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KadasheLogo } from "@/components/ui/kadashe-logo";
import {
  Calendar,
  Users,
  ShieldCheck,
  CircleDollarSign,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { JoinCircleButton } from "@/components/circles/JoinCircleButton";

export default async function JoinCirclePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const supabase = await createClient();
  const { code: rawCode } = await params;
  const inviteCode = decodeURIComponent(rawCode || "").trim().toUpperCase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const adminDb = createAdminClient();

  // Find circle by invite code with creator profile & current memberships
  const { data: circle, error } = await adminDb
    .from("circles")
    .select("*, creator:profiles!circles_creator_id_fkey(full_name, avatar_url), memberships(id, user_id)")
    .eq("invite_code", inviteCode)
    .single();

  if (error || !circle) {
    notFound();
  }

  const currentMembersCount = circle.memberships?.length ?? 0;
  const isFull = currentMembersCount >= circle.max_members;
  const isAlreadyMember = user ? circle.memberships?.some((m: any) => m.user_id === user.id) : false;
  const totalPoolPayout = Number(circle.contribution_amount) * circle.max_members;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-background">
      <div className="w-full max-w-lg space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <KadasheLogo withLink size="lg" />
          <Badge variant="outline" className="px-3 py-0.5 text-xs text-[#0284C7] dark:text-sky-400 border-sky-500/30">
            Circle Invitation
          </Badge>
        </div>

        {/* Circle Card */}
        <Card className="border-[#e1e8f0] dark:border-sky-500/20 bg-card shadow-lg shadow-black/5 rounded-3xl overflow-hidden">
          <CardHeader className="space-y-2 text-center pb-4">
            <CardTitle className="text-2xl font-bold tracking-tight">{circle.name}</CardTitle>
            <CardDescription className="text-xs">
              Organized by <span className="font-semibold text-foreground">{circle.creator?.full_name}</span>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Pool Metrics Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-500/20 text-center">
                <p className="text-[11px] text-muted-foreground font-semibold">Total Round Payout</p>
                <p className="text-xl font-extrabold text-[#0284C7] dark:text-sky-400 mt-0.5">
                  ₦{totalPoolPayout.toLocaleString()}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-muted/40 border border-border text-center">
                <p className="text-[11px] text-muted-foreground font-semibold">Per-Round Share</p>
                <p className="text-xl font-bold text-foreground mt-0.5">
                  ₦{Number(circle.contribution_amount).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Circle Details List */}
            <div className="space-y-3 text-xs border-y border-border/60 py-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#0284C7]" />
                  Frequency
                </span>
                <span className="font-bold capitalize">{circle.frequency}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Users className="h-4 w-4 text-[#0284C7]" />
                  Members
                </span>
                <span className="font-bold">
                  {currentMembersCount} / {circle.max_members} Joined
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#0284C7]" />
                  Security Mode
                </span>
                <span className="font-bold text-[#0284C7] dark:text-sky-400">100% Automated Escrow</span>
              </div>
            </div>

            {/* Join Button / Status */}
            {isAlreadyMember ? (
              <div className="space-y-3">
                <div className="p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/40 text-[#0284C7] dark:text-sky-300 text-xs font-semibold text-center">
                  You are already a member of this circle!
                </div>
                <Link href={`/circles/${circle.id}`} className="block">
                  <Button className="w-full h-11 bg-[#0284C7] hover:bg-[#0369A1] text-white font-semibold rounded-full">
                    Go to Circle Ledger
                  </Button>
                </Link>
              </div>
            ) : isFull ? (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-xs font-semibold text-center">
                This circle is currently full. Contact the organizer to create a new circle.
              </div>
            ) : (
              <JoinCircleButton inviteCode={inviteCode} isLoggedIn={!!user} />
            )}
          </CardContent>
        </Card>

        {/* Back Link */}
        <div className="text-center">
          <Link href="/dashboard" className="text-xs text-muted-foreground hover:text-foreground font-medium inline-flex items-center gap-1.5">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
