# Phase 08: Strategy -- 3D Scene + Page

## Context Links
- [Plan Overview](plan.md)
- Depends on: [Phase 07](phase-07-singleton.md)
- Content: `src/content/strategy.content.ts` (Phase 03)

## Overview
- **Priority:** P1
- **Status:** pending
- **Effort:** 4h
- **Description:** Context object with a "slot" that accepts interchangeable algorithm blocks. User sees blocks plug in/out.

## Key Insights
- Interactive element: user can click to trigger strategy swap (not just auto-play)
- Visual metaphor: context = frame/housing, strategy = colored block that slides in/out
- 3 strategy blocks (different colors/shapes) demonstrate interchangeability
- Swap animation is the hero moment

## Requirements

### Functional
- 3D scene: context object (frame/housing) with an open slot; 3 strategy blocks nearby
- Step 1: default strategy (Block A) is plugged into context slot
- Step 2: Block A ejects, Block B slides in (swap animation)
- Step 3: context behavior changes (visual indicator: output particles change color/pattern)
- Interactive: clicking a strategy block triggers swap animation
- Route: `/patterns/strategy`

### Non-Functional
- Blocks should be visually distinct: different colors, subtle shape variations
- Slot should have a visible "receptacle" effect (inset glow)
- Swap animation: ~1s slide-out + slide-in with easing

## Architecture

### Scene Components
```
StrategyScene
├── ContextFrame (box with slot cutout, housing for strategy)
├── StrategyBlock x3 (colored blocks, active/staged positions)
├── OutputIndicator (particles/effect showing current strategy behavior)
├── SwapAnimation (transition controller)
└── StepController
```

## Related Code Files
- **Create:** `src/scenes/strategy/strategy-scene.tsx`, `src/scenes/strategy/context-frame.tsx`, `src/scenes/strategy/strategy-block.tsx`, `src/scenes/strategy/output-indicator.tsx`
- **Modify:** `src/app/patterns/[slug]/page.tsx`

## Implementation Steps

1. Create `context-frame.tsx`: box geometry with a rectangular slot (CSG or just visual arrangement), inset glow
2. Create `strategy-block.tsx`:
   - Props: `color`, `label`, `position`, `isActive`, `isInSlot`
   - When `isInSlot`: positioned inside context frame slot
   - When staged: positioned to the side, slightly transparent
   - Click handler: triggers store action to swap
3. Create `output-indicator.tsx`: small particle burst or shape that changes color based on active strategy
4. Create `strategy-scene.tsx`:
   - Context frame center, 3 strategy blocks (one in slot, two staged)
   - Step 0: Block A in slot, B and C staged
   - Step 1: show context using Strategy A (output indicator = blue)
   - Step 2: swap animation (A slides out, B slides in)
   - Step 3: output indicator changes to green (Strategy B behavior)
   - Click interaction: clicking staged block triggers swap to that block
5. Wire up route and sync with content
6. Test: manual click swap + auto-play step progression

## Todo List
- [ ] Create ContextFrame component
- [ ] Create StrategyBlock component (with click interaction)
- [ ] Create OutputIndicator component
- [ ] Create StrategyScene orchestrator
- [ ] Wire up route
- [ ] Test click interaction + auto-play

## Success Criteria
- Strategy blocks visually swap in/out of context slot
- Click interaction works (user can trigger swap)
- Output changes visually with active strategy
- Step sync with code highlights

## Risk Assessment
- **Click raycasting:** R3F handles `onClick` on meshes natively; test pointer events
- **CSG complexity:** Avoid boolean geometry for slot; use visual arrangement (two walls + base) instead

## Next Steps
- Phase 09: Decorator
