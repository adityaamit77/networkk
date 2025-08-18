# Information Architecture & Content Contracts

## Top Navigation
- Home (`/`)
- Services (`/services`)
- Industries (`/industries`)
- Insights (`/insights`)
- Success Stories (`/success-stories`)
- About (`/about`)
- Contact (`/contact`)

## Route List
| Path | Notes |
| --- | --- |
| `/` | Home landing page |
| `/services` | Overview of all services |
| `/industries` | Industry specialisations |
| `/insights` | Articles & thought leadership |
| `/success-stories` | Case studies & testimonials |
| `/about` | Company background |
| `/contact` | Contact form |

## Footer Link Matrix
### Services
- Executive Search
- Leadership Hiring
- Talent Advisory
- D&I Consulting
- Career Transition

### Company
- Our Approach
- Why Choose Us
- Events
- Partner With Us
- Careers

### Legal
- Privacy
- Terms
- Sitemap

## Content JSON Contract
### Page Fields
- `slug`: unique identifier
- `title`: page title (H1)
- `seo`:
  - `title`: ≤60 characters
  - `description`: 120–160 characters
  - `canonical`: absolute URL
  - `og`: optional { `title`, `description`, `image` }
- `breadcrumbs`: array of { `label`, `href` }
- `robots`: { `index` (bool), `follow` (bool) }
- `blocks`: array of Block objects

### Block Object
- `type`: block component identifier
- `heading`: section heading (H2/H3)
- `props`: block-specific properties
- `media`: { `image`, `alt`, `caption?`, `credit?` }
- `ctas`: array of { `label`, `href` }
- `analyticsId`: optional string
- `layout`: optional layout hints `{ colSpan, rowSpan, order }`
- `children`: nested blocks

## Editorial & SEO Rules
- Exactly one `<h1>` per page from `title`
- Block headings use `<h2>` and `<h3>` only
- Alt text required for all images (5–125 chars)
- Maintain canonical URLs; default to page URL
- Use internal links via top navigation and footer
