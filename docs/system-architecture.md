# System Architecture: Design Pattern Visualizer

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         DESIGN PATTERN VISUALIZER                   │
│                      Next.js 14 + React Three Fiber                 │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────────┐         ┌──────────────────────────┐
│   Landing Page (SSG)     │         │ Pattern Pages (SSG)      │
│  - Pattern Grid          │────────→│ - 3D Canvas              │
│  - Pattern Cards         │         │ - Code Walkthrough       │
│  - Hero Section          │         │ - Real-world Examples    │
└──────────────────────────┘         └──────────────────────────┘
         ↓                                      ↓
   No Three.js                  Three.js Bundle (~80KB)
   (~15KB JS)                    + R3F + Scene Components
```

---

## Layered Architecture

### Layer 1: Next.js App Router (Server)

**Routing:**
- `/` → Landing page (index)
- `/patterns/[slug]` → Pattern pages (SSG via `generateStaticParams`)
  - Slugs: factory-method, observer, singleton, strategy, decorator

**Server Components:**
- `src/app/layout.tsx` — Root layout, Navbar, Footer
- `src/app/patterns/[slug]/page.tsx` — Fetches pattern, renders PatternPageLayout
- `src/components/pattern/pattern-page-layout.tsx` — Composes all pattern page sections
- `src/components/pattern/code-block.tsx` — Shiki server-side highlighting

**Static Generation:**
```typescript
export function generateStaticParams() {
  return [
    { slug: "factory-method" },
    { slug: "observer" },
    { slug: "singleton" },
    { slug: "strategy" },
    { slug: "decorator" }
  ];
}
```

---

### Layer 2: Client-Side State Management (Zustand)

**Store Location:** `src/store/pattern-store.ts`

**State:**
```typescript
interface PatternState {
  currentStep: number;        // 0-based step index
  totalSteps: number;         // Total steps in pattern
  isPlaying: boolean;         // Auto-play mode toggle
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  togglePlay: () => void;
  reset: (totalSteps: number) => void;
}
```

**Usage:**
1. **StepControls** (UI) → reads/writes store
2. **FactoryMethodScene** (3D) → reads currentStep, adjusts scene state
3. **CodeBlock** (UI) → CSS shows/hides via data-step attribute matching currentStep

**Auto-play:**
- Default: `isPlaying: false` (paused on page load)
- When enabled: `setInterval` advances step every 3 seconds
- Loops: `nextStep()` wraps to 0 after final step

---

### Layer 3: 3D Scene Rendering (React Three Fiber)

**Canvas Setup** (`src/components/pattern/pattern-canvas.tsx`):
```
R3F Canvas
├── CameraRig (scripted camera per step)
├── SceneLighting (ambient + directional + point + fog)
├── [PatternScene] (factory-method, observer, etc.)
│   ├── Shared Primitives (GlowingSphere, AnimatedArrow, etc.)
│   └── Pattern-specific Components
└── EffectComposer (optional: bloom post-processing)
```

**Camera System** (`src/scenes/shared/camera-rig.tsx`):
- Props: `position: [x, y, z]`, `target: [x, y, z]`
- `useFrame` hook: each frame, lerp camera toward target
- Lerp factor: 0.05 (smooth 60fps transition)
- No OrbitControls (user cannot freely rotate)
- Camera position/target supplied by `PatternStep` content

**Lighting** (`src/scenes/shared/scene-lighting.tsx`):
- Ambient light: 0.3 intensity (shadows, no pure black)
- Directional light: 1.0 intensity (key light)
- Point lights: per-scene (optional, used in factory machines)
- Fog: linear, far distance ~20 units

---

### Layer 4: Pattern Scene Orchestration (Factory Method Example)

**FactoryMethodScene** (`src/scenes/factory-method/factory-method-scene.tsx`):
```typescript
const currentStep = usePatternStore((s) => s.currentStep);

return (
  <>
    <ConveyorBelt />
    {MACHINES.map((m, i) => (
      <MachineStation
        isActive={i === activeMachine}  // Step 2: highlight one
        ...
      />
    ))}
    <RequestArrow visible={currentStep === 0} />  // Step 0
    <Product visible={currentStep === 2} ... />    // Step 2
  </>
);
```

**Step Mapping:**
| Step | Scene State | Code Highlight |
|------|-------------|---|
| 0 | Idle (no arrow, no product) | `factory.createProduct(type)` intro |
| 1 | Request arrow animates left→right | `class ConcreteCreatorB extends Creator` |
| 2 | WebApp machine active (glows), others dim | `return new ConcreteProductB()` |

**Child Components:**
- **MachineStation**: Box + label + glow animation (active state)
- **ConveyorBelt**: Belt surface + glowing edge strip
- **Product**: Shape that scales 0→1 on step change
- **RequestArrow**: Arrow traveling from left

---

### Layer 5: Data Model (Content System)

**Type Definitions** (`src/content/types.ts`):
```typescript
interface PatternStep {
  description: string;          // What this step shows
  code: string;                 // TypeScript code example
  highlightedLines: number[];   // Line numbers to highlight
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
}

