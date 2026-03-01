# Design Pattern Visualizer - Documentation Index

This directory contains all project documentation for the Design Pattern Visualizer application.

## Quick Navigation

### For New Developers
Start here to understand the project:
1. **[codebase-summary.md](./codebase-summary.md)** — Overview of all 68 files, directory structure, key components
2. **[system-architecture.md](./system-architecture.md)** — How all parts fit together, data flow, extension points
3. **[code-standards.md](./code-standards.md)** — Coding guidelines, naming conventions, best practices

### For Project Managers & Stakeholders
Understanding scope and progress:
- **[project-overview-pdr.md](./project-overview-pdr.md)** — Vision, requirements, success criteria, risk assessment

### For Implementation (Phase 06+)
Adding new patterns after Factory Method:
- Read: [code-standards.md](./code-standards.md) → "3D Components (R3F)" section
- Read: [system-architecture.md](./system-architecture.md) → "Extension Points" section
- Copy: Factory Method scene structure → create new pattern scene
- Register: Add 1 line to `getPatternScene()` in `pattern-page-layout.tsx`

---

## Document Overview

| File | Size | Purpose | Audience |
|------|------|---------|----------|
| **codebase-summary.md** | 301 LOC | Full file listing, directory structure, component descriptions | Developers, new team members |
| **system-architecture.md** | 510 LOC | Technical architecture, data flow, design decisions, extension points | Architects, developers, reviewers |
| **code-standards.md** | 754 LOC | Coding conventions, patterns, best practices, examples | All developers |
| **project-overview-pdr.md** | 585 LOC | Vision, requirements, acceptance criteria, risk assessment | PMs, developers, stakeholders |

**Total:** 2,150 LOC of documentation across 4 files (all under 800 LOC limit)

---

## Key Concepts

### Scene Registry Pattern

All 3D pattern scenes are registered in one place:

```typescript
// src/components/pattern/pattern-page-layout.tsx
function getPatternScene(slug: string): React.ReactNode {
  if (slug === "factory-method") return <FactoryMethodScene />;
  // if (slug === "observer") return <ObserverScene />;
  // if (slug === "singleton") return <SingletonScene />;
  // ... add new patterns here
  return null;
}
```

**How to add Pattern #6:**
1. Create `src/scenes/{pattern-slug}/` with scene components
2. Import scene: `import { NewScene } from "@/scenes/{pattern-slug}/new-scene";`
3. Register: Add `if (slug === "{pattern-slug}") return <NewScene />;`
4. Done — PatternPageLayout handles the rest

