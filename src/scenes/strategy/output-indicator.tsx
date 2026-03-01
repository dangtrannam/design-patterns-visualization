"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { FloatingLabel } from "@/scenes/shared/floating-label";

interface OutputIndicatorProps {
  activeStrategy: 0 | 1 | 2;
}

const STRATEGY_COLORS: Record<number, string> = {
  0: "#3b82f6",
  1: "#22c55e",
  2: "#f97316",
};

/** Pulsing sphere that changes color to reflect the active strategy's output. */
export function OutputIndicator({ activeStrategy }: OutputIndicatorProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Update color reactively when activeStrategy changes
  useEffect(() => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    const newColor = STRATEGY_COLORS[activeStrategy] ?? STRATEGY_COLORS[0];
    mat.color.set(newColor);
    mat.emissive.set(newColor);
  }, [activeStrategy]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    const pulse = Math.sin(clock.getElapsedTime() * 3.5);
    mat.emissiveIntensity = 0.35 + 0.25 * pulse;

    const scaleVal = 1 + 0.06 * pulse;
    meshRef.current.scale.setScalar(scaleVal);
  });

  const initialColor = STRATEGY_COLORS[activeStrategy] ?? STRATEGY_COLORS[0];

  return (
    <group position={[2.5, 0, 0]}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.25, 24, 24]} />
        <meshStandardMaterial
          color={initialColor}
          emissive={initialColor}
          emissiveIntensity={0.35}
          metalness={0.3}
          roughness={0.25}
        />
      </mesh>
      <FloatingLabel text="Output" position={[0, 0.55, 0]} fontSize={0.18} />
    </group>
  );
}
