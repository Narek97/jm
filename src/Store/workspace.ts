import { create } from 'zustand';

interface IWorkspaceId {
  id: number;
  name: string;
  feedbackId: number;
}

interface WorkspaceByIdStore {
  workspace: IWorkspaceId | null;
  setWorkspace: (workspace: IWorkspaceId) => void;
  removeWorkspace: (id: number) => void;
  clearWorkspaces: () => void;
}

export const useWorkspaceStore = create<WorkspaceByIdStore>(set => ({
  workspace: null, // Initialize as null to indicate no workspace is set
  setWorkspace: workspace =>
    set(() => ({
      workspace: workspace,
    })),
  removeWorkspace: id =>
    set(state => ({
      workspace: state.workspace?.id === id ? null : state.workspace,
    })),
  clearWorkspaces: () => set({ workspace: null }),
}));
