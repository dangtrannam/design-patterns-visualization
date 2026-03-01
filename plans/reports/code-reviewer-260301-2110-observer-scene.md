# Code Review: Observer 3D Scene

**Date:** 2026-03-01
**Reviewer:** code-reviewer
**Report:** `plans/reports/code-reviewer-260301-2110-observer-scene.md`

---

## Scope

| File | LOC | Notes |
|------|-----|-------|
| `src/scenes/observer/event-hub.tsx` | 46 | EventHub component |
| `src/scenes/observer/subscriber-node.tsx` | 56 | SubscriberNode component |
| `src/scenes/observer/connection-edge.tsx` | 22 | ConnectionEdge component |
| `src/scenes/observer/observer-scene.tsx` | 66 | Root scene + SUBSCRIBERS map |
| `src/scenes/shared/particle-stream.tsx` | 83 | Shared — reviewed for correctness of usage |
| `src/components/pattern/pattern-page-layout.tsx` | lines 1-29 | Scene registry |

**Total reviewed:** ~300 LOC
**TypeScript:** `npx tsc --noEmit` — **0 errors**
**ESLint:** **0 warnings / errors**

---

## Overall Assessment

Solid, production-quality implementation. R3F best practices are followed consistently: no per-frame heap allocations, scratch vectors hoisted as refs, `useMemo` deps use spread elements correctly. Step-to-scene mapping is clear and correct. The one suppressed eslint-disable comment is justified and documented. Minor issues only.

---

## Critical Issues

None.

---

## High Priority

None.

---

## Medium Priority

### M1 — `ParticleStream.initPositions` memo has a stale-dep risk (informational)

**File:** `src/scenes/shared/particle-stream.tsx` lines 31-43

`initPositions` is computed once from `startPos`/`endPos` and used only to seed the `<bufferAttribute>` at mount time. The `useFrame` loop overwrites positions every frame from scratch, so `initPositions` staleness is **not a runtime bug here**. However if `startPos`/`endPos` were to change while mounted (e.g., animated hub in a future scene), the seed positions would be wrong until remount.

The `startPos`/`endPos` props are arrays and will produce a new reference each render if defined inline, but in `observer-scene.tsx` they are `HUB` (module-level constant) and `sub.position` (stable memo values from the module-level `SUBSCRIBERS` array), so identity is stable and this memo is safe in the current usage.

**Risk:** Low in current usage; could bite a future reuse with dynamic start/end positions.
**Recommendation:** Add a comment on `initPositions` that it is a seed-only value (frame loop owns actual positions), or use spread-element deps like ConnectionEdge does, to make the intent explicit.

---

### M2 — `SubscriberNode` idle scale reset runs every frame unnecessarily

**File:** `src/scenes/observer/subscriber-node.tsx` line 36

```ts
meshRef.current.scale.setScalar(1); // runs every frame when not reacting
```

Same pattern appears in `event-hub.tsx` line 26. When `isReacting`/`isEmitting` is `false` the scale is already 1; writing it again every frame is harmless but wastes a tiny amount of work. In a scene with many nodes this is not measurable, but the pattern is slightly inelegant.

**Recommendation (optional):** Track previous state in a ref and skip the write when already at the target, or accept as-is given the node count is fixed at 4.

---

## Low Priority

### L1 — `ConnectionEdge` suppressed eslint-disable is correct but could use a tighter comment

**File:** `src/scenes/observer/connection-edge.tsx` lines 17-18

```ts
// eslint-disable-next-line react-hooks/exhaustive-deps
[from[0], from[1], from[2], to[0], to[1], to[2]]
```

The intent is correct: using spread array elements avoids re-running `useMemo` when a parent re-renders and passes a new array reference with identical values (e.g., `HUB` is a module constant but TypeScript infers `[number, number, number]` so R3F parent could in theory reconstitute it). The suppress is justified.

**Recommendation:** Tighten the comment to clarify intent:
```ts
// Spread elements, not array refs — arrays are new each render but values are stable
// eslint-disable-next-line react-hooks/exhaustive-deps
[from[0], from[1], from[2], to[0], to[1], to[2]]
```

---

### L2 — Step mapping hardcodes indices without a named constant

**File:** `src/scenes/observer/observer-scene.tsx` lines 37-38

```ts
const isEmitting = currentStep === 1;
const isReacting = currentStep === 2;
```

Step indices are implicitly tied to the 3-step array in `observer.content.ts`. If the content author reorders steps, the visual breaks silently with no TypeScript error.

**Recommendation (optional):** A comment mapping step index to title is sufficient, or define:
```ts
const STEP_EMIT = 1;
const STEP_REACT = 2;
```
This is a documentation/maintenance concern, not a functional bug.

