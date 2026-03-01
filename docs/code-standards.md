# Code Standards & Codebase Structure

## Project Organization

### Directory Layout

```
src/
├── app/                              # Next.js App Router
│   ├── page.tsx                      # Landing page
│   ├── layout.tsx                    # Root layout (Navbar, Footer, providers)
│   ├── globals.css                   # Global styles (dark mode, CSS variables)
│   ├── fonts/                        # Geist font files
│   ├── favicon.ico
│   └── patterns/
│       └── [slug]/
│           ├── page.tsx              # Pattern page (SSG, renders PatternPageLayout)
│           └── opengraph-image.tsx   # OG image generation
│
├── components/                       # Reusable UI components
│   ├── layout/
│   │   ├── navbar.tsx                # Top navigation (Server Component)
│   │   ├── footer.tsx                # Bottom footer (Server Component)
│   │   └── page-shell.tsx            # Pattern page wrapper
│   │
│   ├── pattern/                      # Pattern page components
│   │   ├── pattern-page-layout.tsx   # Server compositor + scene registry
│   │   ├── pattern-canvas.tsx        # R3F Canvas wrapper (dynamic, ssr:false)
│   │   ├── code-block.tsx            # Shiki server component (pre-renders all steps)
│   │   ├── step-controls.tsx         # Step UI (prev/next/play) — Client
│   │   ├── webgl-fallback.tsx        # GPU detection fallback — Client
│   │   └── pattern-card.tsx          # Hover card for pattern grid — Client
│   │
│   └── ui/                           # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── badge.tsx
│       └── separator.tsx
│
├── content/                          # Pattern definitions & content
│   ├── types.ts                      # Pattern, PatternStep, PatternCategory types
│   ├── index.ts                      # Pattern registry + helpers
│   ├── factory-method.content.ts     # Factory Method pattern data
│   ├── observer.content.ts           # Observer pattern data (stub)
│   ├── singleton.content.ts          # Singleton pattern data (stub)
│   ├── strategy.content.ts           # Strategy pattern data (stub)
│   └── decorator.content.ts          # Decorator pattern data (stub)
│
├── lib/                              # Utilities & helpers
│   ├── constants.ts                  # GITHUB_URL, feature flags
│   ├── utils.ts                      # cn() (clsx + tailwind-merge), other utilities
│   └── shiki.ts                      # Singleton Shiki highlighter instance
│
├── store/                            # Client-side state
│   └── pattern-store.ts              # Zustand pattern store (currentStep, isPlaying, etc.)
│
└── scenes/                           # 3D scene components (R3F)
    ├── shared/                       # Reusable primitives used across patterns
    │   ├── scene-lighting.tsx        # Ambient + directional + point lights + fog
    │   ├── camera-rig.tsx            # Scripted camera rig (lerps per step)
    │   ├── glowing-sphere.tsx        # Emissive pulsing sphere
    │   ├── animated-arrow.tsx        # Arrow with dash animation
    │   ├── floating-label.tsx        # Billboard text (drei Text)
    │   └── particle-stream.tsx       # Animated particle buffer
    │
    └── factory-method/               # Factory Method pattern scene (NEW)
        ├── factory-method-scene.tsx  # Main orchestrator (reads store, renders children)
        ├── machine-station.tsx       # Machine node with glow animation
        ├── conveyor-belt.tsx         # Assembly belt geometry
        ├── product.tsx               # Product shape (sphere/cube/torus)
        └── request-arrow.tsx         # Client request arrow
```

---

## File Naming Conventions

### TypeScript/React Components

**Pattern:** PascalCase with descriptive name + `.tsx` extension

```
✓ factory-method-scene.tsx       # "Use client" scene component
✓ machine-station.tsx             # Reusable 3D component
✓ conveyor-belt.tsx               # 3D primitive
✓ pattern-page-layout.tsx         # Server layout composer
✓ step-controls.tsx               # Client UI component
✓ code-block.tsx                  # Server component
✓ animated-arrow.tsx              # Shared 3D primitive
```

**File content:** One component per file. Subcomponents should be in separate files if used elsewhere.

### Content Files

**Pattern:** kebab-case + `.content.ts` suffix

```
✓ factory-method.content.ts
✓ observer.content.ts
✓ singleton.content.ts
```

**Content:** Exports single default `Pattern` constant

### Utility Files

**Pattern:** kebab-case + clear purpose

```
✓ shiki.ts                  # Singleton highlighter
✓ pattern-store.ts          # Zustand store
✓ constants.ts              # App constants
✓ utils.ts                  # General utilities (cn, etc.)
```

---

## Code Style Guide

### TypeScript

**Type Definitions:**
- Use `interface` for object shapes (preferred over `type`)
- Use `type` for unions, primitives, tuples
- Prefix generic types with 'T' if single-letter (e.g., `<T>`)

