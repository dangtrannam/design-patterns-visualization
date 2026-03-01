"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { FloatingLabel } from "@/scenes/shared/floating-label";

interface MachineStationProps {
  position: [number, number, number];
  label: string;
  isActive: boolean;
  color: string;
}

/** Assembly machine node — glows and pulses when active, dims when idle. */
export function MachineStation({ position, label, isActive, color }: MachineStationProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current || !meshRef.current) return;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    if (isActive) {
      const pulse = Math.sin(clock.getElapsedTime() * 3);
      groupRef.current.scale.setScalar(1 + 0.04 * pulse);
      mat.emissiveIntensity = 0.45 + 0.25 * pulse;
      mat.opacity = 1;
    } else {
      groupRef.current.scale.setScalar(1);
      mat.emissiveIntensity = 0.05;
      mat.opacity = 0.35;
    }
  });

  return (
    <group position={position}>
      <group ref={groupRef}>
        <RoundedBox ref={meshRef} args={[1.2, 1.4, 1.2]} radius={0.08} smoothness={4}>
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.05}
            transparent
            metalness={0.6}
            roughness={0.3}
          />
        </RoundedBox>
      </group>
      <FloatingLabel
        text={label}
        position={[0, 1.1, 0]}
        fontSize={0.18}
        color={isActive ? "#ffffff" : "#64748b"}
      />
    </group>
  );
}
