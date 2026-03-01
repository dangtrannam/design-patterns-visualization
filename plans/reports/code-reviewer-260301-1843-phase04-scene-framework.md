# Code Review — Phase 04: Scene Framework

**Date:** 2026-03-01
**Files reviewed:** 11 (6 scene primitives + 5 pattern components + 1 page route)
**Build:** PASS (tsc --noEmit: clean, eslint: clean, next build: clean)
**Three.js server-bundle leak:** None confirmed (first-load JS = 87.3 kB, Three.js in async chunk only)

---

## Overall Assessment

Solid implementation. All architectural constraints are correctly respected:
`"use client"` on every R3F hook consumer, `dynamic({ ssr: false })` for the Canvas, `CodeBlock` is a true async Server Component, and Three.js is entirely absent from the server/shared bundles. No runtime errors expected on happy path. A few medium-priority issues remain.

---

## Critical Issues

None.

---

## High Priority

### H1 — `SceneLighting` missing `"use client"` (benign today, risk tomorrow)

`src/scenes/shared/scene-lighting.tsx` has no directive. Currently harmless because it only emits JSX with no hooks, and it is only ever rendered inside the Canvas (client tree). However, if someone imports it from a Server Component directly by mistake, it will fail silently or error because it outputs `<ambientLight>` etc., which are not valid HTML elements on the server.

**Fix:** Add `"use client"` as first line. Consistent with every other scene primitive.

---

### H2 — `WebGLFallback`: `useDetectGPU` initial tier is `undefined`, not `0`

`useDetectGPU` returns `{ tier: undefined, ... }` on the first render while the async detection runs. The guard `if (gpu.tier === 0)` will be `false` during that window, so the children (Canvas) mount immediately, then if the GPU is actually tier-0, the fallback is shown after the Canvas has already tried to initialize WebGL — a flash of 3D content followed by teardown.

Additionally, `useDetectGPU` uses Suspense internally in some drei versions; rendering it outside a `<Suspense>` boundary (as in the current layout) can throw a suspend in a non-suspended tree.

**Fix options:**
1. Guard for `undefined` tier: `if (gpu.tier === 0 || gpu.tier === undefined) return <Fallback />` — conservative, shows fallback while detecting.
2. Use drei's `<Detect>` / `<AdaptiveDpr>` pattern, or wrap `WebGLFallback` in `<Suspense>`.
3. Simplest safe guard: check `!gpu.tier` (falsy covers both `0` and `undefined`).

---

## Medium Priority

### M1 — `CameraRig`: allocates two `new THREE.Vector3` per frame

```ts
// current — every frame:
camera.position.lerp(new THREE.Vector3(...position), LERP);
currentTarget.current.lerp(new THREE.Vector3(...target), LERP);
```

Two object allocations every ~16 ms = ~120 allocations/sec. At scale (many patterns open) this increases GC pressure. The `position` and `target` props also spread into `new THREE.Vector3` even when unchanged.

**Fix:** Hoist a second `useRef` for a scratch `targetVec`:
```ts
const scratchPos = useRef(new THREE.Vector3());
const scratchTgt = useRef(new THREE.Vector3());

useFrame(() => {
  scratchPos.current.set(...position);
  scratchTgt.current.set(...target);
  camera.position.lerp(scratchPos.current, LERP);
  currentTarget.current.lerp(scratchTgt.current, LERP);
  camera.lookAt(currentTarget.current);
});
```

---

### M2 — `ParticleStream`: allocates two `new THREE.Vector3` per particle per frame

```ts
// inside useFrame loop:
const start = new THREE.Vector3(...startPos); // once per frame
const end   = new THREE.Vector3(...endPos);   // once per frame
const p     = start.clone().lerp(end, progress); // once per particle
```

With default `count=20`: 20 `.clone()` + 2 constructor allocs every frame = 22 allocations/~16 ms.

**Fix:** Hoist `start`, `end`, `p` scratch vectors to refs outside `useFrame`:
```ts
const startVec = useRef(new THREE.Vector3());
const endVec   = useRef(new THREE.Vector3());
const scratch  = useRef(new THREE.Vector3());

useFrame(({ clock }) => {
  startVec.current.set(...startPos);
  endVec.current.set(...endPos);
  // ...
  scratch.current.copy(startVec.current).lerp(endVec.current, progress);
});
```

---

### M3 — `CodeBlock` section heading always shows `steps[0].title`

```tsx
// pattern-page-layout.tsx line 58
<h2>{pattern.steps[0]?.title ?? "Implementation"}</h2>
```

This heading is static — it never updates as the user steps through. Step 2, 3, etc. have different titles that are never shown. This is a UX mismatch, not a bug per se, but it may confuse users.

**Fix:** Either use a static label ("Implementation") always, or move the heading into a client component that reads `usePatternStore((s) => s.currentStep)`.

