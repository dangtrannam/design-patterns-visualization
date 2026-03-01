import { Badge } from "@/components/ui/badge";
import type { PatternCategory } from "@/content/types";

interface PageShellProps {
  title: string;
  description: string;
  category?: PatternCategory;
  children: React.ReactNode;
}

/** Wraps each pattern page — gradient header + content container */
export function PageShell({ title, description, category, children }: PageShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Gradient header */}
      <section className="relative overflow-hidden border-b border-border/50 bg-gradient-to-b from-muted/60 to-background px-4 py-12 lg:py-16">
        {/* Subtle radial glow behind title */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(199_89%_48%_/_0.12),transparent)]"
        />
        <div className="container relative">
          {category && (
            <Badge variant="outline" className="mb-3 capitalize text-accent border-accent/40">
              {category}
            </Badge>
          )}
          <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">{description}</p>
        </div>
      </section>

      {/* Content area */}
      <div className="container flex-1 py-10">{children}</div>
    </div>
  );
}
