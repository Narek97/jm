import { create } from 'zustand';

type SelectedIdListSetter = number[] | ((prev: number[]) => number[]);

interface OutcomePinBoardsState {
  selectedIdList: number[];
  setSelectedIdList: (idList: SelectedIdListSetter) => void;
}

export const useOutcomePinBoardsStore = create<OutcomePinBoardsState>(set => ({
  selectedIdList: [],
  setSelectedIdList: idList =>
    set(state => ({
      selectedIdList: typeof idList === 'function' ? idList(state.selectedIdList) : idList,
    })),
}));
