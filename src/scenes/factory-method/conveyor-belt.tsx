"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** Horizontal assembly belt — subtle emissive pulse suggests movement. */
export function ConveyorBelt() {
  const stripRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!stripRef.current) return;
    const t = clock.getElapsedTime();
    (stripRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
      0.05 + 0.04 * Math.sin(t * 2);
  });

  return (
    <group>
      {/* Main belt surface */}
      <mesh position={[0, -0.8, 0]}>
        <boxGeometry args={[12, 0.1, 1.5]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Glowing edge strip — suggests movement direction */}
      <mesh ref={stripRef} position={[0, -0.74, 0]}>
        <boxGeometry args={[12, 0.02, 0.06]} />
        <meshStandardMaterial
          color="#6366f1"
          emissive="#6366f1"
          emissiveIntensity={0.05}
        />
      </mesh>
    </group>
  );
}
