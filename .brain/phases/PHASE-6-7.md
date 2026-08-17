# PHASE 6 — REAL-TIME GLASS LEDGER
Status: ✅ COMPLETE | Gate: APPROVED | Completed: 2026-08-17
Goal: Contribution status updates live in real-time for all circle members.
Depends on: Phase 5 APPROVED | Blocks: Phase 7

## CHECKLIST
- [x] P6.1  Enable Realtime on transactions table (migration 006_enable_realtime.sql)
- [x] P6.2  Enable Realtime on memberships table
- [x] P6.3  Enable Realtime on circles table
- [x] P6.4  Create useCircleRealtime hook: src/hooks/use-circle-realtime.ts
             Manages channel subscription + cleanup on unmount
             Subscribes to INSERT/UPDATE on transactions WHERE circle_id = current
             Subscribes to INSERT/UPDATE on memberships WHERE circle_id = current
- [x] P6.5  Create GlassLedger component: src/components/circles/GlassLedger.tsx
             Live escrow progress bar (collected / target) with animated fill
             "4 of 5 members have paid" live count
             Transaction rows with flash animation on new INSERT events
             Real-time connection status badge (green ping / amber reconnecting)
- [x] P6.6  Replace static ledger in circle detail page with GlassLedger client component
- [x] P6.7  Add graceful fallback: if Realtime drops -> "Reconnecting..." badge
- [x] P6.8  git commit: "feat: real-time Glass Ledger with Supabase Realtime"

## GATE CRITERIA (ALL met)
- [x] GATE-6A Realtime subscription created and cleaned up on unmount
- [x] GATE-6B Status animations work correctly (grey -> green flash on confirm)
- [x] GATE-6C Progress bar updates in real-time as payments come in
- [x] GATE-6D Network drop shows fallback badge, Supabase auto-reconnects
- [x] GATE-6E GlassLedger seeded with SSR data — no loading flash on first render

---

# PHASE 7 — PWA & OFFLINE LAYER
Status: ✅ COMPLETE | Gate: APPROVED | Completed: 2026-08-17
Goal: App is installable. Works offline. Queues and syncs on reconnect.
Depends on: Phase 6 APPROVED | Blocks: Phase 8

## CHECKLIST
- [x] P7.1  Generated PWA icons: 192x192 and 512x512 (emerald green brand, rotating arrows)
             Saved to public/icons/icon-192.png and public/icons/icon-512.png
- [x] P7.2  public/manifest.json verified: standalone, emerald theme, correct icon paths
- [x] P7.3  next.config.ts @ducanh2912/next-pwa already configured (Phase 1)
- [x] P7.4  Create Dexie.js local DB: src/lib/local-db.ts
             Tables: circles, transactions, syncQueue
             Helpers: cacheCircles, cacheTransactions, getOfflineCircles, queueOfflineAction, flushSyncQueue
- [x] P7.5  Create useNetworkStatus hook: src/hooks/use-network-status.ts
             Listens to online/offline events
- [x] P7.6  Create NetworkBanner component: src/components/layout/NetworkBanner.tsx
             Amber top bar when offline — auto-hides on reconnect
- [x] P7.7  Create InstallPrompt component: src/components/layout/InstallPrompt.tsx
             Bottom sheet on first visit (beforeinstallprompt API)
             "Add Alajo to Home Screen" emerald CTA button
             Session storage dismissal — never shown twice in same session
- [x] P7.8  Add NetworkBanner + InstallPrompt to root layout.tsx
- [x] P7.9  Add Transactions (Ledger) nav link to Navbar
- [x] P7.10 git commit: "feat: offline-first PWA with service worker, Dexie.js sync, and install prompt"

## GATE CRITERIA (ALL met)
- [x] GATE-7A App shows install prompt bottom sheet on mobile
- [x] GATE-7B NetworkBanner shows when offline, hides when online
- [x] GATE-7C Dexie IndexedDB schema defined for offline caching
- [x] GATE-7D Sync queue ready for offline action replay on reconnect
- [x] GATE-7E Clean build — 0 TypeScript errors, 17 routes

## DEFERRED FROM THIS PHASE
- [~] DEFER-7A (-> V2): Background sync for offline contribution payments
      Reason: Payments MUST be online (financial integrity). Non-financial actions only.
