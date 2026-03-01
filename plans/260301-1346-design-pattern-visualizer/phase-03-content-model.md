# Phase 03: Pattern Content Model & Data

## Context Links
- [Plan Overview](plan.md)
- Depends on: [Phase 01](phase-01-project-setup.md)
- [Brainstorm Report](../reports/brainstorm-260301-1328-design-pattern-visualizer.md)

## Overview
- **Priority:** P1
- **Status:** completed
- **Effort:** 5h
- **Completed:** 2026-03-01
- **Description:** Define TypeScript types for pattern content and write all 5 pattern story files. Content-first approach: stories must be complete before any scene work.

## Key Insights
- Content-first: pattern narratives drive scene design, not the other way around
- Each pattern needs: problem narrative, metaphor description, step-by-step walkthrough, code snippets, real-world example, anti-patterns
- Steps array drives both 3D scene animation AND code highlight sync via Zustand
- All content is TypeScript (type-safe, colocated, no CMS needed for MVP)

## Requirements

### Functional
- `Pattern` type with all fields needed by pattern page sections
- `PatternStep` type with scene description, code snippet, highlighted lines
- 5 complete content files with real TypeScript code examples
- Pattern registry mapping slug to content
- Code snippets must be valid, compilable TypeScript (TS only, no multi-language for MVP)
- Each PatternStep must include `cameraPosition` and `cameraTarget` for scripted camera <!-- Updated: Validation Session 1 -->

### Non-Functional
- Content files <150 lines each (split if larger)
- Consistent tone: conversational but technically precise
- Code examples use TypeScript (primary audience: web devs)

## Architecture

### Type Definitions (`src/content/types.ts`)

```typescript
export interface PatternStep {
  title: string;
  description: string;          // What happens in this step
  sceneDescription: string;     // What the 3D scene shows
  code: string;                 // TypeScript code for this step
  highlightedLines: number[];   // Lines to highlight in Shiki
  cameraPosition: [number, number, number]; // R3F camera position for this step
  cameraTarget: [number, number, number];   // R3F camera look-at target
  // Updated: Validation Session 1 - scripted camera per step
}

export interface CodeSnippet {
  title: string;
  language: string;
  code: string;
}

export interface AntiPattern {
  title: string;
  description: string;
  code?: string;
}

export interface Pattern {
  slug: string;
  name: string;
  category: 'creational' | 'structural' | 'behavioral';
  tagline: string;              // One-line hook
  problem: string;              // Why does this pattern exist? (2-3 paragraphs)
  metaphor: string;             // 3D scene metaphor description
  steps: PatternStep[];         // 3-5 steps
  realWorldExample: CodeSnippet;
  antiPatterns: AntiPattern[];  // 1-2 anti-patterns
}
```

### Pattern Registry (`src/content/index.ts`)
```typescript
import { factoryMethod } from './factory-method.content';
import { observer } from './observer.content';
// ...
export const patterns: Record<string, Pattern> = {
  'factory-method': factoryMethod,
  'observer': observer,
  // ...
};
export const patternSlugs = Object.keys(patterns);
```

## Related Code Files
- **Create:** `src/content/types.ts`, `src/content/index.ts`, `src/content/factory-method.content.ts`, `src/content/observer.content.ts`, `src/content/singleton.content.ts`, `src/content/strategy.content.ts`, `src/content/decorator.content.ts`

## Implementation Steps

1. Create `src/content/types.ts` with all interfaces above
2. Write `factory-method.content.ts`:
   - Problem: "You need to create objects without specifying exact class..."
   - Metaphor: assembly line with 3 machine nodes producing different products
   - Steps (3): client calls factory -> factory delegates to concrete creator -> product materializes
   - Code: TypeScript abstract factory + concrete creators + products
   - Real-world: React component factory (render different form fields by type)
   - Anti-pattern: giant switch statement creating objects directly
3. Write `observer.content.ts`:
   - Problem: "Multiple objects need to react when one object changes state..."
   - Metaphor: central event hub with subscriber nodes, events as particle streams
   - Steps (3): event source emits -> notification dispatched to subscribers -> subscribers react
   - Code: TypeScript EventEmitter with typed events
   - Real-world: DOM event listeners / React state subscriptions
   - Anti-pattern: tight coupling with direct method calls
