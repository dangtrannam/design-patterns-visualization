"use client";

import { usePatternStore } from "@/store/pattern-store";
import { ContextFrame } from "./context-frame";
import { StrategyBlock } from "./strategy-block";
import { OutputIndicator } from "./output-indicator";
import { SceneLighting } from "@/scenes/shared/scene-lighting";
import { CameraRig } from "@/scenes/shared/camera-rig";

const STRATEGIES = [
  { label: "BubbleSort", color: "#3b82f6" },
  { label: "QuickSort",  color: "#22c55e" },
  { label: "MergeSort",  color: "#f97316" },
];

const STAGED_POSITIONS: [number, number, number][] = [
  [-4, 1.2, 0],
  [-4, 0,   0],
  [-4, -1.2, 0],
];

const SLOT_POS: [number, number, number] = [0, 0.2, 0];

// Camera positions per step
const CAMERA_POSITIONS: [number, number, number][] = [
  [0, 5, 10],
  [5, 5, 6],
  [0, 5, 10],
];

/**
 * Strategy 3D scene — slot-and-block metaphor:
 *   Step 0: BubbleSort block in slot, others staged left
 *   Step 1: Context delegates to BubbleSort (output = blue)
 *   Step 2: QuickSort swapped in, output changes to green
 */
export function StrategyScene() {
  const currentStep = usePatternStore((s) => s.currentStep);

  // Step 2 → BlockB (QuickSort) is in slot; steps 0–1 → BlockA (BubbleSort) is in slot
  const activeIndex = currentStep === 2 ? 1 : 0;

  // Output color tracks active strategy
  const activeStrategy = (currentStep === 2 ? 1 : 0) as 0 | 1 | 2;

  const camPos = CAMERA_POSITIONS[Math.min(currentStep, 2)];

  return (
    <>
      <SceneLighting />
      <CameraRig position={camPos} target={[0, 0, 0]} />

      <ContextFrame />

      {STRATEGIES.map((strategy, i) => (
        <StrategyBlock
          key={strategy.label}
          color={strategy.color}
          label={strategy.label}
          isInSlot={i === activeIndex}
          stagedPosition={STAGED_POSITIONS[i]}
          slotPosition={SLOT_POS}
        />
      ))}

      <OutputIndicator activeStrategy={activeStrategy} />
    </>
  );
}
