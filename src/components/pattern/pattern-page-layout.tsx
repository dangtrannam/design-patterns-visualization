import dynamic from "next/dynamic";
import type { Pattern } from "@/content/types";
import { PageShell } from "@/components/layout/page-shell";
import { CodeBlock } from "./code-block";
import { StepControls } from "./step-controls";
import { WebGLFallback } from "./webgl-fallback";
import { FactoryMethodScene } from "@/scenes/factory-method/factory-method-scene";
import { ObserverScene } from "@/scenes/observer/observer-scene";

// Dynamic import keeps Three.js out of the server bundle
const PatternCanvas = dynamic(
  () => import("./pattern-canvas").then((m) => m.PatternCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="h-[500px] animate-pulse rounded-lg border border-white/10 bg-black/20" />
    ),
  }
);

/**
 * Maps pattern slug to its 3D scene component.
 * All entries MUST be "use client" components — never async server imports.
 */
function getPatternScene(slug: string): React.ReactNode {
  if (slug === "factory-method") return <FactoryMethodScene />;
  if (slug === "observer") return <ObserverScene />;
  return null;
}

interface PatternPageLayoutProps {
  pattern: Pattern;
}

/**
 * Server compositor for pattern pages.
 * Renders: header → problem → 3D canvas → step controls → code → real-world → anti-patterns.
 */
export function PatternPageLayout({ pattern }: PatternPageLayoutProps) {
  const scene = getPatternScene(pattern.slug);

  return (
    <PageShell
      title={pattern.name}
      description={pattern.tagline}
      category={pattern.category}
    >
      {/* Problem */}
      <section className="mb-10">
        <h2 className="mb-2 text-xl font-semibold">The Problem</h2>
        <p className="max-w-2xl text-muted-foreground">{pattern.problem}</p>
      </section>

      {/* 3D Canvas */}
      <section className="mb-4">
        <WebGLFallback>
          <PatternCanvas
            steps={pattern.steps}
            className="h-[500px] overflow-hidden rounded-lg border border-white/10"
          >
            {scene}
          </PatternCanvas>
        </WebGLFallback>
      </section>

      {/* Step controls */}
      <section className="mb-10">
        <StepControls totalSteps={pattern.steps.length} />
      </section>

      {/* Code block — server-rendered Shiki; heading is static ("Implementation")
          since this is a server component and can't read Zustand currentStep */}
      <section className="mb-10">
        <h2 className="mb-3 text-xl font-semibold">Implementation</h2>
        <CodeBlock steps={pattern.steps} />
      </section>

      {/* Real-world example */}
      <section className="mb-10">
        <h2 className="mb-3 text-xl font-semibold">Real-World Example</h2>
        <p className="mb-3 text-sm text-muted-foreground">
          {pattern.realWorldExample.title}
        </p>
        <pre className="overflow-auto rounded-lg border border-white/10 bg-[#0d1117] p-4 text-sm text-slate-300">
          <code>{pattern.realWorldExample.code}</code>
        </pre>
      </section>

      {/* Anti-patterns */}
      {pattern.antiPatterns.length > 0 && (
        <section>
          <h2 className="mb-3 text-xl font-semibold">Anti-Patterns to Avoid</h2>
          <div className="space-y-4">
            {pattern.antiPatterns.map((ap) => (
              <div
                key={ap.title}
                className="rounded-lg border border-red-500/20 bg-red-950/10 p-4"
              >
                <h3 className="mb-1 font-medium text-red-400">{ap.title}</h3>
                <p className="text-sm text-muted-foreground">{ap.description}</p>
                {ap.code && (
                  <pre className="mt-3 overflow-auto rounded border border-white/5 bg-black/30 p-3 text-xs text-slate-400">
                    <code>{ap.code}</code>
                  </pre>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </PageShell>
  );
}
