# Phase 01: Project Setup & Tooling

## Context Links
- [Plan Overview](plan.md)
- [Tech Stack Research](../reports/researcher-260301-1335-visualization-tech-stack.md)

## Overview
- **Priority:** P1 (blocks everything)
- **Status:** completed
- **Effort:** 2h
- **Description:** Initialize Next.js 14 project with all dependencies, folder structure, and build config.

## Key Insights
- R3F + Three.js ~600KB; must be route-split via dynamic imports
- Shiki works best as server component (zero client JS for code blocks)
- shadcn/ui uses `npx shadcn@latest init` (not npm install)

## Requirements

### Functional
- Next.js 14 App Router project with TypeScript strict mode
- All MVP dependencies installed and importable
- Folder structure matches spec
- Dev server runs without errors

### Non-Functional
- Absolute imports via `@/` prefix
- ESLint + Prettier configured
- `.gitignore` includes node_modules, .next, .env*

## Architecture

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── patterns/[slug]/
│       ├── page.tsx
│       └── opengraph-image.tsx
├── components/
│   ├── layout/          # Navbar, Footer, PageShell
│   ├── pattern/         # PatternCanvas, StepControls, CodeBlock, PatternCard
│   └── ui/              # shadcn components
├── scenes/
│   ├── factory-method/
│   ├── observer/
│   ├── singleton/
│   ├── strategy/
│   └── decorator/
├── content/
│   ├── types.ts
│   ├── index.ts
│   └── *.content.ts
├── store/
│   └── pattern-store.ts
├── lib/
│   ├── shiki.ts
│   └── utils.ts
└── styles/
    └── globals.css
```

## Related Code Files
- **Create:** `next.config.js`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.js`, `.eslintrc.json`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/lib/utils.ts`

## Implementation Steps

1. Run `npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"`
2. Install 3D stack: `npm install three @react-three/fiber @react-three/drei @react-three/postprocessing`
3. Install `@types/three`
4. Install state + animation: `npm install zustand framer-motion`
5. Install Shiki: `npm install shiki`
6. Init shadcn/ui: `npx shadcn@latest init` (New York style, slate color, CSS variables)
7. Create all directories in `src/` per folder structure above
8. Configure `next.config.js`:
   ```js
   const nextConfig = {
     transpilePackages: ['three'],
     webpack: (config) => {
       config.externals = [...(config.externals || [])];
       return config;
     },
   };
   ```
9. Verify `tsconfig.json` has `"paths": { "@/*": ["./src/*"] }`
10. Add placeholder `src/app/page.tsx` with "Design Pattern Visualizer" heading
11. Run `npm run dev` — confirm no errors
12. Run `npm run build` — confirm production build succeeds
13. Init git repo: `git init && git add -A && git commit -m "chore: init next.js 14 project with r3f stack"`

## Todo List
- [x] Create Next.js project
- [x] Install all dependencies
- [x] Init shadcn/ui
- [x] Create folder structure
- [x] Configure next.config.js
- [x] Verify dev + build succeed
- [x] Init git repo

## Success Criteria
- `npm run dev` starts without errors
- `npm run build` produces production build
- All imports (`three`, `@react-three/fiber`, `zustand`, `shiki`, `framer-motion`) resolve
- Folder structure matches spec

## Risk Assessment
- **shadcn/ui init conflicts with existing Tailwind config:** Run shadcn init AFTER create-next-app; accept overwrite prompts
- **Three.js type errors:** Ensure `@types/three` version matches `three` version

## Next Steps
- Phase 02 (Design System) and Phase 03 (Content Model) can start in parallel after this completes
