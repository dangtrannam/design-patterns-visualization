# Phase 04: 3D Scene Framework

## Context Links
- [Plan Overview](plan.md)
- Depends on: [Phase 02](phase-02-design-system.md), [Phase 03](phase-03-content-model.md)
- [Tech Stack Research](../reports/researcher-260301-1335-visualization-tech-stack.md)

## Overview
- **Priority:** P1
- **Status:** completed
- **Effort:** 5h
- **Completed:** 2026-03-01
- **Description:** Build reusable R3F infrastructure: canvas wrapper, Zustand step store, code block component, step controls, WebGL fallback, and shared 3D primitives.

## Key Insights
- R3F Canvas must be dynamic-imported with `ssr: false` (Three.js needs browser APIs)
- Zustand store syncs: scene step <-> code highlight <-> step controls
- Shiki must be called server-side; `CodeBlock` is a React Server Component
- `useDetectGPU` from drei provides GPU tier for fallback decisions
- Bloom post-processing adds glow but has perf cost; use sparingly

## Requirements

### Functional
- `PatternCanvas` wrapper: R3F Canvas with camera, lights, fog, optional bloom
- `usePatternStore` (Zustand): currentStep, totalSteps, setStep, next, prev, isPlaying, toggle
- `StepControls` UI: prev/next buttons, auto-play toggle, step counter, progress bar
- `CodeBlock` server component: renders ALL steps' code blocks at build time; client controls visibility via `data-step` attribute and CSS — no client-side Shiki <!-- Updated: Validation Session 1 -->
- WebGL fallback: detect GPU tier, show message on unsupported devices
- Reusable 3D primitives: `GlowingSphere`, `AnimatedArrow`, `FloatingLabel`, `ParticleStream`

### Non-Functional
- Canvas responsive to container width
- Auto-play interval: 3 seconds per step (configurable); default `isPlaying: false` <!-- Updated: Validation Session 1 -->
- Camera scripted per step: lerps to `step.cameraPosition` / `step.cameraTarget` on step change (no free orbit) <!-- Updated: Validation Session 1 -->
- Performance: target 60fps on mid-range desktop GPU

## Architecture

### Component Tree (Pattern Page)
```
PatternPage (Server Component)
├── PageShell
├── ProblemSection (static text)
├── PatternCanvas (dynamic import, ssr: false)
│   └── R3F Canvas
│       ├── CameraRig
│       ├── Lighting (ambient + directional + point)
│       ├── Fog
│       ├── [SceneComponent] (per-pattern, receives step from store)
│       └── EffectComposer (bloom)
├── StepControls (client component, reads/writes store)
├── CodeBlock (server component, Shiki)
├── RealWorldSection (static)
└── AntiPatternsSection (static)
```

### Zustand Store (`src/store/pattern-store.ts`)
```typescript
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
```

### Shiki Setup (`src/lib/shiki.ts`)
- Create singleton highlighter (lazy init)
- Export `highlightCode(code: string, lang: string, highlightLines?: number[]): string`
- Returns HTML string for dangerouslySetInnerHTML in CodeBlock

## Related Code Files
- **Create:**
  - `src/components/pattern/pattern-canvas.tsx` (client, dynamic wrapper)
  - `src/components/pattern/step-controls.tsx` (client)
  - `src/components/pattern/code-block.tsx` (server)
  - `src/components/pattern/webgl-fallback.tsx` (client)
  - `src/components/pattern/pattern-page-layout.tsx` (server, composes sections)
  - `src/store/pattern-store.ts`
  - `src/lib/shiki.ts`
  - `src/scenes/shared/glowing-sphere.tsx`
  - `src/scenes/shared/animated-arrow.tsx`
  - `src/scenes/shared/floating-label.tsx`
  - `src/scenes/shared/particle-stream.tsx`
  - `src/scenes/shared/camera-rig.tsx`
  - `src/scenes/shared/scene-lighting.tsx`
- **Modify:** `src/app/patterns/[slug]/page.tsx` (wire up layout)

## Implementation Steps

1. Create `src/store/pattern-store.ts`:
   - Zustand store with `currentStep`, `totalSteps`, `isPlaying`, actions
   - Auto-play: `useEffect` in consumer with `setInterval` when `isPlaying`
2. Create `src/lib/shiki.ts`:
   - Lazy-init Shiki highlighter with `one-dark-pro` theme
   - `highlightCode()` function returning HTML string
   - Handle line decoration for highlighted lines