```typescript
// ✓ Preferred
interface PatternStep {
  description: string;
  code: string;
  highlightedLines: number[];
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
}

// ✓ Acceptable for unions
type PatternCategory = "Creational" | "Structural" | "Behavioral";
```

**Naming:**
- Components: PascalCase (`PatternCard`, `MachineStation`)
- Functions: camelCase (`getPatternBySlug`, `highlightCode`)
- Constants: UPPER_SNAKE_CASE for true constants (`GITHUB_URL`)
- Variables: camelCase (`currentStep`, `activeMachine`)

**Imports:**
- Group by type: React → third-party → local
- Absolute paths with `@/` alias (configured in `tsconfig.json`)

```typescript
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { FloatingLabel } from "@/scenes/shared/floating-label";
```

**Props Pattern:**
```typescript
interface MachineStationProps {
  position: [number, number, number];
  label: string;
  isActive: boolean;
  color: string;
}

export function MachineStation({ position, label, isActive, color }: MachineStationProps) {
  // Implementation
}
```

### React Components

**Server vs. Client:**
- Server by default; only use `"use client"` for:
  - R3F components (Canvas, useFrame, useRef)
  - Components using React hooks (useState, useEffect)
  - Components reading Zustand store (usePatternStore)
  - Framer Motion (useMotion, useAnimation)

```typescript
// ✓ Server Component (no "use client")
export function CodeBlock({ steps }: CodeBlockProps) {
  const highlighted = steps.map(step => highlightCode(step.code, 'typescript'));
  return <div>{/* static render */}</div>;
}

// ✓ Client Component (needs "use client")
"use client";
export function StepControls({ totalSteps }: StepControlsProps) {
  const { currentStep, nextStep } = usePatternStore();
  return <button onClick={nextStep}>Next</button>;
}
```

**Component Structure:**
```typescript
// Imports
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

// Type definitions
interface ComponentProps {
  children?: ReactNode;
  className?: string;
}

// Component
export function Component({ children, className }: ComponentProps) {
  return <div className={cn("base-styles", className)}>{children}</div>;
}
```

### 3D Components (R3F)

**Pattern:**
```typescript
"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function MyPrimitive({ position, color }: MyPrimitiveProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    // Animation logic
  });

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}
```

**Ref Safety:**
- Always check ref existence: `if (!meshRef.current) return;`
- Use proper Three.js types: `THREE.Mesh`, `THREE.Group`, `THREE.Material`
- Prefer `useRef` over external state for mutable objects

**Material Properties:**
```typescript
<meshStandardMaterial
  color={color}          // Base color
  emissive={color}       // Self-illumination
  emissiveIntensity={0.5}
  metalness={0.6}        // 0 = non-metal, 1 = mirror
  roughness={0.3}        // 0 = smooth, 1 = rough
  transparent={true}
  opacity={0.8}
/>
```

---

## Component Patterns

### Server Components (Pattern Pages)

**Responsibility:** Fetch data, render static UI, compose child components

```typescript
// src/app/patterns/[slug]/page.tsx
export async function generateStaticParams() {
  return getAllPatterns().map((p) => ({ slug: p.slug }));
}

export default async function PatternPage({ params }: { params: { slug: string } }) {
  const pattern = getPatternBySlug(params.slug);
  if (!pattern) return notFound();

  return <PatternPageLayout pattern={pattern} />;
}
```

### Client Components (Interactive UI)

**Responsibility:** Read/write store, handle user input, manage local UI state

```typescript
"use client";

import { usePatternStore } from "@/store/pattern-store";

export function StepControls({ totalSteps }: StepControlsProps) {
  const { currentStep, nextStep, prevStep, isPlaying, togglePlay } = usePatternStore();

  return (
    <div>
      <button onClick={prevStep}>Prev</button>
      <span>{currentStep + 1} / {totalSteps}</span>
      <button onClick={nextStep}>Next</button>
      <button onClick={togglePlay}>{isPlaying ? "Pause" : "Play"}</button>
    </div>
  );
}
```

### 3D Scenes (R3F Components)

**Responsibility:** Render 3D geometry, read store for state, animate per frame

```typescript
"use client";

import { usePatternStore } from "@/store/pattern-store";

export function FactoryMethodScene() {
  const currentStep = usePatternStore((s) => s.currentStep);

  return (
    <>
      <ConveyorBelt />
      <MachineStation isActive={currentStep === 1} ... />
      <Product visible={currentStep === 2} ... />
    </>
  );
}
```

---

## State Management (Zustand)

**Store Location:** `src/store/pattern-store.ts`