---

### L3 — `FloatingLabel` uses drei `Text` without a `font` prop

**File:** `src/scenes/shared/floating-label.tsx` line 20

drei `Text` defaults to a bundled Roboto font loaded at runtime via HTTP fetch. This is fine for development but may produce a flash of unstyled/missing text on first load in production (slow CDN, offline, strict CSP). No font is specified for the label rendering. This is an existing shared component issue, not introduced by this PR.

**Recommendation (not blocking):** Pre-load font or specify `font` prop pointing to a local public asset if FOUT becomes a visible problem.

---

### L4 — `Math.round(...* 100) / 100` rounding precision

**File:** `src/scenes/observer/observer-scene.tsx` lines 22-24

```ts
Math.round(Math.cos(s.angle) * RADIUS * 100) / 100
```

For the 4 standard angles (0, π/2, π, 3π/2) with RADIUS=3:
- cos(0)·3 = 3.00, cos(π/2)·3 ≈ 1.84e-16 → 0.00, cos(π)·3 = -3.00, cos(3π/2)·3 ≈ -1.84e-16 → 0.00

The rounding works correctly for these specific values. The comment in the code says it "avoids floating-point imprecision in positions" which is accurate — without rounding, cos(π/2) yields a near-zero non-zero value that could cause barely-off positioning in the Line vertex shader.

**Status:** Correct and intentional. No action needed.

---

## Edge Cases Scouted

| Edge Case | Risk | Status |
|-----------|------|--------|
| ParticleStream mounts/unmounts on step 1↔2 transition — does GPU buffer leak? | Low — R3F disposes geometry on unmount | Safe: R3F auto-disposes BufferGeometry |
| `currentStep > 2` (e.g., store reset race) — `isEmitting` and `isReacting` both false | Low — idle state, visually correct | Safe |
| `SUBSCRIBERS` mutated at runtime | None — module-level constant, not exported | Safe |
| `pattern-page-layout` used server-side with `ObserverScene` — would break if Scene is async | N/A — layout function is synchronous JSX | Safe |
| Multiple pattern pages mounted simultaneously sharing Zustand store | Medium — global store, step bleeds across routes | Existing architectural issue, not new |

---

## Positive Observations

- **Zero per-frame allocations** in all useFrame callbacks. Scratch vectors (`scratchStart`, `scratchEnd`, `scratchP`) are properly hoisted as refs in `ParticleStream`.
- **`useMemo` deps discipline** in `ConnectionEdge` correctly uses spread primitive elements to avoid reference-equality churn. The pattern is consistent.
- **`Math.round` precision guard** for trig values is a thoughtful defensive move for line vertex matching.
- **`ssr: false` + `dynamic` import** correctly keeps Three.js out of the server bundle.
- **`"use client"` boundaries** are correct on all scene components; the server-side `PatternPageLayout` compositor is not accidentally client-ified.
- **`ParticleStream` mount/unmount** is cleanly controlled by the JSX conditional (`{isEmitting && ...}`), letting React lifecycle handle teardown — simpler than an internal visibility toggle.
- **Staggered `pulseSpeed` values** (3.7, 4.2, 5.0, 6.1) are distinct enough to be visually meaningful and avoid synchrony, clearly communicating Observer independence.
- **TypeScript strict** — all props are fully typed, no `any` escapes.
- **ESLint clean** — 0 warnings including the justified suppress.
- **File sizes all under 70 LOC** — well within the 200-line target from development rules.

---

## Recommended Actions

1. **(Optional/Low)** Add a comment on `initPositions` in `particle-stream.tsx` clarifying it is a seed value only — the frame loop owns actual positions.
2. **(Optional/Low)** Tighten the `eslint-disable` comment in `connection-edge.tsx` to explain the array-vs-element dep choice.
3. **(Optional/Low)** Add `STEP_EMIT = 1 / STEP_REACT = 2` named constants in `observer-scene.tsx` to make step-index coupling explicit.
4. **(Informational)** Track the global Zustand store issue (step bleeds across pattern routes) as a future architectural task — not introduced here.

---

## Metrics

| Metric | Value |
|--------|-------|
| TypeScript errors | 0 |
| ESLint warnings | 0 |
| Files > 200 LOC | 0 |
| Per-frame allocations | 0 |
| Critical issues | 0 |
| High issues | 0 |
| Medium issues | 1 (informational) |
| Low issues | 3 (optional) |

---

## Unresolved Questions

- Global Zustand `currentStep` store is shared across all pattern pages. If a user navigates directly between patterns without the store resetting, step state bleeds. Is there a route-change reset handler, or is this deferred to a later phase?
