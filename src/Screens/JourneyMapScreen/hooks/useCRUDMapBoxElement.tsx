import { useCallback } from 'react';

import { v4 as uuidv4 } from 'uuid';

import { useUpdateMap } from '@/Screens/JourneyMapScreen/hooks/useUpdateMap.tsx';
import { useUndoRedoStore } from '@/store/undoRedo.ts';
import { ActionsEnum, JourneyMapRowActionEnum } from '@/types/enum';

export const useCrudMapBoxElement = () => {
  const { updateMapByType } = useUpdateMap();
  const { undoActions, updateUndoActions, updateRedoActions } = useUndoRedoStore();

  const crudBoxElement = useCallback(
    (data: any, action: ActionsEnum) => {
      switch (action) {
        case ActionsEnum.CREATE: {
          updateMapByType(JourneyMapRowActionEnum.BOX_ELEMENT, ActionsEnum.CREATE, data);
          updateRedoActions([]);
          updateUndoActions([
            ...undoActions,
            {
              id: uuidv4(),
              type: JourneyMapRowActionEnum.BOX_ELEMENT,
              action: ActionsEnum.DELETE,
              data,
            },
          ]);
          break;
        }
        case ActionsEnum.UPDATE: {
          updateMapByType(JourneyMapRowActionEnum.BOX_ELEMENT, ActionsEnum.UPDATE, data);
          updateRedoActions([]);
          updateUndoActions([
            ...undoActions,
            {
              id: uuidv4(),
              type: JourneyMapRowActionEnum.BOX_ELEMENT,
              action: ActionsEnum.UPDATE,
              data,
            },
          ]);
          break;
        }
        case ActionsEnum.DELETE: {
          updateMapByType(JourneyMapRowActionEnum.BOX_ELEMENT, ActionsEnum.DELETE, data);
          updateRedoActions([]);
          updateUndoActions([
            ...undoActions,
            {
              id: uuidv4(),
              type: JourneyMapRowActionEnum.BOX_ELEMENT,
              action: ActionsEnum.CREATE,
              data,
            },
          ]);
          break;
        }
      }
    },
    [undoActions, updateMapByType, updateRedoActions, updateUndoActions],
  );

  return { crudBoxElement };
};
