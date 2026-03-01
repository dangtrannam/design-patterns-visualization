export type PatternCategory = "creational" | "structural" | "behavioral";

export interface PatternStep {
  id: string;
  title: string;
  description: string;
  code: string;
}

export interface PatternContent {
  slug: string;
  title: string;
  category: PatternCategory;
  summary: string;
  problem: string;
  solution: string;
  steps: PatternStep[];
  tags: string[];
}
