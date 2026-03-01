"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface CameraRigProps {
  position: [number, number, number];
  target: [number, number, number];
}

const LERP = 0.05;

/** Scripted camera — lerps position + lookAt each frame. No free orbit. */
export function CameraRig({ position, target }: CameraRigProps) {
  const { camera } = useThree();
  // Scratch vectors — hoisted to avoid allocations inside the frame loop
  const scratchPos = useRef(new THREE.Vector3());
  const currentTarget = useRef(new THREE.Vector3(...target));

  useFrame(() => {
    scratchPos.current.set(...position);
    camera.position.lerp(scratchPos.current, LERP);
    currentTarget.current.lerp(scratchPos.current.set(...target), LERP);
    camera.lookAt(currentTarget.current);
  });

  return null;
}
