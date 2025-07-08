import React, { FC, memo, useCallback } from 'react';

import './style.scss';

import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { useWuShowToast } from '@npm-questionpro/wick-ui-lib';
import { useQueryClient } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';

import { FieldExtractor } from '../../helpers/fieldExtractor';
import { onDragEndMap } from '../../helpers/onDragEndMap';
import { useUpdateMap } from '../../hooks/useUpdateMap';

import {
  CompareJourneyMapJsonMutation,
  useCompareJourneyMapJsonMutation,
} from '@/api/mutations/generated/compareJourneyMapJson.generated.ts';
import {
  CreateUpdateOutcomeMutation,
  useCreateUpdateOutcomeMutation,
} from '@/api/mutations/generated/createUpdateOutcome.generated';
import {
  UpdateBoxElementMutation,
  useUpdateBoxElementMutation,
} from '@/api/mutations/generated/updateBoxElement.generated.ts';
import {
  UpdateJourneyMapRowMutation,
  useUpdateJourneyMapRowMutation,
} from '@/api/mutations/generated/updateJourneyMapRow.generated.ts';
import {
  UpdateMapLinkMutation,
  useUpdateMapLinkMutation,
} from '@/api/mutations/generated/updateLink.generated';
import {
  UpdateMetricsMutation,
  useUpdateMetricsMutation,
} from '@/api/mutations/generated/updateMetrics.generated';
import {
  UpdateTouchPointMutation,
  useUpdateTouchPointMutation,
} from '@/api/mutations/generated/updateTouchPoint.generated.ts';
import { MapRowTypeEnum, UpdateOutcomePositionInput } from '@/api/types';
import CustomLoader from '@/Components/Shared/CustomLoader';
import EmptyDataInfo from '@/Components/Shared/EmptyDataInfo';
import { debounced400 } from '@/hooks/useDebounce';
import JourneyMapSentimentRow from '@/Screens/JourneyMapScreen/components/JourneyMapRows/JourneyMapSentimentRow';
import { useJourneyMapStore } from '@/store/journeyMap';
import { useLayerStore } from '@/store/layers.ts';
import { useUndoRedoStore } from '@/store/undoRedo';
import { ActionsEnum, JourneyMapRowActionEnum, JourneyMapRowTypesEnum } from '@/types/enum';
import { getPageContentByKey } from '@/utils/getPageContentByKey.ts';
import { scrollNeighbours } from '@/utils/scrollNeighbours.ts';

interface IJourneyMapRows {
  isGuest: boolean;
  isPdfVersion?: boolean;
  isFetchingNextPageJourneyMapRows: boolean;
  onHandleFetchNextPageJourneyMapRows: () => void;
}

