"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type ProductType = "sphere" | "cube" | "torus";

interface ProductProps {
  type: ProductType;
  visible: boolean;
  position: [number, number, number];
  color: string;
}

/** Product that materialises with a smooth scale-in animation. */
export function Product({ type, visible, position, color }: ProductProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const target = visible ? 1 : 0;
    const current = groupRef.current.scale.x;
    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(current, target, Math.min(delta * 5, 1))
    );
  });

  return (
    <group ref={groupRef} position={position} scale={0}>
      {type === "sphere" && (
        <mesh>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} />
        </mesh>
      )}
      {type === "cube" && (
        <mesh>
          <boxGeometry args={[0.65, 0.65, 0.65]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} />
        </mesh>
      )}
      {type === "torus" && (
        <mesh>
          <torusGeometry args={[0.32, 0.12, 8, 24]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} />
        </mesh>
      )}
    </group>
  );
}
