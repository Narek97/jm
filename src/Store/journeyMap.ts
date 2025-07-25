import { create } from 'zustand';

import {
  JourneyMapType,
  JourneyMapVersionType,
  MapOutcomeGroupsForRowCreationType,
  MapSelectedPersonasType,
} from '@/Screens/JourneyMapScreen/types.ts';

interface JourneyMapState {
  journeyMap: JourneyMapType;
  defaultJourneyMap: JourneyMapType | null;
  journeyMapRowsCount: number;
  journeyMapVersion: JourneyMapVersionType | null;
  selectedJourneyMapPersona: MapSelectedPersonasType | null;
  isOpenSelectedJourneyMapPersonaInfo: boolean;
  isDragging: boolean;
  createNewRow: {
    isOpenCreateNewRow: boolean;
    rowIndex: number;
  };
  mapAssignedPersonas: MapSelectedPersonasType[];
  mapOutcomeGroups: MapOutcomeGroupsForRowCreationType[];
  updateJourneyMap: (updates: Partial<JourneyMapType>) => void;
  updateDefaultJourneyMap: (updates: JourneyMapType | null) => void;
  updateJourneyMapRowsCount: (count: number) => void;
  updateJourneyMapVersion: (version: JourneyMapVersionType | null) => void;
  updateSelectedJourneyMapPersona: (persona: MapSelectedPersonasType | null) => void;
  updateIsOpenSelectedJourneyMapPersonaInfo: (isOpen: boolean) => void;
  updateIsDragging: (isDragging: boolean) => void;
  updateCreateNewRow: (isOpen: boolean, index: number) => void;
  updateMapAssignedPersonas: (personas: MapSelectedPersonasType[]) => void;
  updateMapOutcomeGroups: (outcomeGroups: MapOutcomeGroupsForRowCreationType[]) => void;
}

export const useJourneyMapStore = create<JourneyMapState>(set => ({
  journeyMap: {
    title: '',
    workspaceId: null,
    columns: [],
    rows: [],
  },
  defaultJourneyMap: null,
  journeyMapRowsCount: 0,
  journeyMapVersion: null,
  selectedJourneyMapPersona: null,
  isOpenSelectedJourneyMapPersonaInfo: false,
  isDragging: false,
  createNewRow: {
    isOpenCreateNewRow: false,
    rowIndex: 0,
  },
  mapAssignedPersonas: [],
  mapOutcomeGroups: [],
  updateJourneyMap: updates =>
    set(state => ({
      journeyMap: { ...state.journeyMap, ...updates },
    })),
  updateDefaultJourneyMap: updates => set({ defaultJourneyMap: updates }),
  updateJourneyMapRowsCount: count => set({ journeyMapRowsCount: count }),
  updateJourneyMapVersion: version => set({ journeyMapVersion: version }),
  updateSelectedJourneyMapPersona: persona => set({ selectedJourneyMapPersona: persona }),
  updateIsOpenSelectedJourneyMapPersonaInfo: isOpen =>
    set({ isOpenSelectedJourneyMapPersonaInfo: isOpen }),
  updateIsDragging: isDragging => set({ isDragging }),
  updateCreateNewRow: (isOpen, index) =>
    set({
      createNewRow: {
        isOpenCreateNewRow: isOpen,
        rowIndex: index,
      },
    }),
  updateMapAssignedPersonas: personas => set({ mapAssignedPersonas: personas }),
  updateMapOutcomeGroups: outcomeGroups => set({ mapOutcomeGroups: outcomeGroups }),
}));