**Pattern:**
```typescript
import { create } from "zustand";

interface PatternState {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  togglePlay: () => void;
  reset: (totalSteps: number) => void;
}

export const usePatternStore = create<PatternState>((set) => ({
  currentStep: 0,
  totalSteps: 0,
  isPlaying: false,

  setStep: (step) =>
    set((state) => ({
      currentStep: Math.max(0, Math.min(step, state.totalSteps - 1)),
    })),

  nextStep: () =>
    set((state) => ({
      currentStep: (state.currentStep + 1) % state.totalSteps,
    })),

  prevStep: () =>
    set((state) => ({
      currentStep:
        state.currentStep === 0 ? state.totalSteps - 1 : state.currentStep - 1,
    })),

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

  reset: (totalSteps) => set({ currentStep: 0, totalSteps, isPlaying: false }),
}));
```

**Usage:**
```typescript
const store = usePatternStore();                    // Full store
const currentStep = usePatternStore((s) => s.currentStep); // Selector
```

---

## Code Quality Standards

### TypeScript Configuration

**Strict Mode:** `tsconfig.json` requires:
```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true
  }
}
```

### ESLint

**Config:** `.eslintrc.json` enforces:
- No `console.log` in production (warn)
- Unused variables (error)
- Unescaped HTML entities (error)

### Linting Before Commit

```bash
npm run lint      # Run ESLint
npm run format    # Run Prettier
```

---

## Performance Best Practices

### Code Splitting

**Dynamic Imports for 3D:**
```typescript
// src/components/pattern/pattern-canvas.tsx
const PatternCanvas = dynamic(
  () => import("./pattern-canvas").then((m) => m.PatternCanvas),
  {
    ssr: false,  // Three.js requires browser APIs
    loading: () => <LoadingSpinner />,
  }
);
```

### Memoization

**Use `useCallback` in 3D loop handlers:**
```typescript
"use client";
import { useCallback, useRef } from "react";

export function MyComponent() {
  const meshRef = useRef<THREE.Mesh>(null);

  const handleFrame = useCallback(({ clock }) => {
    // Frame logic
  }, []);

  return <primitive object3D={meshRef.current} />;
}
```

### Animation Frame Efficiency

**Avoid allocations in `useFrame`:**
```typescript
// ✗ Bad: allocates new Vector3 every frame
useFrame(() => {
  meshRef.current.position.copy(new THREE.Vector3(0, 0, 0));
});

// ✓ Good: reuse vector
const pos = new THREE.Vector3();
useFrame(() => {
  pos.set(0, 0, 0);
  meshRef.current.position.copy(pos);
});
```

**Use delta time for frame-rate independence:**
```typescript
// ✗ Bad: assumes 60fps
rotation += 0.05;

// ✓ Good: scales with deltaTime
rotation += 0.05 * clock.getDelta() * 60;
```

---

## Error Handling

### Try-Catch Patterns

**Shiki Highlighter (async init):**
```typescript
// src/lib/shiki.ts
let highlighter: Highlighter | null = null;

async function getHighlighter(): Promise<Highlighter> {
  if (highlighter) return highlighter;

  try {
    highlighter = await createHighlighter({
      themes: ["one-dark-pro"],
      langs: ["typescript"],
    });
    return highlighter;
  } catch (error) {
    console.error("Shiki init failed:", error);
    throw new Error("Code highlighting unavailable");
  }
}
```

**Component Error Boundaries:**
```typescript
import { ReactNode } from "react";

export function ErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <div>
      {/* Error boundary logic */}
      {children}
    </div>
  );
}
```

---

## Testing Standards

### Unit Test Pattern

```typescript
// example.test.ts
import { describe, it, expect } from "vitest";
import { getPatternBySlug } from "@/content/index";

describe("Pattern Registry", () => {
  it("returns pattern by valid slug", () => {
    const pattern = getPatternBySlug("factory-method");
    expect(pattern).toBeDefined();
    expect(pattern?.name).toBe("Factory Method");
  });

  it("returns null for invalid slug", () => {
    const pattern = getPatternBySlug("unknown-pattern");
    expect(pattern).toBeNull();
  });
});
```

### Component Test Pattern

```typescript
// step-controls.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { StepControls } from "@/components/pattern/step-controls";

describe("StepControls", () => {
  it("displays current step", () => {
    render(<StepControls totalSteps={3} />);
    expect(screen.getByText(/1 \/ 3/)).toBeInTheDocument();
  });

  it("advances step on next click", () => {
    render(<StepControls totalSteps={3} />);
    fireEvent.click(screen.getByText("Next"));
    expect(screen.getByText(/2 \/ 3/)).toBeInTheDocument();
  });
});
```

---

## Git & Commit Standards

### Commit Messages

**Format:** Conventional Commits

```
feat: add Factory Method 3D scene
fix: correct camera lerp timing
docs: update codebase summary
refactor: extract shared lighting logic
test: add step controls integration test
chore: bump Three.js to 0.183
```

