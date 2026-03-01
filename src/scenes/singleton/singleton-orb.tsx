"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface SingletonOrbProps {
  visible: boolean;
}

/**
 * Large glowing orb — the singleton instance.
 * Slow Y rotation, bloom-friendly high emissive, scale lerps 0→1 on mount.
 */
export function SingletonOrb({ visible }: SingletonOrbProps) {
  const groupRef = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }) => {
    const group = groupRef.current;
    const mat = matRef.current;
    if (!group || !mat) return;

    const targetScale = visible ? 1 : 0;
    const current = group.scale.x;
    const next = THREE.MathUtils.lerp(current, targetScale, 0.08);
    group.scale.setScalar(next);

    // Slow Y rotation
    group.rotation.y = clock.getElapsedTime() * 0.25;

    // Pulsing emissive for bloom
    const t = clock.getElapsedTime();
    mat.emissiveIntensity = 0.6 + 0.4 * Math.sin(t * 1.2);
  });

  return (
    <group ref={groupRef} scale={0}>
      <mesh>
        <sphereGeometry args={[1.5, 48, 48]} />
        <meshStandardMaterial
          ref={matRef}
          color="#22d3ee"
          emissive="#22d3ee"
          emissiveIntensity={0.6}
          roughness={0.1}
          metalness={0.3}
          transparent
          opacity={0.95}
        />
      </mesh>
      {/* Inner bright core for bloom */}
      <mesh>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial
          color="#e0f9ff"
          emissive="#22d3ee"
          emissiveIntensity={1.5}
          roughness={0.05}
          metalness={0.1}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
}
