# Codebase Summary: Design Pattern Visualizer

## Project Overview

**Design Pattern Visualizer** is an interactive Next.js 14 web application that uses 3D visualization (React Three Fiber) to teach software design patterns. Each pattern gets a custom animated 3D scene synchronized with step-by-step code walkthroughs.

**Key Stats:**
- 68 files total
- 48,565 tokens (repomix analysis)
- Tech Stack: Next.js 14, React 18, R3F v8, Zustand, Shiki v4, Tailwind CSS

---

## Directory Structure

```
D:/Dev/DesignPatternVisualize/
├── src/
│   ├── app/                          # Next.js 14 App Router
│   │   ├── page.tsx                  # Landing page
│   │   ├── layout.tsx                # Root layout
│   │   ├── globals.css               # Dark-only neon palette
│   │   ├── fonts/                    # Geist font files
│   │   ├── favicon.ico
│   │   └── patterns/
│   │       └── [slug]/
│   │           ├── page.tsx          # SSG pattern pages
│   │           └── opengraph-image.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── navbar.tsx            # Sticky header (Server Component)
│   │   │   ├── footer.tsx            # Minimal footer
│   │   │   └── page-shell.tsx        # Pattern page wrapper
│   │   ├── pattern/
│   │   │   ├── pattern-page-layout.tsx    # Server compositor
│   │   │   ├── pattern-canvas.tsx         # R3F Canvas (dynamic, ssr:false)
│   │   │   ├── code-block.tsx             # Shiki SSR code highlighting
│   │   │   ├── step-controls.tsx          # Prev/Next/Play UI
│   │   │   ├── webgl-fallback.tsx         # GPU detection fallback
│   │   │   └── pattern-card.tsx           # Framer Motion hover card
│   │   └── ui/
│   │       ├── button.tsx            # shadcn Button
│   │       ├── card.tsx              # shadcn Card
│   │       ├── badge.tsx             # shadcn Badge
│   │       └── separator.tsx          # shadcn Separator
│   ├── content/
│   │   ├── types.ts                  # Pattern, PatternStep, PatternCategory types
│   │   ├── index.ts                  # Pattern registry + helpers
│   │   ├── factory-method.content.ts # Factory Method pattern definition
│   │   ├── observer.content.ts       # Observer pattern (stub)
│   │   ├── singleton.content.ts      # Singleton pattern (stub)
│   │   ├── strategy.content.ts       # Strategy pattern (stub)
│   │   └── decorator.content.ts      # Decorator pattern (stub)
│   ├── lib/
│   │   ├── constants.ts              # GITHUB_URL, etc.
│   │   ├── utils.ts                  # cn() utility
│   │   └── shiki.ts                  # Singleton highlighter
│   ├── store/
│   │   └── pattern-store.ts          # Zustand state (currentStep, isPlaying, etc.)
│   └── scenes/
│       ├── shared/
│       │   ├── scene-lighting.tsx    # Ambient + directional + point lights
│       │   ├── camera-rig.tsx        # Scripted camera lerp per step
│       │   ├── glowing-sphere.tsx    # Emissive sphere primitive
│       │   ├── animated-arrow.tsx    # Pulsing arrow primitive
│       │   ├── floating-label.tsx    # Billboard text primitive
│       │   └── particle-stream.tsx   # Animated particles
│       └── factory-method/
│           ├── factory-method-scene.tsx  # Main orchestrator (NEW)
│           ├── machine-station.tsx       # Glowing machine node (NEW)
│           ├── conveyor-belt.tsx         # Assembly belt geometry (NEW)
│           ├── product.tsx               # Materializing product shape (NEW)
│           └── request-arrow.tsx         # Client request arrow (NEW)
├── plans/                            # Implementation planning
├── public/                           # Static assets (if any)
├── package.json                      # Dependencies
├── tsconfig.json                     # TypeScript config
├── tailwind.config.ts                # Tailwind with CSS variables
├── components.json                   # shadcn/ui config (New York, slate, CSS vars)
├── next.config.mjs                   # Three.js transpilation
└── repomix-output.xml                # Full codebase compaction
```

