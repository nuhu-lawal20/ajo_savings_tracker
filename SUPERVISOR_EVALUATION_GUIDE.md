# 🇳🇬 Kadashe — 3MTT Capstone Supervisor & Evaluator Guide
> **Project:** Kadashe (*Traditional Adashe. Programmatic Trust.*)  
> **Fellow:** Nuhu Lawal (`FE/23/84783109` | `nuhulawal20@gmail.com`)  
> **Track:** Software Development Track — Almara Hub, Paragon Nigeria, Kaduna State  
> 
> 🌐 **LIVE PRODUCTION APPLICATION:** [**https://kadashe.vercel.app/**](https://kadashe.vercel.app/)  
> 📦 **GITHUB REPOSITORY:** [**https://github.com/nuhu-lawal20/ajo_savings_tracker**](https://github.com/nuhu-lawal20/ajo_savings_tracker)  
> 💻 **LOCAL ENVIRONMENT:** `http://localhost:3000` (if evaluating locally)

---

## 🎯 1. Executive Summary & Problem Solved
In Northern Nigeria and across West Africa, over ₦1.8 Trillion flows through informal rotating savings associations (**Adashe / Ajo / Esusu**). However, traditional Adashe is plagued by:
1. **Embezzlement & Default Risk:** Fraudulent collectors (*Alajo*) running away with communal savings.
2. **Paper Notebook Disputes:** Lack of transparent payment accounting and ledger tracking.
3. **Cash-Handling Vulnerability:** Physical cash transit dangers in local markets.

**Kadashe** solves this through **Zero-Custody Escrow (Paystack)**, **Algorithmic AI Trust Scoring**, and a **Live Real-time Glass Ledger**.

---

## 🔐 2. Pre-Seeded Supervisor & Evaluator Accounts
To allow supervisors to evaluate the application without waiting for email delivery or OTP tokens, **12 pre-seeded test accounts** with verified Tier 1 KYC and active savings circles are provisioned below.

### 🛡️ A. Helper Admin (Operations & Risk Moderator) Accounts
*Admins hold operational moderation rights: inspect user trust dossiers, freeze high-risk circles, and suspend non-compliant users.*

| Role | Full Name | Email | Password | Access Level |
|---|---|---|---|---|
| **Helper Admin 1** | Bello Garba | `moderator1@kadashe.ng` | `KadasheAdmin2026!` | Full Admin Console (`/admin`) |
| **Helper Admin 2** | Zainab Aliyu | `moderator2@kadashe.ng` | `KadasheAdmin2026!` | Full Admin Console (`/admin`) |

---

### 👤 B. Active Circle Members (Kaduna Tech & Market Adashe)
*A live 5-member Adashe circle (`Kaduna Tech & Market Adashe`, ₦25,000 weekly pool) is currently active and pre-populated with Round 1 contributions.*

| Turn / Position | Full Name | Email | Password | Role & AI Reputation | Payment Status |
|:---:|---|---|---|---|:---:|
| **Turn #1** | Babajide Adeleke | `babajide@kadashe.ng` | `KadasheTest2026!` | 🥇 **Highest Trust Score (90/100)** | Confirmed ₦25k ✅ |
| **Turn #2** | Amina Onize Bello | `amina@kadashe.ng` | `KadasheTest2026!` | 🥈 **Circle Organizer (85/100)** | Confirmed ₦25k ✅ |
| **Turn #3** | Musa Danladi | `musa@kadashe.ng` | `KadasheTest2026!` | 🥉 Contributor (80/100) | Confirmed ₦25k ✅ |
| **Turn #4** | Emeka Okafor | `emeka@kadashe.ng` | `KadasheTest2026!` | 🏅 Contributor (65/100) | Confirmed ₦25k ✅ |
| **Turn #5** | Chinedu Eze | `chinedu@kadashe.ng` | `KadasheTest2026!` | 🏅 Contributor (60/100) | Due R1 ⏳ |

> ⚖️ **Anti-Organizer Favoritism Rule:** In Kadashe, circle creators never receive automatic first-turn privileges. Positions are algorithmically assigned by AI Trust Score. If an organizer shares the exact same trust score as a fellow member, the algorithm automatically places the organizer **below** the regular member.

---

### 👤 C. Additional High-Trust & Independent Evaluator Accounts

| Full Name | Email | Password | Status & Verification | Trust Score |
|---|---|---|---|:---:|
| **Fatima Umar** | `fatima@kadashe.ng` | `KadasheTest2026!` | Tier 1 Verified (Kano Merchant) | 65 / 100 |
| **Tunde Bakare** | `tunde@kadashe.ng` | `KadasheTest2026!` | Tier 1 Verified (Lagos Freelancer) | 85 / 100 |
| **Halima Sani** | `halima@kadashe.ng` | `KadasheTest2026!` | Tier 1 Verified (Kaduna Artisan) | 60 / 100 |
| **Nnamdi Kanu** | `nnamdi@kadashe.ng` | `KadasheTest2026!` | Tier 1 Verified (Aba Trader) | 75 / 100 |
| **Khalid Ibrahim** | `khalid@kadashe.ng` | `KadasheTest2026!` | Tier 1 Verified (Elite Saver) | 95 / 100 |

---

## 🏛️ 3. Segregation of Duties & Super Admin Architecture
> [!IMPORTANT]
> **Enterprise Security Notice (ISO 27001 & CBN Compliance):**  
> In institutional fintechs, the master Super Admin account (`nuhulawal20@gmail.com`) is **air-gapped from evaluator demo access**. System administrators are strictly prohibited from participating in consumer savings pools to eliminate **Moral Hazard and Conflict of Interest**.

### 👑 Super Admin Capabilities (Master Governance):
1. **Direct Provisioning:** Super Admin directly provisions Helper Admins via internal Supabase Service Role engines (`adminDb.auth.admin.createUser`).
2. **Account Immunity:** Super Admin accounts hold cryptographic immunity and can **never be suspended, paused, or demoted by any operator**.
3. **Treasury Governance:** Direct oversight over automated Paystack virtual escrow balances and system reserve funds.
4. **Emergency Kill-Switch:** Master authority to freeze or unfreeze any circle across the platform with 1 click.
5. **Tamper-Proof Account Simulation (`Simulate Member View`):** Super Admin can simulate any member account (e.g. *Amina* or *Babajide*) to inspect their user experience and live rotation status. State changes and funds are locked in read-only preview mode to prevent accidental tampering with real system records.

---

## 🧪 4. Suggested Supervisor Testing Journeys

### 🧭 Test Journey 1: Evaluate Helper Admin Moderation
1. Go to [**https://kadashe.vercel.app/login**](https://kadashe.vercel.app/login) (or `http://localhost:3000/login`).
2. Click **"Helper Admin 1"** on the fast-pass card (or enter `moderator1@kadashe.ng` / `KadasheAdmin2026!`).
3. You will land directly in the **Platform Governance & Risk Terminal** ([`/admin`](https://kadashe.vercel.app/admin)).
4. **Actions to Test:**
   * **Freeze Circle:** Click **"❄️ Freeze Circle"** on the live *Kaduna Tech & Market Adashe* card. Notice how it immediately pauses contributions and payouts. Click **"Unfreeze & Restore"** to restore.
   * **Inspect User Dossier:** Click any member (e.g. *Emeka Okafor*) in the Member Directory to view their complete KYC and Trust Score dossier.
   * **Suspend Account:** Test the **"Suspend Account"** button to lockout fraudulent actors.

---

### 🧭 Test Journey 2: Evaluate Algorithmic Fairness (Babajide Adeleke)
1. Sign in with `babajide@kadashe.ng` / `KadasheTest2026!` at [**https://kadashe.vercel.app/login**](https://kadashe.vercel.app/login).
2. Navigate to [`/dashboard`](https://kadashe.vercel.app/dashboard) and [`/circles`](https://kadashe.vercel.app/circles).
3. Click into **"Kaduna Tech & Market Adashe"**.
4. **Actions to Test:**
   * Notice that Babajide holds **Turn #1 (Earliest Payout)** because he has the highest AI Trust Score (**90/100**).
   * Click any member card in the **Rotation Payout Order** list to open their interactive **Member Trust Dossier Modal**.
   * View the **Real-Time Glass Ledger** showing live confirmed Round 1 contributions (₦75,000 currently locked in Paystack escrow).

---

### 🧭 Test Journey 3: Evaluate Circle Organizer (Amina Onize Bello)
1. Sign in with `amina@kadashe.ng` / `KadasheTest2026!` at [**https://kadashe.vercel.app/login**](https://kadashe.vercel.app/login).
2. Open **"Kaduna Tech & Market Adashe"**.
3. Notice that although Amina created the circle, her **85/100** Trust Score puts her in **Turn #2**, demonstrating complete algorithmic impartiality.
4. Check the copyable **Circle Invite Code** (`KADA-778899`).

---

### 🧭 Test Journey 4: Evaluate Integrated Wallet & AML Name-Matching Security (Phase 11)
> [!TIP]
> **Fintech Architecture Highlight:**  
> Kadashe features a **Dual-Pillar Financial Engine**: separating **Personal Ready Wallet Cash** from **Zero-Custody Escrow Savings**.

1. Sign in as any member (e.g. `amina@kadashe.ng` or `babajide@kadashe.ng`).
2. Navigate to **"My Wallet"** ([`/wallet`](https://kadashe.vercel.app/wallet)) via the sidebar or bottom navigation.
3. **Actions to Test:**
   * **Test AML Bank Account Name-Matching Security (Live Paystack Verification):**
     1. Click **"Link Bank Account"**.
     2. Select any Nigerian bank (e.g., *EcoBank Nigeria*, *GTBank*, *Access Bank*).
     3. Enter an account number that belongs to a different person (e.g. an account under another name).
     4. Click **"Verify & Link Account"**.
     5. **Observe the security guard:** The system queries Paystack's real-time Name Enquiry API, performs a tokenized similarity check against the user's KYC verified name, and **blocks the third-party account linkage** with an explicit anti-money laundering warning:  
        `"Account name [Name] does not match your verified name [KYC Name]. Only accounts in your own name are permitted."`
     6. Linking is only permitted when the account holder matches the authenticated user, preventing third-party money laundering.
   * **Fund Wallet:** Click **"Fund Wallet"** to launch the Paystack top-up modal with preset quick amounts (₦1,000, ₦5,000, ₦10,000, etc.).
   * **Ledger Transparency:** Inspect the **Wallet Ledger** table showing timestamped, immutable credit and debit entries.

---

### 🧭 Test Journey 5: Experience Live Circle Contribution as an Unpaid Member (Chinedu Eze)
1. Go to [**https://kadashe.vercel.app/login**](https://kadashe.vercel.app/login) (or `http://localhost:3000/login`).
2. Click **"Chinedu Eze (Turn #5 • Unpaid ⏳)"** on the fast-pass card (or enter `chinedu@kadashe.ng` / `KadasheTest2026!`).
3. **Actions to Test:**
   * Open [`/transactions`](http://localhost:3000/transactions):
     * Notice Chinedu is highlighted in amber under **"Yet to Contribute (You — Due)"** with a dedicated **"Pay Now"** button.
     * The Round #1 Escrow Vault currently shows `₦100,000 / ₦125,000` collected from 4 peers (Babajide, Amina, Musa, Emeka).
   * Open **"Kaduna Tech & Market Adashe"** ([`/circles/06e2c54d-9561-473b-8a45-06e43f075836`](http://localhost:3000/circles/06e2c54d-9561-473b-8a45-06e43f075836)):
     * Notice the prominent **"Pay ₦25,000"** escrow contribution action button.
   * Click **"Pay ₦25,000"**:
     * Select **"Pay with Paystack"** or **"Pay from Wallet"**.
     * In the Paystack modal, select **"Card"** ➡️ Click **"Success"**.
   * **Observe the Instant Reaction:**
     * The Escrow Vault immediately reaches **`₦125,000 / ₦125,000 (100% Funded)`** (all 5 members paid).
     * Turn #1 recipient (**Babajide Adeleke**) receives the automated Round #1 lump-sum payout of **₦125,000** credited to his Kadashe Wallet!
     * Chinedu transitions into the green **"Confirmed Contributors"** list.
     * Chinedu's AI Trust Score gains **+5 pts** for timely contribution.
     * A cryptographic payment receipt broadcasts live across the **Transparent Glass Ledger**.

---

## 🏛️ 5. Capstone Demo vs Production Scope
* **Capstone Evaluation Mode:** Full UI, ledger math, race condition protection, name-match validation, and database operations run in **Paystack Test Mode** so supervisors can evaluate real-world fintech flows without actual naira movement.
* **Production Deployment:** Swap test keys with live keys, activate CBN PSSP integration, and enable live float account settlement.
