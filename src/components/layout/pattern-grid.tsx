import { patterns } from "@/content";
import { PatternCard } from "@/components/pattern/pattern-card";

export function PatternGrid() {
  return (
    <div>
      <div className="mb-10 text-center">
        <h2 className="mb-3 text-3xl font-bold tracking-tight text-foreground">
          Explore Patterns
        </h2>
        <p className="text-muted-foreground">
          Pick a pattern to open its interactive 3D scene.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {patterns.map((p) => (
          <PatternCard
            key={p.slug}
            title={p.name}
            description={p.tagline}
            slug={p.slug}
            category={p.category}
          />
        ))}
      </div>
    </div>
  );
}
