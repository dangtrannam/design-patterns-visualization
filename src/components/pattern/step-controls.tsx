"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePatternStore } from "@/store/pattern-store";

const AUTO_PLAY_MS = 3000;

interface StepControlsProps {
  /** Total number of steps — used to initialize the store on mount. */
  totalSteps: number;
}

export function StepControls({ totalSteps }: StepControlsProps) {
  const {
    currentStep,
    isPlaying,
    nextStep,
    prevStep,
    togglePlay,
    setTotalSteps,
    reset,
  } = usePatternStore();

  // Initialize store when pattern changes
  useEffect(() => {
    setTotalSteps(totalSteps);
    reset();
  }, [totalSteps, setTotalSteps, reset]);

  // Auto-play: advance every AUTO_PLAY_MS when isPlaying
  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(nextStep, AUTO_PLAY_MS);
    return () => clearInterval(id);
  }, [isPlaying, nextStep]);

  // Sync code-block visibility via data-step attribute (CodeBlock is a server component)
  useEffect(() => {
    document.querySelectorAll<HTMLElement>("[data-step]").forEach((el) => {
      el.style.display =
        Number(el.getAttribute("data-step")) === currentStep ? "block" : "none";
    });
  }, [currentStep]);

  const progress = totalSteps > 1 ? (currentStep / (totalSteps - 1)) * 100 : 0;

  return (
    <div className="flex flex-col gap-3">
      {/* Progress bar */}
      <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full bg-indigo-500"
          animate={{ width: `${progress}%` }}
          transition={{ ease: "easeInOut", duration: 0.3 }}
        />
      </div>

      {/* Controls row */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Step {currentStep + 1} / {totalSteps}
        </span>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={prevStep}
            disabled={currentStep === 0}
            aria-label="Previous step"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={nextStep}
            disabled={currentStep === totalSteps - 1}
            aria-label="Next step"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