---

## Key Components

### Content System (`src/content/`)

**Types** (`types.ts`):
- `PatternCategory`: Creational | Structural | Behavioral
- `PatternStep`: code, highlightedLines[], description, cameraPosition, cameraTarget
- `Pattern`: name, slug, category, tagline, problem, steps[], realWorldExample, antiPatterns[]

**Pattern Registry** (`index.ts`):
- `PatternDictionary` maps slug → Pattern
- `getPatternBySlug()`, `getAllPatterns()`, `getPatternsByCategory()` helpers

### Store & UI State (`src/store/pattern-store.ts`)

**Zustand Store `usePatternStore`:**
- `currentStep: number` — current step index (0-based)
- `totalSteps: number` — total steps in pattern
- `isPlaying: boolean` — auto-play mode
- `setStep(step)`, `nextStep()`, `prevStep()`, `togglePlay()`, `reset(totalSteps)`

### Scene Framework

**Pattern Page Layout** (`src/components/pattern/pattern-page-layout.tsx`):
- Server component that composes: header → problem → 3D canvas → controls → code → real-world → anti-patterns
- Calls `getPatternScene(slug)` to retrieve pattern-specific 3D component
- **NEW:** `getPatternScene()` function maps pattern slugs to their scene components
  - Extensible registry pattern for adding new pattern scenes
  - All scene components MUST be "use client" (R3F requirement)

**Pattern Canvas** (`src/components/pattern/pattern-canvas.tsx`):
- Dynamically imported, `ssr: false` (Three.js client-only)
- Props: `steps`, `children` (scene), `className`
- Includes R3F Canvas, lighting, fog, camera rig, optional bloom

**Step Controls** (`src/components/pattern/step-controls.tsx`):
- Client component: Prev/Next buttons, Play/Pause toggle
- Reads/writes Zustand store
- Framer Motion progress bar

**Code Block** (`src/components/pattern/code-block.tsx`):
- Server component using Shiki v4 for syntax highlighting
- Pre-renders ALL steps at build time
- Client shows/hides via `data-step` CSS attribute (no client-side Shiki)
- Copy button per block

### 3D Scenes (`src/scenes/`)

**Shared Primitives** (`src/scenes/shared/`):
- `SceneLighting`: ambient + directional + point lights + fog
- `CameraRig`: Lerps camera per frame toward target position (scripted, no free orbit)
- `GlowingSphere`: Emissive pulsing sphere
- `AnimatedArrow`: Line + cone arrowhead with dash animation
- `FloatingLabel`: drei Text with billboard behavior
- `ParticleStream`: Animated particle buffer

**Factory Method Scene** (`src/scenes/factory-method/`):
- **FactoryMethodScene**: Main orchestrator
  - Reads `currentStep` from Zustand
  - Controls visibility/state of child components per step
  - Step 0: idle state
  - Step 1: request arrow animates from left
  - Step 2: one machine activates (highlights, dims others)
  - Step 3: product materializes at factory output
- **MachineStation**: Assembly node with rounded box, emissive pulse when active
  - Props: position, label, isActive, color
  - FloatingLabel shows machine name above
  - Dims opacity (0.35) and reduces emissive (0.05) when inactive
- **ConveyorBelt**: Horizontal belt surface with glowing edge strip
  - Animates emissive intensity for "movement" effect
  - Uses metallic material for industrial look
- **Product**: Shape (sphere/cube/torus) that appears on step 3
  - Props: type, visible, position, color
  - Scales from 0→1 when visible becomes true
- **RequestArrow**: Animated arrow traveling left→right
  - Visible only on step 1
  - Uses shared AnimatedArrow primitive

---

## Static Content Files

### Pattern Definitions

Each pattern file in `src/content/` exports a `Pattern` constant with:
- 3 steps (default for MVP)
- TypeScript code examples
- Camera positions + targets
- Real-world examples (e.g., React Hooks, Express.js)
- Anti-patterns section

**Completed:**
- `factory-method.content.ts` ✓ (Phase 05)

