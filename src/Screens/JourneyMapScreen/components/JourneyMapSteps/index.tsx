import { FC, memo, useCallback, useRef } from 'react';

import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { useWuShowToast } from '@npm-questionpro/wick-ui-lib';
import { useQueryClient } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';

import {
  AddOrUpdateColumnStepMutation,
  useAddOrUpdateColumnStepMutation,
} from '@/api/mutations/generated/addOrUpdateColumnStep.generated.ts';
import { MapRowTypeEnum, PersonaStateEnum } from '@/api/types';
import DraggableItem from '@/Screens/JourneyMapScreen/components/JourneyMapSteps/DraggableItem';
import { JOURNEY_MAP_LOADING_ROW } from '@/Screens/JourneyMapScreen/constants.tsx';
import useScrollObserver from '@/Screens/JourneyMapScreen/hooks/useScrollObserver.tsx';
import {
  JourneyMapColumnType,
  JourneyMapRowType,
  JourneyMapType,
} from '@/Screens/JourneyMapScreen/types.ts';
import { useJourneyMapStore } from '@/store/journeyMap.ts';
import { useLayerStore } from '@/store/layers.ts';
import { useUndoRedoStore } from '@/store/undoRedo.ts';
import { ActionsEnum, JourneyMapRowTypesEnum } from '@/types/enum';
import { lightenColor } from '@/utils/lightenColor.ts';
import { scrollNeighbours } from '@/utils/scrollNeighbours.ts';

interface IStep {
  step: JourneyMapRowType;
  columns: JourneyMapColumnType[];
  isGuest: boolean;
}

