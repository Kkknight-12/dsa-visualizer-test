import { create } from 'zustand';
import { SCENARIOS } from '@/lib/scenarios';
import { Scenario, SimulationStep, SystemNode } from '@/types/simulation';

interface SimulationState {
  scenarios: Scenario[];
  currentScenario: Scenario;
  currentStepIndex: number;
  isPlaying: boolean;
  playbackSpeed: number; // 0.5, 1.0, 2.0
  stepProgress: number; // 0 to 1
  selectedNodeId: string | null;
  isCodeDrawerOpen: boolean;
  isInspectorOpen: boolean;
  cameraMode: 'isometric' | 'top' | 'free';

  // Actions
  setScenario: (id: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (index: number) => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  reset: () => void;
  setPlaybackSpeed: (speed: number) => void;
  setStepProgress: (progress: number) => void;
  selectNode: (id: string | null) => void;
  toggleCodeDrawer: () => void;
  toggleInspector: () => void;
  setCameraMode: (mode: 'isometric' | 'top' | 'free') => void;

  // Getters
  getCurrentStep: () => SimulationStep | undefined;
  getSelectedNode: () => SystemNode | undefined;
}

export const useSimulationStore = create<SimulationState>((set, get) => ({
  scenarios: SCENARIOS,
  currentScenario: SCENARIOS[0],
  currentStepIndex: 0,
  isPlaying: false,
  playbackSpeed: 1.0,
  stepProgress: 0,
  selectedNodeId: null,
  isCodeDrawerOpen: true,
  isInspectorOpen: false,
  cameraMode: 'isometric',

  setScenario: (id: string) => {
    const found = SCENARIOS.find((s) => s.id === id);
    if (found) {
      set({
        currentScenario: found,
        currentStepIndex: 0,
        stepProgress: 0,
        isPlaying: false,
        selectedNodeId: null,
      });
    }
  },

  nextStep: () => {
    const { currentScenario, currentStepIndex } = get();
    if (currentStepIndex < currentScenario.steps.length - 1) {
      set({
        currentStepIndex: currentStepIndex + 1,
        stepProgress: 0,
      });
    } else {
      set({ isPlaying: false });
    }
  },

  prevStep: () => {
    const { currentStepIndex } = get();
    if (currentStepIndex > 0) {
      set({
        currentStepIndex: currentStepIndex - 1,
        stepProgress: 0,
      });
    }
  },

  goToStep: (index: number) => {
    const { currentScenario } = get();
    if (index >= 0 && index < currentScenario.steps.length) {
      set({
        currentStepIndex: index,
        stepProgress: 0,
      });
    }
  },

  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

  reset: () =>
    set({
      currentStepIndex: 0,
      stepProgress: 0,
      isPlaying: false,
    }),

  setPlaybackSpeed: (speed: number) => set({ playbackSpeed: speed }),
  setStepProgress: (progress: number) => set({ stepProgress: Math.min(Math.max(progress, 0), 1) }),
  selectNode: (id: string | null) => set({ selectedNodeId: id, isInspectorOpen: Boolean(id) }),
  toggleCodeDrawer: () => set((state) => ({ isCodeDrawerOpen: !state.isCodeDrawerOpen })),
  toggleInspector: () => set((state) => ({ isInspectorOpen: !state.isInspectorOpen })),
  setCameraMode: (mode) => set({ cameraMode: mode }),

  getCurrentStep: () => {
    const { currentScenario, currentStepIndex } = get();
    return currentScenario.steps[currentStepIndex];
  },

  getSelectedNode: () => {
    const { currentScenario, selectedNodeId } = get();
    if (!selectedNodeId) return undefined;
    return currentScenario.nodes.find((n) => n.id === selectedNodeId);
  },
}));