**In Progress:**
- `observer.content.ts` (Phase 06)
- `singleton.content.ts` (Phase 07)
- `strategy.content.ts` (Phase 08)
- `decorator.content.ts` (Phase 09)

---

## Styling & Design System

**Colors** (`src/app/globals.css`):
- Dark-only neon palette (`:root` + `.dark` merged)
- CSS variables: `--primary`, `--secondary`, `--accent`, `--destructive`, `--muted`, etc.
- Animated neon borders on pattern cards
- Gradient header on pattern pages

**Tailwind** (`tailwind.config.ts`):
- Uses CSS variable colors
- Extends with custom spacing, shadows
- Dark mode always active (no light mode toggle)

**shadcn/ui** (`components.json`):
- Style: New York
- Color: Slate
- CSS Variables for all colors
- Installed: Button, Card, Badge, Separator

---

## Performance & Loading

**Code Splitting:**
- Three.js + R3F only loaded on pattern pages
- Landing page: ~15KB JS (no Three.js)
- Pattern pages: +~80KB (three + r3f + scene code)

**Bundle Analysis:**
- `next.config.mjs`: transpiles `three` (bypasses CommonJS issues)
- Dynamic import of `PatternCanvas` with `ssr: false`
- Shiki lazy-inits on first code highlight

**Optimization Flags:**
- Canvas dpr: responsive (0.5-2 based on device)
- Fog reduces far clipping distance
- WebGL fallback on unsupported devices
- No bloom by default (optional per scene)

---

## Data Flow Diagram

```
Landing Page
  ↓
Pattern Picker (index.tsx)
  ↓
[slug]/page.tsx (SSG via generateStaticParams)
  ↓
PatternPageLayout (Server)
  ├→ getPatternScene(slug) → FactoryMethodScene (React client component)
  ├→ PatternCanvas (dynamic, ssr:false)
  │   └→ R3F Canvas → CameraRig, Lighting, FactoryMethodScene, Effects
  ├→ StepControls (Client) → reads/writes usePatternStore
  └→ CodeBlock (Server) → Shiki pre-renders all steps

Zustand Store (Client)
  currentStep ← StepControls
  currentStep → FactoryMethodScene (via usePatternStore)
  currentStep → CodeBlock CSS visibility (via data-step)
```

---

## Testing & Validation

**Code Review Reports** (`plans/reports/`):
- Phase 02-04: Code quality checks ✓
- Phase 05 (Factory Method): Code review complete ✓

**Phase 05 Completion** (2026-03-01):
- All 5 factory-method scene components implemented
- Page integration verified (SSG build passes)
- Step sync tested (Zustand ↔ UI ↔ Scene)
- No regressions in phases 02-04

---

## Next Steps

**Phase 06 (Observer):**
- Reuse all shared infrastructure from Phase 04
- Add Observer pattern content (`observer.content.ts` needs step details)
- Create `src/scenes/observer/observer-scene.tsx` + child components
- Register scene in `getPatternScene()` function

**Phase 07-09:** Repeat pattern (Singleton, Strategy, Decorator)

**Phase 10:** Landing page redesign + SEO + deploy to Vercel

---

## Key Files Reference

| File | Purpose | Lines |
|------|---------|-------|
| `src/content/types.ts` | Type definitions | ~60 |
| `src/store/pattern-store.ts` | Zustand state | ~30 |
| `src/lib/shiki.ts` | Syntax highlighting | ~40 |
| `src/components/pattern/pattern-page-layout.tsx` | Server compositor + scene registry | ~111 |
| `src/scenes/factory-method/factory-method-scene.tsx` | Factory orchestrator | ~49 |
| `src/scenes/factory-method/machine-station.tsx` | Machine component | ~58 |
| `src/scenes/factory-method/conveyor-belt.tsx` | Belt geometry | ~36 |

---

## Notes

- R3F is pinned to v8 (v9 requires React 19; project uses React 18)
- Camera has no OrbitControls (scripted per step via CameraRig)
- All pattern pages are SSG (static generation at build time)
- Shiki initialization is lazy (first highlight triggers cold start ~200ms, then cached)
- Three.js transpilation required via `next.config.mjs` for `three/examples` usage
