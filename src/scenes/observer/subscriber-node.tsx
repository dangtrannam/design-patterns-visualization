"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { FloatingLabel } from "@/scenes/shared/floating-label";

interface SubscriberNodeProps {
  position: [number, number, number];
  label: string;
  color: string;
  isReacting: boolean; // step 2 — independent reaction pulse
  pulseSpeed?: number; // staggered speeds show independence
}

/** Subscriber orb — reacts with its own pulse speed to show independent handling. */
export function SubscriberNode({
  position,
  label,
  color,
  isReacting,
  pulseSpeed = 5,
}: SubscriberNodeProps) {
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!matRef.current || !meshRef.current) return;
    const t = clock.getElapsedTime();
    if (isReacting) {
      const pulse = Math.sin(t * pulseSpeed);
      matRef.current.emissiveIntensity = 0.55 + 0.45 * pulse;
      meshRef.current.scale.setScalar(1 + 0.1 * Math.abs(pulse));
    } else {
      matRef.current.emissiveIntensity = 0.15 + 0.1 * Math.sin(t * 1.2);
      meshRef.current.scale.setScalar(1);
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.38, 24, 24]} />
        <meshStandardMaterial
          ref={matRef}
          color={color}
          emissive={color}
          emissiveIntensity={0.15}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
      <FloatingLabel text={label} position={[0, 0.7, 0]} fontSize={0.17} color={color} />
    </group>
  );
}
