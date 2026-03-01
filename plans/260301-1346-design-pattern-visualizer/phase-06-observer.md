# Phase 06: Observer -- 3D Scene + Page

## Context Links
- [Plan Overview](plan.md)
- Depends on: [Phase 05](phase-05-factory-method.md) (validates framework)
- Content: `src/content/observer.content.ts` (Phase 03)

## Overview
- **Priority:** P1
- **Status:** pending
- **Effort:** 5h
- **Description:** Central event hub with subscriber nodes connected by edges; events travel as animated particle streams. Pub-sub visualization.

## Key Insights
- Particle system is the hero effect here; use `ParticleStream` shared primitive
- Hub-and-spoke layout: central node (publisher) surrounded by 3-4 subscriber nodes
- Events fan out simultaneously to all subscribers (visual impact)
- Color-coded events: different event types = different particle colors

## Requirements

### Functional
- 3D scene: central publisher orb, 3-4 subscriber nodes arranged radially
- Connecting edges (lines/tubes) between hub and subscribers
- Step 1: event source emits (hub pulses, particles spawn)
- Step 2: particles travel along edges to all subscribers simultaneously
- Step 3: subscriber nodes react (glow, scale pulse, label changes)
- Optional: show subscribe/unsubscribe by fading a node in/out
- Route: `/patterns/observer`

### Non-Functional
- Particle count per stream: 10-20 (perf-safe)
- Edge lines should glow subtly
- Hub pulse on emit: scale 1.0 -> 1.2 -> 1.0

## Architecture

### Scene Components
```
ObserverScene
├── EventHub (GlowingSphere, center, pulsing on emit)
├── SubscriberNode x4 (GlowingSphere, radial positions)
├── ConnectionEdge x4 (line geometry, hub -> subscriber)
├── ParticleStream x4 (animated particles along edges)
└── StepController (reads store, triggers animations)
```

## Related Code Files
- **Create:** `src/scenes/observer/observer-scene.tsx`, `src/scenes/observer/event-hub.tsx`, `src/scenes/observer/subscriber-node.tsx`, `src/scenes/observer/connection-edge.tsx`
- **Modify:** `src/app/patterns/[slug]/page.tsx` (add observer scene mapping)

## Implementation Steps

1. Create `event-hub.tsx`: centered GlowingSphere, pulse animation on step trigger
2. Create `subscriber-node.tsx`: GlowingSphere + FloatingLabel, react animation (scale bounce + color flash)
3. Create `connection-edge.tsx`: line geometry from hub to subscriber position, subtle glow material
4. Create `observer-scene.tsx`:
   - Arrange hub at origin, 4 subscribers at equal angles on XZ plane (radius ~3)
   - Step 0: all nodes idle, edges visible
   - Step 1: hub pulses, particles spawn at hub
   - Step 2: ParticleStreams travel along edges to subscribers
   - Step 3: subscriber nodes react (glow + bounce)
5. Wire up in `[slug]/page.tsx` with dynamic import
6. Sync steps with observer.content.ts code highlights
7. Test: full page flow, auto-play, manual step navigation

## Todo List
- [ ] Create EventHub component
- [ ] Create SubscriberNode component
- [ ] Create ConnectionEdge component
- [ ] Create ObserverScene orchestrator
- [ ] Wire up in page route
- [ ] Sync with content steps
- [ ] Test full flow

## Success Criteria
- Hub emits particles that travel to all 4 subscribers
- Subscribers visually react when particles arrive
- Step sync works with code highlights
- Smooth auto-play loop

## Risk Assessment
- **Particle performance:** Limit to 20 particles per stream; use `<Points>` buffer geometry
- **Timing coordination:** Particles must arrive at subscribers before step 3 triggers; use step-aware animation clock

## Next Steps
- Phase 07: Singleton
