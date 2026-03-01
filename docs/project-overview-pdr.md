# Design Pattern Visualizer: Project Overview & PDR

**Version:** 1.0 (Phase 05 completion)
**Last Updated:** 2026-03-01
**Status:** In Progress (5 of 10 phases complete)

---

## Executive Summary

**Design Pattern Visualizer** is an interactive web application that teaches software design patterns through 3D visualization and step-by-step code walkthroughs. The MVP covers 5 core GoF patterns (Factory Method, Observer, Singleton, Strategy, Decorator) with custom animated 3D scenes synchronized to code examples.

**Target Audience:** Junior to mid-level developers learning design patterns for interviews, refactoring, or architecture design.

**Success Metric:** Ship MVP with 5 patterns, <4s page load time, 60fps 3D scenes on mid-range GPU.

---

## Product Vision

### Problem Statement

Existing pattern resources (Refactoring.Guru, Patterns.dev) are text-heavy and lack interactivity. Developers want:
- Visual representation (not just UML diagrams)
- Animation showing pattern flow step-by-step
- Real-world code examples they can run
- Fast, memorable learning experience

### Solution

Interactive 3D visualization where each pattern becomes an animated scene:
- **Factory Method:** Assembly line with machines creating products
- **Observer:** Hub-and-spoke with message broadcasting
- **Singleton:** Single instance with lock metaphor
- **Strategy:** Algorithm swapper with interchangeable strategies
- **Decorator:** Layer-by-layer component wrapping

Each pattern page: problem narrative → 3D animation → code walkthrough → real-world example → anti-patterns.

### Competitive Advantage

1. **Custom 3D metaphors** (not generic diagrams)
2. **Step sync:** Animation ↔ Code ↔ UI controls all in sync
3. **Modern tech:** Next.js 14 SSG → instant page loads
4. **Reusable infrastructure:** New patterns take <5h to add
5. **Evergreen content:** Patterns never go out of date

---

## Requirements

### Functional Requirements (MVP)

#### FR-1: Landing Page
- **Description:** Hero section + pattern grid showing all 5 patterns
- **Acceptance Criteria:**
  - Grid displays cards for Factory, Observer, Singleton, Strategy, Decorator
  - Each card shows pattern icon, name, category, 1-line description
  - Hover shows glow/scale animation
  - Click navigates to pattern detail page
  - Mobile: Shows message "Desktop recommended for 3D experience"

#### FR-2: Pattern Detail Page
- **Description:** Full-page pattern learning experience
- **Acceptance Criteria:**
  - Loads in <4s (SSG)
  - Displays: problem narrative, 3D canvas, step controls, code walkthrough, real-world, anti-patterns
  - 3D canvas renders scene with lights, fog, camera
  - Camera position/target animate when stepping
  - No layout shift during load
  - Accessible (semantic HTML, ARIA labels)

#### FR-3: 3D Scene Rendering
- **Description:** Custom animated scene per pattern
- **Acceptance Criteria:**
  - Renders at 60fps on mid-range GPU (GeForce GTX 1060)
  - Scene components (machines, arrows, particles) animate smoothly
  - Camera lerps to target position on step change
  - Fallback message on unsupported devices (GPU tier 0)
  - No memory leaks (verify with DevTools)

#### FR-4: Step Controls & Navigation
- **Description:** UI to navigate pattern steps
- **Acceptance Criteria:**
  - Prev/Next buttons advance step
  - Step counter shows "Step X / Total"
  - Play/Pause toggle auto-advances every 3s
  - Keyboard: Left/Right arrows also work
  - Progress bar animates (Framer Motion)
  - Step state syncs with code highlight + camera

#### FR-5: Code Highlighting
- **Description:** Syntax-highlighted code matching current step
- **Acceptance Criteria:**
  - All steps pre-rendered at build time (Shiki)
  - Code block shows only current step (hidden via CSS)
  - Highlighted lines visually distinct (background color)
  - Copy button per block (copies to clipboard)
  - No lag when switching steps (instant CSS toggle)

#### FR-6: Real-World Examples
- **Description:** Practical code example showing pattern in use
- **Acceptance Criteria:**
  - Real-world section appears below code walkthrough
  - Shows example usage (e.g., React Hooks, Express.js)
  - TypeScript code with syntax highlighting
  - Includes brief explanation

