"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";

interface AnimatedArrowProps {
  from: [number, number, number];
  to: [number, number, number];
  color?: string;
  speed?: number;
}

/** Directional arrow with pulsing opacity — shows data/control flow. */
export function AnimatedArrow({
  from,
  to,
  color = "#a5b4fc",
  speed = 1,
}: AnimatedArrowProps) {
  const coneRef = useRef<THREE.Mesh>(null);

  const { linePoints, conePos, quaternion } = useMemo(() => {
    const start = new THREE.Vector3(...from);
    const end = new THREE.Vector3(...to);
    const dir = end.clone().sub(start).normalize();

    // Shorten shaft so it doesn't overlap the arrowhead
    const shaftEnd = end.clone().sub(dir.clone().multiplyScalar(0.22));
    const conePosition = end.clone().sub(dir.clone().multiplyScalar(0.11));

    // Rotate default Y-up cone to face the direction
    const q = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dir
    );

    return {
      linePoints: [start, shaftEnd] as [THREE.Vector3, THREE.Vector3],
      conePos: conePosition.toArray() as [number, number, number],
      quaternion: q,
    };
  }, [from, to]);

  useFrame(({ clock }) => {
    if (!coneRef.current) return;
    const t = clock.getElapsedTime() * speed;
    (coneRef.current.material as THREE.MeshBasicMaterial).opacity =
      0.5 + 0.5 * Math.sin(t);
  });

  return (
    <group>
      <Line points={linePoints} color={color} lineWidth={2} />
      <mesh ref={coneRef} position={conePos} quaternion={quaternion}>
        <coneGeometry args={[0.08, 0.22, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.8} />
      </mesh>
    </group>
  );
}
