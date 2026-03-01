# Code Review — Phase 03: Content Model

**Date:** 2026-03-01
**Scope:** `src/content/` — types.ts, index.ts, 5 pattern content files
**Score: 8.5 / 10**
**tsc --noEmit:** PASS (zero errors)

---

## Overall Assessment

Solid, well-structured content layer. Type interfaces are clean, registry is correct, and the pedagogical progression across all five patterns is coherent. Several `highlightedLines` are off-by-one or pointing at the wrong semantic lines, and one code snippet contains a TypeScript access-modifier bug that would confuse learners. Everything else is production-ready.

---

## Critical Issues (must fix)

### 1. `observer.content.ts` — Private field accessed in step 2 code snippet

In step 1, `observers` is declared `private` on `EventEmitter`:
```ts
private observers: Observer<T>[] = [];
```
In step 2, `StockTicker` extends `EventEmitter` and calls:
```ts
this.observers.forEach(o => o.update(data));  // line 9
```
Accessing a `private` member from a subclass is a TypeScript compile error. The snippet as shown would not compile if placed in a real file — it teaches incorrect inheritance semantics to learners.

**Fix:** Change the field declaration in the step-1 snippet to `protected`:
```ts
protected observers: Observer<T>[] = [];
```
Or add a `protected notify()` method on `EventEmitter` and have `StockTicker` call `this.notify(data)` without touching `observers` directly.

---

## High Priority

### 2. `highlightedLines` mismatches

Several steps highlight structurally wrong lines. Counts are 1-indexed against the `code` string.

#### factory-method, step 2 — `highlightedLines: [2, 11, 12]`
Line 2 is the comment `// Factory method — subclasses override this`, not a meaningful highlight.
The intent (factory method override) is better served by lines `[3, 11, 12, 13]` (abstract declaration + WebApp override body).

#### observer, step 2 — `highlightedLines: [5, 6, 9, 10]`
```
L5:   this.notify(price);  // line 5 ✓ — correct
L6:   }                    // closing brace — not meaningful
L9:   this.observers...    // correct
L10:  }                    // closing brace — not meaningful
```
Lines 6 and 10 are closing braces. Replace with `[5, 8, 9]` to highlight `setPrice` body + `notify` body.

#### observer, step 3 — `highlightedLines: [14, 15, 16, 17]`
Code string has 17 lines total. Line 14 = `ticker.subscribe(new PriceLogger())`, line 17 = `ticker.setPrice(105)` — correct, but line 16 is a blank line. Replace with `[13, 14, 15, 17]` to skip the blank.

#### decorator, step 2 — `highlightedLines: [8, 9, 10, 11, 14]`
Line 14 = `notifier = new SMSDecorator(notifier);` — this is the wrap call, which is a good highlight. Lines 8–11 cover the `SMSDecorator.send()` body correctly. No change needed here — this is acceptable.

#### decorator, step 3 — `highlightedLines: [1, 2, 3, 4, 8]`
Lines 1–4 = `SlackDecorator` class body (correct). Line 8 = `notifier = new SlackDecorator(notifier);` (correct). This is fine.

#### decorator, step 4 — `highlightedLines: [1, 2, 3, 4]`
```
L1: notifier.send("🚨 Server is down!");
L2: // 📧 Email: ...
L3: // 📱 SMS: ...
L4: // 💬 Slack: ...
```
Highlighting comment output lines instead of the live code. Better: `[1]` only — just the send call. The output lines are illustrative comments, not code to highlight.

#### singleton, step 2 — `highlightedLines: [5, 6]`
```
L5: console.log(db1 === db2); // true
L6: console.log(db2 === db3); // true
```
Both are correct — highlights the identity equality assertions. Fine.

#### strategy, step 3 — `highlightedLines: [13, 14, 15]`
```
L13: // Runtime swap — no changes to Sorter
L14: sorter.setStrategy(new QuickSort());
L15: console.log(sorter.sort([3, 1, 4, 1, 5]));
```
Line 13 is a comment. Replace with `[14, 15]`.

