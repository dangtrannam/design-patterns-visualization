"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface GhostOrbProps {
  visible: boolean;
}

/**
 * Ghost orb — rejected duplicate instance.
 * When visible=true: fades from 0.5 opacity → 0 over ~1.2s then stays hidden.
 * When visible=false: resets elapsed tracker so next trigger starts fresh.
 */
export function GhostOrb({ visible }: GhostOrbProps) {
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const elapsedVisible = useRef<number>(0);
  const FADE_DURATION = 1.2;

  useFrame(({  }, delta) => {
    const mat = matRef.current;
    if (!mat) return;

    if (!visible) {
      elapsedVisible.current = 0;
      mat.opacity = 0;
      return;
    }

    elapsedVisible.current += delta;
    const t = Math.min(elapsedVisible.current / FADE_DURATION, 1);
    // Start at 0.5 opacity, fade to 0
    mat.opacity = 0.5 * (1 - t);
  });

  return (
    // Slightly larger radius (1.55) to avoid z-fighting with SingletonOrb at 1.5
    <mesh>
      <sphereGeometry args={[1.55, 40, 40]} />
      <meshStandardMaterial
        ref={matRef}
        color="#ef4444"
        emissive="#ef4444"
        emissiveIntensity={0.4}
        roughness={0.3}
        metalness={0.1}
        transparent
        opacity={0}
        depthWrite={false}
      />
    </mesh>
  );
}
