import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, CircleDollarSign, ArrowRight, ShieldCheck, KeyRound } from "lucide-react";

export default async function CirclesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch all circles joined by user
  const { data: myMemberships } = await supabase
    .from("memberships")
    .select("*, circle:circles(*, creator:profiles!circles_creator_id_fkey(full_name))")
    .eq("user_id", user!.id);

  // Fetch all other open/pending circles that user has not joined yet
  const joinedCircleIds = (myMemberships ?? []).map((m: any) => m.circle_id);

  let openCirclesQuery = supabase
    .from("circles")
    .select("*, creator:profiles!circles_creator_id_fkey(full_name), memberships(id)")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (joinedCircleIds.length > 0) {
    openCirclesQuery = openCirclesQuery.not("id", "in", `(${joinedCircleIds.join(",")})`);
  }

  const { data: openCircles } = await openCirclesQuery;

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Savings Circles</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your rotating pools, monitor rotation turns, or join a new group.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/circles/create">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/25">
              <Plus className="mr-1.5 h-4 w-4" />
              Create Circle
            </Button>
          </Link>
        </div>
      </div>

      {/* Join with Invite Code Quick Bar */}
      <Card className="border-border/60 bg-card/60">
        <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Have a Private Invite Code?</h3>
              <p className="text-xs text-muted-foreground">Enter an invite code from a friend to join their rotation.</p>
            </div>
          </div>

          <form action="/join" method="GET" className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              name="code"
              placeholder="e.g. ALAJO-9X2P"
              required
              className="h-10 px-3 rounded-lg border border-border bg-background text-xs font-mono uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full sm:w-44"
            />
            <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white shrink-0">
              Join
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Section 1: My Circles */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
          <span>My Circles</span>
          <Badge variant="outline" className="text-xs font-normal">
            {myMemberships?.length ?? 0}
          </Badge>
        </h2>

        {(!myMemberships || myMemberships.length === 0) ? (
          <Card className="p-8 text-center border-dashed">
            <p className="text-xs text-muted-foreground">You have not joined any savings circles yet.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {myMemberships.map((m: any) => (
              <Card key={m.id} className="border-border/60 hover:shadow-md transition-shadow flex flex-col justify-between">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-[10px] uppercase font-semibold">
                      {m.circle?.frequency}
                    </Badge>
                    <Badge
                      className={`text-[10px] ${
                        m.circle?.status === "active"
                          ? "bg-emerald-600 text-white"
                          : m.circle?.status === "completed"
                          ? "bg-blue-600 text-white"
                          : "bg-amber-500 text-white"
                      }`}
                    >
                      {m.circle?.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-base font-bold mt-2">{m.circle?.name}</CardTitle>
                  <CardDescription className="text-xs line-clamp-2">
                    {m.circle?.description || "Peer-to-peer rotating savings pool"}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0 space-y-3">
                  <div className="p-3 rounded-lg bg-muted/40 text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Your Slot</span>
                      <span className="font-bold text-foreground">Position #{m.payout_position}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Contribution</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        ₦{Number(m.circle?.contribution_amount).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <Link href={`/circles/${m.circle_id}`} className="block">
                    <Button variant="outline" size="sm" className="w-full font-semibold text-xs">
                      View Circle Ledger
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Section 2: Open Circles to Join */}
      <div className="space-y-4 pt-4">
        <h2 className="text-lg font-bold tracking-tight">Open Community Circles</h2>

        {(!openCircles || openCircles.length === 0) ? (
          <Card className="p-8 text-center border-dashed">
            <p className="text-xs text-muted-foreground">No other open circles waiting for members right now.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {openCircles.map((c: any) => {
              const currentMembers = c.memberships?.length ?? 0;
              const slotsLeft = c.max_members - currentMembers;

              return (
                <Card key={c.id} className="border-border/60 hover:shadow-md transition-shadow flex flex-col justify-between">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-[10px] uppercase font-semibold">
                        {c.frequency}
                      </Badge>
                      <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-500/30">
                        {slotsLeft} slots remaining
                      </Badge>
                    </div>
                    <CardTitle className="text-base font-bold mt-2">{c.name}</CardTitle>
                    <CardDescription className="text-xs">
                      Organizer: {c.creator?.full_name ?? "Member"}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0 space-y-3">
                    <div className="p-3 rounded-lg bg-muted/40 text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Pool Payout</span>
                        <span className="font-bold text-emerald-600">
                          ₦{(Number(c.contribution_amount) * c.max_members).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Per Round</span>
                        <span className="font-medium">₦{Number(c.contribution_amount).toLocaleString()}</span>
                      </div>
                    </div>

                    <Link href={`/join/${c.invite_code}`} className="block">
                      <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs">
                        Join Circle
                        <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