const JourneyMapRows: FC<IJourneyMapRows> = memo(
  ({
    isGuest,
    isPdfVersion,
    isFetchingNextPageJourneyMapRows,
    onHandleFetchNextPageJourneyMapRows,
  }) => {
    const queryClient = useQueryClient();
    const { updateMapByType } = useUpdateMap();

    const { journeyMap, journeyMapRowsCount, updateJourneyMap, updateIsDragging } =
      useJourneyMapStore();
    const { currentLayer } = useLayerStore();
    const { undoActions, updateUndoActions, updateRedoActions } = useUndoRedoStore();

    const { showToast } = useWuShowToast();

    const { mutate: updateRow } = useUpdateJourneyMapRowMutation<
      Error,
      UpdateJourneyMapRowMutation
    >();

    const { mutate: compareJourneyMap } = useCompareJourneyMapJsonMutation<
      Error,
      CompareJourneyMapJsonMutation
    >();
    const { mutate: updateBoxElement } = useUpdateBoxElementMutation<
      Error,
      UpdateBoxElementMutation
    >();
    const { mutate: creatUpdateOutcome } = useCreateUpdateOutcomeMutation<
      Error,
      CreateUpdateOutcomeMutation
    >();
    const { mutate: mutateUpdateMetrics } = useUpdateMetricsMutation<
      Error,
      UpdateMetricsMutation
    >();
    const { mutate: mutateTouchPoint } = useUpdateTouchPointMutation<
      Error,
      UpdateTouchPointMutation
    >();
    const { mutate: mutateLink } = useUpdateMapLinkMutation<Error, UpdateMapLinkMutation>();

    const updateRowByFieldName = useCallback(
      ({
        fieldName,
        fieldValue,
        rowId,
        callback,
      }: {
        fieldName: string;
        fieldValue: string | number;
        rowId: number;
        callback?: () => void;
      }) => {
        updateRow(
          {
            updateRowInput: {
              rowId,
              [fieldName]: fieldValue,
            },
          },
          {
            onSuccess: () => {
              if (callback) {
                callback();
              }
            },
          },
        );
      },
      [updateRow],
    );

    const onDragstart = useCallback(() => {
      updateIsDragging(true);
    }, [updateIsDragging]);

    const updateDataBetweenDifferentRows = useCallback(
      (result: any) => {
        const destData = result?.destination?.droppableId?.split('*');
        const source = result?.source?.droppableId?.split('*');

        const destinationData = {
          rowIndex: destData[1],
          id: destData[2],
          boxIndex: destData[3],
          stepId: +destData[4],
          childIndex: result?.destination?.index,
        };
        const sourceData = {
          rowIndex: source[1],
          id: source[2],
          boxIndex: source[3],
          stepId: +source[4],
          childIndex: result?.source?.index,
        };

        const dropData = onDragEndMap(
          {
            source: {
              droppableId: sourceData?.boxIndex,
              index: sourceData?.childIndex,
              rowIndex: sourceData?.rowIndex,
            },
            destination: {
              droppableId: destinationData?.boxIndex,
              index: destinationData?.childIndex,
              rowIndex: destinationData?.rowIndex,
            },
          },
          !(sourceData?.id === destinationData?.id),
          result?.type,
          journeyMap.rows,
        );

        const undoType = {
          [result?.type]: result?.type,
          CONS: 'BOX_ELEMENT',
          PROS: 'BOX_ELEMENT',
          INTERACTIONS: 'BOX_ELEMENT',
          LIST_ITEM: 'BOX_ELEMENT',
        };

        updateRedoActions([]);
        updateUndoActions([
          ...undoActions,
          {
            id: uuidv4(),
            type: undoType[result?.type],
            action: ActionsEnum.DRAG,
            data: {
              id: dropData?.dragItem?.id,
              isDroppedAnotherRow: !(sourceData?.id === destinationData?.id),
              source: {
                droppableId: destinationData?.boxIndex,
                index: destinationData?.childIndex,
                rowIndex: destinationData?.rowIndex,
              },
              destination: {
                droppableId: sourceData?.boxIndex,
                index: sourceData?.childIndex,
                rowIndex: sourceData?.rowIndex,
              },
              undoPositionInput: {
                index: sourceData?.childIndex + 1,
                columnId: dropData?.initialColumnId,
                rowId: dropData?.initialRowId,
                stepId: dropData?.initialsSepId,
              },
            },
          },
        ]);

        if (dropData) {
          switch (result?.type) {
            case MapRowTypeEnum.Touchpoints: {
              mutateTouchPoint(
                {
                  updateTouchPointInput: {
                    id: dropData?.dragItem?.id,
                    positionInput: {
                      index: destinationData?.childIndex + 1,
                      columnId: dropData.dragItem.columnId,
                      rowId: dropData.dragItem.rowId,
                      stepId: destinationData.stepId,
                    },
                  },
                },
                {
                  onSuccess: () => {},
                },
              );
              break;
            }
            case MapRowTypeEnum.Outcomes: {
              let positionInput: UpdateOutcomePositionInput = {
                index: destinationData?.childIndex + 1,
              };
              if (
                (sourceData?.rowIndex === destinationData?.rowIndex &&
                  sourceData?.boxIndex !== destinationData?.boxIndex) ||
                sourceData?.rowIndex !== destinationData?.rowIndex
              ) {
                const positionChange: {
                  stepId: number;
                  rowId?: number;
                  columnId?: number;
                } = {
                  stepId: dropData.dragItem.stepId,
                  rowId: dropData.dragItem.rowId,
                  columnId: dropData?.dragItem.columnId,
                };

                positionInput = {
                  index: destinationData?.childIndex + 1,
                  positionChange,
                };
              }

              creatUpdateOutcome(
                {
                  createUpdateOutcomeInput: {
                    updateOutcomeInput: {
                      id: dropData?.dragItem?.id as number,
                      positionInput,
                    },
                  },
                },
                {
                  onSuccess: () => {},
                },
              );
              break;
            }
            case MapRowTypeEnum.Metrics: {
              mutateUpdateMetrics(
                {
                  updateMetricsInput: {
                    id: dropData?.dragItem?.id as number,
                    positionInput: {
                      index: destinationData?.childIndex + 1,
                      columnId: dropData.dragItem.columnId,
                      rowId: dropData.dragItem.rowId,
                      stepId: destinationData.stepId,
                    },
                  },
                },
                {
                  onSuccess: () => {},
                },
              );
              break;
            }
            case MapRowTypeEnum.Links: {
              mutateLink(
                {
                  editLinkInput: {
                    id: dropData?.dragItem?.id as number,
                    positionInput: {
                      index: destinationData?.childIndex + 1,
                      columnId: dropData.dragItem.columnId,
                      rowId: dropData.dragItem.rowId,
                      stepId: destinationData.stepId,
                    },
                  },
                },
                {
                  onSuccess: () => {},
                },
              );
              break;
            }
            default: {
              updateBoxElement(
                {
                  updateBoxDataInput: {
                    boxElementId: dropData?.dragItem?.id as number,
                    positionInput: {
                      index: destinationData?.childIndex + 1,
                      columnId: dropData.dragItem.columnId,
                      rowId: dropData.dragItem.rowId,
                      stepId: destinationData.stepId,
                    },
                  },
                },
                {
                  onSuccess: () => {},
                },
              );
              break;
            }
          }
          updateJourneyMap({
            rows: dropData.rows,
          });
        }
      },
      [
        creatUpdateOutcome,
        journeyMap.rows,
        mutateLink,
        mutateTouchPoint,
        mutateUpdateMetrics,
        undoActions,
        updateBoxElement,
        updateJourneyMap,
        updateRedoActions,
        updateUndoActions,
      ],
    );

    const onRowDragEnd = useCallback(
      (result: any) => {
        updateIsDragging(false);
        const { source, destination } = result;
        if (!destination) return;

        if (
          destination.droppableId === source.droppableId &&
          destination?.index === source?.index
        ) {
          return;
        }

        switch (result?.type) {
          case 'rows_group': {
            const sourceItems = [...journeyMap.rows];

            const [draggedItem] = sourceItems.splice(result.source.index, 1);
            sourceItems.splice(result.destination.index, 0, draggedItem);
            updateJourneyMap({
              rows: sourceItems,
            });

            updateRedoActions([]);
            updateUndoActions([
              ...undoActions,
              {
                id: uuidv4(),
                type: JourneyMapRowActionEnum.ROW,
                action: ActionsEnum.DRAG,
                data: {
                  destinationIndex: result.destination.index,
                  sourceIndex: result.source.index,
                  draggedItem,
                },
              },
            ]);

            const extractor = new FieldExtractor(sourceItems);

            // Specify top-level fields and box fields
            const selectedFields = extractor.extractFields(
              ['label', 'rowFunction', 'boxes'],
              ['columnId', 'step', 'boxElements', 'links', 'metrics', 'outcomes', 'touchPoints'], // Specify which fields to extract from each box
            );

            const queries = queryClient.getQueriesData({
              queryKey: ['GetJourneyMapRows.infinite'],
              exact: true,
            });
            const lastQuery = queries[queries.length - 1];
            const lastVariables = lastQuery?.[1];

            updateRowByFieldName({
              fieldName: 'index',
              fieldValue: destination?.index + 1,
              rowId: draggedItem?.id,
              callback: () => {
                compareJourneyMap(
                  {
                    compareJourneyMapJsonInput: {
                      frontJsonHash: JSON.stringify(selectedFields),
                      getJourneyMapInput: lastVariables!,
                    },
                  },
                  {
                    onSuccess: data => {
                      if (data?.compareJourneyMapJson?.id) {
                        showToast({
                          variant: 'warning',
                          message: `Something went wrong! | ID: ${data?.compareJourneyMapJson?.id}`,
                        });
                      }
                    },
                  },
                );
              },
            });

            break;
          }
          default:
            updateDataBetweenDifferentRows(result);
        }
      },
      [
        compareJourneyMap,
        journeyMap.rows,
        queryClient,
        showToast,
        undoActions,
        updateDataBetweenDifferentRows,
        updateIsDragging,
        updateJourneyMap,
        updateRedoActions,
        updateRowByFieldName,
        updateUndoActions,
      ],
    );

    const updateLabel = ({
      rowId,
      previousLabel,
      label,
    }: {
      rowId: number;
      previousLabel: string;
      label: string;
    }) => {
      debounced400(() => {
        const data = {
          rowId,
          previousLabel,
          label,
        };

        updateMapByType(JourneyMapRowActionEnum.ROW_LABEL, ActionsEnum.UPDATE, data);
        updateRedoActions([]);
        updateUndoActions([
          ...undoActions,
          {
            id: uuidv4(),
            type: JourneyMapRowActionEnum.ROW_LABEL,
            action: ActionsEnum.UPDATE,
            data,
          },
        ]);
      });
    };

    const onHandleScroll = (e: React.UIEvent<HTMLElement>) => {
      const currentScrollHeight = e.currentTarget.scrollTop + e.currentTarget.clientHeight;

      const bottom =
        currentScrollHeight + 100 > e.currentTarget.scrollHeight &&
        currentScrollHeight + 100 < e.currentTarget.scrollHeight + 100;
      if (
        bottom &&
        !isFetchingNextPageJourneyMapRows &&
        journeyMap?.rows.length < journeyMapRowsCount
      ) {
        onHandleFetchNextPageJourneyMapRows();
      }

      const stages = document.getElementById('stages');
      const steps = document.getElementById('steps');
      const rows = document.getElementById('rows');
      scrollNeighbours(rows?.scrollLeft || 0, [stages!, steps!]);
    };

    return (
      <div
        className={`journey-map-rows 
        ${isPdfVersion ? 'journey-map-rows-pdf-view' : ''} 
        ${isGuest ? 'journey-map-rows-guest-view' : ''} 
        ${journeyMap?.rows?.length <= 1 && currentLayer.isBase ? 'journey-map-rows-empty' : ''}`}
        id="rows"
        onScroll={onHandleScroll}>
        {journeyMap?.rows?.length > 1 || !currentLayer.isBase ? (
          <DragDropContext onDragEnd={result => onRowDragEnd(result)} onBeforeCapture={onDragstart}>
            <Droppable droppableId={'rows'} type={'rows_group'}>
              {provided => {
                return (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={'journey-map-rows-container'}>
                    <div data-testid={'journey-map-rows'} className={'journey-map-rows--droppable'}>
                      {journeyMap?.rows.map((rowItem, index: number) => {
                        if (rowItem?.rowFunction !== MapRowTypeEnum.Steps) {
                          return (
                            //   10000 is for identification * issue
                            <Draggable
                              key={rowItem?.id + '_row_' + index}
                              draggableId={String(rowItem?.id + 10000)}
                              index={index}
                              isDragDisabled={isGuest}>
                              {provided2 => {
                                return (
                                  <div
                                    ref={provided2.innerRef}
                                    {...provided2.draggableProps}
                                    className={`journey-map-rows--droppable-item`}
                                    key={rowItem?.id}>
                                    {getPageContentByKey({
                                      content: {
                                        [JourneyMapRowTypesEnum.SENTIMENT]: (
                                          <JourneyMapSentimentRow
                                            dragHandleProps={provided2?.dragHandleProps}
                                            rowItem={rowItem}
                                            index={index}
                                            rowsLength={journeyMap?.rows.length - 1}
                                            disabled={isGuest}
                                            updateLabel={updateLabel}
                                          />
                                        ),
                                      },
                                      key: rowItem.rowFunction!,
                                      defaultPage: (
                                        <div>hello</div>
                                        // <JourneyMapRegularRow
                                        //   key={rowItem?.id}
                                        //   dragHandleProps={provided2?.dragHandleProps}
                                        //   rowItem={rowItem}
                                        //   index={index}
                                        //   updateLabel={updateLabel}
                                        //   rowsLength={journeyMap?.rows.length - 1}
                                        // />
                                      ),
                                    })}
                                  </div>
                                );
                              }}
                            </Draggable>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                );
              }}
            </Droppable>
          </DragDropContext>
        ) : (
          <div className={'journey-map-rows--empty-data-block'}>
            <EmptyDataInfo
              message={
                <>
                  <p className={'journey-map-rows--empty-data-block--title'}>
                    Chart your customer journey!
                  </p>
                  <p className={'journey-map-rows--empty-data-block--sub-title'}>
                    Create impactful journey maps to enhance every customer interaction. Add data
                    lanes to get started.
                  </p>
                </>
              }
            />
          </div>
        )}
        {(journeyMap?.rows?.length > 1 || !currentLayer.isBase) &&
          isFetchingNextPageJourneyMapRows && (
            <div
              className={`journey-map-rows--loading-block  ${!currentLayer.isBase ? 'rows-loading-base-mode' : ''}`}>
              <CustomLoader />
            </div>
          )}
      </div>
    );
  },
);

export default JourneyMapRows;
