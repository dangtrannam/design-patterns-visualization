"use client";

import { AnimatedArrow } from "@/scenes/shared/animated-arrow";

interface RequestArrowProps {
  visible: boolean;
}

/** Animated client request signal traveling toward the factory hub. */
export function RequestArrow({ visible }: RequestArrowProps) {
  if (!visible) return null;
  return (
    <AnimatedArrow
      from={[-6.5, 0, 0]}
      to={[-0.7, 0, 0]}
      color="#a5b4fc"
      speed={2}
    />
  );
}
