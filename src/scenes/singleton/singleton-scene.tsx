"use client";

import { usePatternStore } from "@/store/pattern-store";
import { AnimatedArrow } from "@/scenes/shared/animated-arrow";
import { FloatingLabel } from "@/scenes/shared/floating-label";
import { SingletonOrb } from "./singleton-orb";
import { GhostOrb } from "./ghost-orb";

const ARROW_ORIGINS: [number, number, number][] = [
  [4, 0, 0],
  [-4, 0, 0],
  [0, 4, 0],
  [0, -4, 0],
  [2.8, 0, 2.8],
  [-2.8, 0, -2.8],
];

const ORIGIN: [number, number, number] = [0, 0, 0];

/**
 * Singleton 3D scene — single orb metaphor:
 *   Step 0: orb materialises, first caller arrow arrives from front
 *   Step 1: all 6 arrows converge, ghost orb briefly flares red then fades
 */
export function SingletonScene() {
  const currentStep = usePatternStore((s) => s.currentStep);

  const orbVisible = currentStep >= 0; // always visible once scene loads
  const ghostVisible = currentStep === 1;

  // Step 0: only first arrow (index 0); Step 1: all arrows
  const visibleArrowCount = currentStep === 0 ? 1 : ARROW_ORIGINS.length;

  return (
    <>
      {/* Main singleton orb */}
      <SingletonOrb visible={orbVisible} />

      {/* Ghost orb — rejected duplicate, fades on step 1 */}
      <GhostOrb visible={ghostVisible} />

      {/* Label */}
      <FloatingLabel
        text="Singleton Instance"
        position={[0, 2.2, 0]}
        fontSize={0.28}
        color="#22d3ee"
      />

      {/* Request arrows converging on the orb */}
      {ARROW_ORIGINS.slice(0, visibleArrowCount).map((origin, i) => (
        <AnimatedArrow
          key={i}
          from={origin}
          to={ORIGIN}
          color="#22d3ee"
          speed={1.2}
        />
      ))}
    </>
  );
}
