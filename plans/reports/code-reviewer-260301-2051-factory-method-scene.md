# Code Review — Factory Method 3D Scene

**Date:** 2026-03-01
**Reviewer:** code-reviewer
**Report:** `plans/reports/code-reviewer-260301-2051-factory-method-scene.md`

---

## Scope

| File | LOC | Role |
|------|-----|------|
| `src/scenes/factory-method/conveyor-belt.tsx` | 35 | Static belt + emissive pulse |
| `src/scenes/factory-method/machine-station.tsx` | 55 | Active/idle node with glow |
| `src/scenes/factory-method/product.tsx` | 47 | Scale-in animated product |
| `src/scenes/factory-method/request-arrow.tsx` | 16 | Thin wrapper over AnimatedArrow |
| `src/scenes/factory-method/factory-method-scene.tsx` | 36 | Scene orchestrator |
| `src/components/pattern/pattern-page-layout.tsx` | 95 | Server compositor (wiring focus) |

TypeScript: `tsc --noEmit` — **0 errors**
ESLint (`next lint`) — **0 warnings / 0 errors**

---

## Overall Assessment

Solid implementation. All six files are well below the 200-line limit, follow established conventions from the shared primitives (scratch vectors, `useRef`-gated `useFrame`, delta-based lerp), and the step→scene mapping is correct and complete. Two medium-priority issues exist around an opacity flicker and a `null` return in a server component, plus one low-priority note on the non-exhaustive scene dispatch. No critical or high-priority issues.

---

## Critical Issues

None.

---

## High Priority Issues

None.

---

## Medium Priority Issues

### M1 — MachineStation: initial `opacity` prop diverges from `useFrame` target on step change

**File:** `machine-station.tsx` lines 40–42 and 29–35

**Problem:** The JSX sets `opacity={isActive ? 1 : 0.35}` on the `<meshStandardMaterial>`, but `useFrame` owns the material's `opacity` after the first frame. When `isActive` toggles, React re-renders the component with a new prop value; however, R3F does a shallow prop-diff on the material — it will immediately set `opacity` back to the JSX value before `useFrame` runs. On slower devices the result is a one-frame opacity jump on every step transition because the material starts at the JSX value then gets corrected by `useFrame`.

The same issue applies to `emissiveIntensity={0.05}` — it is the correct idle default so it is less visible, but it is still conceptually inconsistent: `useFrame` is the single owner of animated properties.

**Fix:** Remove the `opacity` prop from JSX and let `useFrame` own it entirely. Initialize the ref's material state inside a `useLayoutEffect` (or just accept a one-frame settling — see note below).

```tsx
// In the return JSX — remove opacity from JSX:
<meshStandardMaterial
  color={color}
  emissive={color}
  emissiveIntensity={0.05}
  transparent
  metalness={0.6}
  roughness={0.3}
  // opacity intentionally omitted — owned by useFrame
/>
```

Or, simpler, force-set opacity on the first frame without a `useEffect`:

```tsx
useFrame(({ clock }) => {
  if (!groupRef.current || !meshRef.current) return;
  const mat = meshRef.current.material as THREE.MeshStandardMaterial;
  const pulse = isActive ? Math.sin(clock.getElapsedTime() * 3) : 0;
  groupRef.current.scale.setScalar(isActive ? 1 + 0.04 * pulse : 1);
  mat.emissiveIntensity = isActive ? 0.45 + 0.25 * pulse : 0.05;
  mat.opacity = isActive ? 1 : 0.35;  // always written, no JSX conflict
});
```

The second approach (always write in `useFrame`) is already almost what the code does — the bug is only the JSX prop being re-applied by R3F on re-render. Removing `opacity` from the JSX surface entirely and always driving it from `useFrame` is the right pattern.

**Impact:** Minor visual flicker on step change; more importantly it is an inconsistency with the project's own established convention (see `CameraRig`, `ParticleStream`) where animated properties are not duplicated as JSX props.

---

### M2 — `pattern-page-layout.tsx`: importing a `"use client"` component into a Server Component without isolating it

