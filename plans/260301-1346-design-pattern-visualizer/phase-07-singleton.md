# Phase 07: Singleton -- 3D Scene + Page

## Context Links
- [Plan Overview](plan.md)
- Depends on: [Phase 06](phase-06-observer.md)
- Content: `src/content/singleton.content.ts` (Phase 03)

## Overview
- **Priority:** P1
- **Status:** pending
- **Effort:** 4h
- **Description:** Single glowing orb center-stage with request arrows converging from multiple angles. Shows "one instance" concept visually.

## Key Insights
- Simplest scene conceptually but needs visual drama (bloom, glow, arrow convergence)
- Key moment: second request attempts to create new instance but gets redirected to existing orb
- Fewer steps (2) than other patterns; compensate with richer animation

## Requirements

### Functional
- 3D scene: one large glowing orb at center, 5-6 request arrows from different angles
- Step 1: first request arrow arrives, orb materializes (scale 0 -> 1, bloom flash)
- Step 2: additional arrows arrive; show "redirect" effect (arrows curve toward existing orb, no new orb created; failed-creation indicator like a ghosted orb that fades)
- Route: `/patterns/singleton`

### Non-Functional
- Orb should be the most visually striking element (strong bloom, slow rotation)
- Redirect arrows should visibly curve/bend toward existing orb
- Ghost orb on "failed creation": transparent, red-tinted, fade out

## Architecture

### Scene Components
```
SingletonScene
├── SingletonOrb (large GlowingSphere, bloom, slow rotation)
├── RequestArrow x6 (arrows from different directions)
├── GhostOrb (transparent, appears and fades on step 2)
└── StepController
```

## Related Code Files
- **Create:** `src/scenes/singleton/singleton-scene.tsx`, `src/scenes/singleton/singleton-orb.tsx`, `src/scenes/singleton/ghost-orb.tsx`
- **Modify:** `src/app/patterns/[slug]/page.tsx` (add singleton scene mapping)

## Implementation Steps

1. Create `singleton-orb.tsx`: large sphere with strong emissive, slow Y rotation, bloom-friendly material
2. Create `ghost-orb.tsx`: transparent sphere, red tint, fade-out animation (opacity 0.5 -> 0 over 1s)
3. Create `singleton-scene.tsx`:
   - SingletonOrb at origin
   - 6 RequestArrows from positions distributed on a sphere (different angles)
   - Step 0: empty scene, no orb
   - Step 1: first arrow animates in, orb materializes with bloom flash
   - Step 2: remaining arrows converge; ghost orb appears briefly then fades; arrows redirect to real orb
4. Wire up route and content sync
5. Test

## Todo List
- [ ] Create SingletonOrb component
- [ ] Create GhostOrb component
- [ ] Create SingletonScene orchestrator
- [ ] Wire up route
- [ ] Test full flow

## Success Criteria
- Orb appears dramatically on step 1 with bloom
- Step 2 shows arrows redirecting + ghost orb fading
- Clean 2-step flow syncs with code

## Risk Assessment
- **Bloom overdone:** Tune bloom intensity to enhance, not wash out; test on different monitors
- **Short step count:** 2 steps may feel abrupt; consider adding intro idle state

## Next Steps
- Phase 08: Strategy
