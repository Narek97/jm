import { create } from 'zustand';

interface WorkspaceById {
  id: number;
  name: string;
  feedbackId: number;
}

interface WorkspaceByIdStore {
  workspaceById: WorkspaceById | null;
  setWorkspace: (workspace: WorkspaceById) => void;
  removeWorkspace: (id: number) => void;
  clearWorkspaces: () => void;
}

export const useWorkspaceStore = create<WorkspaceByIdStore>(set => ({
  workspaceById: null, // Initialize as null to indicate no workspace is set
  setWorkspace: workspace =>
    set(() => ({
      workspaceById: workspace,
    })),
  removeWorkspace: id =>
    set(state => ({
      workspaceById: state.workspaceById?.id === id ? null : state.workspaceById,
    })),
  clearWorkspaces: () => set({ workspaceById: null }),
}));
