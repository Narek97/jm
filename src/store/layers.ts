import { create } from 'zustand';

// Define the state shape
interface LayerState {
  layers: LayerType[];
  currentLayer: LayerType;
  setLayers: (layers: LayerType[]) => void;
  setCurrentLayer: (currentLayer: LayerType) => void;
}

// Create the Zustand store
export const useLayerStore = create<LayerState>(set => ({
  layers: [],
  currentLayer: {
    name: 'Base Layer',
    id: 1,
    isBase: true,
    rowIds: [],
    columnIds: [],
    tagIds: [],
    columnSelectedStepIds: null,
  },
  setLayers: layers => set({ layers }),
  setCurrentLayer: currentLayer => set({ currentLayer }),
}));
