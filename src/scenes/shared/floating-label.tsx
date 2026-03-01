"use client";

import { Text } from "@react-three/drei";

interface FloatingLabelProps {
  text: string;
  position: [number, number, number];
  fontSize?: number;
  color?: string;
}

/** Billboard text label — always faces the camera */
export function FloatingLabel({
  text,
  position,
  fontSize = 0.22,
  color = "#e2e8f0",
}: FloatingLabelProps) {
  return (
    <Text
      position={position}
      fontSize={fontSize}
      color={color}
      anchorX="center"
      anchorY="middle"
    >
      {text}
    </Text>
  );
}
