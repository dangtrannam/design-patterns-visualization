# Phase 05: Factory Method -- 3D Scene + Page

## Context Links
- [Plan Overview](plan.md)
- Depends on: [Phase 04](phase-04-scene-framework.md)
- Content: `src/content/factory-method.content.ts` (Phase 03)

## Overview
- **Priority:** P1
- **Status:** completed
- **Effort:** 5h
- **Completed:** 2026-03-01
- **Description:** First complete pattern page. Assembly line metaphor with 3 machine nodes creating different product objects. This is the template for all subsequent patterns.

## Key Insights
- First pattern is highest effort because it validates the entire framework
- Assembly line metaphor: conveyor belt (tube), machine stations (boxes), products (shapes materializing)
- 3 steps: client calls factory -> factory delegates -> concrete product appears
- User can rotate scene, pause animation; step sync with code walkthrough

## Requirements

### Functional
- 3D scene: conveyor belt with 3 machine stations, each producing a different product shape
- Step 1: client request arrives (animated arrow from left)
- Step 2: factory routes to correct machine (highlight one machine, dim others)
- Step 3: product materializes on conveyor output (animate scale from 0 to 1 with bloom)
- Code walkthrough synced: each step highlights relevant code section
- Full page: problem narrative -> 3D scene -> code walkthrough -> real-world -> anti-patterns
- Route: `/patterns/factory-method`

### Non-Functional
- Scene loop: 30-60s per full cycle if auto-playing
- Smooth transitions between steps (Framer Motion for UI, useFrame lerp for 3D)
- Products visually distinct: sphere, cube, torus (different colors)

## Architecture

### Scene Components
```
FactoryMethodScene
├── ConveyorBelt (tube geometry, animated texture scroll)
├── MachineStation x3 (box geometry, label, active/inactive state)
├── RequestArrow (animated arrow from left to factory)
├── Product (sphere/cube/torus, scale-in animation on step 3)
└── StepAnimationController (reads store, orchestrates transitions)
```

### Step-to-Scene Mapping
| Step | Scene State | Code Highlight |
|------|-------------|----------------|
| 1 | Arrow animates toward factory hub | `factory.createProduct(type)` |
| 2 | Hub routes to Machine B (Machine B glows, A+C dim) | `class ConcreteCreatorB extends Creator` |
| 3 | Product B materializes at output | `return new ConcreteProductB()` |

## Related Code Files
- **Create:** `src/scenes/factory-method/factory-method-scene.tsx`, `src/scenes/factory-method/conveyor-belt.tsx`, `src/scenes/factory-method/machine-station.tsx`, `src/scenes/factory-method/product.tsx`, `src/scenes/factory-method/request-arrow.tsx`
- **Modify:** `src/app/patterns/[slug]/page.tsx` (import FactoryMethodScene conditionally)

## Implementation Steps

1. Create `src/scenes/factory-method/conveyor-belt.tsx`:
   - Tube geometry along X-axis
   - Animated texture offset for "belt moving" effect using `useFrame`
   - Subtle metallic material
2. Create `src/scenes/factory-method/machine-station.tsx`:
   - Props: `position`, `label`, `isActive`, `color`
   - Box geometry with rounded edges (drei `RoundedBox`)
   - When `isActive`: emissive glow + scale pulse
   - When inactive: dim opacity
   - `FloatingLabel` above with machine name
3. Create `src/scenes/factory-method/product.tsx`:
   - Props: `type` ('sphere' | 'cube' | 'torus'), `visible`, `position`
   - Scale-in animation (0 -> 1) when visible becomes true
   - Emissive glow matching machine color
4. Create `src/scenes/factory-method/request-arrow.tsx`:
   - Animated arrow from screen-left to factory center
   - Uses `AnimatedArrow` shared primitive
   - Visible only on step 1
5. Create `src/scenes/factory-method/factory-method-scene.tsx`:
   - Main scene component; reads `currentStep` from `usePatternStore`
   - Renders: ConveyorBelt, 3 MachineStations, RequestArrow, Product
   - Step controller logic:
     - Step 0 (idle): all machines neutral, no product
     - Step 1: request arrow animates in
     - Step 2: one machine activates (based on product type cycle)
     - Step 3: product materializes
   - Camera focus shifts per step (subtle dolly)
6. Update `src/app/patterns/[slug]/page.tsx`:
   - Map `factory-method` slug to `FactoryMethodScene` via dynamic import
   - Pass scene as child to `PatternCanvas`
7. Wire up content: `factory-method.content.ts` steps -> StepControls + CodeBlock
8. Test full page flow:
   - Navigate to `/patterns/factory-method`
   - Verify 3D scene loads, steps advance, code highlights sync
   - Test auto-play mode
   - Test OrbitControls (rotate, zoom)
9. Performance check: verify R3F chunk loads only on this route

## Todo List
- [x] Create ConveyorBelt component
- [x] Create MachineStation component
- [x] Create Product component
- [x] Create RequestArrow component
- [x] Create FactoryMethodScene orchestrator
- [x] Wire up in [slug]/page.tsx
- [x] Sync steps with CodeBlock highlights
- [x] Test full page flow
- [x] Performance check (bundle splitting)

## Success Criteria
- Scene renders 3 machine stations on a conveyor belt
- Stepping through 3 steps shows: request -> routing -> product creation
- Code block highlights change per step
- Auto-play cycles through steps smoothly
- OrbitControls allow rotation/zoom
- No Three.js loaded on landing page (bundle split verified)

## Risk Assessment
- **Scene complexity creep:** Keep geometry simple (primitives only, no 3D models)
- **Animation timing:** Use `useFrame` delta for frame-rate-independent animation
- **First-pattern tax:** Extra time expected for framework validation; budget accordingly

## Next Steps
- Phase 06: Observer scene (reuses all shared infrastructure proven here)
