# Design System

## Tokens

### Spacing Scale
| Token | Value |
|-------|-------|
| --space-1 | 0.25rem |
| --space-2 | 0.5rem |
| --space-3 | 0.75rem |
| --space-4 | 1rem |
| --space-6 | 1.5rem |
| --space-8 | 2rem |
| --space-12 | 3rem |
| --space-16 | 4rem |
| --space-24 | 6rem |
| --space-32 | 8rem |

### Fluid Type Scale
| Token | Example |
|-------|---------|
| --fs-sm | clamp(0.875rem, 0.84rem + 0.2vw, 0.95rem) |
| --fs-base | clamp(1rem, 0.96rem + 0.25vw, 1.125rem) |
| --fs-lg | clamp(1.125rem, 1.08rem + 0.35vw, 1.25rem) |
| --fs-xl | clamp(1.25rem, 1.2rem + 0.5vw, 1.5rem) |
| --fs-2xl | clamp(1.5rem, 1.4rem + 0.8vw, 1.875rem) |
| --fs-3xl | clamp(1.875rem, 1.7rem + 1vw, 2.25rem) |
| --fs-4xl | clamp(2.25rem, 2rem + 1.5vw, 3rem) |
| --fs-5xl | clamp(3rem, 2.5rem + 2vw, 4rem) |

### Color Palette
Brand colors and neutral grayscale tokens are defined in `src/styles/tokens.css` and mapped in Tailwind config.

### Radii
`--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl`, `--radius-full`

### Shadows
`--shadow-sm`, `--shadow-md`, `--shadow-lg`

## Grid & Layout
- 12‑column responsive grid
- Tailwind `container` centered with breakpoints: sm 640px, md 768px, lg 1024px, xl 1280px, 2xl 1440px
- Global layout: header/nav, main, footer, skip link, and focus ring styles

## Components
- `SEO.astro` – meta tags with OpenGraph and Twitter
- `JsonLd.astro` – renders structured data blocks
- `Image.astro` – AVIF/WebP sources, alt enforcement, LCP priority
- `Footer.astro`, `Button.astro`, `Heading.astro`
- Layout shell: `BaseLayout.astro`

## Page Skeleton
```
<html>
  <head>…SEO…</head>
  <body>
    <a class="skip-link" href="#main">Skip to main content</a>
    <header>…nav…</header>
    <main id="main">…page blocks…</main>
    <footer>…</footer>
  </body>
</html>
```
