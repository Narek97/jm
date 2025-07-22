import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

import { CommentAndNoteModelsEnum } from '@/api/types.ts';
import { NoteType } from '@/types';

type NoteKey = `${CommentAndNoteModelsEnum}_${number}`;

interface NoteState {
  notes: Record<NoteKey, NoteType | null>;
  getNote: (type: CommentAndNoteModelsEnum, id: number) => NoteType | null;
  setNote: (type: CommentAndNoteModelsEnum, id: number, note: NoteType | null) => void;
  removeNote: (type: CommentAndNoteModelsEnum, id: number) => void;
  clearNotes: () => void;
}

const createNoteKey = (type: CommentAndNoteModelsEnum, id: number): NoteKey => `${type}_${id}`;

export const useNoteStore = create<NoteState>()(
  subscribeWithSelector((set, get) => ({
    notes: {},

    getNote: (type, id) => {
      const key = createNoteKey(type, id);
      return get().notes[key] ?? null;
    },

    setNote: (type, id, note) => {
      const key = createNoteKey(type, id);
      set(state => ({
        notes: {
          ...state.notes,
          [key]: note,
        },
      }));
    },

    removeNote: (type, id) => {
      const key = createNoteKey(type, id);
      set(state => {
        const { [key]: _, ...rest } = state.notes;
        return { notes: rest };
      });
    },

    clearNotes: () => {
      set({ notes: {} });
    },
  })),
);

// Helper hooks for easier usage
export const useNote = (type: CommentAndNoteModelsEnum, id: number) => {
  return useNoteStore(state => state.getNote(type, id));
};

// Extract actions to avoid recreating object on every render
export const useSetNote = () => useNoteStore(state => state.setNote);
export const useRemoveNote = () => useNoteStore(state => state.removeNote);
export const useClearNotes = () => useNoteStore(state => state.clearNotes);
