"use client";

/** Ambient + directional + accent point lights — place inside R3F Canvas */
export function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />
      <pointLight position={[-8, -8, -5]} intensity={0.4} color="#6366f1" />
    </>
  );
}
