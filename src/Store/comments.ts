import { create } from 'zustand';

import { NotesAndCommentsDrawerType } from '@/types';

interface NotesAndCommentsDrawerState {
  notesAndCommentsDrawer: NotesAndCommentsDrawerType;
  setNotesAndCommentsDrawer: (state: NotesAndCommentsDrawerType) => void;
  updateNotesAndCommentsDrawer: (state: Partial<NotesAndCommentsDrawerType>) => void;
}

export const useNotesAndCommentsDrawerStore = create<NotesAndCommentsDrawerState>(set => ({
  notesAndCommentsDrawer: {
    title: '',
    isOpen: false,
    itemId: null,
    type: null,
    rowFunction: null,
    stepId: null,
  },
  setNotesAndCommentsDrawer: state => set({ notesAndCommentsDrawer: state }),
  updateNotesAndCommentsDrawer: state =>
    set(prev => ({
      notesAndCommentsDrawer: { ...prev.notesAndCommentsDrawer, ...state },
    })),
}));
