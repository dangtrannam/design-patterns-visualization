"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ParticleStreamProps {
  startPos: [number, number, number];
  endPos: [number, number, number];
  count?: number;
  color?: string;
  speed?: number;
}

/** Particles that travel continuously from startPos → endPos. */
export function ParticleStream({
  startPos,
  endPos,
  count = 20,
  color = "#818cf8",
  speed = 0.5,
}: ParticleStreamProps) {
  const pointsRef = useRef<THREE.Points>(null);

  // Phase offset per particle so they're staggered along the path
  const offsets = useMemo(
    () => Float32Array.from({ length: count }, (_, i) => i / count),
    [count]
  );

  const initPositions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const start = new THREE.Vector3(...startPos);
    const end = new THREE.Vector3(...endPos);
    for (let i = 0; i < count; i++) {
      const p = start.clone().lerp(end, offsets[i]);
      pos[i * 3] = p.x;
      pos[i * 3 + 1] = p.y;
      pos[i * 3 + 2] = p.z;
    }
    return pos;
  }, [startPos, endPos, count, offsets]);

  // Scratch vectors — hoisted to avoid per-frame allocations
  const scratchStart = useRef(new THREE.Vector3());
  const scratchEnd = useRef(new THREE.Vector3());
  const scratchP = useRef(new THREE.Vector3());

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const attr = pointsRef.current.geometry.getAttribute(
      "position"
    ) as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    const t = clock.getElapsedTime() * speed;
    scratchStart.current.set(...startPos);
    scratchEnd.current.set(...endPos);

    for (let i = 0; i < count; i++) {
      const progress = (offsets[i] + t) % 1;
      scratchP.current.copy(scratchStart.current).lerp(scratchEnd.current, progress);
      arr[i * 3] = scratchP.current.x;
      arr[i * 3 + 1] = scratchP.current.y;
      arr[i * 3 + 2] = scratchP.current.z;
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[initPositions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.06}
        sizeAttenuation
        transparent
        opacity={0.8}
      />
    </points>
  );
}
