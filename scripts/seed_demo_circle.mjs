import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const adminDb = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function seedCircle() {
  console.log("🌱 Seeding Demo Active Savings Circle...");

  // Fetch creator: Amina
  const { data: amina } = await adminDb.from("profiles").select("id").eq("email", "amina@kadashe.ng").single();
  const { data: babajide } = await adminDb.from("profiles").select("id").eq("email", "babajide@kadashe.ng").single();
  const { data: emeka } = await adminDb.from("profiles").select("id").eq("email", "emeka@kadashe.ng").single();
  const { data: musa } = await adminDb.from("profiles").select("id").eq("email", "musa@kadashe.ng").single();
  const { data: chinedu } = await adminDb.from("profiles").select("id").eq("email", "chinedu@kadashe.ng").single();

  if (!amina || !babajide || !emeka || !musa || !chinedu) {
    console.error("Missing members for circle seeding");
    return;
  }

  // Create circle
  const { data: circle, error: circleError } = await adminDb.from("circles").insert({
    creator_id: amina.id,
    name: "Kaduna Tech & Market Adashe",
    description: "Weekly peer savings rotation for Kaduna market entrepreneurs and tech freelancers.",
    contribution_amount: 25000,
    frequency: "weekly",
    max_members: 5,
    status: "active",
    current_round: 1,
    invite_code: "KADA-778899",
  }).select().single();

  if (circleError) {
    console.error("Error creating circle:", circleError.message);
    return;
  }

  console.log("✅ Created Circle:", circle.name, `(${circle.id})`);

  // Add memberships
  const members = [
    { circle_id: circle.id, user_id: amina.id, payout_position: 1, has_paid_current_round: true, payout_status: "pending" },
    { circle_id: circle.id, user_id: babajide.id, payout_position: 2, has_paid_current_round: true, payout_status: "pending" },
    { circle_id: circle.id, user_id: emeka.id, payout_position: 3, has_paid_current_round: false, payout_status: "pending" },
    { circle_id: circle.id, user_id: musa.id, payout_position: 4, has_paid_current_round: true, payout_status: "pending" },
    { circle_id: circle.id, user_id: chinedu.id, payout_position: 5, has_paid_current_round: false, payout_status: "pending" },
  ];

  await adminDb.from("memberships").insert(members);
  console.log("✅ Inserted 5 Circle Memberships with automated rotation slots.");

  // Insert confirmed transactions for Round 1
  const txs = [
    { circle_id: circle.id, user_id: amina.id, amount: 25000, type: "contribution", status: "confirmed", reference: "ref_amina_rnd1_001" },
    { circle_id: circle.id, user_id: babajide.id, amount: 25000, type: "contribution", status: "confirmed", reference: "ref_baba_rnd1_002" },
    { circle_id: circle.id, user_id: musa.id, amount: 25000, type: "contribution", status: "confirmed", reference: "ref_musa_rnd1_003" },
  ];

  await adminDb.from("transactions").insert(txs);
  console.log("✅ Inserted 3 confirmed Glass Ledger transactions totaling ₦75,000 in escrow.");
}

seedCircle().catch(console.error);
