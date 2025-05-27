import { create } from 'zustand';

type OutcomePinnedBoardIds = { [key: string]: any };

type OutcomePinnedBoardIdsState = {
  outcomePinnedBoardIds: OutcomePinnedBoardIds;
  setOutcomePinnedBoardIds: (
    ids: OutcomePinnedBoardIds | ((prev: OutcomePinnedBoardIds) => OutcomePinnedBoardIds),
  ) => void;
};

export const useOutcomePinnedBoardIdsStore = create<OutcomePinnedBoardIdsState>(set => ({
  outcomePinnedBoardIds: {},

  setOutcomePinnedBoardIds: idsOrUpdater =>
    set(state => ({
      outcomePinnedBoardIds:
        typeof idsOrUpdater === 'function'
          ? idsOrUpdater(state.outcomePinnedBoardIds)
          : idsOrUpdater,
    })),
}));
