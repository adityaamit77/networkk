# Networkk

Executive search and leadership hiring platform built with Astro and Next.js.

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development
pnpm dev

# Or start individual apps
pnpm dev:website  # Astro frontend
pnpm dev:cms      # Next.js CMS (coming in Phase 4)
```

## Project Structure

- `apps/website/` - Astro frontend with SEO-first design
- `apps/cms/` - Next.js CMS admin (Phase 4+)
- `packages/content-bridge/` - Shared types and schemas

## Development Status

### ✅ Phase 0 - Project Setup (COMPLETE)
- [x] Monorepo structure with PNPM workspaces
- [x] Shared TypeScript configuration
- [x] Content bridge package with Zod schemas
- [x] Basic Astro setup with React integration

### 🚧 Phase 1 - Frontend Foundation (IN PROGRESS)
- [x] Design system with Tailwind
- [x] SEO components with OpenGraph, JSON-LD
- [x] Block library v1 (Hero, TilesGrid, MetricsBand, Testimonials, CTA, FAQ, Carousel, etc.)
- [ ] Content adapter pattern (add Zod validation)
- [x] Home and About pages with sample content
- [x] Remaining UI components
- [ ] Performance optimization
- [ ] Accessibility audit

### 📋 Next Phases
- Phase 2: Services, Industries, Insights pages
- Phase 3: Complete frontend with forms and optimization
- Phase 4+: Next.js CMS development

## Completed Tasks

### Website
- Monorepo setup with PNPM workspaces
- Astro frontend scaffold under `apps/website`
- `<SEO />` component with OpenGraph and Twitter tags
- JSON-LD helper component
- Heading hierarchy and ARIA landmarks in layouts
- Block library v1 with core marketing blocks (Hero, TilesGrid, MetricsBand, Testimonials, CTA, FAQ, Carousel, etc.)
- Home and About pages with sample content
- JSON content stubs for Services, Industries, Insights, and more pages

### CMS
- Initial Next.js CMS scaffold under `apps/cms`

## Next CMS Task

Set up Prisma models and database schema for the admin app.

## SEO Features

- ✅ One H1 per page with logical hierarchy
- ✅ Required title (≤60 chars) and description (120-160 chars)
- ✅ Canonical URLs for all pages
- ✅ OpenGraph and Twitter cards
- ✅ JSON-LD structured data
- ✅ Image alt text enforcement
- ✅ Internal linking strategy

## Tech Stack

- **Frontend**: Astro 4 + React + Tailwind CSS
- **Backend**: Next.js 14 (App Router) - Phase 4+
- **Database**: Prisma + PostgreSQL - Phase 4+
- **Content**: JSON/MDX with type validation
- **Deployment**: Vercel (planned)

## Commands

```bash
pnpm dev              # Start all apps in dev mode
pnpm build            # Build all apps
pnpm lint             # Lint all packages
pnpm type-check       # TypeScript validation
pnpm clean            # Clean all build artifacts
```