#### FR-7: Anti-Patterns
- **Description:** Common mistakes to avoid
- **Acceptance Criteria:**
  - List 2-3 anti-patterns per pattern
  - Each shows: title, description, code example
  - Styled distinctly (red border, warning icon)
  - Helps learner avoid pitfalls

#### FR-8: Responsive Design
- **Description:** Works across viewport sizes
- **Acceptance Criteria:**
  - Desktop (1200px+): Full 3D experience
  - Tablet (768px-1200px): Simplified 2D fallback or mobile message
  - Mobile (<768px): Message "Best on desktop" + link to desktop version
  - No horizontal scroll
  - Touch-friendly buttons (48px+ tap target)

### Non-Functional Requirements (MVP)

#### NFR-1: Performance
- **Requirement:** Page load <4s, 3D render 60fps
- **Metrics:**
  - Landing page FCP: <2s
  - Pattern page LCP: <3s
  - 3D canvas: 60fps on GTX 1060
  - No layout shift (CLS < 0.1)
- **Implementation:** SSG, dynamic imports, Shiki lazy-init, WebGL fallback

#### NFR-2: Bundle Size
- **Requirement:** Landing page <30KB JS; Pattern page +80KB for Three.js
- **Metrics:**
  - Landing page: next.js core + React + Tailwind (~25KB gzipped)
  - Pattern page: +Three.js (~80KB) + R3F (~30KB)
  - No Three.js on landing page (verified via bundle analyzer)
- **Implementation:** Dynamic import with `ssr: false`

#### NFR-3: Code Quality
- **Requirement:** TypeScript strict mode, 0 lint errors, >80% test coverage
- **Metrics:**
  - No `any` types (except necessary escapes)
  - ESLint strict config
  - All components unit-tested
  - E2E tests for critical flows
- **Implementation:** CI/CD with GitHub Actions

#### NFR-4: Accessibility
- **Requirement:** WCAG 2.1 AA compliance
- **Metrics:**
  - Semantic HTML (buttons, headings, landmarks)
  - ARIA labels on 3D canvas
  - Keyboard navigation (Tab, Arrow keys)
  - Color contrast ≥4.5:1 on text
- **Implementation:** axe DevTools in CI, manual testing

#### NFR-5: SEO
- **Requirement:** Rankable for "design patterns learning"
- **Metrics:**
  - Static HTML (SSG) for all pages
  - Meta titles, descriptions per pattern
  - Open Graph images generated per pattern
  - Sitemap + robots.txt
  - Fast Core Web Vitals (Vercel Analytics)
- **Implementation:** Next.js metadata API, generateStaticParams

#### NFR-6: Security
- **Requirement:** No XSS, CSRF, or data leakage
- **Metrics:**
  - Content Security Policy header
  - No sensitive env vars in client code
  - HTML sanitization for user content (if added later)
  - HTTPS only (Vercel default)
- **Implementation:** Next.js security headers, .env.local for secrets

#### NFR-7: Reliability
- **Requirement:** 99.5% uptime
- **Metrics:**
  - Error monitoring (Sentry integration optional)
  - Graceful fallbacks (WebGL failure, code highlight error)
  - No 404s on valid routes
- **Implementation:** Error boundaries, fallback UI

---

## Technical Specification

### Tech Stack

| Component | Tech | Reason |
|-----------|------|--------|
| **Framework** | Next.js 14 App Router | SSG, SEO, edge middleware |
| **React** | React 18 | Latest stable, hooks support |
| **3D Rendering** | Three.js 0.183 | Industry standard, R3F ecosystem |
| **R3F** | React Three Fiber v8 | React binding for Three.js; v8 for React 18 compat |
| **State** | Zustand v5 | Lightweight, no boilerplate |
| **Animation UI** | Framer Motion v12 | Smooth transitions, progress bar |
| **Code Highlight** | Shiki v4 | Server-side, zero runtime cost |
| **CSS Framework** | Tailwind CSS v3 | Utility-first, dark mode, CSS variables |
| **Components** | shadcn/ui | Unstyled, composable, accessible |
| **Font** | Geist (Vercel) | Modern, optimized |
| **Deployment** | Vercel | Native Next.js, auto-scaling |

