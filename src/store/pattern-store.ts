import { create } from "zustand";

interface PatternState {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  setStep: (step: number) => void;
  setTotalSteps: (total: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  togglePlay: () => void;
  reset: () => void;
}

export const usePatternStore = create<PatternState>((set, get) => ({
  currentStep: 0,
  totalSteps: 0,
  isPlaying: false,
  setStep: (step) => set({ currentStep: step }),
  setTotalSteps: (total) => set({ totalSteps: total }),
  nextStep: () => {
    const { currentStep, totalSteps } = get();
    if (currentStep < totalSteps - 1) set({ currentStep: currentStep + 1 });
  },
  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 0) set({ currentStep: currentStep - 1 });
  },
  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),
  reset: () => set({ currentStep: 0, isPlaying: false }),
}));
