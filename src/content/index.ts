import type { PatternContent } from "./types";

// Pattern registry — populated as each pattern is implemented
export const patterns: PatternContent[] = [];

export function getPattern(slug: string): PatternContent | undefined {
  return patterns.find((p) => p.slug === slug);
}

export function getPatternsByCategory(category: PatternContent["category"]): PatternContent[] {
  return patterns.filter((p) => p.category === category);
}
