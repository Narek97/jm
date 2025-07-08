import React, { FC, memo, useCallback } from 'react';

import './style.scss';

import axios from 'axios';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { v4 as uuidv4 } from 'uuid';

import CustomLoader from '@/components/molecules/custom-loader/custom-loader';
import { useUpdateMap } from '@/containers/journey-map-container/hooks/useUpdateMap';
import MergeColumnsButton from '@/containers/journey-map-container/journey-map-rows/merge-columns-btn';
import CardInput from '@/containers/journey-map-container/journey-map-rows/row-types/row-text-fields/none-draggable-cards/card-input';
import UnMergeColumnsButton from '@/containers/journey-map-container/journey-map-rows/unmerge-columns-btn';
import { debounced600 } from '@/hooks/useDebounce';
import TextIcon from '@/public/journey-map/text.svg';
import InsightsIcon from '@/public/journey-map/text.svg';
import { journeyMapState } from '@/store/atoms/journeyMap.atom';
import { currentLayerState } from '@/store/atoms/layers.atom';
import { redoActionsState, undoActionsState } from '@/store/atoms/undoRedo.atom';
import { TOKEN_NAME } from '@/utils/constants/general';
import { getCookies } from '@/utils/helpers/cookies';
import { findPreviousBox, getConnectionDetails } from '@/utils/helpers/general';
import {
  ActionsEnum,
  JourneyMapRowActionEnum,
  JourneyMapRowTypesEnum,
} from '@/utils/ts/enums/global-enums';
import { ObjectKeysType } from '@/utils/ts/types/global-types';
import {
  JourneyMapRowType,
  JourneyMapTextAreaRowsType,
} from '@/utils/ts/types/journey-map/journey-map-types';

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

const token = getCookies(TOKEN_NAME);

async function updateBoxElementText(
  updateTextRowInput: { text: string; rowId: number; columnId: number; stepId: number },
  signal: AbortSignal,
) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}`,
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
    const currentLayer = useRecoilValue(currentLayerState);
    const isLayerModeOn = !currentLayer?.isBase;
    const journeyMap = useRecoilValue(journeyMapState);
    const setUndoActions = useSetRecoilState(undoActionsState);
    const setRedoActions = useSetRecoilState(redoActionsState);

    const abortControllerRef = React.useRef<AbortController | null>(null);

    const itemIcon: ObjectKeysType = {
      [JourneyMapRowTypesEnum.TEXT]: <TextIcon />,
      [JourneyMapRowTypesEnum.INSIGHTS]: <InsightsIcon />,
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
            setRedoActions([]);
            setUndoActions(prev => [
              ...prev,
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
      [row.id, setRedoActions, setUndoActions, updateMapByType],
    );

    return (
      <>
        {row?.boxes?.map((rowItem, index) => (
          <React.Fragment key={`text_area_${row?.id}_${index}`}>
            {!!rowItem.mergeCount && (
              <>
                {rowItem.isLoading ? (
                  <div className={'journey-map-row--loading'}>
                    <CustomLoader />
                  </div>
                ) : (
                  <div
                    className={'text-insights'}
                    style={{
                      width: `${rowItem.mergeCount * width + rowItem.mergeCount - 1}px`,
                      minWidth: `${width}px`,
                    }}
                    key={`text_area_${row?.id}_${index}`}>
                    <div className={'text-insights--content'}>
                      <div className={`box-controls-container--blank-type`}>
                        <CardInput
                          rowId={row?.id}
                          icon={itemIcon[type]}
                          headerColor={headerColor}
                          bodyColor={bodyColor}
                          disabled={disabled}
                          rowItem={rowItem}
                          onHandleUpdateBoxElement={onHandleUpdateBoxElement}
                        />
                        {rowItem.mergeCount > 1 && row?.boxes && !isLayerModeOn && (
                          <UnMergeColumnsButton
                            boxIndex={rowItem.mergeCount - 1 + index}
                            rowId={row?.id}
                            rowItem={row.boxes[index + rowItem.mergeCount - 1]}
                            boxes={row?.boxes}
                          />
                        )}
                      </div>
                    </div>

                    {index > 0 && row?.boxes && !isLayerModeOn && (
                      <MergeColumnsButton
                        connectionStart={getConnectionDetails(row.boxes[index - 1], journeyMap)}
                        connectionEnd={getConnectionDetails(rowItem, journeyMap)}
                        rowId={row?.id}
                        previousBoxDetails={findPreviousBox(row.boxes, index)}
                        endStepId={rowItem?.step?.id!}
                        endColumnId={rowItem?.columnId!}
                        endBoxMergeCount={rowItem.mergeCount}
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