3. Create `src/components/pattern/code-block.tsx`: <!-- Updated: Validation Session 1 - pre-render all steps SSR -->
   - Server component
   - Props: `steps: PatternStep[]` (receives ALL steps, not one)
   - For each step: call `highlightCode(step.code, 'typescript', step.highlightedLines)`
   - Render all blocks stacked; add `data-step={i}` attribute to each wrapper
   - Default: only step 0 visible (`display: block`), others hidden (`display: none`)
   - Client `StepControls` component adds/removes CSS via `data-step` attribute matching Zustand `currentStep`
   - Styled container with rounded corners, copy button per block
4. Create `src/components/pattern/pattern-canvas.tsx`:
   - Client component, exported via `next/dynamic` with `ssr: false`
   - R3F `<Canvas>` with: camera position, dpr settings, gl config
   - Props: `children` (scene component), `className`
   - Includes `<Suspense>` boundary with loading spinner
5. Create `src/scenes/shared/scene-lighting.tsx`:
   - Ambient light (low intensity), directional light, optional point lights
   - Fog setup
6. Create `src/scenes/shared/camera-rig.tsx`: <!-- Updated: Validation Session 1 - scripted camera, no free orbit -->
   - Props: `position: [number, number, number]`, `target: [number, number, number]`
   - `useFrame` lerps camera position and lookAt toward target each frame (lerp factor 0.05)
   - No OrbitControls (user does not freely rotate)
   - Export `CameraRig` as R3F component placed inside Canvas
7. Create `src/scenes/shared/glowing-sphere.tsx`:
   - `<mesh>` with `<sphereGeometry>` + emissive `<meshStandardMaterial>`
   - Props: position, color, radius, pulseSpeed
   - Animate emissive intensity with `useFrame`
8. Create `src/scenes/shared/animated-arrow.tsx`:
   - Line or tube geometry from point A to B
   - Animated dash offset for "traveling" effect
9. Create `src/scenes/shared/floating-label.tsx`:
   - drei `<Text>` with billboard behavior (always faces camera)
   - Props: text, position, fontSize, color
10. Create `src/scenes/shared/particle-stream.tsx`:
    - `<Points>` with animated positions along a path
    - Props: startPos, endPos, count, color, speed
11. Create `src/components/pattern/step-controls.tsx`:
    - Client component reading `usePatternStore`
    - Prev/Next buttons (shadcn Button), Play/Pause toggle
    - Step indicator: "Step 2 / 4"
    - Progress bar (animated width via Framer Motion)
12. Create `src/components/pattern/webgl-fallback.tsx`:
    - Uses `useDetectGPU` from drei
    - If tier === 0 or mobile with no WebGL2: render message card instead of Canvas
13. Create `src/components/pattern/pattern-page-layout.tsx`:
    - Server component composing: PageShell, problem text, canvas area, step controls, code block, real-world section, anti-patterns
    - Props: `pattern: Pattern`
    - Maps `pattern.steps[currentStep]` to CodeBlock
14. Wire up `src/app/patterns/[slug]/page.tsx`:
    - `generateStaticParams()` returns all 5 slugs
    - Looks up pattern from registry
    - Renders `PatternPageLayout` with pattern data
    - Dynamic imports PatternCanvas (placeholder scene for now)
15. Test: navigate to `/patterns/factory-method`, verify canvas loads with default lighting, step controls work, code block renders

## Todo List
- [x] Create Zustand pattern store
- [x] Create Shiki helper + CodeBlock server component
- [x] Create PatternCanvas wrapper (dynamic, ssr: false)
- [x] Create shared lighting + camera rig
- [x] Create reusable 3D primitives (sphere, arrow, label, particles)
- [x] Create StepControls UI
- [x] Create WebGL fallback
- [x] Create PatternPageLayout compositor
- [x] Wire up [slug] route with generateStaticParams
- [x] Test end-to-end with placeholder scene (build passes, all 5 pattern pages SSG)

## Success Criteria
- `/patterns/factory-method` loads with R3F canvas (placeholder cube)
- Step controls advance step, store updates, CodeBlock re-highlights
- Shiki renders syntax-highlighted TypeScript on server
- WebGL fallback triggers on simulated low-end device
- No Three.js in landing page bundle (verified via network tab)

## Risk Assessment
- **Shiki WASM cold start:** Lazy init + caching mitigates; test in prod build
- **R3F + postprocessing bundle size:** Monitor with bundle analyzer; bloom is optional
- **OrbitControls touch conflicts:** May need to disable on mobile; defer to pattern phases
- **Zustand hydration mismatch:** Store is client-only; no SSR serialization needed

## Next Steps
- Phase 05: Build Factory Method scene using these shared components
