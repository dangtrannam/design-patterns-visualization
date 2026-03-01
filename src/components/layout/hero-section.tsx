import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 to-background py-24 px-4 text-center">
      {/* Ambient glow orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div className="h-[500px] w-[700px] rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-3xl">
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          GoF Design Patterns
        </p>

        <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight text-foreground sm:text-6xl">
          See Design Patterns{" "}
          <span className="text-primary">Come Alive</span>
        </h1>

        <p className="mb-10 text-lg text-muted-foreground sm:text-xl">
          Interactive 3D scenes that walk you through Factory Method, Observer,
          Singleton, Strategy, and Decorator — step by step, with synced code.
        </p>

        <Button asChild size="lg" className="gap-2 text-base">
          <Link href="/patterns/factory-method">
            Start Exploring <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
