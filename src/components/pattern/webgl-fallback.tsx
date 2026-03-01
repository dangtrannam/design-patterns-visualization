"use client";

import { useDetectGPU } from "@react-three/drei";

interface WebGLFallbackProps {
  children: React.ReactNode;
}

/** Wraps the 3D canvas — shows a message card on tier-0 (unsupported) devices. */
export function WebGLFallback({ children }: WebGLFallbackProps) {
  const gpu = useDetectGPU();

  // tier is undefined while detection runs; treat undefined + 0 both as unsupported
  if (!gpu.tier) {
    return (
      <div className="flex h-[500px] items-center justify-center rounded-lg border border-white/10 bg-black/20 text-center">
        <div className="space-y-2 px-6">
          <p className="text-lg font-medium text-muted-foreground">
            3D visualization unavailable
          </p>
          <p className="text-sm text-muted-foreground/60">
            Your device doesn&apos;t support WebGL 2. Please view on a modern
            desktop browser.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