interface Pattern {
  name: string;                 // "Factory Method"
  slug: string;                 // "factory-method"
  category: PatternCategory;    // Creational | Structural | Behavioral
  tagline: string;              // Short description
  problem: string;              // Problem narrative
  steps: PatternStep[];         // 3 steps (MVP)
  realWorldExample: {
    title: string;
    code: string;
  };
  antiPatterns: Array<{
    title: string;
    description: string;
    code?: string;
  }>;
}
```

**Pattern Registry** (`src/content/index.ts`):
```typescript
export const PatternDictionary: Record<string, Pattern> = {
  "factory-method": factoryMethodPattern,
  "observer": observerPattern,
  // ... etc
};

export function getPatternBySlug(slug: string): Pattern | null { ... }
export function getAllPatterns(): Pattern[] { ... }
```

---

### Layer 6: Scene Registration & Extension Point

**Scene Registry** (`src/components/pattern/pattern-page-layout.tsx`):
```typescript
/**
 * Maps pattern slug to its 3D scene component.
 * All entries MUST be "use client" components — never async server imports.
 */
function getPatternScene(slug: string): React.ReactNode {
  if (slug === "factory-method") return <FactoryMethodScene />;
  // if (slug === "observer") return <ObserverScene />;
  // ... add new patterns here
  return null;
}
```

**How to add a new pattern:**
1. Create `src/scenes/{pattern-slug}/{pattern-slug}-scene.tsx` + child components
2. Add import: `import { NewPatternScene } from "@/scenes/{pattern-slug}/{pattern-slug}-scene";`
3. Add condition: `if (slug === "{pattern-slug}") return <NewPatternScene />;`

---

## Component Hierarchy: Pattern Page

```
PatternPage (Server)
  └── PatternPageLayout (Server)
      ├── PageShell (Server)
      │   ├── Navbar (Server)
      │   │   └── Logo, GitHub link
      │   └── Footer (Server)
      │       └── Copyright, pattern nav
      ├── Problem Section (Server text)
      ├── WebGLFallback (Client)
      │   └── PatternCanvas (Client, dynamic import)
      │       └── R3F Canvas
      │           ├── CameraRig
      │           ├── SceneLighting
      │           ├── FactoryMethodScene (Client)
      │           │   ├── ConveyorBelt
      │           │   ├── MachineStation[0..2]
      │           │   │   └── FloatingLabel
      │           │   ├── RequestArrow
      │           │   └── Product
      │           └── EffectComposer (optional bloom)
      ├── StepControls (Client)
      │   ├── Prev Button
      │   ├── Play/Pause Toggle
      │   ├── Step Counter
      │   └── Progress Bar (Framer Motion)
      ├── CodeBlock (Server)
      │   ├── Step 0 Code Block (hidden by default)
      │   ├── Step 1 Code Block
      │   ├── Step 2 Code Block
      │   └── Copy button (per block)
      ├── Real-World Section (Server text)
      └── Anti-Patterns Section (Server text)
```

---

## Data Flow During Step Change

```
User clicks "Next" button
  ↓
StepControls (Client) → store.nextStep()
  ↓
Zustand store: currentStep = 1
  ↓
┌──────────────────────────────────────────────────────────┐
│  React re-renders:                                       │
│  • FactoryMethodScene reads store → updates scene state  │
│  • CodeBlock shows step 1 block via CSS data-step attr   │
│  • StepControls displays "Step 2 / 3"                    │
│  • CameraRig lerps camera to step.cameraTarget           │
└──────────────────────────────────────────────────────────┘
  ↓
Animation frame loop (useFrame):
  • Camera lerps toward target position
  • MachineStation scales up + emissive pulses (if active)
  • Product scales in (if step === 2)
  • RequestArrow moves (if step === 0)
