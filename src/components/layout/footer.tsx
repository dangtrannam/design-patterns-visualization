import Link from "next/link";
import { GITHUB_URL } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-auto w-full border-t border-border/50">
      <div className="container py-6">
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Design Pattern Visualizer. Built with Next.js & Three.js.
          </p>
          <nav className="flex items-center gap-4" aria-label="Footer links">
            <Link
              href="/"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Patterns
            </Link>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              GitHub
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
