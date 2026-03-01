import type { Pattern } from "./types";
import { factoryMethod } from "./factory-method.content";
import { observer } from "./observer.content";
import { singleton } from "./singleton.content";
import { strategy } from "./strategy.content";
import { decorator } from "./decorator.content";

// Record for O(1) slug lookup
const patternsMap: Record<string, Pattern> = {
  "factory-method": factoryMethod,
  observer,
  singleton,
  strategy,
  decorator,
};

// Array for iteration (navbar, landing grid, etc.)
export const patterns: Pattern[] = Object.values(patternsMap);

export const patternSlugs: string[] = Object.keys(patternsMap);

export function getPattern(slug: string): Pattern | undefined {
  return patternsMap[slug];
}

export function getPatternsByCategory(
  category: Pattern["category"]
): Pattern[] {
  return patterns.filter((p) => p.category === category);
}
