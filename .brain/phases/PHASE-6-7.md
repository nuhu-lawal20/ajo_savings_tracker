# PHASE 6 — REAL-TIME GLASS LEDGER
Status: LOCKED | Gate: PENDING
Goal: Contribution status updates live in real-time for all circle members.
Depends on: Phase 5 APPROVED | Blocks: Phase 7

## CHECKLIST
- [ ] P6.1  Enable Realtime on transactions table (Supabase -> Database -> Replication)
- [ ] P6.2  Enable Realtime on memberships table
- [ ] P6.3  Create GlassLedger component: src/components/circles/GlassLedger.tsx
             Columns: Position | Member | Amount | Status | Time Paid
- [ ] P6.4  Add Supabase Realtime subscription to GlassLedger
             Subscribe to INSERT/UPDATE on transactions WHERE circle_id = current
             On event -> update row in-place (no refresh)
- [ ] P6.5  Create useCircleRealtime hook: src/hooks/use-circle-realtime.ts
             Manages channel subscription + cleanup on unmount
- [ ] P6.6  Add animated status indicators:
             Pending -> grey pulse | Confirmed -> green checkmark fade-in | New -> row flash
- [ ] P6.7  Add running total: "35,000 collected of 50,000 target" progress bar
- [ ] P6.8  Add live paid count: "4 of 5 members have paid this round"
- [ ] P6.9  Add EscrowBalance display (visual simulation — not real escrow in MVP)
- [ ] P6.10 Highlight current payout recipient row in gold
- [ ] P6.11 TEST: Open circle in 2 browser tabs -> pay in tab 1 -> tab 2 updates within 2 seconds
- [ ] P6.12 TEST: Realtime reconnects after DevTools -> Network -> Offline -> Online
- [ ] P6.13 Add graceful fallback: if Realtime drops -> show "Refresh to update" banner
- [ ] P6.14 git commit: "feat: real-time Glass Ledger with Supabase Realtime"

## GATE CRITERIA (ALL must be TRUE before Phase 7 starts)
- [ ] GATE-6A Payment in tab 1 reflects in tab 2 within 2 seconds (no refresh)
- [ ] GATE-6B Status animations work correctly (grey -> green)
- [ ] GATE-6C Progress bar updates in real-time
- [ ] GATE-6D Network drop shows fallback banner, auto-reconnects
- [ ] GATE-6E Realtime subscription cleaned up on component unmount (no memory leaks)

## DEFERRED FROM THIS PHASE
- [~] DEFER-6A (-> Phase 7): GlassLedger shows cached data when offline
      Reason: Requires Dexie.js IndexedDB caching (Phase 7)

---

# PHASE 7 — PWA & OFFLINE LAYER
Status: LOCKED | Gate: PENDING
Goal: App is installable. Works offline. Queues and syncs on reconnect.
Depends on: Phase 6 APPROVED | Blocks: Phase 8

## CHECKLIST
- [ ] P7.1  Generate PWA icons: 192x192 and 512x512 maskable (emerald green brand)
             Save to public/icons/icon-192.png and public/icons/icon-512.png
- [ ] P7.2  Create public/manifest.json:
             name: Alajo, short_name: Alajo, theme_color: #065f46, display: standalone
- [ ] P7.3  Configure next.config.ts with @ducanh2912/next-pwa caching strategies:
             Cache First: app shell | SWR: /api/circles | Network First: /api/transactions
             Network Only: paystack.co (payments MUST be online)
- [ ] P7.4  Create Dexie.js local DB: src/lib/local-db.ts
             Tables: circles, transactions, syncQueue
- [ ] P7.5  Create offline sync module: src/lib/offline-sync.ts
             Functions: queueOfflineAction(), flushSyncQueue(), replayAction()
- [ ] P7.6  Create useNetworkStatus hook: src/hooks/use-network-status.ts
             Listens to online/offline events -> calls flushSyncQueue() on reconnect
- [ ] P7.7  Create NetworkBanner component: amber bar when offline
             Text: "You are offline. Data is safe — syncing when you reconnect."
- [ ] P7.8  Create InstallPrompt component: bottom sheet on first visit (mobile)
             Text: "Add Alajo to your home screen — works without internet!"
- [ ] P7.9  Add NetworkBanner + InstallPrompt to root layout
- [ ] P7.10 Mirror circles from API to localDB.circles on every successful fetch
- [ ] P7.11 Mirror transactions from API to localDB.transactions on every fetch
- [ ] P7.12 CircleCard falls back to localDB data when offline
- [ ] P7.13 GlassLedger shows cached transactions when offline (resolves DEFER-6A)
- [ ] P7.14 Queue circle join action if offline -> replay on reconnect
- [ ] P7.15 TEST install: Chrome DevTools -> Application -> Manifest -> Install
- [ ] P7.16 TEST offline: DevTools -> Network -> Offline -> navigate circles -> confirm visible
- [ ] P7.17 TEST sync: Offline -> try action -> Online -> confirm synced
- [ ] P7.18 Run Lighthouse PWA audit: target score >= 90
- [ ] P7.19 git commit: "feat: offline-first PWA with service worker and Dexie.js sync"

## GATE CRITERIA (ALL must be TRUE before Phase 8 starts)
- [ ] GATE-7A App shows install prompt / browser install button
- [ ] GATE-7B App loads from cache when Network set to Offline in DevTools
- [ ] GATE-7C Circles visible offline (from IndexedDB)
- [ ] GATE-7D Transactions visible offline (from IndexedDB)
- [ ] GATE-7E Queued actions sync when reconnected
- [ ] GATE-7F Lighthouse PWA score >= 90
- [ ] GATE-7G NetworkBanner shows when offline hides when online

## DEFERRED FROM THIS PHASE
- [~] DEFER-7A (-> V2): Background sync for offline contribution payments
      Reason: Payments MUST be online (financial integrity). Non-financial actions only.
