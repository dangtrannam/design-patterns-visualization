"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { usePatternStore } from "@/store/pattern-store";
import { CoreObject } from "./core-object";
import { DecoratorShell } from "./decorator-shell";
import { CameraRig } from "@/scenes/shared/camera-rig";
import { SceneLighting } from "@/scenes/shared/scene-lighting";

type CameraPos = [number, number, number];

const CAMERA_POSITIONS: CameraPos[] = [
  [0, 5, 8],   // step 0: bare component
  [0, 6, 10],  // step 1: SMS shell materialises
  [0, 7, 12],  // step 2: Slack shell materialises
  [6, 7, 8],   // step 3: pulse wave fires
];

const CAMERA_TARGET: CameraPos = [0, 0, 0];

/**
 * Decorator 3D scene — concentric shells metaphor:
 *   Step 0: bare core sphere only
 *   Step 1: SMS/cyan shell materialises around core
 *   Step 2: Slack/purple shell materialises around SMS shell
 *   Step 3: sequential pulse wave — core → shell1 (0.35s) → shell2 (0.7s), cycle ~2s
 */
export function DecoratorScene() {
  const currentStep = usePatternStore((s) => s.currentStep);

  // Track elapsed time since entering step 3 for pulse sequencing
  const pulseClockRef = useRef(0);
  const prevStepRef = useRef(currentStep);

  useEffect(() => {
    if (currentStep !== prevStepRef.current) {
      pulseClockRef.current = 0;
      prevStepRef.current = currentStep;
    }
  }, [currentStep]);

  useFrame((_, delta) => {
    if (currentStep === 3) {
      pulseClockRef.current += delta;
    }
  });

  // Visibility
  const shell1Visible = currentStep >= 1;
  const shell2Visible = currentStep >= 2;

  // Step 3 pulse windows (cycled every 2s)
  const t = pulseClockRef.current;
  const cycle = t % 2.0;

  const coreIsPulsing = currentStep === 3 && cycle < 0.5;
  const shell1IsPulsing = currentStep === 3 && cycle > 0.35 && cycle < 0.85;
  const shell2IsPulsing = currentStep === 3 && cycle > 0.7 && cycle < 1.2;

  const cameraPos = CAMERA_POSITIONS[Math.min(currentStep, 3)];

  return (
    <>
      <SceneLighting />
      <CameraRig position={cameraPos} target={CAMERA_TARGET} />

      <CoreObject isPulsing={coreIsPulsing} />

      <DecoratorShell
        radius={0.9}
        color="#22d3ee"
        label="SMS"
        visible={shell1Visible}
        isPulsing={shell1IsPulsing}
        pulseDelay={0}
        renderOrder={1}
      />

      <DecoratorShell
        radius={1.5}
        color="#a78bfa"
        label="Slack"
        visible={shell2Visible}
        isPulsing={shell2IsPulsing}
        pulseDelay={0.3}
        renderOrder={2}
      />
    </>
  );
}
