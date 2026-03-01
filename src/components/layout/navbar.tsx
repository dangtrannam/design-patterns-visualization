import Link from "next/link";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { patterns } from "@/content";
import { GITHUB_URL } from "@/lib/constants";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container flex h-14 items-center justify-between">
        {/* Logo / site title */}
        <Link
          href="/"
          className="text-base font-bold tracking-tight text-foreground transition-colors hover:text-accent"
        >
          Design Patterns<span className="text-accent">.</span>
        </Link>

        {/* Pattern navigation links — hidden on mobile */}
        {patterns.length > 0 && (
          <nav className="hidden md:flex items-center gap-0.5" aria-label="Patterns">
            {patterns.map((p) => (
              <Link
                key={p.slug}
                href={`/patterns/${p.slug}`}
                className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {p.name}
              </Link>
            ))}
          </nav>
        )}

        {/* GitHub link */}
        <Button variant="ghost" size="icon" asChild>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View source on GitHub"
          >
            <Github className="h-5 w-5" />
          </a>
        </Button>
      </div>
    </header>
  );
}
