"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { FloatingLabel } from "@/scenes/shared/floating-label";

interface StrategyBlockProps {
  color: string;
  label: string;
  isInSlot: boolean;
  stagedPosition: [number, number, number];
  slotPosition: [number, number, number];
  onClick?: () => void;
}

/** Colored algorithm block that slides in/out of the context frame slot. */
export function StrategyBlock({
  color,
  label,
  isInSlot,
  stagedPosition,
  slotPosition,
  onClick,
}: StrategyBlockProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  // Persist current lerped position without causing re-renders
  const posRef = useRef<THREE.Vector3>(
    new THREE.Vector3(...stagedPosition)
  );

  useFrame(() => {
    if (!groupRef.current || !meshRef.current) return;

    const target = isInSlot ? slotPosition : stagedPosition;
    posRef.current.x = THREE.MathUtils.lerp(posRef.current.x, target[0], 0.06);
    posRef.current.y = THREE.MathUtils.lerp(posRef.current.y, target[1], 0.06);
    posRef.current.z = THREE.MathUtils.lerp(posRef.current.z, target[2], 0.06);

    groupRef.current.position.copy(posRef.current);

    const targetScale = isInSlot ? 1.0 : 0.85;
    const s = groupRef.current.scale.x;
    const newScale = THREE.MathUtils.lerp(s, targetScale, 0.06);
    groupRef.current.scale.setScalar(newScale);

    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    const targetOpacity = isInSlot ? 1.0 : 0.7;
    mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, 0.06);

    const targetEmissive = isInSlot ? 0.4 : 0.05;
    mat.emissiveIntensity = THREE.MathUtils.lerp(
      mat.emissiveIntensity,
      targetEmissive,
      0.06
    );
  });

  return (
    <group ref={groupRef} position={stagedPosition} onClick={onClick}>
      <mesh ref={meshRef}>
        <boxGeometry args={[0.8, 0.5, 0.8]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.05}
          transparent
          opacity={0.7}
          metalness={0.4}
          roughness={0.35}
        />
      </mesh>
      <FloatingLabel
        text={label}
        position={[0, 0.5, 0]}
        fontSize={0.16}
        color={isInSlot ? "#ffffff" : "#94a3b8"}
      />
    </group>
  );
}
