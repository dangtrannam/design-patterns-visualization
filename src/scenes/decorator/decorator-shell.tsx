"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { FloatingLabel } from "@/scenes/shared/floating-label";

interface DecoratorShellProps {
  radius: number;
  color: string;
  label: string;
  visible: boolean;
  isPulsing: boolean;
  pulseDelay: number;
  renderOrder: number;
}

/**
 * Semi-transparent concentric sphere shell.
 * Scales in from 0→1 when visible becomes true.
 * Pulses emissive after pulseDelay seconds when isPulsing.
 */
export function DecoratorShell({
  radius,
  color,
  label,
  visible,
  isPulsing,
  pulseDelay,
  renderOrder,
}: DecoratorShellProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const pulseStartRef = useRef<number | null>(null);
  const wasPulsingRef = useRef(false);

  useFrame(({ clock }) => {
    if (!meshRef.current || !matRef.current) return;
    const t = clock.getElapsedTime();

    // Scale lerp: smoothly materialize / dematerialize
    const targetScale = visible ? 1 : 0;
    meshRef.current.scale.setScalar(
      THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.07)
    );

    // Track pulse start to apply delay
    if (isPulsing && !wasPulsingRef.current) {
      pulseStartRef.current = t;
      wasPulsingRef.current = true;
    } else if (!isPulsing) {
      wasPulsingRef.current = false;
      pulseStartRef.current = null;
    }

    // Emissive: base idle breathe + boosted pulse after delay
    const elapsed =
      pulseStartRef.current !== null ? t - pulseStartRef.current : 0;
    const delayPassed = elapsed >= pulseDelay;

    if (isPulsing && delayPassed) {
      const pulse = Math.sin((elapsed - pulseDelay) * 10);
      matRef.current.emissiveIntensity = 0.4 + 0.5 * Math.abs(pulse);
    } else {
      matRef.current.emissiveIntensity = 0.2 + 0.05 * Math.sin(t * 0.9);
    }
  });

  return (
    <group>
      <mesh ref={meshRef} renderOrder={renderOrder}>
        <sphereGeometry args={[radius, 32, 16]} />
        <meshStandardMaterial
          ref={matRef}
          color={color}
          emissive={color}
          emissiveIntensity={0.2}
          transparent
          opacity={0.28}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      {visible && (
        <FloatingLabel
          text={label}
          position={[0, radius + 0.3, 0]}
          fontSize={0.2}
          color={color}
        />
      )}
    </group>
  );
}
