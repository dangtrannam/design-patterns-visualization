---
title: "Design Pattern Visualizer - 3D Interactive Learning Platform"
description: "Next.js 14 site with R3F 3D scenes visualizing 5 design patterns for MVP launch"
status: in-progress
priority: P1
effort: 40h
branch: main
tags: [nextjs, r3f, threejs, design-patterns, portfolio]
created: 2026-03-01
---

# Design Pattern Visualizer - Implementation Plan

## Vision
Interactive website where each GoF design pattern gets a custom 3D animated scene (R3F) synchronized with step-by-step code walkthroughs (Shiki). Desktop-first, deployed on Vercel.

## Tech Stack
Next.js 14 App Router | React Three Fiber + drei | Zustand | Shiki (SSR) | Tailwind + shadcn/ui | Framer Motion | Vercel

## MVP Scope
5 patterns in order: Factory Method, Observer, Singleton, Strategy, Decorator

## Phases

| # | Phase | Effort | Status | Completed | File |
|---|-------|--------|--------|-----------|------|
| 01 | Project Setup & Tooling | 2h | completed | 2026-03-01 | [phase-01](phase-01-project-setup.md) |
| 02 | Design System & Layout Shell | 3h | completed | 2026-03-01 | [phase-02](phase-02-design-system.md) |
| 03 | Pattern Content Model & Data | 5h | completed | 2026-03-01 | [phase-03](phase-03-content-model.md) |
| 04 | 3D Scene Framework | 5h | completed | 2026-03-01 | [phase-04](phase-04-scene-framework.md) |
| 05 | Factory Method Scene + Page | 5h | completed | 2026-03-01 | [phase-05](phase-05-factory-method.md) |
| 06 | Observer Scene + Page | 5h | pending | [phase-06](phase-06-observer.md) |
| 07 | Singleton Scene + Page | 4h | pending | [phase-07](phase-07-singleton.md) |
| 08 | Strategy Scene + Page | 4h | pending | [phase-08](phase-08-strategy.md) |
| 09 | Decorator Scene + Page | 4h | pending | [phase-09](phase-09-decorator.md) |
| 10 | Landing Page, SEO & Deploy | 3h | pending | [phase-10](phase-10-landing-seo-deploy.md) |

## Key Dependencies
- Phase 01 blocks all others
- Phase 02-03 can run in parallel after 01
- Phase 04 requires 02+03; blocks all scene phases (05-09)
- Phases 05-09 are sequential (ship each before starting next)
- Phase 10 requires all scenes complete

## Research
- [Brainstorm Report](../reports/brainstorm-260301-1328-design-pattern-visualizer.md)
- [Tech Stack Research](../reports/researcher-260301-1335-visualization-tech-stack.md)

## Folder Structure
See Phase 01 for full `src/` directory layout.

## Hard Rules
- Content-first: write pattern stories BEFORE building scenes
- No React Flow: 3D scene IS the diagram
- No pattern #6 until all 5 deployed
- Desktop-first; mobile gets WebGL fallback message
- R3F loaded only on pattern routes (dynamic import, ssr: false)
- TypeScript only for code examples (MVP)
- Step walkthrough starts PAUSED by default
- Camera scripted per step (not free orbit)
- CodeBlock: pre-render ALL steps server-side, client shows/hides by step index

## Validation Log

### Session 1 — 2026-03-01
**Trigger:** Post-plan validation interview
**Questions asked:** 4

#### Questions & Answers

1. **[Architecture]** Shiki server component + Zustand client state mismatch for per-step highlighting?
   - Options: Pre-render all steps SSR + client shows/hides | Client component | CSS class toggling
   - **Answer:** Pre-render all steps server-side, client shows/hides
   - **Rationale:** CodeBlock renders N blocks (one per step) at build time. Client Zustand step index controls `display`. Zero client JS for highlighting. Affects Phase 04 CodeBlock architecture and Phases 05-09 scene content integration.

2. **[Architecture]** 3D camera behavior during step walkthrough?
   - Options: Scripted per step | Free orbit | Scripted + orbit on idle
   - **Answer:** Scripted camera per step
   - **Rationale:** Each `PatternStep` must include a `cameraPosition` and `cameraTarget` field. Camera rig lerps to target on step change. Affects Phase 03 types, Phase 04 camera rig, Phases 05-09 scene content.

3. **[Assumptions]** Auto-play default on page load?
   - Options: Start paused | Auto-play on load
   - **Answer:** Start paused
   - **Rationale:** `isPlaying: false` as Zustand default. Confirms Phase 04 store initial state.

4. **[Scope]** Code example languages for content files?
   - Options: TypeScript only | TS + JS | Language switcher
   - **Answer:** TypeScript only for MVP
   - **Rationale:** Confirms Phase 03 assumption. No multi-language content overhead.

#### Confirmed Decisions
- CodeBlock architecture: SSR pre-render all steps, client hides/shows — Phase 04
- Camera: scripted lerp per step, positions defined in content — Phases 03, 04, 05-09
- Auto-play: `isPlaying: false` default — Phase 04
- Languages: TypeScript only — Phase 03

#### Action Items
- [ ] Add `cameraPosition` and `cameraTarget` to `PatternStep` type (Phase 03)
- [ ] Add camera positions to all 5 content files (Phase 03)
- [ ] Update CodeBlock to render all-steps container with hidden siblings (Phase 04)
- [ ] Update CameraRig to accept target props and lerp per step (Phase 04)
