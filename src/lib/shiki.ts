import { createHighlighter, type Highlighter } from "shiki";

let highlighter: Highlighter | null = null;

export async function getHighlighter(): Promise<Highlighter> {
  if (!highlighter) {
    highlighter = await createHighlighter({
      themes: ["github-dark"],
      langs: ["typescript", "javascript", "python"],
    });
  }
  return highlighter;
}

export async function highlight(code: string, lang = "typescript"): Promise<string> {
  const hl = await getHighlighter();
  return hl.codeToHtml(code, { lang, theme: "github-dark" });
}
