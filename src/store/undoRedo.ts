import { create } from 'zustand';

import { ActionsEnum, JourneyMapRowActionEnum, JourneyMapRowTypesEnum } from '@/types/enum.ts';

// Define the action type
interface ActionItem {
  id: string;
  type: JourneyMapRowActionEnum | JourneyMapRowTypesEnum;
  action: ActionsEnum;
  data: any;
  subAction?: ActionsEnum | null;
}

// Define the state shape
interface UndoRedoState {
  undoActions: ActionItem[];
  redoActions: ActionItem[];
  updateUndoActions: (updates: ActionItem[]) => void;
  updateRedoActions: (updates: ActionItem[]) => void;
}

// Create the Zustand store
export const useUndoRedoStore = create<UndoRedoState>(set => ({
  undoActions: [],
  redoActions: [],
  updateUndoActions: updates => set({ undoActions: updates }),
  updateRedoActions: updates => set({ redoActions: updates }),
}));