**Summary:** 4 steps have genuinely wrong highlights (observer step 2, observer step 3, decorator step 4, strategy step 3). 2 are minor (factory-method step 2, decorator step 4). Fix the 4 clear cases.

---

## Medium Priority

### 3. `index.ts` — `patternsMap` not exported

`patternsMap` is `const` without `export`. `patternSlugs` and `patterns` are exported, so direct map lookup is only available via `getPattern()`. This is intentional (encapsulation), but is worth confirming — if any future consumer needs `Object.entries(patternsMap)`, they can't get it. The existing `getPatternsByCategory` + `patterns.filter` covers use cases fine. **No action needed unless more registry helpers are planned.**

### 4. `decorator.content.ts` — emoji in code strings

Steps 1–4 use emoji inside `console.log` calls (`📧 Email`, `📱 SMS`, `💬 Slack`). This works at runtime but:
- Shiki may render emoji inconsistently depending on font
- Copy-paste from the UI may produce encoding issues on some terminals

Suggestion: replace with `[Email]`, `[SMS]`, `[Slack]` prefixes in the code snippet strings. Keep emoji in `sceneDescription`/`description` prose if desired.

### 5. `singleton.content.ts` — `realWorldExample` uses `??=` operator

```ts
return (Logger.instance ??= new Logger());
```
Nullish assignment (`??=`) is ES2021 / TS 4.0+. This is fine for a modern Next.js 14 project but is less recognisable to learners than the explicit `if (!instance)` form used in the steps. Consider whether the real-world example should match the didactic style of the steps or show modern idiom — either is valid, just be intentional.

---

## Low Priority

### 6. `CodeSnippet` interface unused field: `language`

`language: string` in `CodeSnippet` is only ever set to `"typescript"` across all five files. If Shiki is always called with TypeScript, consider a narrower type (`"typescript" | "javascript"`) or a constant. YAGNI note: fine to leave as `string` if other languages are planned.

### 7. Minor prose inconsistency

- factory-method `metaphor`: uses British English ("materialises", "conveyor belt") — fine.
- Other files use American conventions. Not a bug, but worth noting if consistency matters for the design brief.

---

## Positive Observations

- Type interface design is clean and minimal. `PatternStep` covers all renderer needs without over-engineering.
- Camera positions are varied and plausible: zoom-in for close detail (`[0, 5, 8]`), elevated overview (`[0, 8, 10]`), side angle (`[6, 5, 6]`), pull-back for final step (`[0, 7, 12]`). No zeroed-out tuples.
- `cameraTarget` always has a non-zero x on side-view steps and `[0,0,0]` on centred steps — good scene coverage intent.
- All 5 patterns have consistent structure: slug matches export name and registry key, correct `category` enum value, 2–4 steps as per type comment.
- Registry is correct: `patternsMap` keys match slugs, `patterns` array derives from `Object.values` (order-stable in V8), helpers are O(1) and O(n) respectively — appropriate.
- Code examples compile (verified by tsc) and are pedagogically progressive: each step builds on the last.
- YAGNI respected: no unnecessary fields, no speculative helpers.

---

## Recommended Actions (prioritised)

1. **[Must]** Fix `observer.content.ts` step 1: change `private observers` to `protected observers` in the snippet so the subclass access in step 2 is valid TypeScript.
2. **[Should]** Fix 4 highlighted-line sets: observer step 2, observer step 3, decorator step 4, strategy step 3.
3. **[Consider]** Replace emoji in decorator code strings with text prefixes to avoid rendering edge cases.
4. **[Nice-to-have]** Tighten strategy step 3 highlight from `[13,14,15]` to `[14,15]`.

---

## Unresolved Questions

- Is `patternsMap` intentionally unexported? If registry consumers beyond the 3 current helpers are expected, export it.
- Should `realWorldExample.language` be narrowed to a union type, or is supporting non-TypeScript examples a future goal?
- Are the camera positions driving actual R3F `<PerspectiveCamera>` props — or is the scene renderer lerping to them? If lerping, the step-to-step delta matters (currently varies from ~2 units to ~6 units); confirm this is enough travel to feel like a camera move without being disorienting.
