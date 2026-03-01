"use client";

import { usePatternStore } from "@/store/pattern-store";
import { ConveyorBelt } from "./conveyor-belt";
import { MachineStation } from "./machine-station";
import { Product } from "./product";
import { RequestArrow } from "./request-arrow";

const MACHINES = [
  { position: [-3.5, 0, 0] as [number, number, number], label: "ServerApp", color: "#8b5cf6" },
  { position: [0, 0, 0] as [number, number, number], label: "WebApp", color: "#06b6d4" },
  { position: [3.5, 0, 0] as [number, number, number], label: "MobileApp", color: "#f59e0b" },
];

/**
 * Factory Method 3D scene — assembly line metaphor:
 *   Step 0: client request arrow travels toward factory hub
 *   Step 1: WebApp machine activates (factory routes to concrete creator)
 *   Step 2: ConsoleLogger product materialises at output
 */
export function FactoryMethodScene() {
  const currentStep = usePatternStore((s) => s.currentStep);

  const showArrow = currentStep === 0;
  const activeMachine = currentStep === 1 ? 1 : -1; // index 1 = WebApp (concrete creator)
  const showProduct = currentStep === 2;

  return (
    <>
      <ConveyorBelt />
      {MACHINES.map((m, i) => (
        <MachineStation
          key={m.label}
          position={m.position}
          label={m.label}
          isActive={i === activeMachine}
          color={m.color}
        />
      ))}
      <RequestArrow visible={showArrow} />
      <Product
        type="sphere"
        visible={showProduct}
        position={[5.8, 0, 0]}
        color="#06b6d4"
      />
    </>
  );
}