```

---

## Styling Architecture

**Global Styles** (`src/app/globals.css`):
- Dark-only (`:root`, `.dark` merged)
- CSS variables for colors (primary, secondary, accent, muted, destructive, etc.)
- Animated neon borders on pattern cards
- Smooth gradients on pattern page headers

**Component Styling:**
- Tailwind CSS + `clsx` + `tailwind-merge` (via `cn()` utility)
- shadcn/ui components: Button, Card, Badge, Separator
- Framer Motion for UI animations (progress bar, card hovers)

**3D Material Properties:**
```typescript
// MachineStation active state
color: "#8b5cf6"
emissive: "#8b5cf6"
emissiveIntensity: 0.45 + 0.25 * pulse()  // Animates
metalness: 0.6
roughness: 0.3
```

---

## Performance Optimization

**Code Splitting:**
1. Landing page: imports only layout, footer, pattern index
2. Pattern page: dynamic import of PatternCanvas + scene
3. Three.js only loaded on `/patterns/*` routes

**Bundle Breakdown:**
| Component | Size | When Loaded |
|-----------|------|-------------|
| Next.js core | ~35KB | Always |
| React | ~10KB | Always |
| Tailwind | ~15KB | Always |
| Three.js | ~500KB | Pattern pages only |
| R3F | ~30KB | Pattern pages only |
| Scene code | ~20KB | Pattern pages only |

**Runtime Optimizations:**
- Shiki: lazy-init, cached after first use
- Canvas dpr: responsive (0.5-2x based on device)
- Fog reduces draw distance
- WebGL fallback on GPU tier 0
- No bloom by default (optional per scene)
- `useFrame` delta time for frame-rate independence

---

## Deployment Architecture

**Hosting:** Vercel (Next.js native)

**Build Output:**
- SSG: All pattern pages pre-built at build time (5 pages)
- ISR: Not used (static content, no revalidation needed)
- Image optimization: next/image (if hero images added)

**Environment Variables:**
- `GITHUB_URL`: GitHub repository link (used in navbar)
- Next.js defaults: `NODE_ENV`, `NEXT_PUBLIC_*` for client

**CI/CD:**
- Push to GitHub → Vercel auto-deploys
- Bundle size monitoring via Vercel Analytics
- Performance metrics: Core Web Vitals

---

## Extension Points

### 1. Adding a New Pattern

**File structure:**
```
src/scenes/observer/
├── observer-scene.tsx          # Main orchestrator
├── subject.tsx                 # Observer UI component
├── observer-component.tsx       # Listeners visualization
└── notification-stream.tsx      # Event visualization
```

**Integration steps:**
1. Create pattern content: `src/content/observer.content.ts`
2. Create scene components: `src/scenes/observer/*`
3. Register in `getPatternScene()`: `if (slug === "observer") return <ObserverScene />;`
4. Done — SSG regenerates with new page

### 2. Adding a New Shared Primitive

**Location:** `src/scenes/shared/{primitive-name}.tsx`

**Pattern:**
- Export React component (use "use client")
- Accept props for position, color, animation state
- Use `useFrame` for animations
- No external dependencies (only three, @react-three/fiber)

### 3. Customizing Scene Lighting

**Edit:** `src/scenes/shared/scene-lighting.tsx`

**Current setup:**
- Ambient: 0.3
- Directional: 1.0
- Fog: linear, far 20

**Per-pattern override:** Create custom lighting component in `src/scenes/{pattern}/` and render instead of shared

---

## Error Handling & Fallbacks

**WebGL Not Supported:**
- `useDetectGPU` from drei detects GPU tier
- Tier 0 or undefined → render `WebGLFallback` message
- Message: "WebGL not supported on this device"

**Pattern Not Found:**
- `getPatternBySlug()` returns null
- Pattern page renders 404 error boundary

**Code Highlighting Failure:**
- Shiki init error caught in `try/catch`
- Falls back to `<pre><code>` with no highlighting

---

## Testing Strategy

**Unit Tests:**
- `usePatternStore` actions (setStep, nextStep, etc.)
- `getPatternBySlug()` and pattern registry
- Utility functions (`cn()`, constants)

**Integration Tests:**
- Pattern page SSG builds successfully
- Step controls update store correctly
- Code block visibility toggles per step
- Camera lerps to correct position

**E2E Tests:**
- Navigate to pattern page
- Step through all steps
- Toggle auto-play
- Verify no console errors

**Performance Tests:**
- Landing page: < 3s FCP
- Pattern page: < 4s LCP
- Canvas: 60fps on mid-range GPU

---

## Known Constraints

1. **R3F v8 (not v9)**: v9 requires React 19; project uses React 18
2. **No free camera rotation**: Camera is scripted per step (design choice)
3. **TypeScript only**: Code examples in patterns are TypeScript (MVP scope)
4. **Dark mode only**: No light theme toggle
5. **Desktop-first**: Mobile gets WebGL fallback message
6. **5 patterns max for MVP**: No plans for 6+ until deployment validation

---

## Future Enhancements

**Phase 11+:**
- Pattern #6: Proxy, Decorator variants
- Code editor: Interactive code sandbox (Monaco or CodeMirror)
- Multi-language: Python, Java, Go examples
- Mobile support: Simplified 2D diagrams on mobile
- Community patterns: User-submitted patterns
- Quiz/challenges: Mutation playground (break pattern, see consequences)

---

## Diagrams

### Request Flow: Step Change

```
StepControls (click "Next")
    ↓
Zustand store.nextStep() → currentStep = 1
    ↓
React re-render triggered
    ├→ FactoryMethodScene reads store
    │   └→ Updates child visibility/animation state
    ├→ CodeBlock CSS [data-step="1"] shown
    ├→ StepControls display "Step 2 / 3"
    └→ CameraRig sets target position
         ↓
    useFrame loop (60fps)
         ↓
    Camera lerps toward target
    Machine scales + glows
    Product scales in
    RequestArrow animates
         ↓
    Scene renders frame by frame
```

### File Dependencies

```
src/app/patterns/[slug]/page.tsx
    ↓
    imports getPatternBySlug
         ↓
    src/content/index.ts
         ↓
    src/content/factory-method.content.ts
    src/content/types.ts

    renders PatternPageLayout
         ↓
    src/components/pattern/pattern-page-layout.tsx
         ↓
    imports getPatternScene()
         ↓
    src/scenes/factory-method/factory-method-scene.tsx
         ├→ imports shared primitives
         ├→ imports usePatternStore
         └→ imports child scene components
```

