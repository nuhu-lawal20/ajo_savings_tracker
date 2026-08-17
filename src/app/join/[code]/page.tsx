import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ShieldCheck, Calendar, Users, CircleDollarSign, ArrowLeft } from "lucide-react";
import { JoinCircleButton } from "@/components/circles/JoinCircleButton";

export default async function PublicJoinPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code: rawCode } = await params;
  const inviteCode = rawCode.trim().toUpperCase();

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch circle by invite code
  const { data: circle, error } = await supabase
    .from("circles")
    .select("*, creator:profiles!circles_creator_id_fkey(*), memberships(id, user_id)")
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
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-2xl shadow-md shadow-emerald-600/25">
              A
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-foreground">Alajo</span>
          </Link>
          <Badge variant="outline" className="px-3 py-0.5 text-xs text-emerald-600 border-emerald-500/30">
            Circle Invitation
          </Badge>
        </div>

        {/* Circle Card */}
        <Card className="border-border/60 bg-card shadow-lg shadow-black/5">
          <CardHeader className="space-y-2 text-center pb-4">
            <CardTitle className="text-2xl font-bold tracking-tight">{circle.name}</CardTitle>
            <CardDescription className="text-xs">
              Organized by <span className="font-semibold text-foreground">{circle.creator?.full_name}</span>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Pool Metrics Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 text-center">
                <p className="text-[11px] text-muted-foreground font-semibold">Total Round Payout</p>
                <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  ₦{totalPoolPayout.toLocaleString()}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-muted/40 border border-border text-center">
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
                  <Calendar className="h-4 w-4 text-emerald-600" />
                  Frequency
                </span>
                <span className="font-bold capitalize">{circle.frequency}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Users className="h-4 w-4 text-emerald-600" />
                  Members
                </span>
                <span className="font-bold">
                  {currentMembersCount} / {circle.max_members} Joined
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  Security Mode
                </span>
                <span className="font-bold text-emerald-600">100% Automated Escrow</span>
              </div>
            </div>

            {/* Join Button / Status */}
            {isAlreadyMember ? (
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold text-center">
                  You are already a member of this circle!
                </div>
                <Link href={`/circles/${circle.id}`} className="block">
                  <Button className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
                    Go to Circle Ledger
                  </Button>
                </Link>
              </div>
            ) : isFull ? (
              <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-xs font-semibold text-center">
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
