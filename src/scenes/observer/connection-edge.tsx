"use client";

import { useMemo } from "react";
import { Line } from "@react-three/drei";
import * as THREE from "three";

interface ConnectionEdgeProps {
  from: [number, number, number];
  to: [number, number, number];
  color: string;
}

/** Static glowing wire connecting hub to a subscriber node. */
export function ConnectionEdge({ from, to, color }: ConnectionEdgeProps) {
  const points = useMemo(
    () => [new THREE.Vector3(...from), new THREE.Vector3(...to)] as [THREE.Vector3, THREE.Vector3],
    // Spread primitives, not array refs — arrays are new each render but values are stable module constants
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [from[0], from[1], from[2], to[0], to[1], to[2]]
  );

  return <Line points={points} color={color} lineWidth={1} />;
}
