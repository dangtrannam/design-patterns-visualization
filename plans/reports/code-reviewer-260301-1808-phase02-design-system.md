# Code Review — Phase 02: Design System

**Date:** 2026-03-01
**Reviewer:** code-reviewer agent
**Score: 8.5 / 10**

---

## Scope

| File | LOC |
|---|---|
| `src/app/globals.css` | 61 |
| `src/app/layout.tsx` | 39 |
| `src/components/layout/navbar.tsx` | 49 |
| `src/components/layout/footer.tsx` | 33 |
| `src/components/layout/page-shell.tsx` | 37 |
| `src/components/pattern/pattern-card.tsx` | 52 |
| `src/components/ui/{button,badge,separator,card}.tsx` | shadcn-generated |

Build: clean. `tsc --noEmit`: clean.

---

## Overall Assessment

Solid, idiomatic Phase 02 delivery. The component structure is appropriately minimal for this stage, shadcn integration is correct, Tailwind CSS variables wire cleanly, and Framer Motion usage is restrained. No security issues. No broken imports detected. A few accessibility and structural issues need attention before Phase 03 components depend on this shell.

---

## Critical Issues

None.

---

## High Priority

### 1. `PageShell` renders a second `<main>` inside root layout's `<main>` (page.tsx)

`page.tsx` (home) already wraps content in `<main>`. `PageShell` also renders `<main className="container flex-1 py-10">`. When a pattern page uses `PageShell`, the document will contain nested `<main>` elements, which is invalid HTML (only one `<main>` per document per ARIA spec) and breaks landmark navigation for screen readers.

Fix: change `PageShell`'s inner element to `<div>` or `<section>`, keeping `<main>` only in the top-level route. Pattern pages that use `PageShell` should NOT also wrap content in `<main>`.

```tsx
// page-shell.tsx line 34 — change:
<main className="container flex-1 py-10">{children}</main>
// to:
<div className="container flex-1 py-10">{children}</div>
```

### 2. `Navbar` is `"use client"` unnecessarily — imports server-side data

`navbar.tsx` imports `patterns` from `@/content` (a plain JS array — no browser API) and has no interactivity. Marking it `"use client"` forces the entire nav subtree out of the RSC boundary, adding bundle weight for no reason. Remove the directive; it will render as a Server Component.

```tsx
// Remove line 1: "use client";
```

### 3. `categoryColors` uses bare Tailwind class strings that may be purged

```tsx
const categoryColors: Record<PatternCategory, string> = {
  creational: "border-accent/40 text-accent",
  structural: "border-secondary/40 text-secondary",
  behavioral: "border-primary/40 text-primary",
};
```

Tailwind's JIT scanner only detects classes in static string literals. Classes assembled at runtime from object values are safe only if the full class string appears verbatim somewhere in a scanned file. These strings are verbatim here, so they are currently detected correctly — **but if this map is ever refactored to construct class names dynamically** (e.g. `border-${color}/40`) they will break silently. Document this constraint with a comment or use `cn()` consolidation.

No change required now; annotate for future maintainers:
```tsx
// NOTE: full class strings must remain verbatim — Tailwind JIT requires static strings
```

---

## Medium Priority

### 4. Mobile nav missing — no hamburger / drawer

Nav links are `hidden md:flex`. On mobile only the logo and GitHub icon are visible; there is no way to navigate to individual patterns. Acceptable for Phase 02 placeholder, but should be tracked as a Phase 03/04 task before patterns are populated.

### 5. `footer.tsx` has a visual double-separator

The footer has `border-t border-border/50` on the `<footer>` element AND a `<Separator>` inside the container. On render this produces two horizontal dividers stacked closely — one from the CSS border, one from Radix. Remove one.

```tsx
// Option A: remove the border-t from <footer> and keep <Separator>
<footer className="mt-auto w-full">

// Option B: remove <Separator> and keep border-t (simpler — no extra component needed)
```

### 6. `new Date().getFullYear()` in footer runs on every server render

This is fine functionally and is standard practice. However in a statically exported build this date is baked at build time, not runtime — which is the correct behavior. No change needed; just note it is not a live clock.