**File:** `pattern-page-layout.tsx` line 7

```ts
import { FactoryMethodScene } from "@/scenes/factory-method/factory-method-scene";
```

**Problem:** `FactoryMethodScene` is a `"use client"` module (it calls `usePatternStore`). Importing it statically into a Server Component is legal in Next.js 14 App Router — the client component is serialized as a reference and rendered on the client. However, the file also calls `getPatternScene` which constructs the JSX (`<FactoryMethodScene />`), meaning the **scene JSX is evaluated on the server** and passed as a `children` prop through `PatternCanvas` (which is `dynamic`/client). React Server Components allow passing client components as children, so this is architecturally correct.

The risk is that **any future scene that reads server-side data or calls `async` functions** will violate this pattern silently — the `getPatternScene` dispatch function looks synchronous and pattern-agnostic, but it is in a Server Component. A comment documenting this constraint is missing.

**Fix:** Add a comment on `getPatternScene`:

```tsx
/**
 * Maps pattern slug to its 3D scene element.
 * Scenes MUST be "use client" components — they are passed as RSC children
 * to the dynamically-imported PatternCanvas and rendered on the client.
 * Do NOT return async components or server-only imports here.
 */
function getPatternScene(slug: string): React.ReactNode {
  if (slug === "factory-method") return <FactoryMethodScene />;
  return undefined;
}
```

**Impact:** No runtime impact today; documentation gap that will cause confusion when adding the next pattern scene.

---

## Low Priority Issues

### L1 — `factory-method-scene.tsx`: `getPatternScene` return type `undefined` vs `null` — minor RSC pattern inconsistency

**File:** `pattern-page-layout.tsx` line 22 / `pattern-canvas.tsx` line 47

`getPatternScene` returns `undefined` for unknown slugs. `SceneCore` uses `children ?? <PlaceholderCube />` — the nullish-coalescing operator treats both `null` and `undefined` as the fallback trigger, so this is functionally fine. However, the React type for `ReactNode` includes `undefined`, and explicitly returning `null` is the conventional "render nothing" signal in React. Minor style inconsistency only.

**Suggestion:** `return null;` instead of `return undefined;` for clarity.

---

### L2 — `request-arrow.tsx`: early-return `null` inside a client component mounted/unmounted by parent

**File:** `request-arrow.tsx` lines 13–14

```tsx
if (!visible) return null;
return <AnimatedArrow ... />;
```

This unmounts and remounts `AnimatedArrow` (and its internal `useFrame`) on every step transition rather than hiding it. `AnimatedArrow` holds a `coneRef` and a `useMemo` — these are cheap to recreate. For this scene it is perfectly acceptable.

However, the sister primitives (`Product`, `MachineStation`) use an always-mounted approach with animated opacity/scale, which is the preferred pattern when the component has geometry that should animate in/out smoothly. `RequestArrow` disappears instantly rather than fading out.

**Suggestion (optional):** Pass `visible` through to `AnimatedArrow` and drive opacity from 0→1 in `useFrame`, consistent with how `Product` handles its scale. Only worth doing if a smooth fade-out is desired for the arrow.

---

### L3 — `factory-method-scene.tsx`: step→machine mapping is an implicit index assumption

**File:** `factory-method-scene.tsx` line 35

```ts
const activeMachine = currentStep === 1 ? 1 : -1;
```

`1` here is the array index into `MACHINES`. This is correct today (index 1 = WebApp). If `MACHINES` order changes, this silently breaks. A named lookup would be more defensive:

```ts
const ACTIVE_MACHINE_BY_STEP: Record<number, number> = { 1: 1 }; // step → machine index
const activeMachine = ACTIVE_MACHINE_BY_STEP[currentStep] ?? -1;
```

Or add an inline comment: `// index 1 = WebApp (MACHINES[1])`.

Minor — YAGNI applies, a comment is sufficient.

---

## Edge Cases Verified

