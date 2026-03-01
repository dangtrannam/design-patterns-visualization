"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { usePatternStore } from "@/store/pattern-store";
import { SceneLighting } from "@/scenes/shared/scene-lighting";
import { CameraRig } from "@/scenes/shared/camera-rig";
import type { PatternStep } from "@/content/types";

// ── Placeholder ──────────────────────────────────────────────────────────────

function PlaceholderCube() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    meshRef.current.rotation.y = t * 0.5;
    meshRef.current.rotation.x = t * 0.3;
  });
  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshStandardMaterial
        color="#6366f1"
        emissive="#6366f1"
        emissiveIntensity={0.3}
        wireframe
      />
    </mesh>
  );
}

// ── Scene core: reads store for camera, renders children or placeholder ───────

function SceneCore({
  steps,
  children,
}: {
  steps: PatternStep[];
  children?: React.ReactNode;
}) {
  const currentStep = usePatternStore((s) => s.currentStep);
  const step = steps[currentStep] ?? steps[0];

  return (
    <>
      <SceneLighting />
      <CameraRig
        position={step?.cameraPosition ?? [0, 0, 8]}
        target={step?.cameraTarget ?? [0, 0, 0]}
      />
      {children ?? <PlaceholderCube />}
    </>
  );
}

// ── Public component (dynamically imported with ssr:false in layout) ──────────

interface PatternCanvasProps {
  steps: PatternStep[];
  className?: string;
  children?: React.ReactNode;
}

export function PatternCanvas({ steps, children, className }: PatternCanvasProps) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          <SceneCore steps={steps}>{children}</SceneCore>
        </Suspense>
      </Canvas>
    </div>
  );
}