---

### M4 — `StepControls` DOM query is fragile / too broad

```ts
document.querySelectorAll<HTMLElement>("[data-step]")
```

This queries the entire document. If two pattern pages are somehow mounted (SSG pre-rendering, React hydration mismatch edge case) or another component elsewhere uses `data-step`, all matching elements get toggled. A scoped ref would be safer.

**Fix:** Pass a `containerRef` down to both `CodeBlock` (via a wrapper `div` with `ref`) and `StepControls`, and scope the query: `containerRef.current?.querySelectorAll("[data-step]")`.

---

### M5 — `PatternPage` (`page.tsx`) missing `generateMetadata`

The route has `generateStaticParams` but no `generateMetadata`. Every pattern page falls back to the root layout metadata, so tab titles all read the same and OG cards won't have pattern-specific names. `metadataBase` warning already shows in the build log.

**Fix:**
```ts
export async function generateMetadata({ params }: PatternPageProps) {
  const pattern = getPattern(params.slug);
  if (!pattern) return {};
  return { title: pattern.name, description: pattern.tagline };
}
```

---

## Low Priority

### L1 — `FloatingLabel`: `"use client"` directive may not be needed

`FloatingLabel` uses no hooks (`useFrame`, `useState`, etc.) — it just renders drei's `<Text>`. The `"use client"` is technically correct (it renders inside Canvas), but adding it to every static scene primitive adds noise. Since it is always in the Canvas client tree, either approach works. Not a bug.

### L2 — `AnimatedArrow`: `useMemo` dependency arrays use array identity

```ts
}, [from, to]);  // from/to are [number,number,number] inline literals
```

If the parent re-renders with new inline tuple literals (`from={[0,0,0]}`), the memo will invalidate every render due to referential inequality. For a scene component that re-renders on every Zustand step change this triggers unnecessary recomputation. Stable tuple refs in the parent (or `useMemo` in the parent) would avoid this.

### L3 — `realWorldExample.code` in layout not Shiki-highlighted

The "Real-World Example" block (line 69–73 of `pattern-page-layout.tsx`) uses a raw `<pre><code>` without Shiki, while the step code blocks are highlighted. Visual inconsistency in the same page. Could pass through `highlight()` in the server component.

### L4 — `WebGLFallback` height hardcoded at `h-[500px]`

The canvas below it also uses `h-[500px]` (via className prop). These need to stay in sync. If the canvas height ever changes, the fallback card won't match. A shared constant or CSS variable would prevent drift.

---

## Positive Observations

- `"use client"` discipline is solid across all R3F hook consumers.
- `dynamic({ ssr: false })` correctly applied — Three.js confirmed absent from first-load shared bundle.
- `CodeBlock` is a proper `async` Server Component; Shiki runs at build time. Elegant approach.
- `CameraRig` lerp-without-OrbitControls is the right pattern for scripted animation.
- `ParticleStream` buffer mutation (`needsUpdate = true`) follows correct R3F practice.
- `useMemo` in `AnimatedArrow` for geometry/quaternion is correct — expensive math not in `useFrame`.
- Zustand store initialized via `setTotalSteps` + `reset` in `useEffect` is clean and correct.
- Build output: 87.3 kB first-load JS — no Three.js bloat in the critical path.
- ESLint and TypeScript both pass without errors or warnings.

---

## Recommended Actions (Prioritized)

1. **[H1]** Add `"use client"` to `scene-lighting.tsx`.
2. **[H2]** Fix `WebGLFallback` to guard against `undefined` tier — use `if (!gpu.tier)` or `if (gpu.tier === 0 || gpu.tier === undefined)`.
3. **[M1]** Hoist scratch `Vector3` refs in `CameraRig` to eliminate per-frame allocations.
4. **[M2]** Hoist scratch `Vector3` refs in `ParticleStream` loop.
5. **[M3]** Either use a static "Implementation" heading or make it reactive.
6. **[M4]** Scope `[data-step]` DOM query to a container ref to avoid document-wide leaks.
7. **[M5]** Add `generateMetadata` to `page.tsx` for SEO and OG cards.

---

## Metrics

| Metric | Value |
|---|---|
| TypeScript errors | 0 |
| ESLint errors/warnings | 0 |
| Build | PASS |
| Three.js in server bundle | No |
| Three.js in first-load shared JS | No |
| Files with `"use client"` missing (R3F hooks) | 1 (`scene-lighting.tsx` — no hooks, low risk) |

---

## Unresolved Questions

- Is `WebGLFallback` intentionally placed outside the `<Suspense>` boundary? If `useDetectGPU` is a suspending hook in newer drei versions, this could throw in production on slow devices. Needs verification against the installed drei@9 implementation.
- `realWorldExample.code` — is the unformatted `<pre>` intentional (style guide) or an oversight?
