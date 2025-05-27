import { create } from 'zustand';

import { CopyMapLevelTemplateEnum } from '@/types/enum.ts';

interface CopyMapState {
  orgId: number | null;
  mapId: number | null;
  workspaceId: number | null;
  boardId: number | null;
  template: CopyMapLevelTemplateEnum;
  isProcessing: boolean;
  setCopyMapState: (newState: Partial<CopyMapState>) => void;
  reset: () => void;
}

export const useCopyMapStore = create<CopyMapState>(set => ({
  orgId: null,
  mapId: null,
  workspaceId: null,
  boardId: null,
  template: CopyMapLevelTemplateEnum.WORKSPACES,
  isProcessing: false,
  setCopyMapState: newState =>
    set(state => ({
      ...state,
      ...newState,
    })),
  reset: () =>
    set({
      orgId: null,
      mapId: null,
      workspaceId: null,
      boardId: null,
      template: CopyMapLevelTemplateEnum.WORKSPACES,
      isProcessing: false,
    }),
}));