See [system-architecture.md](./system-architecture.md#layer-6-scene-registration--extension-point) for full details.

### Zustand State Management

Pattern navigation is managed client-side:

```typescript
// Read current step in 3D scene
const currentStep = usePatternStore((s) => s.currentStep);

// Write in step controls
const { nextStep, prevStep } = usePatternStore();
nextStep(); // Advances to next step, triggers scene animation + code highlight
```

See [code-standards.md](./code-standards.md#state-management-zustand) for patterns.

### Server vs. Client Components

- **Server:** PatternPageLayout, CodeBlock, Navbar, Footer (pre-render HTML)
- **Client:** FactoryMethodScene, StepControls, PatternCanvas (interactivity + 3D)

See [code-standards.md](./code-standards.md#react-components) for examples.

---

## Phase Status

| Phase | Title | Status | Files |
|-------|-------|--------|-------|
| 01 | Project Setup | ✓ Complete | — |
| 02 | Design System | ✓ Complete | — |
| 03 | Content Model | ✓ Complete | — |
| 04 | 3D Scene Framework | ✓ Complete | — |
| 05 | **Factory Method Scene** | ✓ **Complete** | `src/scenes/factory-method/*` |
| 06 | Observer Scene | Pending | — |
| 07 | Singleton Scene | Pending | — |
| 08 | Strategy Scene | Pending | — |
| 09 | Decorator Scene | Pending | — |
| 10 | Landing Page & Deploy | Pending | — |

---

## File References (Phase 05)

**Factory Method Scene Files:**
- `src/scenes/factory-method/factory-method-scene.tsx` — Orchestrator (reads Zustand, renders children)
- `src/scenes/factory-method/machine-station.tsx` — Machine node with glow animation
- `src/scenes/factory-method/conveyor-belt.tsx` — Belt geometry with emissive pulse
- `src/scenes/factory-method/product.tsx` — Shape that scales on step change
- `src/scenes/factory-method/request-arrow.tsx` — Arrow animation on step 0

**Pattern Page Integration:**
- `src/components/pattern/pattern-page-layout.tsx` — Server compositor + `getPatternScene()` registry
- `src/app/patterns/[slug]/page.tsx` — SSG pattern page renderer
- `src/store/pattern-store.ts` — Zustand store for step navigation

**Shared Infrastructure (Phase 04):**
- `src/scenes/shared/camera-rig.tsx` — Scripted camera per step
- `src/scenes/shared/scene-lighting.tsx` — Lighting + fog
- `src/scenes/shared/animated-arrow.tsx` — Reusable arrow primitive
- `src/components/pattern/code-block.tsx` — Shiki server-side highlighting
- `src/components/pattern/step-controls.tsx` — UI for step navigation

---

## Architecture Decisions

**6 Major Decisions Explained in Full:**

1. **SSG over SSR/ISR** — All 5 pattern pages built at deploy time (instant loads)
2. **Server-First Components** — Only client where needed (R3F, hooks, store)
3. **R3F v8 pinned** — React 18 compatible; v9 requires React 19
4. **Scripted Camera** — Not free orbit (best viewing angle per step)
5. **Pre-rendered Code Blocks** — Shiki runs at build time, not runtime
6. **Dark Mode Only** — Neon aesthetic, simpler design, faster loads

See [project-overview-pdr.md](./project-overview-pdr.md#technical-specification) for full rationale.

---

## Common Tasks

### I want to add a new pattern (Phase 06+)

1. Create pattern content: `src/content/{pattern-slug}.content.ts`
   - See [codebase-summary.md](./codebase-summary.md#content-system-srccontent) for structure

2. Create scene components: `src/scenes/{pattern-slug}/*.tsx`
   - Follow 3D component pattern in [code-standards.md](./code-standards.md#3d-components-r3f)
   - Use factory-method scene as template

3. Register in `getPatternScene()`:
   ```typescript
   if (slug === "{pattern-slug}") return <NewScene />;
   ```

4. That's it — SSG regenerates the new page automatically

### I want to understand the data flow

See [system-architecture.md](./system-architecture.md#data-flow-during-step-change) for step-by-step walkthrough with diagrams.

### I want to add a new shared primitive

1. Create: `src/scenes/shared/{primitive-name}.tsx`
2. Export React component with "use client"
3. Use `useFrame` for animations
4. Follow patterns in [code-standards.md](./code-standards.md#3d-components-r3f)

### I want to check code quality standards

See [code-standards.md](./code-standards.md) for:
- TypeScript + React patterns
- File naming (kebab-case)
- Component structure
- Error handling
- Testing approach
- Common pitfalls

---

## Performance Targets

- **Landing page:** <2s FCP (First Contentful Paint)
- **Pattern page:** <4s LCP (Largest Contentful Paint)
- **3D rendering:** 60fps on mid-range GPU (GTX 1060)
- **Bundle size:** ~25KB landing (no Three.js) + 80KB pattern page (Three.js included)

See [project-overview-pdr.md](./project-overview-pdr.md#non-functional-requirements-mvp) for detailed NFRs.

---

## Risk Assessment

**High-Risk Items:**
1. R3F performance on mobile (mitigated: WebGL fallback)
2. Shiki cold start on first deploy (~200ms, mitigated: lazy-init)
3. Pattern content scope creep (mitigated: hard limit 5 patterns)
4. Three.js bundle size (mitigated: dynamic import, tree-shaking)

See [project-overview-pdr.md](./project-overview-pdr.md#risk-assessment) for full assessment + mitigation strategies.

---

## Testing Standards

- **Unit tests:** Utils, store actions
- **Component tests:** Step controls, code block visibility
- **E2E tests:** Full page flow (step through all steps, toggle play, verify animations)
- **Performance tests:** Page load <4s, 60fps 3D rendering
- **Accessibility tests:** WCAG 2.1 AA (keyboard nav, ARIA labels)

See [code-standards.md](./code-standards.md#testing-standards) for test patterns.

---

## Getting Help

| Question | Resource |
|----------|----------|
| "Where is the factory-method code?" | [codebase-summary.md](./codebase-summary.md#directory-structure) |
| "How do I add a new pattern?" | [system-architecture.md](./system-architecture.md#extension-points) |
| "What are the coding standards?" | [code-standards.md](./code-standards.md) |
| "What are the project requirements?" | [project-overview-pdr.md](./project-overview-pdr.md) |
| "What's the data flow?" | [system-architecture.md](./system-architecture.md#data-flow-diagram) |
| "Why is architecture this way?" | [project-overview-pdr.md](./project-overview-pdr.md#architecture-decisions) |

---

## Document Maintenance

These documents are updated:
- **After each phase completion** — Status, new files, architecture changes
- **Before code reviews** — Verify standards compliance
- **On major architecture changes** — Decision rationale, risk impact
- **Quarterly** — Metrics, progress, roadmap updates

Last updated: **2026-03-01** (Phase 05 completion)

---

## Contributing

When updating documentation:
1. Keep files under 800 LOC (split if needed)
2. Update cross-references in other docs
3. Verify all code paths exist before documenting
4. Use absolute paths for file references
5. Include diagrams for complex concepts
6. Add to version history table

See [code-standards.md](./code-standards.md#documentation-standards) for details.

