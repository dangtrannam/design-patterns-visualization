import { highlight } from "@/lib/shiki";
import type { PatternStep } from "@/content/types";

interface CodeBlockProps {
  steps: PatternStep[];
}

/**
 * Server component — highlights ALL steps at build time via Shiki.
 * Client-side visibility is controlled by StepControls via data-step + inline style.
 */
export async function CodeBlock({ steps }: CodeBlockProps) {
  const htmlBlocks = await Promise.all(
    steps.map((step) => highlight(step.code, "typescript"))
  );

  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-[#0d1117]">
      {htmlBlocks.map((html, i) => (
        <div
          key={i}
          data-step={i}
          className="overflow-auto p-4 text-sm [&_pre]:!bg-transparent [&_pre]:!p-0"
          style={{ display: i === 0 ? "block" : "none" }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ))}
    </div>
  );
}
