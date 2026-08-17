# PHASE 1 — PROJECT SCAFFOLDING
Status: ✅ COMPLETE | Gate: APPROVED | Completed: 2026-08-17
Goal: Working Next.js app running locally, all packages installed.
Depends on: Phase 0 APPROVED | Blocks: Phase 2

## CHECKLIST
- [x] P1.1  Scaffold: npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
- [x] P1.2  Install: @supabase/supabase-js @supabase/ssr
- [x] P1.3  Install: @upstash/redis @upstash/ratelimit
- [x] P1.4  Install: resend @react-email/components
- [x] P1.5  Install: dexie dexie-react-hooks @ducanh2912/next-pwa
- [x] P1.6  Install: zod react-hook-form @hookform/resolvers
- [x] P1.7  Install: date-fns lucide-react cloudinary
- [x] P1.8  Install: @sentry/nextjs @vercel/analytics @vercel/speed-insights
- [x] P1.9  Init shadcn: npx shadcn@latest init (style: default, baseColor: slate)
- [x] P1.10 Add shadcn components: button input card badge dialog avatar progress
- [x] P1.11 Configure next.config.ts (PWA wrapper + security headers)
- [x] P1.12 Configure globals.css / theme tokens (emerald palette brand colors)
- [x] P1.13 Create folder structure: app/ components/ lib/ types/
- [x] P1.14 Create src/lib/supabase/client.ts (browser Supabase client)
- [x] P1.15 Create src/lib/supabase/server.ts (server-side Supabase client)
- [x] P1.16 Create src/lib/validations.ts (all Zod schemas)
- [x] P1.17 Create src/types/database.types.ts (database types placeholder)
- [x] P1.18 Create src/middleware.ts (Supabase session refresh + route protection)
- [x] P1.19 Run npm run build — confirmed build passes with zero errors
- [x] P1.20 Add .brain/.gitkeep so brain folder tracked by git (not .env.local)
- [x] P1.21 git commit: "feat: initial Next.js 16 scaffold with Supabase, PWA, Tailwind CSS, shadcn/ui and security headers"
- [x] P1.22 git push to GitHub main branch

## GATE CRITERIA (ALL must be TRUE before Phase 2 starts)
- [x] GATE-1A npm run dev / build runs cleanly with zero TypeScript errors
- [x] GATE-1B npm run build completes without errors
- [x] GATE-1C All packages in package.json match the install list above
- [x] GATE-1D Code is pushed to public GitHub repo
- [x] GATE-1E next.config.ts has PWA wrapper + security headers
- [x] GATE-1F shadcn/ui initialized + base components installed

## DEFERRED FROM THIS PHASE
- [~] DEFER-1A (-> Phase 9): Generate proper Supabase TypeScript types via CLI
      Command: npx supabase gen types typescript --project-id [ref] > src/types/database.types.ts
      Reason: DB schema must exist before types can be generated