### 7. `page-shell.tsx` missing `React` import for JSX type inference

`PageShellProps.children` is typed as `React.ReactNode` without importing React. With Next.js 14 + `@types/react@18` the global JSX namespace covers this, so `tsc --noEmit` passes. Safe, but brittle if tsconfig `jsx` settings change. Add:
```tsx
import type { ReactNode } from "react";
// then use ReactNode instead of React.ReactNode
```

---

## Low Priority

### 8. `globals.css` — duplicate `:root` and `.dark` blocks are identical

Both blocks contain the exact same 18 custom properties. The comment says "Force dark mode — light vars match dark for consistency." This is valid intent (single-theme app) but DRY violation. Can be simplified:

```css
/* Single block — app is always dark */
:root,
.dark {
  --background: 222 47% 6%;
  /* ... */
}
```

Saves 20 lines, zero behavioral change.

### 9. GitHub URL is hardcoded in two places

`navbar.tsx` line 38 and `footer.tsx` line 22 both hardcode the same GitHub URL. Extract to a shared constant (e.g. `src/lib/constants.ts`) to avoid drift.

### 10. `PatternCard` hover shadow uses raw HSL string, not a CSS variable

```tsx
hover:shadow-[0_0_20px_hsl(199_89%_48%_/_0.08)]
```

This bypasses the design token system. If the accent hue changes, this shadow won't update. Prefer:
```tsx
hover:shadow-[0_0_20px_hsl(var(--accent)/0.08)]
```

---

## Edge Cases

- `patterns` registry is currently empty (`[]`). The `{patterns.length > 0 && <nav>}` guard in Navbar handles this correctly — no empty `<nav>` rendered. Good defensive coding.
- `categoryColors` record is exhaustive over `PatternCategory` union — TypeScript will error if a new category is added without updating the map. Good.
- `line-clamp-3` on card description: descriptions with no natural break point will still clamp correctly since Tailwind's `line-clamp` uses `-webkit-line-clamp` with block display. Works cross-browser for target audience.

---

## Positive Observations

- CSS variable architecture is clean; single forced-dark approach avoids complexity of light/dark switching for this tool.
- `backdrop-blur-md` + `bg-background/80` on navbar is a tasteful glassmorphism effect appropriate for the neon theme.
- `aria-label` on `<nav>` and GitHub icon link — correct.
- `rel="noopener noreferrer"` on all external links — correct.
- `pointer-events-none` + `aria-hidden` on decorative radial glow — correct.
- `focus-visible:ring-2 focus-visible:ring-ring` on `PatternCard` link — keyboard focus is visible.
- shadcn components are unmodified originals — easy to upgrade later.
- Framer Motion usage is minimal and purposeful (no gratuitous animations).
- `container` class with `2rem` padding and `1400px` max-width: appropriate for a visualization-heavy app.

---

## Recommended Actions (Priority Order)

1. **[High]** Fix `<main>` nesting in `PageShell` — change inner `<main>` to `<div>`.
2. **[High]** Remove `"use client"` from `navbar.tsx`.
3. **[Medium]** Remove double separator in footer (drop either `border-t` or `<Separator>`).
4. **[Medium]** Track mobile nav as a Phase 03/04 backlog item.
5. **[Low]** Merge duplicate `:root` / `.dark` CSS blocks.
6. **[Low]** Extract GitHub URL to a shared constant.
7. **[Low]** Replace hardcoded HSL in `PatternCard` shadow with `hsl(var(--accent)/...)`.

---

## Metrics

| Metric | Status |
|---|---|
| TypeScript errors | 0 |
| Build errors | 0 |
| Accessibility blockers | 1 (nested `<main>`) |
| Security issues | 0 |
| Unnecessary `"use client"` | 1 (navbar) |
| DRY violations | 2 (CSS duplicate block, GitHub URL) |

---

## Unresolved Questions

- Will the site ever need a light mode? If not, the `:root` / `.dark` split is permanent dead weight and can be cleaned up now.
- Is a mobile navigation drawer in scope for Phase 03 or deferred further?
