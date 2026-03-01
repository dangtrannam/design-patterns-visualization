"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { FloatingLabel } from "@/scenes/shared/floating-label";

interface EventHubProps {
  isEmitting: boolean; // step 1 — fast pulse + scale burst
}

/** Central publisher orb — pulses slowly at idle, bursts on emit. */
export function EventHub({ isEmitting }: EventHubProps) {
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!matRef.current || !meshRef.current) return;
    const t = clock.getElapsedTime();
    if (isEmitting) {
      const pulse = Math.sin(t * 8);
      matRef.current.emissiveIntensity = 0.7 + 0.5 * pulse;
      meshRef.current.scale.setScalar(1 + 0.12 * Math.abs(pulse));
    } else {
      matRef.current.emissiveIntensity = 0.4 + 0.3 * Math.sin(t * 1.5);
      meshRef.current.scale.setScalar(1);
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial
          ref={matRef}
          color="#f97316"
          emissive="#f97316"
          emissiveIntensity={0.4}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>
      <FloatingLabel text="EventEmitter" position={[0, 1.0, 0]} fontSize={0.2} color="#fb923c" />
    </group>
  );
}
