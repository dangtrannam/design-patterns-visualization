# Brainstorm Report: Design Pattern Visualizer

**Date:** 2026-03-01 | **Status:** Agreed

---

## Problem Statement

Build a website that interactively visualizes software design patterns — filling the gap between text-heavy resources (Refactoring.Guru) and truly immersive, visual learning tools. Target: junior/mid-level devs prepping for interviews or refactoring codebases.

**Goal:** Portfolio piece with potential SaaS pivot. Core hook: 3D visual-first diagrams.

---

## Evaluated Approaches

### Option A: 3D-First, Pattern-per-Scene
Custom 3D metaphor per pattern (Factory = assembly line, Observer = particle event hub). React Three Fiber.
- ✅ Genuinely differentiated, viral potential
- ❌ High creative + engineering cost per pattern, mobile WebGL risks

### Option B: Animated 2D (React Flow only)
Node-graph diagrams with animated transitions and event flows.
- ✅ Ships fast, mobile-friendly, proven
- ❌ Competitors already do this, loses the differentiator

### Option C: Hybrid — 3D Hero + 2D Detail ✅ CHOSEN
3D animated scene = emotional hook / "wow" moment. Transition to annotated 2D diagram + step-by-step code walkthrough for actual learning.
- ✅ 3D for shareability, 2D for pedagogy and accessibility
- ✅ Progressive: ship simple 3D hero, refine over time
- ✅ Mobile-friendly (fallback to 2D only)

---

## Recommended Tech Stack

| Layer | Tech | Rationale |
|---|---|---|
| Framework | Next.js 14 App Router | SSR/SSG, route-based code splitting, Vercel deploy |
| 3D hero scenes | React Three Fiber + `@react-three/drei` | React-native 3D, hot reload DX, WebGPU-ready |
| UML diagrams | React Flow (lazy-loaded) | Best-in-class node graph for React, viewport culling |
| Syntax highlight | Shiki (server-side) | VS Code accuracy, SSR-friendly, NOT Monaco (2MB overkill) |
| Animation sync | Zustand | Sync state: 3D scene step ↔ code highlight ↔ diagram node |
| UI animations | Framer Motion | Page transitions, step reveals |
| Styling | Tailwind + shadcn/ui | Speed + accessible components |
| Deploy | Vercel | Free tier sufficient for MVP |

**Bundle strategy:** R3F/Three.js (~600KB) loaded only on `/patterns/[slug]` routes via dynamic import. Initial page load <200KB.

**Mobile:** Detect WebGL capability at runtime; fallback to React Flow 2D on low-end Android.

---

## Content Architecture (per pattern page)

```
1. Problem narrative  → "Why does this pattern exist?"
2. 3D hero scene      → Animated metaphor (30–60s loop)
3. Step walkthrough   → 2D diagram + Shiki code sync (Zustand steps)
4. Real-world example → Where/when to use it
5. Anti-patterns      → What goes wrong without it
```

Content-first workflow: **write the pattern story before building any visualization.**

---

## MVP Scope (v1.0 = shipped)

5 patterns, deployed, shareable URL:
1. **Factory Method** — assembly line building different product types
2. **Observer** — event hub with particle flows along edges
3. **Singleton** — single glowing orb, all arrows converge to it
4. **Strategy** — interchangeable algorithm blocks, swap on click
5. **Decorator** — nested concentric shells wrapping a core

Hard rule: **do not start pattern #6 until all 5 are deployed.**

---

## Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Scope creep (async timeline) | Hard MVP cap: 5 patterns, no exceptions before launch |
| 3D scene burnout | Timebox each scene to 1 week; ship simple, iterate |
| Bundle size | Dynamic imports per route; measure with `next/bundle-analyzer` |
| Android WebGL instability | `useDetectGPU` (drei) → fallback to React Flow 2D |
| SEO (JS-heavy) | Static OG image per pattern, strong meta descriptions, SSR for text |
| Never launching | Treat first deployed pattern as public launch, share immediately |

---

## Monetization Path (post-MVP)

- **Free:** 5–7 patterns, basic 3D + 2D walkthrough
- **Pro ($9/mo):** All 23 GoF + modern patterns, code export (multiple languages), no ads
- **Bootcamp API:** Embed-licensed visualizations for course platforms

---

## Success Metrics

- v1.0: 5 patterns live, shareable URL, measurable traffic from at least one dev community post
- v1.5: Organic GitHub stars or HN/Reddit mention
- SaaS pivot trigger: >500 MAU organic, 10+ pro conversion inquiries

---

## Next Steps

1. Set up Next.js project with route-based code splitting configured
2. Write all 5 pattern stories (problem → metaphor → steps) — content first
3. Build shared layout: pattern page shell, Zustand step state
4. Implement pattern #1 (Factory) end-to-end before touching #2
5. Deploy to Vercel after pattern #1 is live (ship early, iterate)

---

## Unresolved Questions

- Multilingual (VN/Eng): Defer to post-MVP to avoid i18n complexity in v1
- Authentication/saved progress: Not needed for v1 (no user accounts)
- AI-generated pattern diffs (mentioned in idea.md): Explore as v2 feature
