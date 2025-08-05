import { useCallback } from 'react';

import { v4 as uuidv4 } from 'uuid';

import { useUpdateMap } from './useUpdateMap';

import { useUndoRedoStore } from '@/Store/undoRedo';
import { ActionsEnum, JourneyMapRowActionEnum } from '@/types/enum';

export const useUpdateSentiment = () => {
  const { updateMapByType } = useUpdateMap();
  const { undoActions, updateUndoActions, updateRedoActions } = useUndoRedoStore();

  const updateSentiment = useCallback(
    (data: any, action: ActionsEnum) => {
      switch (action) {
        case ActionsEnum.UPDATE: {
          updateMapByType(JourneyMapRowActionEnum.SENTIMENT, ActionsEnum.UPDATE, data);
          updateRedoActions([]);
          updateUndoActions([
            ...undoActions,
            {
              id: uuidv4(),
              type: JourneyMapRowActionEnum.SENTIMENT,
              action: ActionsEnum.UPDATE,
              data,
            },
          ]);
          break;
        }
        case ActionsEnum.DISABLE: {
          updateMapByType(JourneyMapRowActionEnum.SENTIMENT, ActionsEnum.DISABLE, data);
          updateRedoActions([]);
          updateUndoActions([
            ...undoActions,
            {
              id: uuidv4(),
              type: JourneyMapRowActionEnum.SENTIMENT,
              action: ActionsEnum.DISABLE,
              data,
            },
          ]);
          break;
        }
      }
    },
    [updateMapByType, updateRedoActions, updateUndoActions, undoActions],
  );

  return { updateSentiment };
};
