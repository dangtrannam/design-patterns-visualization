# Phase 09: Decorator -- 3D Scene + Page

## Context Links
- [Plan Overview](plan.md)
- Depends on: [Phase 08](phase-08-strategy.md)
- Content: `src/content/decorator.content.ts` (Phase 03)

## Overview
- **Priority:** P1
- **Status:** pending
- **Effort:** 4h
- **Description:** Concentric glowing shells wrapping a core object. Each decorator layer adds a visible shell with a label. Most steps (4) of any pattern.

## Key Insights
- Concentric shells = nested wrapping, core metaphor of decorator pattern
- Each shell should be transparent enough to see inner layers
- 4 steps: bare core -> add decorator 1 -> add decorator 2 -> show combined behavior
- Visual payoff: seeing layers build up with distinct colors

## Requirements

### Functional
- 3D scene: small core sphere at center, space for 2-3 concentric shells
- Step 1: bare core component (small sphere, neutral color)
- Step 2: first decorator shell materializes around core (scale animation, semi-transparent, color A)
- Step 3: second decorator shell materializes around first (larger, color B)
- Step 4: combined behavior visualization (all layers pulse in sequence, inner to outer)
- Labels on each shell indicating decorator name
- Route: `/patterns/decorator`

### Non-Functional
- Shell transparency: ~0.3 opacity so inner layers visible
- Shell spacing: each shell ~0.5 units larger radius than previous
- Sequential pulse on step 4: core -> shell 1 -> shell 2 (wave effect)

## Architecture

### Scene Components
```
DecoratorScene
├── CoreObject (small GlowingSphere)
├── DecoratorShell x2 (transparent spheres, scale-in animation)
├── ShellLabel x2 (FloatingLabel per shell)
├── BehaviorPulse (sequential glow animation on step 4)
└── StepController
```

## Related Code Files
- **Create:** `src/scenes/decorator/decorator-scene.tsx`, `src/scenes/decorator/core-object.tsx`, `src/scenes/decorator/decorator-shell.tsx`
- **Modify:** `src/app/patterns/[slug]/page.tsx`

## Implementation Steps

1. Create `core-object.tsx`: small sphere (radius ~0.3), solid color, emissive
2. Create `decorator-shell.tsx`:
   - Props: `radius`, `color`, `opacity`, `visible`, `label`
   - Semi-transparent `meshStandardMaterial` (opacity, transparent: true)
   - Scale-in animation (0 -> 1) when `visible` becomes true
   - FloatingLabel positioned at top of shell
3. Create `decorator-scene.tsx`:
   - Core at origin
   - Shell 1: radius 0.8, color cyan
   - Shell 2: radius 1.3, color purple
   - Step 0: only core visible
   - Step 1: core highlighted (pulse)
   - Step 2: shell 1 materializes (scale 0 -> 1 over 0.8s)
   - Step 3: shell 2 materializes
   - Step 4: sequential pulse animation (core -> shell 1 -> shell 2, 0.3s delay each)
4. Wire up route and content
5. Test: step progression, visual layering, transparency rendering

## Todo List
- [ ] Create CoreObject component
- [ ] Create DecoratorShell component (with scale-in + transparency)
- [ ] Create DecoratorScene orchestrator
- [ ] Wire up route
- [ ] Test layering and transparency
- [ ] Test sequential pulse animation

## Success Criteria
- Concentric shells visibly wrap core object
- Each shell is semi-transparent (inner layers visible)
- Scale-in animations are smooth
- Step 4 sequential pulse creates satisfying wave effect
- All 4 steps sync with code highlights

## Risk Assessment
- **Transparency rendering order:** Three.js transparent objects need correct render order; set `depthWrite: false` on shells and render back-to-front
- **Performance with multiple transparent layers:** 3 transparent spheres + bloom may be heavy; test without bloom first

## Next Steps
- Phase 10: Landing page, SEO, and deployment (final phase)