| Scenario | Status |
|----------|--------|
| `currentStep` out of bounds (> 2 or < 0) | Safe — store clamps via `nextStep`/`prevStep` guards; scene conditions are boolean comparisons so they resolve to `false` gracefully |
| `totalSteps` not yet initialised (store default = 0) | `StepControls.useEffect` calls `setTotalSteps` + `reset` on mount, so `currentStep` is always 0 at first render — scene starts in step-0 state correctly |
| WebGL not available | `WebGLFallback` blocks `PatternCanvas` render entirely; scene components never mount |
| Auto-play wraps at last step | `nextStep` in store does nothing past `totalSteps - 1`; scene stays on step 2 with product visible and arrow hidden |
| `Product` scale lerp with large delta (tab backgrounded) | `Math.min(delta * 5, 1)` caps the lerp factor at 1, preventing overshoot — correctly handled |
| `MachineStation` ref null-guard | Both `groupRef` and `meshRef` guarded with `&&` before access in `useFrame` — correct |
| `ConveyorBelt` always running `useFrame` | Belt animates regardless of step — intentional (ambient animation), and it is one cheap `Math.sin` per frame |

---

## Positive Observations

- **Zero per-frame allocations** in `Product` and `ConveyorBelt` — both read `.scale.x` and set via `setScalar`, no `new THREE.Vector3()` inside `useFrame`. Consistent with project convention.
- **`delta`-based lerp** in `Product` is frame-rate independent and correctly clamped — this is the right pattern.
- **`RoundedBox` ref** in `MachineStation`: drei's `RoundedBox` is typed as `ForwardRefComponent<Props, Mesh>`, so `ref={meshRef}` with `useRef<THREE.Mesh>` is type-correct and verified by `tsc`.
- **`MACHINES` constant** is defined outside the component — no re-creation on render.
- **`useMemo` in `AnimatedArrow`** correctly hoists geometry/quaternion calculations out of the frame loop; `from`/`to` are stable tuples from `RequestArrow` (hardcoded literals), so the memo never re-runs after mount.
- **`RequestArrow` wrapper** is correctly thin — it does not duplicate `AnimatedArrow` logic (DRY satisfied).
- **Server/client boundary** in `pattern-page-layout.tsx` is architecturally sound: `FactoryMethodScene` is passed as RSC `children` prop through `dynamic`-imported `PatternCanvas`, which is the correct Next.js 14 pattern for mixing server and client components.
- **File sizes** all well under 200-line limit.
- **TypeScript strict** — no casts except the necessary `material as THREE.MeshStandardMaterial` which is unavoidable given R3F's generic material typing.

---

## Recommended Actions

1. **(M1 — medium)** Remove `opacity` from the `<meshStandardMaterial>` JSX in `MachineStation` and let `useFrame` own it exclusively to eliminate the one-frame flicker on step transition.
2. **(M2 — medium)** Add a doc comment to `getPatternScene` in `pattern-page-layout.tsx` stating the constraint that scene components must be client-only and must not perform server-side async work.
3. **(L3 — low)** Add an inline comment to the `activeMachine` derivation in `factory-method-scene.tsx` clarifying the index→label mapping.
4. **(L2 — optional)** Consider driving `RequestArrow` opacity from 0→1 via `useFrame` for a fade-in/out consistent with `Product`'s scale animation — only if smooth transition is a UX goal.

---

## Metrics

| Metric | Value |
|--------|-------|
| TypeScript errors | 0 |
| ESLint issues | 0 |
| Files over 200 lines | 0 |
| Critical issues | 0 |
| High issues | 0 |
| Medium issues | 2 |
| Low issues | 3 |

---

## Unresolved Questions

1. When the second pattern scene (e.g., Observer or Singleton) is added, does `getPatternScene` remain the dispatch point, or will it move to a pattern-specific page file? The current server-component import of a client scene scales to ~5 patterns fine, but a dynamic `import()` per slug may be cleaner at larger scale.
2. Should `ConveyorBelt` pulse animation pause when `isPlaying === false` (store idle)? Currently it runs unconditionally. Probably intentional ambient effect — worth confirming.
