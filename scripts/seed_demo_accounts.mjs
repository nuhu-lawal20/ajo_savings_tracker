import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing SUPABASE credentials in .env.local");
  process.exit(1);
}

const adminDb = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const HELPER_ADMINS = [
  {
    email: "moderator1@kadashe.ng",
    password: "KadasheAdmin2026!",
    fullName: "Bello Garba",
    phone: "08011112233",
    role: "helper_admin",
    isAdmin: true,
    trustScore: 100,
    kycTier: 2,
  },
  {
    email: "moderator2@kadashe.ng",
    password: "KadasheAdmin2026!",
    fullName: "Zainab Aliyu",
    phone: "08022223344",
    role: "helper_admin",
    isAdmin: true,
    trustScore: 100,
    kycTier: 2,
  },
];

const DEMO_MEMBERS = [
  {
    email: "amina@kadashe.ng",
    password: "KadasheTest2026!",
    fullName: "Amina Onize Bello",
    phone: "08033334455",
    role: "none",
    isAdmin: false,
    trustScore: 85,
    kycTier: 2,
  },
  {
    email: "babajide@kadashe.ng",
    password: "KadasheTest2026!",
    fullName: "Babajide Adeleke",
    phone: "08044445566",
    role: "none",
    isAdmin: false,
    trustScore: 90,
    kycTier: 2,
  },
  {
    email: "emeka@kadashe.ng",
    password: "KadasheTest2026!",
    fullName: "Emeka Okafor",
    phone: "08055556677",
    role: "none",
    isAdmin: false,
    trustScore: 75,
    kycTier: 2,
  },
  {
    email: "musa@kadashe.ng",
    password: "KadasheTest2026!",
    fullName: "Musa Danladi",
    phone: "08066667788",
    role: "none",
    isAdmin: false,
    trustScore: 80,
    kycTier: 2,
  },
  {
    email: "chinedu@kadashe.ng",
    password: "KadasheTest2026!",
    fullName: "Chinedu Eze",
    phone: "08077778899",
    role: "none",
    isAdmin: false,
    trustScore: 70,
    kycTier: 2,
  },
  {
    email: "fatima@kadashe.ng",
    password: "KadasheTest2026!",
    fullName: "Fatima Umar",
    phone: "08088889900",
    role: "none",
    isAdmin: false,
    trustScore: 65,
    kycTier: 2,
  },
  {
    email: "tunde@kadashe.ng",
    password: "KadasheTest2026!",
    fullName: "Tunde Bakare",
    phone: "08099990011",
    role: "none",
    isAdmin: false,
    trustScore: 85,
    kycTier: 2,
  },
  {
    email: "halima@kadashe.ng",
    password: "KadasheTest2026!",
    fullName: "Halima Sani",
    phone: "08012341234",
    role: "none",
    isAdmin: false,
    trustScore: 60,
    kycTier: 2,
  },
  {
    email: "nnamdi@kadashe.ng",
    password: "KadasheTest2026!",
    fullName: "Nnamdi Kanu",
    phone: "08023452345",
    role: "none",
    isAdmin: false,
    trustScore: 75,
    kycTier: 2,
  },
  {
    email: "khalid@kadashe.ng",
    password: "KadasheTest2026!",
    fullName: "Khalid Ibrahim",
    phone: "08034563456",
    role: "none",
    isAdmin: false,
    trustScore: 95,
    kycTier: 2,
  },
];

async function seed() {
  console.log("🌱 Starting Kadashe Demo Evaluator Seeding...");

  const allAccounts = [...HELPER_ADMINS, ...DEMO_MEMBERS];

  for (const acc of allAccounts) {
    console.log(`Processing: ${acc.fullName} (${acc.email})...`);

    // 1. Create or update user in auth.users
    let userId = null;

    const { data: createData, error: createError } = await adminDb.auth.admin.createUser({
      email: acc.email,
      password: acc.password,
      email_confirm: true,
      user_metadata: { full_name: acc.fullName, phone: acc.phone },
    });

    if (createError) {
      if (createError.message.includes("already registered") || createError.message.includes("already exists")) {
        // Fetch existing user ID
        const { data: existingUser } = await adminDb
          .from("profiles")
          .select("id")
          .eq("email", acc.email)
          .single();

        if (existingUser) {
          userId = existingUser.id;
          // Update password
          await adminDb.auth.admin.updateUserById(userId, { password: acc.password });
        }
      } else {
        console.error(`Error creating auth user ${acc.email}:`, createError.message);
        continue;
      }
    } else if (createData?.user) {
      userId = createData.user.id;
    }

    if (!userId) continue;

    // 2. Upsert profile
    const { error: profileError } = await adminDb.from("profiles").upsert({
      id: userId,
      email: acc.email,
      full_name: acc.fullName,
      phone: acc.phone,
      is_admin: acc.isAdmin,
      admin_role: acc.role,
      trust_score: acc.trustScore,
      kyc_tier: acc.kycTier,
      is_suspended: false,
      updated_at: new Date().toISOString(),
    }, { onConflict: "id" });

    if (profileError) {
      console.error(`Error updating profile for ${acc.email}:`, profileError.message);
    } else {
      console.log(`✅ Seeded: ${acc.fullName} (${acc.role === "helper_admin" ? "🛡️ Helper Admin" : "👤 Tier 1 Member"})`);
    }
  }

  console.log("\n🎉 Seeding complete! All 12 demo evaluator accounts are ready for login.");
}

seed().catch(console.error);
