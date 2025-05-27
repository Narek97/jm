import { create } from 'zustand';

interface WorkspaceById {
  id: number;
  name: string;
  feedbackId: number;
  // Add other workspace properties
}

interface WorkspaceByIdStore {
  workspaceById: Record<string, WorkspaceById>;
  setWorkspace: (workspace: WorkspaceById) => void;
  removeWorkspace: (id: string) => void;
  clearWorkspaces: () => void;
}

export const useWorkspaceStore = create<WorkspaceByIdStore>(set => ({
  workspaceById: {}, // Initial state: empty object
  setWorkspace: workspace =>
    set(state => ({
      workspaceById: {
        ...state.workspaceById,
        [workspace.id]: workspace,
      },
    })),
  removeWorkspace: id =>
    set(state => {
      const { [id]: _, ...rest } = state.workspaceById;
      return { workspaceById: rest };
    }),
  clearWorkspaces: () => set({ workspaceById: {} }),
}));