### Architecture Decisions

#### Decision 1: SSG vs. ISR vs. SSR

**Choice:** SSG (Static Site Generation)

**Rationale:**
- Pattern content is static (no DB, no user input on detail pages)
- All 5 pattern pages built at deploy time
- Instant page loads (99.9% cache hit rate)
- No need for ISR (content rarely changes)
- Fallback: landing page uses SSG, pattern pages use `generateStaticParams`

#### Decision 2: Server vs. Client Components

**Choice:** Server-first, client-only where needed

**Server Components Used:**
- Layout components (Navbar, Footer, PageShell)
- Pattern page composer (PatternPageLayout)
- Code highlighting (CodeBlock) — Shiki is server-only

**Client Components Used:**
- R3F Canvas (needs browser APIs)
- Step controls (reads Zustand store)
- Pattern cards (hover animations)

**Benefit:** Minimal client JS, zero hydration mismatch

#### Decision 3: R3F v8 vs. v9

**Choice:** v8 (pinned)

**Rationale:**
- v9 requires React 19 (not available in stable MVP timeline)
- v8 stable, well-documented, proven in production
- Defer upgrade to Phase 11+

#### Decision 4: Camera Control

**Choice:** Scripted camera (no free orbit)

**Rationale:**
- Each step has predefined camera position + target
- Camera lerps smoothly to target when step changes
- Ensures best viewing angle for scene narrative
- Reduces cognitive load (no camera wrestling)
- Easier to demo on video/screenshot

#### Decision 5: Code Highlighting Architecture

**Choice:** Pre-render all steps at build time (SSR Shiki)

**Rationale:**
- Shiki runs server-side on all pattern steps
- Client receives HTML with `<pre><code>` blocks
- Client CSS shows/hides block matching current step
- Zero client JS for highlighting
- Fast step changes (instant CSS toggle)
- No Shiki WASM cold start on page load

**Alternative Considered:** Client-side Shiki (rejected: adds ~500KB WASM, slower)

#### Decision 6: Dark Mode Only

**Choice:** Dark theme exclusively (no light toggle)

**Rationale:**
- 3D neon aesthetic requires dark background
- Reduces CSS/design complexity
- Faster page load
- Defer light mode to Phase 11+ if requested

---

## Phase Breakdown

### Completed Phases (MVP Foundation)

#### Phase 01: Project Setup ✓
- Next.js 14 App Router scaffold
- TypeScript strict mode
- Tailwind CSS + shadcn/ui
- Git + ESLint + Prettier
- Package dependencies locked

#### Phase 02: Design System ✓
- Color palette (neon dark theme)
- Typography (Geist)
- Layout shell (Navbar + Footer)
- Pattern card component
- Hover animations

#### Phase 03: Content Model ✓
- Pattern type definitions
- Factory Method content (3 steps)
- Observer/Singleton/Strategy/Decorator stubs
- Pattern registry + helpers
- Type safety for all content

#### Phase 04: 3D Scene Framework ✓
- R3F Canvas wrapper (dynamic, ssr: false)
- Zustand pattern store (step management)
- Shiki singleton + CodeBlock server component
- Shared 3D primitives (lighting, camera, arrow, sphere, label, particles)
- StepControls UI + WebGL fallback
- PatternPageLayout compositor

#### Phase 05: Factory Method Scene ✓
- ConveyorBelt geometry (metallic belt + glow strip)
- MachineStation component (box, label, pulse animation)
- Product shape (scales 0→1 on appearance)
- RequestArrow (animates on step 0)
- FactoryMethodScene orchestrator (reads store, controls child state)
- Page integration: `[slug]/page.tsx` → PatternPageLayout → FactoryMethodScene
- **Extension Point:** `getPatternScene()` registry in PatternPageLayout for future patterns

### Pending Phases (MVP Completion)

#### Phase 06: Observer Scene
- Observer scene orchestrator
- Subject + Observer nodes
- Event stream visualization
- Content details + camera positions
- Register in getPatternScene()

#### Phase 07: Singleton Scene
- Singleton instance visualization
- Lock mechanism animation
- Access gate component
- Content + anti-patterns

#### Phase 08: Strategy Scene
- Strategy swapper visualization
- Algorithm alternative nodes
- Dynamic behavior switching
- Real-world: sorting strategies, payment methods

