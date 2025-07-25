import React, { FC, memo, ReactNode, useCallback } from 'react';

import './style.scss';

import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

import CardInput from './CardInput';
import UnMergeColumnsButton from '../../../components/UnmergeColumnsBtn';

import InsightsIcon from '@/Assets/public/mapRow/insights.svg';
import TextIcon from '@/Assets/public/mapRow/text.svg';
import BaseWuLoader from '@/Components/Shared/BaseWuLoader';
import { TOKEN_NAME } from '@/Constants';
import { debounced600 } from '@/Hooks/useDebounce.ts';
import MergeColumnsButton from '@/Screens/JourneyMapScreen/components/JourneyMapRows/components/MergeColumnsBtn';
import { findPreviousBox } from '@/Screens/JourneyMapScreen/helpers/findPreviousBox';
import { getConnectionDetails } from '@/Screens/JourneyMapScreen/helpers/getConnectionDetails.ts';
import { useUpdateMap } from '@/Screens/JourneyMapScreen/hooks/useUpdateMap.tsx';
import {
  BoxType,
  JourneyMapRowType,
  JourneyMapTextAreaRowsType,
} from '@/Screens/JourneyMapScreen/types';
import { useJourneyMapStore } from '@/Store/journeyMap.ts';
import { useLayerStore } from '@/Store/layers.ts';
import { useUndoRedoStore } from '@/Store/undoRedo';
import { ObjectKeysType } from '@/types';
import { ActionsEnum, JourneyMapRowActionEnum, JourneyMapRowTypesEnum } from '@/types/enum';
import { getCookie } from '@/utils/cookieHelper.ts';

const UPDATE_BOX_ELEMENT_MUTATION = `
mutation UpdateTextRows($updateTextRowInput: UpdateTextRowInput!) {
  updateTextRows(updateTextRowInput: $updateTextRowInput) {
    id
    columnId
    text
    rowId
    action
    stepId
    previousText
  }
}

`;

const token = getCookie(TOKEN_NAME);

async function updateBoxElementText(
  updateTextRowInput: { text: string; rowId: number; columnId: number; stepId: number },
  signal: AbortSignal,
) {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/graphql`,
      {
        query: UPDATE_BOX_ELEMENT_MUTATION,
        variables: { updateTextRowInput },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        signal,
      },
    );
    return response.data.data.updateTextRows;
  } catch (error) {
    console.error(error);
  }
}

interface INoneDraggableCards {
  row: JourneyMapRowType;
  type: JourneyMapTextAreaRowsType;
  width: number;
  headerColor: string;
  bodyColor: string;
  disabled: boolean;
}

const NoneDraggableCards: FC<INoneDraggableCards> = memo(
  ({ row, type, width, headerColor, bodyColor, disabled }) => {
    const { updateMapByType } = useUpdateMap();

    const { journeyMap } = useJourneyMapStore();
    const { undoActions, updateUndoActions, updateRedoActions } = useUndoRedoStore();
    const { currentLayer } = useLayerStore();

    const isLayerModeOn = !currentLayer?.isBase;

    const abortControllerRef = React.useRef<AbortController | null>(null);

    const itemIcon: ObjectKeysType = {
      [JourneyMapRowTypesEnum.TEXT]: <img src={TextIcon} alt={'Text'} />,
      [JourneyMapRowTypesEnum.INSIGHTS]: <img src={InsightsIcon} alt={'Insights'} />,
    };

    const onHandleUpdateBoxElement = useCallback(
      ({
        previousText,
        value,
        columnId,
        stepId,
      }: {
        previousText: string;
        value: string;
        columnId: number;
        stepId: number;
      }) => {
        // Cancel any existing request
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
        // Create a new AbortController for the new request
        debounced600(async () => {
          abortControllerRef.current = new AbortController();

          try {
            const result = await updateBoxElementText(
              {
                text: value,
                rowId: row.id,
                columnId,
                stepId,
              },
              abortControllerRef.current!.signal,
            );
            updateMapByType(JourneyMapRowActionEnum.BOX_TEXT_ELEMENT, ActionsEnum.UPDATE, result);
            updateRedoActions([]);
            updateUndoActions([
              ...undoActions,
              {
                id: uuidv4(),
                type: JourneyMapRowActionEnum.BOX_TEXT_ELEMENT,
                action: ActionsEnum.UPDATE,
                data: { ...result, previousText },
              },
            ]);
          } catch (error) {
            console.error(error);
          }
        });
      },
      [row.id, undoActions, updateMapByType, updateRedoActions, updateUndoActions],
    );

    return (
      <>
        {row.boxes?.map((boxItem: BoxType, index) => (
          <React.Fragment key={`text_area_${row?.id}_${index}`}>
            {!!boxItem.mergeCount && (
              <>
                {boxItem.isLoading ? (
                  <div className={'journey-map-row--loading'}>
                    <BaseWuLoader />
                  </div>
                ) : (
                  <div
                    className={'text-insights'}
                    style={{
                      width: `${boxItem.mergeCount * width + boxItem.mergeCount - 1}px`,
                      minWidth: `${width}px`,
                    }}
                    key={`text_area_${row?.id}_${index}`}>
                    <div className={'text-insights--content'}>
                      <div className={`box-controls-container--blank-type`}>
                        <CardInput
                          rowId={row?.id}
                          icon={itemIcon[type] as ReactNode}
                          headerColor={headerColor}
                          bodyColor={bodyColor}
                          disabled={disabled}
                          boxItem={boxItem}
                          onHandleUpdateBoxElement={onHandleUpdateBoxElement}
                        />
                        {boxItem.mergeCount > 1 && row?.boxes && !isLayerModeOn && (
                          <UnMergeColumnsButton
                            boxIndex={boxItem.mergeCount - 1 + index}
                            rowId={row?.id}
                            boxItem={row.boxes[index + boxItem.mergeCount - 1]}
                            boxes={row?.boxes}
                          />
                        )}
                      </div>
                    </div>

                    {index > 0 && row?.boxes && !isLayerModeOn && (
                      <MergeColumnsButton
                        connectionStart={getConnectionDetails(row.boxes[index - 1], journeyMap)}
                        connectionEnd={getConnectionDetails(boxItem, journeyMap)}
                        rowId={row?.id}
                        previousBoxDetails={findPreviousBox(row.boxes, index)}
                        endStepId={boxItem.step?.id || 0}
                        endColumnId={boxItem.columnId}
                        endBoxMergeCount={boxItem.mergeCount}
                      />
                    )}
                  </div>
                )}
              </>
            )}
          </React.Fragment>
        ))}
      </>
    );
  },
);

export default NoneDraggableCards;
