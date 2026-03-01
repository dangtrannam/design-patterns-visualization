"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface GlowingSphereProps {
  position: [number, number, number];
  color?: string;
  radius?: number;
  pulseSpeed?: number;
}

/** Sphere with pulsing emissive intensity — conveying "active" state. */
export function GlowingSphere({
  position,
  color = "#6366f1",
  radius = 0.5,
  pulseSpeed = 1.5,
}: GlowingSphereProps) {
  const matRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }) => {
    if (!matRef.current) return;
    const t = clock.getElapsedTime();
    matRef.current.emissiveIntensity = 0.4 + 0.4 * Math.sin(t * pulseSpeed);
  });

  return (
    <mesh position={position}>
      <sphereGeometry args={[radius, 32, 32]} />
      <meshStandardMaterial
        ref={matRef}
        color={color}
        emissive={color}
        emissiveIntensity={0.4}
        roughness={0.2}
        metalness={0.1}
      />
    </mesh>
  );
}