#### Phase 09: Decorator Scene
- Layer-by-layer wrapping
- Composable decoration nodes
- Feature accumulation animation
- Real-world: React HOCs, middleware stacks

#### Phase 10: Landing Page & Deploy
- Hero section redesign
- Pattern grid with preview cards
- SEO optimization (meta, OG images)
- Vercel deployment + monitoring
- Performance audit (Lighthouse)

---

## Success Criteria

### Launch Criteria (Phase 05 Complete)

- [ ] Factory Method 3D scene implemented (100% per phase spec)
- [ ] Page loads <4s on Vercel (Lighthouse audit)
- [ ] 3D renders 60fps on GTX 1060
- [ ] All code compiles (no TypeScript errors)
- [ ] No visual regressions (Phases 02-04 still work)
- [ ] Code review passed (all quality checks)
- [ ] Documentation updated (codebase-summary, system-architecture, code-standards)

### MVP Completion Criteria (Phase 10)

- [ ] All 5 patterns implemented + accessible at `/patterns/{slug}`
- [ ] Landing page completed + published
- [ ] Performance: LCP <3s, FCP <2s, CLS <0.1 on all pages
- [ ] Accessibility: WCAG 2.1 AA (axe DevTools 0 violations)
- [ ] SEO: All pages have meta titles, descriptions, OG images
- [ ] Security: No security audit failures
- [ ] Testing: >80% code coverage, all critical flows E2E tested
- [ ] Deployment: Live on Vercel, monitoring active

### Post-Launch Metrics

- [ ] <1000 unique users/month by month 6 (viral sharing goal)
- [ ] <2s page load time (geo-distributed)
- [ ] 0 critical bugs in first month
- [ ] Engagement: >70% users complete ≥3 steps per pattern

---

## Risk Assessment

### High-Risk Items

#### Risk 1: R3F Performance on Mobile
- **Impact:** High (users on mobile get fallback message, bad UX)
- **Probability:** Medium (WebGL limitations)
- **Mitigation:** WebGL fallback detects GPU tier; Phase 11 adds simplified 2D on mobile

#### Risk 2: Shiki Cold Start on First Deploy
- **Impact:** Medium (~200ms delay on first highlight)
- **Probability:** Low (lazy-init mitigates, edge caching helps)
- **Mitigation:** Pre-warm Shiki in background; monitor Vercel logs

#### Risk 3: Pattern Content Scope Creep
- **Impact:** High (timeline slips)
- **Probability:** Medium (patterns are complex)
- **Mitigation:** Hard limit: 5 patterns MVP. No #6 until Phase 10 ships.

#### Risk 4: Three.js Bundle Size
- **Impact:** Medium (landing page weight)
- **Probability:** Low (dynamic import prevents landing page load)
- **Mitigation:** Tree-shaking enabled; bundle analyzer in CI

### Medium-Risk Items

#### Risk 5: Camera Animation Jank
- **Impact:** Medium (distracting for learner)
- **Probability:** Low (useFrame + lerp proven)
- **Mitigation:** Test on various GPU tiers; adjust lerp factor if needed

#### Risk 6: SEO Underperformance
- **Impact:** Medium (limited organic traffic)
- **Probability:** Low (SSG + proper metadata should rank)
- **Mitigation:** SEO audit Phase 10; consider backlinks/promotion

---

## Acceptance Criteria (Phase 05 Completion)

### Code Acceptance

- [ ] All 5 factory-method scene files created:
  - `src/scenes/factory-method/factory-method-scene.tsx`
  - `src/scenes/factory-method/machine-station.tsx`
  - `src/scenes/factory-method/conveyor-belt.tsx`
  - `src/scenes/factory-method/product.tsx`
  - `src/scenes/factory-method/request-arrow.tsx`

- [ ] `src/components/pattern/pattern-page-layout.tsx` updated:
  - Added `getPatternScene(slug)` function
  - Correctly maps `slug === "factory-method"` to `<FactoryMethodScene />`

- [ ] Integration verified:
  - Route: `/patterns/factory-method` renders correctly
  - Scene loads with no errors
  - Step controls advance step (0→1→2)
  - Code block highlights sync with step
  - Camera position changes per step

### Quality Acceptance

