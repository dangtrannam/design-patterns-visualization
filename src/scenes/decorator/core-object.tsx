"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface CoreObjectProps {
  isPulsing: boolean;
}

/**
 * Bare component sphere — small solid emissive sphere.
 * When isPulsing: emissive intensity swings 0.3 → 1.2 → 0.3 via sin.
 */
export function CoreObject({ isPulsing }: CoreObjectProps) {
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!matRef.current || !meshRef.current) return;
    const t = clock.getElapsedTime();

    if (isPulsing) {
      // Fast pulse wave: sin oscillates between -1 and 1, mapped to 0.3–1.2
      const pulse = Math.sin(t * 10);
      matRef.current.emissiveIntensity = 0.75 + 0.45 * pulse;
      meshRef.current.scale.setScalar(1 + 0.08 * Math.abs(pulse));
    } else {
      // Gentle idle breathe
      matRef.current.emissiveIntensity = 0.3 + 0.1 * Math.sin(t * 1.2);
      meshRef.current.scale.setScalar(1);
    }
  });

  return (
    <mesh ref={meshRef} renderOrder={0}>
      <sphereGeometry args={[0.35, 32, 16]} />
      <meshStandardMaterial
        ref={matRef}
        color="#e2e8f0"
        emissive="#e2e8f0"
        emissiveIntensity={0.3}
        roughness={0.15}
        metalness={0.05}
      />
    </mesh>
  );
}
