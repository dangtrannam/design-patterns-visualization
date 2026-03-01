export type PatternCategory = "creational" | "structural" | "behavioral";

export interface PatternStep {
  title: string;
  description: string;          // What this step demonstrates
  sceneDescription: string;     // What the 3D scene shows
  code: string;                 // TypeScript snippet for this step
  highlightedLines: number[];   // 1-indexed lines to highlight in Shiki
  cameraPosition: [number, number, number]; // R3F camera xyz
  cameraTarget: [number, number, number];   // R3F look-at xyz
}

export interface CodeSnippet {
  title: string;
  language: string;
  code: string;
}

export interface AntiPattern {
  title: string;
  description: string;
  code?: string;
}

export interface Pattern {
  slug: string;
  name: string;
  category: PatternCategory;
  tagline: string;              // One-line hook shown on cards
  problem: string;              // Why does this pattern exist?
  metaphor: string;             // 3D scene metaphor description
  steps: PatternStep[];         // 2–4 steps driving scene + code sync
  realWorldExample: CodeSnippet;
  antiPatterns: AntiPattern[];  // 1–2 anti-patterns
}
