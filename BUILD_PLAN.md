# Networkk — End-to-End Build Plan (SEO-First)

## Overview
Building a modern executive search platform with Astro frontend → Next.js CMS → AI chat integration.

**Tech Stack**: Node 20, PNPM, TypeScript 5, Astro 4, Next.js 14, Prisma 5, Tailwind 3

**Core Principle**: Frontend-first development with SEO baked in from day one.

---

## Phase 0 — Project Setup & Monorepo Foundation

**Goal**: Clean workspace, shared schemas, development-ready structure

### Project Structure
```
networkk/
├── apps/
│   ├── website/              # Astro frontend
│   │   ├── src/
│   │   │   ├── content/      # JSON & MDX content
│   │   │   ├── components/   # React components
│   │   │   │   ├── blocks/   # Content blocks
│   │   │   │   ├── ui/       # Design system
│   │   │   │   └── seo/      # SEO components
│   │   │   ├── lib/
│   │   │   │   ├── content/  # Content adapters
│   │   │   │   ├── seo.ts    # SEO utilities
│   │   │   │   ├── analytics.ts
│   │   │   │   └── preview.ts
│   │   │   ├── pages/        # Astro pages
│   │   │   └── styles/       # Global styles
│   │   └── public/           # Static assets
│   └── cms/                  # Next.js admin
│       ├── app/
│       │   ├── (auth)/
│       │   ├── admin/        # Admin screens
│       │   └── api/          # API routes
│       ├── prisma/
│       ├── lib/
│       └── public/
└── packages/
    └── content-bridge/       # Shared types & schemas
        └── src/
            ├── types.ts
            ├── blockSchemas.ts
            └── adapters/
```

### Key Features
- **SEO-First**: Every page requires title, description, canonical URL
- **Type Safety**: Shared Zod schemas across frontend and CMS
- **Content Bridge**: Unified content shape for JSON/API consumption
- **Preview System**: Draft content preview with signed tokens

---

## Phase 1 — Frontend Foundation (Astro + Design System)

**Goal**: Ship Home & About pages with complete SEO implementation

### 1.1 Design System & SEO Components
- `<SEO />` component with OpenGraph, Twitter cards, JSON-LD
- Heading hierarchy enforcement (one H1 per page)
- ARIA landmarks and accessibility basics
- Tailwind-based component library

### 1.2 Content Infrastructure
- Zod schemas for all content types
- Content adapter pattern (file-based → API-ready)
- Build-time validation (SEO fields required)

### 1.3 Block Library v1
**Available Blocks**:
- Hero (no H1, uses subtitle)
- TilesGrid (service/feature cards)
- Testimonials (client quotes)
- MetricsBand (key stats)
- FAQ (structured Q&A)
- CTA (call-to-action sections)

### 1.4 Pages to Build
1. **Home Page**
   - H1: Company tagline (≤90 chars)
   - Services preview → internal links
   - Client testimonials
   - Key metrics
   - Latest insights preview

2. **About Page**
   - H1: "Who We Are"
   - Company story
   - Leadership team
   - Awards & recognition

### SEO Requirements (Phase 1)
✅ Single H1 per page, logical H2/H3 hierarchy  
✅ Title ≤60 chars, description 120-160 chars  
✅ All images have descriptive alt text  
✅ Internal links to 3+ relevant pages  
✅ Valid JSON-LD schema markup  
✅ Canonical URLs set correctly  

---

## Phase 2 — Core Business Pages

**Goal**: Services, Industries, Insights with MDX support

### Pages to Build
- **Services**: Executive Search, Leadership Hiring, Talent Advisory
- **Industries**: Hub page + 3 industry detail pages
- **Insights**: Blog hub with MDX articles, pagination

### Features
- MDX processing for blog content
- Dynamic routing for insights
- FAQ schema implementation
- Cross-page internal linking strategy

---

## Phase 3 — Complete Frontend

**Goal**: All remaining pages, forms, performance optimization

### Additional Pages
- Our Approach, Why Choose Us
- Client Success Stories
- Events & Webinars
- Contact, Careers

### Technical
- Form handling with validation
- Performance budgets (LCP <2.5s)
- Accessibility audit (WCAG AA)
- Sitemap & robots.txt generation

---

## Phase 3.5 — Preview Bridge

**Goal**: Preview draft content from CMS

- Preview routes with HMAC tokens
- SSE live updates
- Draft content warnings

---

## Phases 4-11 — CMS Development

**Phase 4**: Next.js foundation + Prisma + Auth  
**Phase 5**: API contracts with Zod validation  
**Phase 6**: Admin UI screens  
**Phase 7**: Visual page builder  
**Phase 8**: Media management  
**Phase 9**: Publishing pipeline  
**Phase 10**: Workflow & governance  
**Phase 11**: QA, docs, training  

---

## Phase 12 — Notifications System

**Goal**: Template-based notifications across channels

- Email, SMS, in-app, webhook delivery
- Event-driven triggers
- User preferences
- Delivery tracking & retries

---

## Phase 13 — RAG + AI Chat

**Goal**: Intelligent chat with document upload

- Vector search across published content
- User document uploads (temporary)
- Citation-based responses
- CMS analytics & transcript management

---

## Success Metrics

**SEO**: Organic traffic growth, keyword rankings  
**Performance**: Core Web Vitals compliance  
**Accessibility**: WCAG AA compliance  
**Content**: Editor adoption, publishing velocity  
**Chat**: Response accuracy, user satisfaction  

---

## Next Steps

Starting with Phase 0 implementation:
1. Set up monorepo structure
2. Configure build tools
3. Create shared type system
4. Implement basic Astro setup
