import { create } from 'zustand';

import {
  LayerStagesAndLanesType,
  LayerStagesStepsType,
} from '@/Screens/JourneyMapScreen/components/JourneyMapHeader/types.ts';
import { LayerType } from '@/Screens/JourneyMapScreen/types.ts';

interface LayerState {
  layers: LayerType[];
  currentLayer: LayerType;
  stagesStepsForLayer: LayerStagesStepsType;
  stagesAndLanesForLayer: LayerStagesAndLanesType;
  setLayers: (layers: LayerType[]) => void;
  setCurrentLayer: (currentLayer: LayerType) => void;
  setStagesStepsForLayer: (stagesSteps: LayerStagesStepsType) => void;
  setStagesAndLanesForLayer: (stagesAndLanesForLayer: LayerStagesAndLanesType) => void;
}

// Create the Zustand store
export const useLayerStore = create<LayerState>(set => ({
  layers: [],
  currentLayer: {
    id: 1,
    name: 'Base Layer',
    isBase: true,
    rowIds: [],
    columnIds: [],
    tagIds: [],
    columnSelectedStepIds: null,
  },
  stagesStepsForLayer: {},
  stagesAndLanesForLayer: { stages: [], lanes: [], steps: null },
  setLayers: layers => set({ layers }),
  setCurrentLayer: currentLayer => set({ currentLayer }),
  setStagesStepsForLayer: stagesSteps => set({ stagesStepsForLayer: stagesSteps }),
  setStagesAndLanesForLayer: stagesAndLanesForLayer => set({ stagesAndLanesForLayer }),
}));
