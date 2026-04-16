# Build Task: work-hours-tracker

Build a complete, production-ready Next.js 15 App Router application.

PROJECT: work-hours-tracker
HEADLINE: Track actual coding hours vs reported time
WHAT: None
WHY: None
WHO PAYS: None
NICHE: productivity
PRICE: $$8/mo

ARCHITECTURE SPEC:
A Next.js web app that tracks actual coding time through IDE integration and compares it with self-reported hours. Uses a simple dashboard to show productivity insights and time discrepancies with Lemon Squeezy for subscription billing.

PLANNED FILES:
- app/page.tsx
- app/dashboard/page.tsx
- app/api/auth/[...nextauth]/route.ts
- app/api/time-entries/route.ts
- app/api/webhooks/lemonsqueezy/route.ts
- components/TimeTracker.tsx
- components/ProductivityChart.tsx
- components/PricingCard.tsx
- lib/db.ts
- lib/auth.ts
- lib/lemonsqueezy.ts

DEPENDENCIES: next, tailwindcss, next-auth, prisma, @prisma/client, recharts, @lemonsqueezy/lemonsqueezy.js, lucide-react, date-fns

REQUIREMENTS:
- Next.js 15 with App Router (app/ directory)
- TypeScript
- Tailwind CSS v4
- shadcn/ui components (npx shadcn@latest init, then add needed components)
- Dark theme ONLY — background #0d1117, no light mode
- Lemon Squeezy checkout overlay for payments
- Landing page that converts: hero, problem, solution, pricing, FAQ
- The actual tool/feature behind a paywall (cookie-based access after purchase)
- Mobile responsive
- SEO meta tags, Open Graph tags
- /api/health endpoint that returns {"status":"ok"}

ENVIRONMENT VARIABLES (create .env.example):
- NEXT_PUBLIC_LEMON_SQUEEZY_STORE_ID
- NEXT_PUBLIC_LEMON_SQUEEZY_PRODUCT_ID
- LEMON_SQUEEZY_WEBHOOK_SECRET

After creating all files:
1. Run: npm install
2. Run: npm run build
3. Fix any build errors
4. Verify the build succeeds with exit code 0

Do NOT use placeholder text. Write real, helpful content for the landing page
and the tool itself. The tool should actually work and provide value.


PREVIOUS ATTEMPT FAILED WITH:
Codex exited 1: Reading additional input from stdin...
OpenAI Codex v0.121.0 (research preview)
--------
workdir: /tmp/openclaw-builds/work-hours-tracker
model: gpt-5.3-codex
provider: openai
approval: never
sandbox: danger-full-access
reasoning effort: none
reasoning summaries: none
session id: 019d94e9-c8ff-71f2-b78e-973c71a72a2b
--------
user
# Build Task: work-hours-tracker

Build a complete, production-ready Next.js 15 App Router application.

PROJECT: work-hours-tracker
HEADLINE: Track actual coding hours
Please fix the above errors and regenerate.