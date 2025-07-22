import { FC, useCallback } from 'react';

import './style.scss';
import 'quill/dist/quill.js';
import 'quill/dist/quill.bubble.css';

import { useWuShowToast } from '@npm-questionpro/wick-ui-lib';
import { v4 as uuidv4 } from 'uuid';

import {
  UpdateItemFlippedTextMutation,
  useUpdateItemFlippedTextMutation,
} from '@/api/mutations/generated/updateItemFlippedText.generated.ts';
import MapEditor from '@/Components/Shared/Editors/MapEditor';
import { debounced800 } from '@/Hooks/useDebounce.ts';
import { useUpdateMap } from '@/Screens/JourneyMapScreen/hooks/useUpdateMap.tsx';
import { useUndoRedoStore } from '@/Store/undoRedo.ts';
import { ActionsEnum, JourneyMapRowActionEnum } from '@/types/enum.ts';

interface IMapRowItemBackCard {
  className: string;
  annotationValue: string | null;
  itemId: number;
  stepId: number;
  rowId: number;
  itemKey: 'boxElements' | 'touchPoints' | 'outcomes' | 'metrics' | 'links';
}
const MapRowItemBackCard: FC<IMapRowItemBackCard> = ({
  className,
  annotationValue = '',
  itemId,
  stepId,
  rowId,
  itemKey,
}) => {
  const { updateMapByType } = useUpdateMap();
  const { showToast } = useWuShowToast();

  const { undoActions, updateUndoActions, updateRedoActions } = useUndoRedoStore();

  const { mutate: mutateItemFlippedText } = useUpdateItemFlippedTextMutation<
    Error,
    UpdateItemFlippedTextMutation
  >({
    onError: error => {
      showToast({
        variant: 'error',
        message: error?.message,
      });
    },
  });

  const onHandleChangeOuterView = useCallback(
    (text: string) => {
      debounced800(() => {
        mutateItemFlippedText(
          {
            updateItemFlippedTextInput: {
              itemId,
              rowId,
              text,
            },
          },
          {
            onSuccess: () => {
              const data = {
                id: itemId,
                stepId,
                rowId,
                itemKey,
                flippedText: text,
                previousFlippedText: annotationValue,
              };
              updateMapByType(JourneyMapRowActionEnum.BACK_CARD, ActionsEnum.UPDATE, data);
              updateRedoActions([]);
              updateUndoActions([
                ...undoActions,
                {
                  id: uuidv4(),
                  type: JourneyMapRowActionEnum.BACK_CARD,
                  action: ActionsEnum.UPDATE,
                  data,
                },
              ]);
            },
          },
        );
      });
    },
    [
      annotationValue,
      itemId,
      itemKey,
      mutateItemFlippedText,
      rowId,
      stepId,
      undoActions,
      updateMapByType,
      updateRedoActions,
      updateUndoActions,
    ],
  );

  return (
    <div className={`map-item-back-card ${className}`}>
      <div className={'map-item-back-card--header'}>
        <p>Flipside</p>
      </div>
      <MapEditor
        itemData={{
          id: itemId,
          rowId,
          stepId,
        }}
        onHandleTextChange={onHandleChangeOuterView}
        initValue={annotationValue || ''}
        isBackCard={true}
      />
    </div>
  );
};

export default MapRowItemBackCard;
