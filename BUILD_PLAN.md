# Networkk Build Plan & Status

This document tracks the implementation progress of the Networkk platform. Status icons:

- ✅ Completed
- 🚧 In Progress / Partial
- ⏳ Not Started

## Phase 0 – Project Setup & Monorepo
- Monorepo with PNPM workspaces (`apps/`, `packages/`) ✅
- Astro website scaffold under `apps/website` ✅
- Shared package `packages/content-bridge` with Zod schemas ✅
- Next.js CMS app scaffold ⏳
- Robots.txt & sitemap generation ⏳

## Phase 1 – Frontend Foundations
- `<SEO />` component with OpenGraph/Twitter tags ✅
- JSON‑LD helper component (`JsonLd.astro`) ✅
- Heading hierarchy & ARIA landmarks in layouts ✅
- Zod content schemas & adapter (block validation TODO) 🚧
- Block library v1 (Hero, TilesGrid, Testimonials, MetricsBand, FAQ, CTA, etc.) ✅
- Pages
  - Home (`src/pages/index.astro`, `content/pages/home.json`) ✅
  - About (`src/pages/about.astro`, `content/pages/about.json`) ✅
- SEO validation at build time (missing block validation) 🚧

## Phase 2 – Services, Industries & Insights
- Services pages (`content/pages/services.json` rendered via `[slug].astro`) 🚧
- Industries hub & detail pages ⏳
- Insights hub & MDX articles ⏳
- Cross linking & FAQ schema enforcement ⏳

## Phase 3 – Remaining Pages, Forms, Performance & A11y
- Additional pages (`case-studies`, `events`, `contact`, `team`) present as content but need templates/SEO review 🚧
- Contact form block exists but lacks backend handling 🚧
- Performance budgets (LCP/CLS/INP) ⏳
- Accessibility audit & improvements ⏳

## Phase 3.5 – Preview Bridge
- Preview routes with HMAC tokens & SSE updates ⏳

## Phases 4–11 – CMS Development
- Next.js CMS application, Prisma models, API contracts, admin UI, visual builder, media management, publishing pipeline, workflow & QA ⏳

## Phase 12 – Notifications System
- Notification templates, delivery channels, preferences, audit trail ⏳

## Phase 13 – RAG + AI Chat
- Vector indexing, document uploads, chat widget, transcripts & analytics ⏳

## Next Actions
1. Implement Services and Industries pages with required SEO metadata.
2. Introduce Insights hub with MDX support.
3. Begin scaffold of Next.js CMS and preview bridge.