- [ ] TypeScript: No `any` types, strict mode passes
- [ ] ESLint: 0 errors, 0 warnings
- [ ] Performance: Page load <4s, 3D renders 60fps
- [ ] Accessibility: Semantic HTML, ARIA labels, keyboard nav works
- [ ] Testing: Unit tests for store, integration tests for page flow

### Documentation Acceptance

- [ ] `docs/codebase-summary.md` created/updated
  - Lists all factory-method scene files
  - Explains scene orchestration pattern
  - Documents `getPatternScene()` extension point

- [ ] `docs/system-architecture.md` created/updated
  - Describes factory-method scene as first concrete implementation
  - Shows step mapping (0→arrow, 1→machine active, 2→product)
  - Explains how to add new patterns

- [ ] `docs/code-standards.md` created/updated
  - Documents 3D component pattern (useRef, useFrame safety)
  - Shows scene registration in PatternPageLayout
  - Lists key files with line counts

- [ ] `docs/project-overview-pdr.md` created/updated
  - Phase 05 completion details
  - Updated phase status table
  - Risk assessment post-implementation

---

## Dependencies & Blockers

### External Dependencies
- **Node.js**: ≥18 (for ESM imports, async/await)
- **Vercel**: Account + linked GitHub repo
- **Three.js**: v0.183 (pinned in package.json)
- **R3F**: v8 (React 18 compatible)

### Internal Dependencies
- Phase 05 depends on Phase 04 ✓
- Phase 06+ depends on Phase 05 ✓
- Phase 10 (deploy) depends on Phases 05-09

### No Blockers (As of Phase 05)
- All phases have completed on schedule
- No major technical debt or regressions
- R3F v8 stable; no migration needed

---

## Monitoring & Metrics

### Phase 05 Metrics

| Metric | Target | Actual |
|--------|--------|--------|
| Page load (LCP) | <4s | TBD (post-deploy) |
| 3D frame rate | 60fps | TBD (GPU testing) |
| Bundle size (3D) | <80KB gzip | TBD |
| TypeScript errors | 0 | 0 ✓ |
| ESLint violations | 0 | 0 ✓ |
| Code coverage | >80% | TBD |

### Production Monitoring (Phase 10+)
- Vercel Analytics (CWV, traffic)
- Sentry (error tracking)
- Custom Zustand analytics (which patterns most visited)
- User engagement (steps completed, time on page)

---

## Next Steps

1. **Immediate (Post Phase 05):**
   - Code review & merge to main
   - Update documentation (this file)
   - Deploy to Vercel staging

2. **Phase 06 (Observer):**
   - Fill in Observer content details
   - Create observer scene components
   - Register in `getPatternScene()`
   - Estimated effort: 5h

3. **Phase 07-09:**
   - Repeat for Singleton, Strategy, Decorator
   - Reuse framework proven in Phase 05
   - Each phase: ~4-5h

4. **Phase 10 (Deploy):**
   - Landing page redesign
   - SEO audit + optimization
   - Vercel deployment + monitoring
   - Estimated effort: 3h

---

## Glossary

- **SSG:** Static Site Generation (pages built at deploy time)
- **ISR:** Incremental Static Regeneration (pages revalidated on-demand)
- **SSR:** Server-Side Rendering (pages built on request)
- **R3F:** React Three Fiber (React binding for Three.js)
- **Zustand:** Lightweight state management (alternative to Redux)
- **Shiki:** Fast, reliable code highlighter (successor to Prism.js)
- **WebGL:** Web Graphics Library (for 3D rendering)
- **CWV:** Core Web Vitals (LCP, FID, CLS metrics)
- **FCP:** First Contentful Paint (time until first pixels render)
- **LCP:** Largest Contentful Paint (time until largest element renders)
- **CLS:** Cumulative Layout Shift (visual stability)

---

## Approval & Sign-Off

| Role | Name | Date | Status |
|------|------|------|--------|
| Developer | Dan | 2026-03-01 | ✓ Complete |
| Code Reviewer | Pending | TBD | Pending |
| Product Manager | Self | 2026-03-01 | ✓ Approved |

---

## Document Version History

| Version | Date | Author | Change |
|---------|------|--------|--------|
| 1.0 | 2026-03-01 | Dan | Initial Phase 05 completion PDR |