**Rules:**
- Lowercase type and subject
- No period at end
- Imperative mood ("add", not "added")
- Reference issue if applicable: `feat: add observer #42`

### Branch Naming

```
feat/factory-method-scene
fix/camera-lerp-timing
docs/phase-05-completion
```

---

## Documentation Standards

### Code Comments

**Only document "why", not "what":**

```typescript
// ✗ Bad: obvious from code
const currentStep = store.currentStep; // Get current step

// ✓ Good: explains design decision
// Clamp step to valid range [0, totalSteps) to prevent out-of-bounds access
setStep: (step) => set((state) => ({
  currentStep: Math.max(0, Math.min(step, state.totalSteps - 1)),
})),
```

### JSDoc for Public APIs

```typescript
/**
 * Maps pattern slug to its 3D scene component.
 * All entries MUST be "use client" components — never async server imports.
 *
 * @param slug - Pattern identifier (e.g., "factory-method")
 * @returns React node to render in canvas, or null if not found
 */
function getPatternScene(slug: string): React.ReactNode {
  // Implementation
}
```

### Type Documentation

```typescript
/**
 * Represents a single step in a pattern walkthrough.
 * Maps to code section + camera position + scene state.
 */
interface PatternStep {
  /** Human-readable description of this step */
  description: string;

  /** TypeScript code example for this step */
  code: string;

  /** Line numbers (1-indexed) to highlight in code block */
  highlightedLines: number[];
}
```

---

## Common Pitfalls to Avoid

### 1. Server vs. Client Confusion

```typescript
// ✗ Wrong: Server component trying to use Zustand
export function Pattern({ pattern }: Props) {
  const currentStep = usePatternStore((s) => s.currentStep); // ❌ Can't use hooks in Server Components
  return <div>{currentStep}</div>;
}

// ✓ Right: Split into Server + Client
// Server:
export function PatternPage() {
  return <PatternPageLayout pattern={pattern} />;
}

// Client:
"use client";
export function PatternClient() {
  const currentStep = usePatternStore((s) => s.currentStep); // ✓ OK in Client Component
  return <div>{currentStep}</div>;
}
```

### 2. Three.js in Server Components

```typescript
// ✗ Wrong: Three.js code in Server Component
import * as THREE from "three";

export function Scene() {
  const geometry = new THREE.BoxGeometry(1, 1, 1); // ❌ Requires browser APIs
  return <mesh geometry={geometry} />;
}

// ✓ Right: Wrap in Client Component
"use client";
import * as THREE from "three";

export function Scene() {
  const geometry = new THREE.BoxGeometry(1, 1, 1); // ✓ OK in Client Component
  return <mesh geometry={geometry} />;
}
```

### 3. Ref Null Checks

```typescript
// ✗ Wrong: No null check
export function Component() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => {
    ref.current.position.x += 0.1; // ❌ Potential null reference
  });
}

// ✓ Right: Check before use
export function Component() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (!ref.current) return;
    ref.current.position.x += 0.1; // ✓ Safe
  });
}
```

### 4. Zustand Selector Stability

```typescript
// ✗ Wrong: Selector creates new function every render
export function Component() {
  const state = usePatternStore(s => ({ step: s.currentStep, next: s.nextStep }));
}

// ✓ Right: Use individual selectors or memoize
export function Component() {
  const currentStep = usePatternStore(s => s.currentStep);
  const nextStep = usePatternStore(s => s.nextStep);
}
```

---

## Key Files Quick Reference

| File | Purpose | Responsibility |
|------|---------|---|
| `src/content/types.ts` | Type definitions | Defines Pattern, PatternStep interfaces |
| `src/content/index.ts` | Pattern registry | `getPatternBySlug()`, `getAllPatterns()` |
| `src/store/pattern-store.ts` | State management | Zustand store for step navigation |
| `src/lib/shiki.ts` | Code highlighting | Singleton Shiki instance |
| `src/components/pattern/pattern-page-layout.tsx` | Page composition + scene registry | `getPatternScene()` extension point |
| `src/scenes/shared/camera-rig.tsx` | Camera control | Lerps camera per step |
| `src/scenes/factory-method/factory-method-scene.tsx` | Factory scene orchestrator | Reads store, renders 3D scene |

---

## Summary

- **File naming:** kebab-case for files, PascalCase for components
- **Components:** Server by default, "use client" only when needed
- **3D code:** Always check refs, avoid allocations in `useFrame`
- **State:** Use Zustand selectors, not full store
- **Performance:** Dynamic imports for 3D, lazy-init Shiki
- **Errors:** Try-catch for async, error boundaries for components
- **Testing:** Unit tests for utils, integration tests for components
- **Git:** Conventional commits, feature branches