4. Write `singleton.content.ts`:
   - Problem: "Exactly one instance of a class must exist and be globally accessible..."
   - Metaphor: single glowing orb, all request arrows converge
   - Steps (2): first request creates instance -> subsequent requests get same instance
   - Code: TypeScript class with private constructor + static getInstance()
   - Real-world: database connection pool, logger
   - Anti-pattern: global mutable state without controlled access
5. Write `strategy.content.ts`:
   - Problem: "You need to swap algorithms at runtime without changing client code..."
   - Metaphor: context with slot accepting interchangeable algorithm blocks
   - Steps (3): default strategy active -> strategy swapped -> behavior changes
   - Code: TypeScript sorting strategies (bubble, quick, merge) behind interface
   - Real-world: payment processing (credit card, PayPal, crypto)
   - Anti-pattern: if/else chains for algorithm selection
6. Write `decorator.content.ts`:
   - Problem: "You need to add behavior to objects dynamically without modifying their class..."
   - Metaphor: concentric shells wrapping a core object
   - Steps (4): bare component -> add first decorator -> add second -> combined behavior
   - Code: TypeScript notification system (base notifier + SMS decorator + Slack decorator)
   - Real-world: Express.js middleware chain
   - Anti-pattern: subclass explosion (one class per combination)
7. Create `src/content/index.ts` registry
8. Verify: import all patterns in a test file, ensure types compile

## Todo List
- [x] Create types.ts
- [x] Write factory-method.content.ts
- [x] Write observer.content.ts
- [x] Write singleton.content.ts
- [x] Write strategy.content.ts
- [x] Write decorator.content.ts
- [x] Create pattern registry index.ts
- [x] Verify TypeScript compilation

## Success Criteria
- All 5 content files export valid `Pattern` objects
- Each pattern has 2-5 steps with real TypeScript code
- `npm run build` succeeds with no type errors
- Content reads well as standalone educational material

## Risk Assessment
- **Content quality:** Code examples must be correct and pedagogically clear; review each carefully
- **Step count mismatch:** Scene complexity grows with step count; keep to 2-4 steps per pattern
- **Scope creep in content:** Keep problem/metaphor descriptions concise; no more than 3 paragraphs each

## Completion Summary

### Files Created/Modified
- `src/content/types.ts` — Pattern, PatternStep with cameraPosition/cameraTarget, CodeSnippet, AntiPattern types
- `src/content/index.ts` — patternsMap Record, patterns array, getPattern() + getPatternsByCategory() helpers
- `src/content/factory-method.content.ts` — 3-step factory pattern with assembly line metaphor + Logger factory code
- `src/content/observer.content.ts` — 3-step observer pattern with event hub metaphor + typed EventEmitter code
- `src/content/singleton.content.ts` — 2-step singleton pattern with glowing orb metaphor + DatabaseConnection code
- `src/content/strategy.content.ts` — 3-step strategy pattern with swappable slot metaphor + SortStrategy code
- `src/content/decorator.content.ts` — 4-step decorator pattern with concentric shells metaphor + Notifier chain code
- `src/components/layout/navbar.tsx` — minor fix: `p.title` → `p.name`

### Quality Metrics
- TypeScript compilation: ✓ clean (`tsc --noEmit`)
- Build verification: ✓ clean (`npm run build`)
- Code review score: 8.5/10 (all critical issues fixed)
- All 5 content files under 150 lines; avg ~110 lines

### Key Implementation Details
- All PatternStep objects include cameraPosition/cameraTarget (validated in Session 1)
- Code snippets are valid, compilable TypeScript (no multi-language for MVP)
- Each pattern includes: problem statement, metaphor, 2-4 steps, real-world example, anti-patterns
- Pattern registry maps slug → content; includes getPattern() and getPatternsByCategory() helpers
- Consistent conversational tone across all content; technically precise examples

## Next Steps
- Phase 04 uses these types and content to build the scene framework
- Scene developers reference `sceneDescription` field in each step
- Phase 04 is now unblocked and ready to begin
