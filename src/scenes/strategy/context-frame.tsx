"use client";

import * as THREE from "three";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { FloatingLabel } from "@/scenes/shared/floating-label";

// U-bracket housing: left wall, right wall, bottom — leaves slot open at top
const WALL_COLOR = "#334155";
const SLOT_EMISSIVE = "#38bdf8";

/** Static context frame — U-shaped housing with a glowing slot indicator. */
export function ContextFrame() {
  const slotRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!slotRef.current) return;
    const mat = slotRef.current.material as THREE.MeshStandardMaterial;
    const pulse = Math.sin(clock.getElapsedTime() * 2.2);
    mat.emissiveIntensity = 0.3 + 0.2 * pulse;
  });

  return (
    <group>
      {/* Left wall */}
      <mesh position={[-1.3, 0, 0]}>
        <boxGeometry args={[0.18, 2.0, 1.2]} />
        <meshStandardMaterial
          color={WALL_COLOR}
          metalness={0.5}
          roughness={0.4}
        />
      </mesh>

      {/* Right wall */}
      <mesh position={[1.3, 0, 0]}>
        <boxGeometry args={[0.18, 2.0, 1.2]} />
        <meshStandardMaterial
          color={WALL_COLOR}
          metalness={0.5}
          roughness={0.4}
        />
      </mesh>

      {/* Bottom base */}
      <mesh position={[0, -0.91, 0]}>
        <boxGeometry args={[2.78, 0.18, 1.2]} />
        <meshStandardMaterial
          color={WALL_COLOR}
          metalness={0.5}
          roughness={0.4}
        />
      </mesh>

      {/* Slot indicator strip — glowing line at slot entry */}
      <mesh ref={slotRef} position={[0, 0.2, 0.62]}>
        <boxGeometry args={[2.44, 0.06, 0.04]} />
        <meshStandardMaterial
          color={SLOT_EMISSIVE}
          emissive={SLOT_EMISSIVE}
          emissiveIntensity={0.3}
          metalness={0.2}
          roughness={0.3}
        />
      </mesh>

      <FloatingLabel text="Context" position={[0, 1.3, 0]} fontSize={0.22} />
      <FloatingLabel text="<slot>" position={[0, 0.55, 0]} fontSize={0.14} color="#94a3b8" />
    </group>
  );
}
