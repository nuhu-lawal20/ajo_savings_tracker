# PHASE 1 — PROJECT SCAFFOLDING
Status: 🟡 IN PROGRESS | Gate: PENDING | Started: 2026-08-17
Goal: Working Next.js app running locally, all packages installed.
Depends on: Phase 0 APPROVED | Blocks: Phase 2

## CHECKLIST
- [ ] P1.1  Scaffold: npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
- [ ] P1.2  Install: @supabase/supabase-js @supabase/ssr
- [ ] P1.3  Install: @upstash/redis @upstash/ratelimit
- [ ] P1.4  Install: resend @react-email/components
- [ ] P1.5  Install: dexie dexie-react-hooks @ducanh2912/next-pwa
- [ ] P1.6  Install: zod react-hook-form @hookform/resolvers
- [ ] P1.7  Install: date-fns lucide-react cloudinary
- [ ] P1.8  Install: @sentry/nextjs @vercel/analytics @vercel/speed-insights
- [ ] P1.9  Init shadcn: npx shadcn@latest init (style: default, baseColor: slate)
- [ ] P1.10 Add shadcn components: button input card badge dialog toast avatar progress
- [ ] P1.11 Configure next.config.ts (PWA wrapper + security headers)
- [ ] P1.12 Configure tailwind.config.ts (emerald palette brand colors)
- [ ] P1.13 Create folder structure: app/(auth)/ app/(dashboard)/ components/ lib/ types/
- [ ] P1.14 Create src/lib/supabase/client.ts (browser Supabase client)
- [ ] P1.15 Create src/lib/supabase/server.ts (server-side Supabase client)
- [ ] P1.16 Create src/lib/validations.ts (all Zod schemas — empty placeholders)
- [ ] P1.17 Create src/types/database.types.ts (placeholder — generated in Phase 9)
- [ ] P1.18 Create src/middleware.ts (Supabase session refresh + route protection)
- [ ] P1.19 Run npm run dev — confirm localhost:3000 loads with zero errors
- [ ] P1.20 Add .brain/.gitkeep so brain folder tracked by git (not .env.local)
- [ ] P1.21 git commit: "feat: initial Next.js 14 scaffold with all dependencies"
- [ ] P1.22 git push to GitHub main branch

## GATE CRITERIA (ALL must be TRUE before Phase 2 starts)
- [ ] GATE-1A npm run dev runs cleanly with zero TypeScript errors
- [ ] GATE-1B npm run build completes without errors
- [ ] GATE-1C All packages in package.json match the install list above
- [ ] GATE-1D Code is pushed to public GitHub repo
- [ ] GATE-1E next.config.ts has PWA wrapper + security headers
- [ ] GATE-1F shadcn/ui initialized + base components installed

## DEFERRED FROM THIS PHASE
- [~] DEFER-1A (-> Phase 9): Generate proper Supabase TypeScript types via CLI
      Command: npx supabase gen types typescript --project-id [ref] > src/types/database.types.ts
      Reason: DB schema must exist before types can be generated
