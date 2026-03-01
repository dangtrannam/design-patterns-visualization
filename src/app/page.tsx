import { HeroSection } from "@/components/layout/hero-section";
import { PatternGrid } from "@/components/layout/pattern-grid";
import { ValueProp } from "@/components/layout/value-prop";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <section className="container mx-auto px-4 py-16">
        <PatternGrid />
      </section>
      <section className="container mx-auto px-4 py-16 border-t border-white/10">
        <ValueProp />
      </section>
    </main>
  );
}
