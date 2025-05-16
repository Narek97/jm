import { create } from "zustand";

interface OutcomePinBoardsState {
  selectedIdList: number[];
  setSelectedIdList: (idList: number[]) => void;
}

export const useOutcomePinBoardsStore = create<OutcomePinBoardsState>(
  (set) => ({
    selectedIdList: [],
    setSelectedIdList: (idList) => set({ selectedIdList: idList }),
  }),
);
