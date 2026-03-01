# Phase 10: Landing Page, SEO & Deployment

## Context Links
- [Plan Overview](plan.md)
- Depends on: [Phase 09](phase-09-decorator.md) (all 5 patterns complete)

## Overview
- **Priority:** P1
- **Status:** pending
- **Effort:** 3h
- **Description:** Landing page with pattern picker grid, OG images, SEO metadata, performance audit, and Vercel production deployment.

## Key Insights
- Landing page must load fast (<200KB); no Three.js on this route
- Pattern cards with static thumbnails (not mini 3D previews) for performance
- OG images critical for social sharing (dev community virality)
- `generateStaticParams` + `generateMetadata` for full SSG + SEO

## Requirements

### Functional
- Landing page (`/`): hero section, tagline, 5 pattern cards in grid, brief value proposition
- Pattern cards: title, category badge, 1-line description, link to pattern page
- OG image generation per pattern route (Next.js `opengraph-image.tsx`)
- SEO: unique title/description per pattern, robots.txt, sitemap.xml
- Bundle analysis: verify R3F not in landing page bundle
- Vercel deployment: production build, preview deployments

### Non-Functional
- Landing page LCP < 1.5s
- Pattern page initial load (excluding R3F chunk) < 200KB
- R3F chunk < 500KB gzipped
- All pages have valid Open Graph meta tags

## Architecture

### Landing Page Layout
```
HeroSection
├── Tagline + subtitle
├── CTA button -> first pattern
└── Animated background (CSS/Framer Motion, no Three.js)

PatternGrid (3-column on desktop, 2 on tablet, 1 on mobile)
├── PatternCard x5
└── "More patterns coming soon" placeholder

ValueProp
├── 3 feature highlights (interactive, visual, free)
└── Tech badges (Next.js, Three.js, TypeScript)
```

### SEO Setup
- `src/app/layout.tsx`: default metadata (title template, description, OG)
- `src/app/patterns/[slug]/page.tsx`: `generateMetadata()` returns pattern-specific title + description
- `src/app/robots.ts`: allow all crawlers
- `src/app/sitemap.ts`: all pattern URLs + landing page

## Related Code Files
- **Modify:** `src/app/page.tsx` (landing page), `src/app/layout.tsx` (metadata)
- **Create:** `src/app/robots.ts`, `src/app/sitemap.ts`, `src/app/patterns/[slug]/opengraph-image.tsx`, `src/components/layout/hero-section.tsx`, `src/components/layout/pattern-grid.tsx`, `src/components/layout/value-prop.tsx`
- **Config:** `vercel.json` (if needed), `next.config.js` (bundle analyzer)

## Implementation Steps

1. Create `src/components/layout/hero-section.tsx`:
   - Large tagline: "See Design Patterns Come Alive"
   - Subtitle explaining the value
   - CTA button linking to `/patterns/factory-method`
   - Background: CSS gradient or subtle Framer Motion particle effect (no WebGL)
2. Create `src/components/layout/pattern-grid.tsx`:
   - Maps `patternSlugs` -> `PatternCard` components
   - Responsive grid: 3 cols (lg), 2 cols (md), 1 col (sm)
   - Framer Motion stagger animation on mount
3. Create `src/components/layout/value-prop.tsx`:
   - 3 feature cards: "Interactive 3D Scenes", "Step-by-Step Code", "Free & Open"
4. Assemble landing page in `src/app/page.tsx`: Hero -> PatternGrid -> ValueProp
5. Add `generateMetadata()` to `src/app/patterns/[slug]/page.tsx`:
   - Title: `{pattern.name} Pattern | Design Pattern Visualizer`
   - Description: `pattern.tagline`
   - OpenGraph: title, description, image
6. Create `src/app/patterns/[slug]/opengraph-image.tsx`:
   - Next.js ImageResponse (Edge runtime)
   - Renders: pattern name, category, tagline on dark background with accent gradient
   - Size: 1200x630
7. Create `src/app/robots.ts`: allow all, sitemap URL
8. Create `src/app/sitemap.ts`: list all routes (/, /patterns/factory-method, etc.)
9. Install `@next/bundle-analyzer`: `npm install @next/bundle-analyzer`
10. Add to `next.config.js`:
    ```js
    const withBundleAnalyzer = require('@next/bundle-analyzer')({ enabled: process.env.ANALYZE === 'true' });
    module.exports = withBundleAnalyzer(nextConfig);
    ```
11. Run `ANALYZE=true npm run build`, verify:
    - Landing page chunk has no Three.js
    - Pattern route chunks contain R3F
    - Total R3F chunk < 500KB gzipped
12. Deploy to Vercel:
    - `npx vercel` (link project)
    - Verify preview deployment works
    - `npx vercel --prod` for production
13. Test production:
    - All 5 pattern pages load and render 3D scenes
    - OG images generate correctly (test with https://opengraph.xyz)
    - Lighthouse score > 80 on landing page

## Todo List
- [ ] Build HeroSection component
- [ ] Build PatternGrid component
- [ ] Build ValueProp component
- [ ] Assemble landing page
- [ ] Add generateMetadata to pattern pages
- [ ] Create OG image generation
- [ ] Create robots.ts and sitemap.ts
- [ ] Run bundle analysis
- [ ] Deploy to Vercel (preview)
- [ ] Deploy to Vercel (production)
- [ ] Test OG images and Lighthouse score

## Success Criteria
- Landing page loads without any Three.js in bundle
- All 5 pattern pages accessible via cards
- OG images render correctly for social sharing
- Lighthouse performance > 80 on landing page
- Production deployment on Vercel works
- Bundle analysis confirms route-based code splitting

## Risk Assessment
- **OG image Edge runtime limitations:** Keep ImageResponse simple (no external fonts if issues arise)
- **Vercel cold start for pattern pages:** SSG via `generateStaticParams` eliminates cold starts for pattern routes
- **Lighthouse score drag from fonts:** Use `next/font` with `display: swap`

## Next Steps
- Post-MVP: add patterns #6-10, consider pro tier, analytics, i18n
