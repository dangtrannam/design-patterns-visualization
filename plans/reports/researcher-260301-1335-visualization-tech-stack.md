# Design Pattern Visualization: Tech Stack Research

**Date:** 2026-03-01
**Scope:** 3D-first visualization website for design patterns using Next.js 14
**Target Stack:** React Three Fiber, React Flow, syntax highlighting, bundle optimization

---

## 1. 3D Rendering: React Three Fiber vs D3 vs Alternatives

| Decision | React Three Fiber | Three.js (vanilla) | D3.js |
|----------|------------------|-------------------|-------|
| **Best For** | React+JSX workflow, rapid prototyping | Full control, custom shaders, complex scenes | Data-driven layouts, force simulations |
| **Bundle Size** | ~600KB (Three.js base) | ~600KB | ~400KB (no 3D) |
| **Integration** | Seamless with React 18+, hooks, state | Framework-agnostic | DOM conflicts with React |
| **Performance** | Good (abstracts some Three.js) | Optimal (raw WebGL) | Weak for 3D |
| **Learning Curve** | Medium (need 3D + React) | Steep | Medium |
| **2026 Trend** | WebGPU + AI-assisted scene generation | WebGPU adoption | Still data-viz focused |

**RECOMMENDATION: React Three Fiber**
- Your use case (unique 3D metaphors per pattern) aligns perfectly with R3F's component model
- Hot reloading speeds iteration (critical for 5 distinct 3D scenes)
- Libraries like `@react-three/drei` provide pre-built shapes/controls
- WebGPU support landed in Three.js core (inherited by R3F)

---

## 2. 2D Diagram Layer: React Flow vs Cytoscape vs D3-force

| Decision | React Flow | Cytoscape.js | D3-force |
|----------|------------|--------------|----------|
| **Best For** | Node editors, workflow diagrams in React | Complex graph analysis, network viz | Custom force simulations |
| **Bundle Size** | ~150KB | ~250KB | ~400KB |
| **Performance** | Good (viewport culling) | Excellent (canvas+WebGL preview) | Variable |
| **React Integration** | Native | Via wrapper (canvas-based) | Conflicts with vDOM |
| **UML Diagram Support** | Limited customization | Purpose-built, excellent | Highly custom |
| **Interactive Features** | Drag, connect, edit | Pan, zoom, analyze | Pan, zoom |
| **Mobile Ready** | Yes | Fair (canvas overhead) | Fair |

**RECOMMENDATION: React Flow**
- Secondary 2D view for UML/relationship diagrams is less critical than 3D
- React Flow's viewport culling + native React integration = lower cognitive load
- Bundle size acceptable for secondary feature
- If performance becomes issue: Cytoscape.js WebGL renderer (v3.31+) is viable alternative

---

## 3. Syntax Highlighting: Shiki vs Prism vs Monaco

| Decision | Shiki | Prism.js | Monaco |
|----------|-------|----------|--------|
| **Bundle Size** | 280KB (with WASM) | 11.7KB | 2MB+ (overkill) |
| **Accuracy** | Superior (VS Code engine) | Good | Perfect (IDE-level) |
| **Render Time** | 3.5-5ms per block | 0.5-0.7ms | N/A |
| **Client vs Server** | Best server-side | Best client-side | Not applicable |
| **Read-Only Use** | Yes | Yes | Over-engineered |
| **Line-by-Line Animation** | Possible (server HTML) | Possible (lightweight) | Possible |

**RECOMMENDATION: Prism.js (client-side) OR Shiki (server-side)**

**Choose Prism.js if:**
- Animating code walkthroughs on client
- Code snippets appear after page load
- Bundle size critical for mobile

**Choose Shiki if:**
- Pre-rendering code blocks at build time (next preferred)
- Code is static on page load
- Superior highlighting for complex pattern code is priority

**Why NOT Monaco:** 2MB+ bundle makes it prohibitive for a visualization site; overkill for read-only display.

---

## 4. Bundle Size & Code Splitting Strategy

### Three.js/React Three Fiber Size Challenge
- **Base Three.js:** ~600KB
- **React Three Fiber wrapper:** +150KB
- **drei utilities (lights, cameras, loaders):** +100KB
- **Total worst-case:** ~850KB

### Mitigation Strategies (Next.js 14)

```typescript
// Dynamic import only when 3D pattern route is accessed
import dynamic from 'next/dynamic';

const FactoryScene = dynamic(() => import('@/components/scenes/Factory3D'), {
  ssr: false, // Disable SSR for 3D components
  loading: () => <LoadingPlaceholder />,
});
```

