"use client";

import { usePatternStore } from "@/store/pattern-store";
import { EventHub } from "./event-hub";
import { SubscriberNode } from "./subscriber-node";
import { ConnectionEdge } from "./connection-edge";
import { ParticleStream } from "@/scenes/shared/particle-stream";

const HUB: [number, number, number] = [0, 0, 0];
const RADIUS = 3;

// 4 subscribers at equal angles on the XZ plane
// Different pulse speeds show each observer reacts independently (step 2)
const SUBSCRIBERS = [
  { angle: 0, label: "PriceLogger", color: "#22d3ee", pulseSpeed: 5.0 },
  { angle: Math.PI / 2, label: "PriceAlert", color: "#a78bfa", pulseSpeed: 4.2 },
  { angle: Math.PI, label: "UIWidget", color: "#4ade80", pulseSpeed: 6.1 },
  { angle: (3 * Math.PI) / 2, label: "Mailer", color: "#fb923c", pulseSpeed: 3.7 },
].map((s) => ({
  ...s,
  position: [
    Math.round(Math.cos(s.angle) * RADIUS * 100) / 100,
    0,
    Math.round(Math.sin(s.angle) * RADIUS * 100) / 100,
  ] as [number, number, number],
}));

/**
 * Observer 3D scene — hub-and-spoke pub-sub:
 *   Step 0: idle — nodes + edges visible, no particles
 *   Step 1: hub emits — particles stream outward along all edges
 *   Step 2: subscribers react — each node pulses at its own speed
 */
// Named indices keep step logic readable as content array evolves
const STEP_EMIT = 1;
const STEP_REACT = 2;

export function ObserverScene() {
  const currentStep = usePatternStore((s) => s.currentStep);

  const isEmitting = currentStep === STEP_EMIT;
  const isReacting = currentStep === STEP_REACT;

  return (
    <>
      <EventHub isEmitting={isEmitting} />
      {SUBSCRIBERS.map((sub) => (
        <group key={sub.label}>
          <ConnectionEdge from={HUB} to={sub.position} color={sub.color} />
          <SubscriberNode
            position={sub.position}
            label={sub.label}
            color={sub.color}
            isReacting={isReacting}
            pulseSpeed={sub.pulseSpeed}
          />
          {isEmitting && (
            <ParticleStream
              startPos={HUB}
              endPos={sub.position}
              count={14}
              color={sub.color}
              speed={0.55}
            />
          )}
        </group>
      ))}
    </>
  );
}
