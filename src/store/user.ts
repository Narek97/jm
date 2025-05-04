import { create } from "zustand";

import { UserType } from "@/types";

type UserStore = {
  user: UserType | null;
  setUser: (user: UserType | null) => void;
  updateUser: (updates: Partial<UserType>) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  updateUser: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    })),
  clearUser: () => set({ user: null }),
}));