const JourneyMapSteps: FC<IStep> = memo(({ step, columns, isGuest }) => {
  const queryClient = useQueryClient();

  const childRef = useRef<any>(null);

  const isScrollable = useScrollObserver();

  const { journeyMap, updateJourneyMap } = useJourneyMapStore();
  const { undoActions, updateUndoActions, updateRedoActions } = useUndoRedoStore();
  const { currentLayer } = useLayerStore();

  const isLayerModeOn = !currentLayer?.isBase;

  const { showToast } = useWuShowToast();

  const { mutate: createOrUpdateStepMutate } = useAddOrUpdateColumnStepMutation<
    Error,
    AddOrUpdateColumnStepMutation
  >({
    onError: error => {
      showToast({
        variant: 'error',
        message: error.message,
      });
    },
  });

  const onHandleUpdateJourneyMap = useCallback(async () => {
    await queryClient.invalidateQueries({
      queryKey: ['GetJourneyMap'],
    });
    await queryClient.invalidateQueries({
      queryKey: ['GetJourneyMapRows.infinite'],
    });
  }, [queryClient]);

  const onHandleScroll = () => {
    const stages = document.getElementById('stages');
    const stepsContent = document.getElementById('steps');
    const rows = document.getElementById('rows');
    scrollNeighbours(stepsContent?.scrollLeft || 0, [stages!, rows!]);
  };

  const onHandleCreateNewStep = useCallback(
    (columnId: number, id: number, stepIndex: number, position: number) => {
      const newBox = {
        id: 99999,
        columnId,
        boxElements: [],
        boxTextElement: null,
        metrics: [],
        touchPoints: [],
        outcomes: [],
        links: [],
        average: 3,
        mergeCount: 1,
        step: {
          isMerged: false,
          isNextColumnMerged: false,
          id,
          columnId,
          index: stepIndex,
          name: '',
          bgColor: '#F0F2FA',
        },
      };

      updateRedoActions([]);
      updateUndoActions([
        ...undoActions,
        {
          id: uuidv4(),
          type: JourneyMapRowTypesEnum.STEPS,
          action: ActionsEnum.DELETE,
          data: {
            step: newBox,
          },
        },
      ]);

      const columns = journeyMap.columns.map(c => {
        if (c.id === columnId) {
          c.size += 1;
        }
        return c;
      });
      const rows = journeyMap.rows.map(r => {
        r.boxes?.splice(position + 1, 0, { ...newBox });
        if (r?.rowWithPersonas?.length) {
          r?.rowWithPersonas?.forEach(rowWithPersonaItem => {
            rowWithPersonaItem?.personaStates?.splice(position + 1, 0, {
              boxId: newBox?.id,
              columnId: newBox?.columnId,
              stepId: newBox?.step.id,
              rowId: r?.id,
              state: PersonaStateEnum.Neutral,
            });
          });
        }
        return {
          ...r,
          boxes: r.boxes,
        };
      });

      updateJourneyMap({
        columns,
        rows,
      });
    },
    [
      journeyMap.columns,
      journeyMap.rows,
      undoActions,
      updateJourneyMap,
      updateRedoActions,
      updateUndoActions,
    ],
  );

  const onHandleDeleteStep = useCallback(
    (id: number, columnId: number) => {
      updateRedoActions([]);
      updateUndoActions([
        ...undoActions,
        {
          id: uuidv4(),
          type: JourneyMapRowTypesEnum.STEPS,
          action: ActionsEnum.CREATE,
          data: {
            step: {
              id,
              columnId,
            },
          },
        },
      ]);

      const columns = journeyMap.columns.map(c =>
        c.id === columnId ? { ...c, size: c.size - 1 } : c,
      );
      const rows = journeyMap.rows.map(r => ({
        ...r,
        rowWithPersonas: r.rowWithPersonas.map(rowWithPersonasItem => {
          return {
            ...rowWithPersonasItem,
            personaStates: rowWithPersonasItem.personaStates?.filter(item => item.stepId !== id),
          };
        }),
        boxes: r.boxes?.filter(b => b.step?.id !== id),
      }));

      updateJourneyMap({
        columns,
        rows,
      });
    },
    [
      journeyMap.columns,
      journeyMap.rows,
      undoActions,
      updateJourneyMap,
      updateRedoActions,
      updateUndoActions,
    ],
  );

  const onHandleUpdateRow = useCallback(
    (
      columnId: number,
      id: number,
      index: number,
      dragStepId: number,
      initialMap: JourneyMapType,
      onSuccess?: (response: AddOrUpdateColumnStepMutation) => void,
      // socketResult: {
      //   destinationIndex: number;
      //   sourceIndex: number;
      //   itemId: number;
      // },
    ) => {
      createOrUpdateStepMutate(
        {
          addOrUpdateColumnStepInput: {
            update: {
              columnId,
              id,
              index,
              dragStepId,
            },
          },
        },
        {
          onSuccess: async response => {
            if (onSuccess) {
              onSuccess(response);
            }
            if (response.addOrUpdateColumnStep.createdColumnStep?.id) {
              await onHandleUpdateJourneyMap();
            }
          },
          onError: async () => {
            showToast({
              variant: 'warning',
              message: `You can't drop items between the merged columns.`,
            });
            updateJourneyMap(initialMap);
            // await onHandleUpdateJourneyMap();
          },
        },
      );
    },
    [createOrUpdateStepMutate, onHandleUpdateJourneyMap, showToast, updateJourneyMap],
  );

  const checkDropDestination = useCallback(
    (stepIndex: number, rows: JourneyMapRowType[]) => {
      const destinationStep = rows[0]?.boxes && rows[0]?.boxes[stepIndex];
      if (destinationStep?.step?.isMerged) {
        showToast({
          variant: 'warning',
          message: `Action denied, destination place contains merged boxes`,
        });
        return false;
      }
      return true;
    },
    [showToast],
  );

  const onHandleDragEnd = useCallback(
    (result: any) => {
      const initialMap = journeyMap;
      const destinationIndex = +result.destination?.index;
      const sourceIndex = +result.source?.index;

      const itemId = +result.draggableId;
      if (result.destination && destinationIndex !== sourceIndex) {
        const journeyMapColumns = journeyMap.columns || [];
        const journeyMapRows = journeyMap.rows || [];

        const columnsPositionId: Array<number> = [];
        journeyMapColumns.forEach(column => {
          const columnSize = Array(column.size).fill(column);
          columnSize.forEach(c => {
            columnsPositionId.push(c.id);
          });
        });

        let incrementColumnId: number | null = null;
        let decrementColumnId: number | null = null;
        let draggableColumnId: number = 0;
        let oldDraggableColumnId: number = 0;
        let oldStepIndex: number = 0;
        let dragIndex: number = destinationIndex;

        const isMoveForward = sourceIndex < destinationIndex;
        const hasValidBoxes = journeyMapRows[0]?.boxes && journeyMapRows[0]?.boxes?.length > 0;
        const isNotLastBox =
          journeyMapRows[0]?.boxes && destinationIndex + 1 < journeyMapRows[0]?.boxes?.length;
        const stepIndex =
          isMoveForward && hasValidBoxes && isNotLastBox ? destinationIndex + 1 : destinationIndex;

        const destinationStepId = journeyMapRows[0]?.boxes?.[stepIndex]?.step?.id;

        const data = checkDropDestination(stepIndex, journeyMap?.rows);
        if (!data) {
          return;
        }

        const newJourneyMapRows = journeyMapRows.map(row => {
          const boxes = row.boxes ? [...row.boxes] : [];
          const [draggedRowItem] = boxes.splice(sourceIndex, 1);

          oldStepIndex = draggedRowItem.step?.index || 0;
          oldDraggableColumnId = +draggedRowItem.columnId!;
          draggableColumnId = +draggedRowItem.columnId!;

          if (draggedRowItem.columnId !== columnsPositionId[destinationIndex]) {
            draggableColumnId = +columnsPositionId[destinationIndex];
            incrementColumnId = columnsPositionId[destinationIndex] || null;
            decrementColumnId = draggedRowItem.columnId || null;
            draggedRowItem.columnId = columnsPositionId[destinationIndex];
            if (draggedRowItem.step?.columnId) {
              draggedRowItem.step.columnId = columnsPositionId[destinationIndex];
            }
          }
          boxes.splice(destinationIndex, 0, draggedRowItem);
          if (row?.rowFunction === MapRowTypeEnum.Sentiment) {
            let rowWithPersonas = [...row.rowWithPersonas];
            const rowBoxes = row.boxes || [];
            const [draggedItemData] = rowBoxes.splice(result.source.index, 1);
            rowBoxes.splice(result.destination.index, 0, draggedItemData);
            rowWithPersonas = rowWithPersonas?.map(persona => {
              const personaStates = [...(persona?.personaStates || [])];
              const [sentimentDraggedRowItem] = personaStates.splice(result.source.index, 1);
              personaStates.splice(result.destination.index, 0, sentimentDraggedRowItem);
              return {
                ...persona,
                personaStates,
              };
            });
            return {
              ...row,
              boxes,
              rowWithPersonas,
            };
          }
          return {
            ...row,
            boxes,
          };
        });
        let oldColumnIndex: number = 0;
        let newColumnIndex: number = 0;
        let sourceColumnsStepSize = 0;
        const newJourneyMapColumns = journeyMapColumns.map((column, index) => {
          if (column.id === oldDraggableColumnId) {
            oldColumnIndex = index;
          } else if (column.id === draggableColumnId) {
            newColumnIndex = index;
          }
          if (column.id === (incrementColumnId || draggableColumnId)) {
            const beforeDropColumns = journeyMapColumns.slice(0, index);
            beforeDropColumns.forEach(c => {
              dragIndex -= c.size;
            });
          }
          if (column.id === incrementColumnId) {
            column.size += 1;
          }
          if (column.id === decrementColumnId) {
            if (column.size > 1) {
              sourceColumnsStepSize = column.size;
              column.size -= 1;
            } else {
              newJourneyMapRows.map(row => ({
                ...row,
                boxes: row.boxes?.splice(
                  sourceIndex + (sourceIndex > destinationIndex ? 1 : 0),
                  0,
                  JOURNEY_MAP_LOADING_ROW,
                ),
              }));
            }
          }
          return column;
        });

        if (!result.socket) {
          const onSuccess = (response: AddOrUpdateColumnStepMutation) => {
            updateRedoActions([]);
            updateUndoActions([
              ...undoActions,
              {
                id: uuidv4(),
                type: JourneyMapRowTypesEnum.STEPS,
                action: ActionsEnum.DRAG,
                data: {
                  step: {
                    id: itemId,
                    columnId: draggableColumnId,
                    sourceIndex: dragIndex + 1,
                  },
                  prevStep: {
                    id: itemId,
                    columnId: oldDraggableColumnId,
                    sourceIndex: oldStepIndex,
                  },
                  newStepId: response.addOrUpdateColumnStep.createdColumnStep?.id,
                },
              },
            ]);
          };
          // If Step source columns steps are reset, need to send BE index+1, because a step is creating on source steps
          if (!sourceColumnsStepSize && oldColumnIndex < newColumnIndex) {
            dragIndex += 1;
          }
          onHandleUpdateRow(
            draggableColumnId,
            itemId,
            dragIndex + 1,
            destinationStepId!,
            initialMap,
            onSuccess,
          );
        }

        const rows = newJourneyMapRows.map(row => {
          const boxes = row.boxes ? [...row.boxes] : [];
          const draggedRowItem = boxes[destinationIndex];
          if (draggedRowItem.step?.index) {
            draggedRowItem.step.index = dragIndex;
          }
          return {
            ...row,
            boxes,
          };
        });

        updateJourneyMap({
          rows,
          columns: newJourneyMapColumns,
        });
      }
    },
    [
      checkDropDestination,
      journeyMap,
      onHandleUpdateRow,
      undoActions,
      updateJourneyMap,
      updateRedoActions,
      updateUndoActions,
    ],
  );

  return (
    <div className={'journey-map-step'} id={'steps'} onScroll={onHandleScroll}>
      <DragDropContext onDragEnd={result => onHandleDragEnd(result)}>
        {step.boxes?.length ? (
          <div className={'journey-map-step--start-step'}>
            <div className={'journey-map-step--new-step-button-block'}>
              {!isLayerModeOn && (
                <button
                  aria-label={'plus'}
                  className={'journey-map-step--new-step-button-block--button'}
                  data-testid="add-step-btn-test-id"
                  onClick={() => childRef.current?.createNewColumn()}>
                  <span className={'wm-add'} />
                </button>
              )}
            </div>
          </div>
        ) : null}
        {/*todo*/}
        {/*{!isLayerModeOn && <RowActionsDrawer index={1} />}*/}
        <Droppable droppableId={'step'} key={'step'} direction="horizontal">
          {provided => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={'journey-map-step--steps'}
              style={{
                marginRight: isScrollable ? '1.75rem' : 0,
              }}
              data-testid="journey-map-step-steps-test-id">
              {step.boxes?.map((stepItem, index) => (
                <Draggable
                  key={String(stepItem.step?.id)}
                  draggableId={String(stepItem.step?.id)}
                  index={index}
                  isDragDisabled={isGuest}>
                  {provided2 => {
                    const stage = columns.find(c => c.id === stepItem.step?.columnId);
                    return (
                      <div
                        ref={provided2.innerRef}
                        {...provided2.draggableProps}
                        key={stepItem?.id}
                        data-testid={`journey-map-step-${stepItem.step?.id}-test-id`}>
                        <div
                          id={`step-box-${stepItem.step?.id}`}
                          className={'journey-map-step--steps--item'}
                          style={{
                            width: 280,
                            borderBottom: `1px solid ${stepItem?.step?.bgColor ? lightenColor(stepItem.step?.bgColor, -4) : 'rgb(224, 228, 245)'}`,
                            borderRight: `1px solid  ${stepItem?.step?.bgColor ? lightenColor(stepItem.step?.bgColor, -4) : 'rgb(224, 228, 245)'}`,
                          }}>
                          <>
                            <DraggableItem
                              hasMergeItems={stepItem?.step?.isMerged || false}
                              canAddNewItem={
                                index < (step.boxes?.length || 0) - 1
                                  ? !(step.boxes && step.boxes[index + 1]?.step?.isMerged)
                                  : true
                              }
                              ref={index === 0 ? childRef : null}
                              key={String(stepItem.step?.id)}
                              stepItem={stepItem}
                              index={index + 1}
                              stageStepCount={stage?.size || 1}
                              isGuest={isGuest}
                              columnColor={stage?.bgColor || '#d9dff2'}
                              onHandleCreateNewStep={onHandleCreateNewStep}
                              onHandleDeleteStep={onHandleDeleteStep}
                              dragHandleProps={provided2.dragHandleProps}
                            />
                          </>
                        </div>
                      </div>
                    );
                  }}
                </Draggable>
              ))}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
});

export default JourneyMapSteps;