### Bundling Best Practices
1. **Route-based splitting:** Each pattern (Factory, Observer, etc.) = separate route → separate chunk
2. **Dynamic imports for 3D:** Only load Three.js when entering 3D view
3. **Lazy load @react-three/drei:** Import utilities only when needed
4. **Shiki optimization:** Use Shiki server-side if highlighting is static; keep Prism for dynamic content
5. **Tree-shake aggressively:** Use `optimizePackageImports` in next.config.js for icon/utility libraries

### Target Bundle Goals
- **Initial (index/landing):** <200KB (gzipped)
- **Per-pattern route:** +300-400KB (acceptable for feature-specific code)
- **React Flow 2D view:** +150KB (lazy-loaded)

---

## 5. Mobile Performance: WebGL on iOS vs Android

| Factor | iOS Safari | Android Chrome | Android Samsung |
|--------|-----------|-----------------|-----------------|
| **WebGL 2 Support** | Full | Partial | Partial |
| **Three.js Support** | Excellent | Unstable | Poor (context loss) |
| **60 FPS Target** | Achievable | 30FPS realistic | 20-30FPS realistic |
| **Memory Issues** | Low | High (fragmentation) | High |
| **Best Practice** | Use as-is | Reduce draw calls | Fallback to 2D |

### Mobile Optimization for Design Patterns
1. **Reduce geometry complexity:** Simplified models instead of high-poly
2. **Limit lighting:** Use 1-2 lights max; avoid shadows on Android
3. **Texture optimization:** Small, pre-compressed textures (WebP)
4. **Adaptive rendering:** Detect device capability → serve optimized variant
5. **Fallback to 2D:** On low-end Android, serve canvas/SVG diagram instead of WebGL

```typescript
// Pseudo-code: Detect and adapt
if (isMobileDevice() && !isIOSDevice()) {
  return <FallbackDiagram2D />; // React Flow diagram instead
}
return <Pattern3DScene />; // Full Three.js experience
```

**Expectation Setting:** 3D design patterns on mobile are secondary; 2D diagrams must be robust fallback.

---

## Summary Table: Final Recommendations

| Layer | Technology | Bundle Impact | Rationale |
|-------|-----------|----------------|-----------|
| **3D Scenes** | React Three Fiber | ~600KB (split) | Best React integration, rapid iteration, WebGPU ready |
| **2D UML Diagrams** | React Flow | +150KB (lazy) | Native React, viewport culling, lower complexity |
| **Syntax Highlighting** | Shiki (server) + Prism (fallback) | +12-30KB (client) | Best quality/size tradeoff; server-render static code |
| **Code Splitting** | Next.js dynamic imports | N/A | Route-based chunks, dynamic 3D loading |
| **Mobile Strategy** | Adaptive 2D fallback | Conditional loading | Graceful degradation on Android |

---

## Implementation Checklist

- [ ] Set up `next/dynamic` for pattern routes (Factory, Observer, etc.)
- [ ] Configure `@next/bundle-analyzer` to monitor Three.js + R3F chunks
- [ ] Create base `SceneLayout` component (R3F Canvas, controls, lighting)
- [ ] Implement 2D React Flow diagram as lazy-loaded secondary view
- [ ] Choose Shiki (build-time) OR Prism (runtime) based on code animation needs
- [ ] Test on iOS (baseline) and low-end Android device
- [ ] Set up performance budget: 400KB per-pattern-route maximum

---

## Unresolved Questions

1. **Shiki WASM overhead:** Will server-side Shiki WASM hurt Lambda cold starts? (Test in CI/CD)
2. **React Flow performance at scale:** If UML diagrams have 20+ nodes, does viewport culling stay <60fps?
3. **Three.js WebGPU adoption:** How soon will mainstream browsers fully support WebGPU? (Safe to plan for late 2026)

---

## Sources
- [React Three Fiber vs Three.js 2026](https://graffersid.com/react-three-fiber-vs-three-js/)
- [Comparing Web Code Highlighters](https://chsm.dev/blog/2025/01/08/comparing-web-code-highlighters)
- [Next.js Bundle Optimization Guide](https://nextjs.org/docs/app/guides/package-bundling)
- [Cytoscape.js WebGL Renderer (v3.31, 2025)](https://blog.js.cytoscape.org/2025/01/13/webgl-preview/)
- [WebGL Mobile Performance Challenges](https://blog.pixelfreestudio.com/webgl-in-mobile-development-challenges-and-solutions/)
- [React Flow Performance Documentation](https://reactflow.dev/learn/advanced-use/performance)
