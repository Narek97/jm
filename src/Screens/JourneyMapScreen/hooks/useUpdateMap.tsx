import { useCallback } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';

import { useUpdatesStagesAndLanes } from './useUpdatesStagesAndLanes';

import { useAddBoxElementMutation } from '@/api/mutations/generated/addBoxElement.generated';
import { useAddOrUpdateColumnStepMutation } from '@/api/mutations/generated/addOrUpdateColumnStep.generated';
import { useCreateMapLinkMutation } from '@/api/mutations/generated/createLink.generated';
import { useCreateTouchPointsMutation } from '@/api/mutations/generated/createTouchPoints.generated';
import { useCreateUpdateOutcomeMutation } from '@/api/mutations/generated/createUpdateOutcome.generated';
import { useDeleteColumnStepMutation } from '@/api/mutations/generated/deleteColumnStep.generated';
import { useDeleteMapLinkMutation } from '@/api/mutations/generated/deleteLink.generated';
import { useDeleteMapColumnMutation } from '@/api/mutations/generated/deleteMapColumn.generated';
import { useDeleteMapRowMutation } from '@/api/mutations/generated/deleteMapRow.generated';
import { useDeleteMetricsMutation } from '@/api/mutations/generated/deleteMetrics.generated';
import { useDeleteOutcomeMutation } from '@/api/mutations/generated/deleteOutcome.generated';
import { useDeleteTouchPointMutation } from '@/api/mutations/generated/deleteTouchPoint.generated';
import { useMergeJourneyMapColumnMutation } from '@/api/mutations/generated/mergeJourneyMapColumn.generated';
import { useRemoveBoxElementMutation } from '@/api/mutations/generated/removeBoxElement.generated';
import { useRestoreMetricsMutation } from '@/api/mutations/generated/restoreMetrics.generated';
import { useRetrieveColumnMutation } from '@/api/mutations/generated/retrieveColumn.generated';
import { useRetrieveColumnStepMutation } from '@/api/mutations/generated/retrieveColumnStep.generated';
import { useRetrieveMetricsDataMutation } from '@/api/mutations/generated/retrieveMetricsData.generated';
import { useRetrieveRowMutation } from '@/api/mutations/generated/retrieveRow.generated';
import { useUnMergeJourneyMapColumnMutation } from '@/api/mutations/generated/unMergeJourneyMapColumn.generated';
import { useUpdateBoxElementMutation } from '@/api/mutations/generated/updateBoxElement.generated';
import { useUpdateItemFlippedTextMutation } from '@/api/mutations/generated/updateItemFlippedText.generated';
import { useUpdateJourneyMapColumnMutation } from '@/api/mutations/generated/updateJourneyMapColumn.generated.ts';
import { useUpdateJourneyMapRowMutation } from '@/api/mutations/generated/updateJourneyMapRow.generated';
import { useUpdateMapLinkMutation } from '@/api/mutations/generated/updateLink.generated';
import { useUpdateLinkBgColorMutation } from '@/api/mutations/generated/updateLinkBGColor.generated';
import { useUpdateMetricsMutation } from '@/api/mutations/generated/updateMetrics.generated';
import { useUpdateTouchPointMutation } from '@/api/mutations/generated/updateTouchPoint.generated';
import { LinkTypeEnum } from '@/api/types.ts';
import { onDragEndMap } from '@/Screens/JourneyMapScreen/helpers/onDragEndMap.ts';
import { JourneyMapColumnType, JourneyMapRowType } from '@/Screens/JourneyMapScreen/types.ts';
import { useJourneyMapStore } from '@/store/journeyMap.ts';
import { useUndoRedoStore } from '@/store/undoRedo.ts';
import {
  ActionsEnum,
  JourneyMapRowActionEnum,
  JourneyMapRowTypesEnum,
  UndoRedoEnum,
} from '@/types/enum';

export const useUpdateMap = () => {
  const {
    updateJourneyMapRowsCount,
    updateJourneyMap,
    journeyMapRowsCount,
    journeyMap,
    selectedJourneyMapPersona,
  } = useJourneyMapStore();
  const { undoActions, redoActions, updateUndoActions, updateRedoActions } = useUndoRedoStore();

  const { updateStages, updateLanes } = useUpdatesStagesAndLanes();
  const { mutate: addBoxElement } = useAddBoxElementMutation();
  const { mutate: updateBoxElement } = useUpdateBoxElementMutation();
  const { mutate: removeBoxElement } = useRemoveBoxElementMutation();
  const { mutate: addTouchPoints } = useCreateTouchPointsMutation();
  const { mutate: updateTouchPoint } = useUpdateTouchPointMutation();
  const { mutate: removeTouchPoint } = useDeleteTouchPointMutation();
  const { mutate: updateMetrics } = useUpdateMetricsMutation();
  const { mutate: restoreMetrics } = useRestoreMetricsMutation();
  const { mutate: retryMetrics } = useRetrieveMetricsDataMutation();
  const { mutate: removeMetrics } = useDeleteMetricsMutation();
  const { mutate: addOrUpdateOutcome } = useCreateUpdateOutcomeMutation();
  const { mutate: removeOutcome } = useDeleteOutcomeMutation();
  const { mutate: addLink } = useCreateMapLinkMutation();
  const { mutate: updateLink } = useUpdateMapLinkMutation();
  const { mutate: updateLinkBGColor } = useUpdateLinkBgColorMutation();
  const { mutate: removeLink } = useDeleteMapLinkMutation();
  const { mutate: updateFlippedText } = useUpdateItemFlippedTextMutation();
  const { mutate: updateRow } = useUpdateJourneyMapRowMutation();
  const { mutate: retrieveRow } = useRetrieveRowMutation();
  const { mutate: removeRow } = useDeleteMapRowMutation();
  const { mutate: updateColumn } = useUpdateJourneyMapColumnMutation();
  const { mutate: retrieveColumn } = useRetrieveColumnMutation();
  const { mutate: removeColumn } = useDeleteMapColumnMutation();
  const { mutate: updateColumnStep } = useAddOrUpdateColumnStepMutation();
  const { mutate: retrieveColumnStep } = useRetrieveColumnStepMutation();
  const { mutate: removeColumnStep } = useDeleteColumnStepMutation();
  const { mutate: unMergeColumns } = useUnMergeJourneyMapColumnMutation();
  const { mutate: mergeColumns } = useMergeJourneyMapColumnMutation();

  const queryClient = useQueryClient();

  const onHandleUpdateJourneyMap = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ['GetJourneyMap'],
      }),
      queryClient.invalidateQueries({
        queryKey: ['GetJourneyMapRows.infinite'],
      }),
    ]);
  }, [queryClient]);

  const onHandleDrag = useCallback(
    (data: any, type: string, undoRedo?: UndoRedoEnum | null) => {
      let source = data.destination;
      let destination = data.source;
      if (undoRedo === UndoRedoEnum.UNDO) {
        source = data.source;
        destination = data.destination;
      }

      const dropData: any = onDragEndMap(
        {
          source,
          destination,
        },
        data.isDroppedAnotherRow,
        type,
        journeyMap.rows,
      );

      updateJourneyMap({
        rows: dropData.rows,
      });
    },
    [journeyMap.rows, updateJourneyMap],
  );

  const addMapNewItem = useCallback(
    (item: any, boxKey: 'boxElements' | 'touchPoints' | 'outcomes' | 'metrics' | 'links') => {
      const rows = journeyMap.rows.map(r => {
        if (r.id === item.rowId) {
          return {
            ...r,
            boxes: r.boxes?.map(box => {
              if (box.step?.id === item.stepId) {
                return {
                  ...box,
                  [boxKey]: [...box[boxKey], item],
                };
              }
              return box;
            }),
          };
        }
        return r;
      });

      updateJourneyMap({ rows });
    },
    [journeyMap.rows, updateJourneyMap],
  );

  const deleteMapItem = useCallback(
    (data: any, boxKey: 'boxElements' | 'touchPoints' | 'outcomes' | 'metrics' | 'links') => {
      const rows = journeyMap.rows.map(r => {
        if (r.id === data.rowId) {
          return {
            ...r,
            boxes: r.boxes?.map(box => {
              if (box.step?.id === data.stepId) {
                return {
                  ...box,
                  [boxKey]: box[boxKey]?.filter(
                    (boxElement: { id: number }) => boxElement.id !== data.id,
                  ),
                };
              }
              return box;
            }),
          };
        }
        return r;
      });

      updateJourneyMap({ rows });
    },
    [journeyMap.rows, updateJourneyMap],
  );

  const updateMapByType = useCallback(
    (
      type: JourneyMapRowActionEnum | JourneyMapRowTypesEnum,
      action: ActionsEnum,
      data: any,
      undoRedo?: UndoRedoEnum | null,
      subAction?: ActionsEnum | null,
    ) => {
      switch (type) {
        case JourneyMapRowActionEnum.BOX_TEXT_ELEMENT: {
          if (undoRedo) {
            updateBoxElement({
              updateBoxDataInput: {
                boxElementId: data.id,
                text: undoRedo === UndoRedoEnum.UNDO ? data.previousText : data.text,
              },
            });
          }

          const rows = journeyMap.rows.map(r => {
            if (r.id === data.rowId) {
              return {
                ...r,
                boxes: r.boxes?.map(box => {
                  if (box.step?.id === data.stepId) {
                    let text = data.text;
                    if (undoRedo === UndoRedoEnum.UNDO) {
                      text = data.previousText;
                    }
                    return {
                      ...box,
                      id: data?.id,
                      boxTextElement: { ...data, text, id: data?.id },
                    };
                  }
                  return box;
                }),
              };
            }
            return r;
          });

          updateJourneyMap({ rows });

          break;
        }
        case JourneyMapRowActionEnum.ROW_COLLAPSE: {
          const rows = journeyMap.rows.map(r => {
            if (r.id === data.rowId) {
              let isCollapsed = data.isCollapsed;
              if (undoRedo === UndoRedoEnum.UNDO) {
                isCollapsed = !data.isCollapsed;
              }
              return {
                ...r,
                isCollapsed,
              };
            }
            return r;
          });

          updateJourneyMap({ rows });

          updateRow({
            updateRowInput: {
              rowId: data.rowId,
              isCollapsed: undoRedo === UndoRedoEnum.UNDO ? !data.isCollapsed : data.isCollapsed,
            },
          });
          break;
        }
        case JourneyMapRowActionEnum.ROW_DISABLE: {
          const rows = journeyMap.rows.map(r => {
            if (r.id === data.rowId) {
              let isLocked = data.isLocked;
              if (undoRedo === UndoRedoEnum.UNDO) {
                isLocked = !data.isLocked;
              }
              return {
                ...r,
                isLocked,
              };
            }
            return r;
          });

          updateJourneyMap({ rows });

          updateRow({
            updateRowInput: {
              rowId: data.rowId,
              isLocked: undoRedo === UndoRedoEnum.UNDO ? !data.isLocked : data.isLocked,
            },
          });
          break;
        }
        case JourneyMapRowActionEnum.ROW_LABEL: {
          const rows = journeyMap.rows.map(r => {
            if (r.id === data.rowId) {
              let label = data.label;
              if (undoRedo === UndoRedoEnum.UNDO) {
                label = data.previousLabel;
              }
              return {
                ...r,
                label,
              };
            }
            return r;
          });

          updateJourneyMap({ rows });

          updateLanes(
            {
              id: data.rowId,
              label: undoRedo === UndoRedoEnum.UNDO ? data.previousLabel : data.label,
            },
            ActionsEnum.UPDATE,
          );
          updateRow({
            updateRowInput: {
              rowId: data.rowId,
              label: undoRedo === UndoRedoEnum.UNDO ? data.previousLabel : data.label,
            },
          });
          break;
        }
        case JourneyMapRowActionEnum.BACK_CARD: {
          if (undoRedo) {
            updateFlippedText({
              updateItemFlippedTextInput: {
                itemId: data.id,
                rowId: data.rowId,
                text: undoRedo === UndoRedoEnum.UNDO ? data.previousFlippedText : data.flippedText,
              },
            });
          }

          const rows = journeyMap.rows.map(r => {
            if (r.id === data.rowId) {
              return {
                ...r,
                boxes: r.boxes?.map(box => {
                  if (box.step?.id === data.stepId) {
                    return {
                      ...box,
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-expect-error
                      [data.itemKey]: box[data.itemKey].map(boxElement => {
                        if (boxElement.id === data.id) {
                          let flippedText = data.flippedText;
                          if (undoRedo === UndoRedoEnum.UNDO) {
                            flippedText = data.previousFlippedText;
                          }
                          return {
                            ...boxElement,
                            flippedText,
                          };
                        }
                        return boxElement;
                      }),
                    };
                  }
                  return box;
                }),
              };
            }
            return r;
          });

          updateJourneyMap({ rows });

          break;
        }
        case JourneyMapRowActionEnum.BOX_ELEMENT: {
          switch (action) {
            case ActionsEnum.CREATE: {
              if (undoRedo) {
                addBoxElement(
                  {
                    addBoxElementInput: {
                      rowId: data.rowId,
                      stepId: data.stepId,
                      columnId: data.columnId,
                      text: data.text,
                      personaId: selectedJourneyMapPersona?.id || null,
                    },
                  },
                  {
                    onSuccess: response => {
                      addMapNewItem(response?.addBoxElement, 'boxElements');

                      updateUndoActions(
                        undoActions.map(el => {
                          if (el.data.id === data.id) {
                            return {
                              ...el,
                              data: { ...el.data, ...response?.addBoxElement },
                            };
                          }
                          return el;
                        }),
                      );
                      updateRedoActions(
                        redoActions.map(el => {
                          if (el.data.id === data.id) {
                            return {
                              ...el,
                              data: { ...el.data, ...response?.addBoxElement, text: el.data.text },
                            };
                          }
                          return el;
                        }),
                      );
                    },
                  },
                );
              } else {
                addMapNewItem(data, 'boxElements');
              }
              break;
            }
            case ActionsEnum.UPDATE: {
              if (undoRedo) {
                updateBoxElement({
                  updateBoxDataInput: {
                    boxElementId: data.id,
                    text: undoRedo === UndoRedoEnum.UNDO ? data.previousText : data.text,
                    bgColor: undoRedo === UndoRedoEnum.UNDO ? data.previousBgColor : data.bgColor,
                  },
                });
              }

              const rows = journeyMap.rows.map(r => {
                if (r.id === data.rowId) {
                  return {
                    ...r,
                    boxes: r.boxes?.map(box => {
                      if (box.step?.id === data.stepId) {
                        return {
                          ...box,
                          boxElements: box.boxElements.map(boxElement => {
                            if (boxElement.id === data.id) {
                              let text = data.text;
                              let bgColor = data.bgColor;
                              if (undoRedo === UndoRedoEnum.UNDO) {
                                text = data.previousText !== null ? data.previousText : data.text;
                                bgColor =
                                  data.previousText !== null ? data.previousBgColor : data.bgColor;
                              }
                              const updateData = {
                                ...boxElement,
                                text,
                                bgColor,
                              };
                              if (data.attachmentId) {
                                updateData.attachmentId = data.attachmentId;
                              }
                              if (data.attachment) {
                                updateData.attachment = {
                                  ...(updateData.attachment || {}),
                                  ...data.attachment,
                                };
                              }

                              if (data.attachmentPosition) {
                                updateData.attachmentPosition = {
                                  ...(updateData.attachmentPosition || {}),
                                  ...data.attachmentPosition,
                                };
                              }
                              return updateData;
                            }
                            return boxElement;
                          }),
                        };
                      }
                      return box;
                    }),
                  };
                }
                return r;
              });

              updateJourneyMap({ rows });

              break;
            }
            case ActionsEnum.DELETE: {
              if (undoRedo) {
                removeBoxElement({
                  removeBoxElementInput: {
                    boxElementId: data.id!,
                  },
                });
              }
              deleteMapItem(data, 'boxElements');
              break;
            }
            case ActionsEnum.DRAG: {
              updateBoxElement({
                updateBoxDataInput: {
                  boxElementId: data?.id as number,
                  positionInput: data.undoPositionInput,
                },
              });
              onHandleDrag(data, 'BOX_ELEMENT', undoRedo);
              break;
            }
          }

          break;
        }
        case JourneyMapRowTypesEnum.TOUCHPOINTS: {
          switch (action) {
            case ActionsEnum.CREATE: {
              const updateMap = (boxItem: any) => {
                const rows = journeyMap.rows.map(r => {
                  if (r.id === boxItem.rowId) {
                    return {
                      ...r,
                      boxes: r.boxes?.map(box => {
                        if (box.step?.id === boxItem.stepId) {
                          return {
                            ...box,
                            touchPoints: [...box.touchPoints, ...boxItem.touchPoints],
                          };
                        }
                        return box;
                      }),
                    };
                  }
                  return r;
                });

                updateJourneyMap({ rows });
              };

              if (undoRedo) {
                addTouchPoints(
                  {
                    createTouchPointInput: {
                      rowId: data.rowId,
                      mapId: data.mapID,
                      stepId: data.stepId,
                      columnId: data.columnId,
                      // personaId: selectedPerson?.id || null,
                      touchPoints: data.touchPoints.map(
                        (touchPoint: { id: number; title: string; iconUrl: string }) => ({
                          id: touchPoint.id,
                          title: touchPoint.title,
                          iconId: touchPoint.iconUrl,
                        }),
                      ),
                    },
                  },
                  {
                    onSuccess: response => {
                      const newData = {
                        ...data,
                        touchPoints: response.createTouchPoints,
                      };
                      updateMap(newData);

                      const updateTouchpointsData = (
                        historyData: Array<{
                          id: string;
                          type: JourneyMapRowActionEnum | JourneyMapRowTypesEnum;
                          action: ActionsEnum;
                          data: any;
                        }>,
                      ) => {
                        return historyData.map(el => {
                          if (el.id === data.parentId) {
                            return {
                              ...el,
                              data: newData,
                            };
                          } else if (
                            el.type === JourneyMapRowTypesEnum.TOUCHPOINTS &&
                            el.action !== ActionsEnum.DRAG
                          ) {
                            return {
                              ...el,
                              data: {
                                ...el.data,
                                touchPoints: el.data.touchPoints.map((tp: { id: number }) => {
                                  const positionIndex = data.touchPoints.findIndex(
                                    (dataTp: { id: number }) => dataTp.id === tp.id,
                                  );
                                  if (positionIndex !== -1) {
                                    return {
                                      ...tp,
                                      id: newData.touchPoints[positionIndex].id,
                                    };
                                  }
                                  return tp;
                                }),
                              },
                            };
                          }
                          return el;
                        });
                      };

                      updateUndoActions(updateTouchpointsData(undoActions));
                      updateRedoActions(updateTouchpointsData(redoActions));
                    },
                  },
                );
              } else {
                updateMap(data);
              }
              break;
            }
            case ActionsEnum.UPDATE: {
              if (undoRedo) {
                data.touchPoints.forEach(
                  (touchPoint: { id: number; touchPoint: string; bgColor: string }) => {
                    updateTouchPoint({
                      updateTouchPointInput: {
                        id: touchPoint.id,
                        bgColor:
                          undoRedo === UndoRedoEnum.UNDO
                            ? touchPoint.touchPoint
                            : touchPoint.bgColor,
                      },
                    });
                  },
                );
              }

              const rows = journeyMap.rows.map(r => {
                if (r.id === data.rowId) {
                  return {
                    ...r,
                    boxes: r.boxes?.map(box => {
                      if (box.step?.id === data.stepId) {
                        return {
                          ...box,
                          touchPoints: box.touchPoints.map(touchPoint => {
                            const tp = data.touchPoints.find(
                              (dataTouchPoint: { id: number }) =>
                                dataTouchPoint.id === touchPoint.id,
                            );
                            if (tp) {
                              let bgColor = tp.bgColor;
                              if (undoRedo === UndoRedoEnum.UNDO) {
                                bgColor = tp.previousBgColor;
                              }
                              return {
                                ...touchPoint,
                                bgColor,
                              };
                            }
                            return touchPoint;
                          }),
                        };
                      }
                      return box;
                    }),
                  };
                }
                return r;
              });

              updateJourneyMap({ rows });

              break;
            }
            case ActionsEnum.DELETE: {
              if (undoRedo) {
                data.touchPoints.forEach((touchPoint: { id: number }) => {
                  removeTouchPoint({
                    id: touchPoint.id,
                  });
                });
              }

              const rows = journeyMap.rows.map(r => {
                if (r.id === data.rowId) {
                  return {
                    ...r,
                    boxes: r.boxes?.map(box => {
                      if (box.step?.id === data.stepId) {
                        return {
                          ...box,
                          touchPoints: box.touchPoints.filter(
                            (touchPoint: { id: number }) =>
                              !data.touchPoints.some(
                                (dataTouchPoint: { id: number }) =>
                                  dataTouchPoint.id === touchPoint.id,
                              ),
                          ),
                        };
                      }
                      return box;
                    }),
                  };
                }
                return r;
              });

              updateJourneyMap({ rows });

              break;
            }
            case ActionsEnum.DRAG: {
              updateTouchPoint({
                updateTouchPointInput: {
                  id: data?.id as number,
                  positionInput: data.undoPositionInput,
                },
              });
              onHandleDrag(data, 'TOUCHPOINTS', undoRedo);
              break;
            }
          }
          break;
        }
        case JourneyMapRowTypesEnum.METRICS: {
          switch (action) {
            case ActionsEnum.CREATE: {
              if (undoRedo) {
                restoreMetrics(
                  {
                    id: data.id,
                  },
                  {
                    onSuccess: response => {
                      const newData = {
                        ...response.restoreMetrics,
                        rowId: data.rowId,
                        stepId: data.stepId,
                      };
                      addMapNewItem(newData, 'metrics');

                      updateUndoActions(
                        undoActions.map(el => {
                          if (el.data.id === data.id) {
                            return {
                              ...el,
                              data: { ...el.data, ...response?.restoreMetrics },
                            };
                          }
                          return el;
                        }),
                      );
                      updateRedoActions(
                        redoActions.map(el => {
                          if (el.data.id === data.id) {
                            return {
                              ...el,
                              data: {
                                ...el.data,
                                ...response?.restoreMetrics,
                              },
                            };
                          }
                          return el;
                        }),
                      );
                    },
                  },
                );
              } else {
                addMapNewItem(data, 'metrics');
              }
              break;
            }
            case ActionsEnum.UPDATE: {
              const updateMapMetrics = (metrics: any) => {
                const rows = journeyMap.rows.map(r => {
                  if (r.id === data.rowId) {
                    return {
                      ...r,
                      boxes: r.boxes?.map(box => {
                        if (box.step?.id === data.stepId) {
                          return {
                            ...box,
                            metrics: box.metrics.map(metricsElement => {
                              if (metricsElement.id === data.id) {
                                return metrics;
                              }
                              return metricsElement;
                            }),
                          };
                        }
                        return box;
                      }),
                    };
                  }
                  return r;
                });

                updateJourneyMap({ rows });
              };

              if (undoRedo) {
                retryMetrics(
                  {
                    id: data.id,
                    previous: undoRedo === UndoRedoEnum.UNDO,
                  },
                  {
                    onSuccess: response => {
                      const newData = {
                        ...response.retrieveMetricsData,
                        rowId: data.rowId,
                        stepId: data.stepId,
                      };

                      updateMapMetrics(newData);

                      updateUndoActions(
                        undoActions.map(el => {
                          if (el.data.id === data.id) {
                            return {
                              ...el,
                              data: { ...el.data, ...response?.retrieveMetricsData },
                            };
                          }
                          return el;
                        }),
                      );
                      updateRedoActions(
                        redoActions.map(el => {
                          if (el.data.id === data.id) {
                            return {
                              ...el,
                              data: {
                                ...el.data,
                                ...response?.retrieveMetricsData,
                              },
                            };
                          }
                          return el;
                        }),
                      );
                    },
                  },
                );
              } else {
                updateMapMetrics(data);
              }

              break;
            }
            case ActionsEnum.DELETE: {
              if (undoRedo) {
                removeMetrics({
                  id: data.id,
                });
              }
              deleteMapItem(data, 'metrics');
              break;
            }
            case ActionsEnum.DRAG: {
              retryMetrics({
                id: data.id,
                previous: undoRedo === UndoRedoEnum.UNDO,
              });
              updateMetrics({
                updateMetricsInput: {
                  id: data?.id as number,
                  positionInput: data.undoPositionInput,
                },
              });
              onHandleDrag(data, 'METRICS', undoRedo);
              break;
            }
          }
          break;
        }
        case JourneyMapRowTypesEnum.OUTCOMES: {
          const createOutcome = (outcomeElement: any) => {
            const rows = journeyMap.rows.map(r => {
              if (r.id === outcomeElement.rowId) {
                return {
                  ...r,
                  boxes: r.boxes?.map(box => {
                    let title = data.title;
                    let description = data.description;
                    let stepId = data.stepId;
                    let rowId = data.rowId;

                    if (undoRedo === UndoRedoEnum.UNDO) {
                      title = data.previousTitle || data.title;
                      description = data.previousDescription || data.description;
                      stepId = data.previousStepId || data.stepId;
                      rowId = data.previousRowId || data.rowId;
                    }
                    if (box.step?.id === stepId) {
                      return {
                        ...box,
                        outcomes: [
                          ...box.outcomes,
                          { ...outcomeElement, title, description, stepId, rowId },
                        ],
                      };
                    }
                    return box;
                  }),
                };
              }
              return r;
            });

            updateJourneyMap({ rows });
          };

          const deleteOutcome = () => {
            const rows = journeyMap.rows.map(r => {
              if (r.id === data.rowId) {
                return {
                  ...r,
                  boxes: r.boxes?.map(box => {
                    let stepId = data.previousStepId;
                    if (undoRedo === UndoRedoEnum.UNDO) {
                      stepId = data.stepId;
                    }
                    if (box.step?.id === stepId) {
                      return {
                        ...box,
                        outcomes: box.outcomes.filter(
                          (outcomeElement: { id: number }) => outcomeElement.id !== data.id,
                        ),
                      };
                    }
                    return box;
                  }),
                };
              }
              return r;
            });

            updateJourneyMap({ rows });
          };

          const updateOutcome = () => {
            const rows = journeyMap.rows.map(r => {
              if (r.id === data.rowId) {
                return {
                  ...r,
                  boxes: r.boxes?.map(box => {
                    if (box.step?.id === data.stepId) {
                      return {
                        ...box,
                        outcomes: box.outcomes.map(outcomeElement => {
                          if (outcomeElement.id === data.id) {
                            let title = data.title;
                            let description = data.description;
                            let bgColor = data.bgColor;
                            if (undoRedo === UndoRedoEnum.UNDO) {
                              title = data.previousTitle || data.title;
                              description = data.previousDescription || data.description;
                              bgColor = data.previousBgColor || data.bgColor;
                            }
                            return {
                              ...outcomeElement,
                              title,
                              description,
                              bgColor,
                              persona: data.persona,
                              personaId: data?.persona?.id,
                            };
                          }
                          return outcomeElement;
                        }),
                      };
                    }
                    return box;
                  }),
                };
              }
              return r;
            });

            updateJourneyMap({ rows });
          };
          switch (action) {
            case ActionsEnum.CREATE: {
              if (undoRedo) {
                addOrUpdateOutcome(
                  {
                    createUpdateOutcomeInput: {
                      createOutcomeInput: {
                        title: data.title,
                        description: data.description,
                        personaId: data.personaId,
                        positionInput: {
                          mapId: data.map.id,
                          columnId: data.columnId,
                          stepId: data.stepId,
                        },
                        outcomeGroupId: data.outcomeGroupId,
                        workspaceId: data.workspaceId,
                      },
                    },
                  },
                  {
                    onSuccess: response => {
                      createOutcome(response?.createUpdateOutcome);

                      updateUndoActions(
                        undoActions.map(el => {
                          if (el.data.id === data.id) {
                            return {
                              ...el,
                              data: {
                                ...data,
                                ...response?.createUpdateOutcome,
                              },
                            };
                          }
                          return el;
                        }),
                      );
                      updateRedoActions(
                        redoActions.map(el => {
                          if (el.data.id === data.id) {
                            return {
                              ...el,
                              data: {
                                ...data,
                                ...response?.createUpdateOutcome,
                              },
                            };
                          }
                          return el;
                        }),
                      );
                    },
                  },
                );
              } else {
                createOutcome(data);
              }
              break;
            }
            case ActionsEnum.UPDATE: {
              if (undoRedo) {
                addOrUpdateOutcome({
                  createUpdateOutcomeInput: {
                    updateOutcomeInput: {
                      personaId: data.personaId,
                      id: data.id,
                      title: undoRedo === UndoRedoEnum.UNDO ? data.previousTtle : data.title,
                      description:
                        undoRedo === UndoRedoEnum.UNDO
                          ? data.previousDescription
                          : data.description,
                      positionInput: {
                        positionChange: {
                          columnId: data.columnId,
                          stepId: data.stepId,
                        },
                      },
                    },
                  },
                });
              }
              if (subAction) {
                if (subAction === ActionsEnum['CREATE-DELETE']) {
                  deleteOutcome();
                  createOutcome(data);
                }
                if (subAction === ActionsEnum.DELETE) {
                  deleteOutcome();
                  if (undoRedo === UndoRedoEnum.UNDO) {
                    createOutcome(data);
                  }
                }
              } else {
                updateOutcome();
              }

              break;
            }

            case ActionsEnum['COLOR-CHANGE']: {
              addOrUpdateOutcome({
                createUpdateOutcomeInput: {
                  updateOutcomeInput: {
                    personaId: data.personaId,
                    id: data.id,
                    bgColor: undoRedo === UndoRedoEnum.UNDO ? data.previousBgColor : data.bgColor,

                    positionInput: {
                      positionChange: {
                        columnId: data.columnId,
                        stepId: data.stepId,
                      },
                    },
                  },
                },
              });
              updateOutcome();
              break;
            }

            case ActionsEnum.DELETE: {
              if (undoRedo) {
                removeOutcome({
                  id: +data.id,
                });
              }
              deleteOutcome();
              break;
            }

            case ActionsEnum.DRAG: {
              addOrUpdateOutcome({
                createUpdateOutcomeInput: {
                  updateOutcomeInput: {
                    id: data?.id as number,
                    positionInput: {
                      index: data.undoPositionInput.index,
                      positionChange: {
                        stepId: data.undoPositionInput.stepId,
                        rowId: data.undoPositionInput.rowId,
                        columnId: data.undoPositionInput.columnId,
                      },
                    },
                  },
                },
              });
              onHandleDrag(data, 'OUTCOMES', undoRedo);
              break;
            }
          }
          break;
        }
        case JourneyMapRowTypesEnum.LINKS: {
          switch (action) {
            case ActionsEnum.CREATE: {
              // todo
              if (undoRedo) {
                const linkInput = {
                  title: '',
                  url: '',
                  linkedMapId: null,
                  personaId: selectedJourneyMapPersona?.id || null,
                  stepId: data.stepId,
                  rowId: data.rowId,
                  type: data.type,
                };
                if (data.type === LinkTypeEnum.External) {
                  linkInput.title = data.title;
                  linkInput.url = data.url;
                } else {
                  linkInput.linkedMapId = data.linkedJourneyMapId;
                }
                addLink(
                  {
                    addLinkInput: linkInput,
                  },
                  {
                    onSuccess: response => {
                      addMapNewItem({ ...response?.addLink, stepId: data.stepId }, 'links');

                      updateUndoActions(
                        undoActions.map(el => {
                          if (el.data.id === data.id) {
                            return {
                              ...el,
                              data: { ...el.data, ...response?.addLink },
                            };
                          }
                          return el;
                        }),
                      );
                      updateRedoActions(
                        redoActions.map(el => {
                          if (el.data.id === data.id) {
                            return {
                              ...el,
                              data: { ...el.data, ...response?.addLink },
                            };
                          }
                          return el;
                        }),
                      );
                    },
                  },
                );
              } else {
                addMapNewItem(data, 'links');
              }
              break;
            }

            case ActionsEnum['COLOR-CHANGE']: {
              if (undoRedo) {
                let bgColor = data.bgColor;
                if (undoRedo === UndoRedoEnum.UNDO) {
                  bgColor = data.previousBgColor;
                }
                updateLinkBGColor({
                  updateLinkBGColor: { linkId: data.id, bgColor },
                });
              }

              const rows = journeyMap.rows.map(r => {
                if (r.id === data.rowId) {
                  return {
                    ...r,
                    boxes: r.boxes?.map(box => {
                      if (box.step?.id === data.stepId) {
                        return {
                          ...box,
                          links: box.links.map(linkElement => {
                            if (linkElement.id === data.id) {
                              let bgColor = data.bgColor;
                              if (undoRedo === UndoRedoEnum.UNDO) {
                                bgColor = data.previousBgColor;
                              }
                              return {
                                ...linkElement,
                                bgColor,
                              };
                            }
                            return linkElement;
                          }),
                        };
                      }
                      return box;
                    }),
                  };
                }
                return r;
              });

              updateJourneyMap({ rows });

              break;
            }

            case ActionsEnum.UPDATE: {
              if (undoRedo) {
                const linkInout = {
                  title: '',
                  url: '',
                  linkedMapId: null,
                  id: data.id,
                  type: data.type,
                };

                if (data.type === LinkTypeEnum.External) {
                  linkInout.title = data.title;
                  linkInout.url = data.url;
                } else {
                  linkInout.linkedMapId = data.linkedMapId;
                }
                updateLink({
                  editLinkInput: linkInout,
                });
              }

              const rows = journeyMap.rows.map(r => {
                if (r.id === data.rowId) {
                  return {
                    ...r,
                    boxes: r.boxes?.map(box => {
                      if (box.step?.id === data.stepId) {
                        return {
                          ...box,
                          links: box.links.map(linkElement => {
                            if (linkElement.id === data.id) {
                              let title = data.title;
                              let linkType = data.type;
                              let mapPersonaImages = data.mapPersonaImages;
                              let linkedJourneyMapId = data.linkedJourneyMapId;
                              let icon = data.icon;
                              let url = data.url;

                              if (undoRedo === UndoRedoEnum.UNDO) {
                                title = data.previousTitle;
                                linkType = data.previousType;
                                mapPersonaImages = data.previousMapPersonaImages;
                                linkedJourneyMapId = data.previousLinkedJourneyMapId;
                                icon = data.previousIcon;
                                url = data.previousUrl;
                              }
                              return {
                                ...linkElement,
                                title,
                                type: linkType,
                                mapPersonaImages,
                                linkedJourneyMapId,
                                icon,
                                url,
                              };
                            }
                            return linkElement;
                          }),
                        };
                      }
                      return box;
                    }),
                  };
                }
                return r;
              });

              updateJourneyMap({ rows });

              break;
            }
            case ActionsEnum.DELETE: {
              if (undoRedo) {
                removeLink({
                  id: data.id,
                });
              }
              deleteMapItem(data, 'links');
              break;
            }
            case ActionsEnum.DRAG: {
              updateLink({
                editLinkInput: {
                  id: data?.id as number,
                  positionInput: data.undoPositionInput,
                },
              });
              onHandleDrag(data, 'LINKS', undoRedo);
              break;
            }
          }

          break;
        }
        case JourneyMapRowActionEnum.ROW: {
          switch (action) {
            case ActionsEnum.DRAG: {
              updateRow({
                updateRowInput: {
                  rowId: data.draggedItem.id,
                  index: data.sourceIndex + 1,
                },
              });

              const sourceItems = [...journeyMap.rows];

              const [draggedItem] = sourceItems.splice(data.destinationIndex, 1);
              sourceItems.splice(data.sourceIndex, 0, draggedItem);

              updateJourneyMap({ rows: sourceItems });

              break;
            }
            case ActionsEnum.CREATE: {
              retrieveRow({ id: data.rowItem.id });

              const rows = journeyMap.rows
                .map((row, index) => {
                  if (index === data.index - 1) {
                    return [row, data.rowItem];
                  }
                  return row;
                })
                .flat();

              updateJourneyMap({ rows });

              break;
            }

            case ActionsEnum.DELETE: {
              removeRow({
                id: data.rowItem?.id,
              });
              updateLanes(
                {
                  id: data.rowItem?.id,
                  label: data.rowItem?.label,
                },
                ActionsEnum.DELETE,
              );

              updateJourneyMapRowsCount(journeyMapRowsCount - 1);

              const rows = journeyMap.rows.filter(row => row.id !== data.rowItem.id);

              updateJourneyMap({ rows });

              break;
            }
          }
          break;
        }

        case JourneyMapRowActionEnum.COLUMN_LABEL: {
          const columns = journeyMap.columns.map(itm => {
            if (itm?.id === data.columnId) {
              return {
                ...itm,
                label: undoRedo === UndoRedoEnum.UNDO ? data.previousLabel : data.label,
              };
            }
            return itm;
          });

          updateJourneyMap({ columns });
          updateStages(
            {
              id: data.columnId,
              label: undoRedo === UndoRedoEnum.UNDO ? data.previousLabel : data.label,
            },
            ActionsEnum.UPDATE,
          );
          updateColumn(
            {
              updateColumnInput: {
                columnId: data.columnId,
                label: undoRedo === UndoRedoEnum.UNDO ? data.previousLabel : data.label,
              },
            },
            {
              onSuccess: () => {},
            },
          );
          break;
        }

        case JourneyMapRowActionEnum.COLUMN_BG_COLOR: {
          const columns = journeyMap.columns.map(itm => {
            if (itm?.id === data.columnId) {
              return {
                ...itm,
                bgColor: undoRedo === UndoRedoEnum.UNDO ? data.previousBgColor : data.bgColor,
              };
            }
            return itm;
          });

          updateJourneyMap({ columns });

          updateColumn({
            updateColumnInput: {
              columnId: data.columnId,
              bgColor: undoRedo === UndoRedoEnum.UNDO ? data.previousBgColor : data.bgColor,
            },
          });
          break;
        }

        case JourneyMapRowActionEnum.COLUMN: {
          switch (action) {
            case ActionsEnum.CREATE: {
              retrieveColumn(
                { id: data.column.id },
                {
                  onSuccess: async () => {
                    await onHandleUpdateJourneyMap();
                    updateStages(
                      {
                        id: data.column.id,
                        label: data.column.label,
                      },
                      ActionsEnum.CREATE,
                    );
                  },
                },
              );
              break;
            }
            case ActionsEnum.DELETE: {
              removeColumn(
                { id: data.column.id },
                {
                  onSuccess: async () => {
                    await onHandleUpdateJourneyMap();
                    updateStages(
                      {
                        id: data.column.id,
                        label: data.column.label,
                      },
                      ActionsEnum.DELETE,
                    );
                  },
                },
              );
              break;
            }
            case ActionsEnum.DRAG: {
              updateColumn(
                {
                  updateColumnInput: {
                    columnId: data.column.id,
                    index:
                      undoRedo === UndoRedoEnum.UNDO ? data.sourceIndex : data.destinationIndex,
                  },
                },
                {
                  onSuccess: async () => {
                    await onHandleUpdateJourneyMap();
                  },
                },
              );
              break;
            }
          }
          break;
        }

        case JourneyMapRowTypesEnum.STEPS: {
          switch (action) {
            case ActionsEnum.CREATE: {
              retrieveColumnStep(
                { id: data.step.id },
                {
                  onSuccess: async () => {
                    await onHandleUpdateJourneyMap();
                  },
                },
              );
              break;
            }
            case ActionsEnum.DELETE: {
              removeColumnStep(
                { id: data.step.id },
                {
                  onSuccess: async () => {
                    await onHandleUpdateJourneyMap();
                  },
                },
              );
              break;
            }
            case ActionsEnum.DRAG: {
              const updateSteps = () => {
                updateColumnStep(
                  {
                    addOrUpdateColumnStepInput: {
                      update: {
                        id: data.step.id,
                        columnId:
                          undoRedo === UndoRedoEnum.UNDO
                            ? data.prevStep.columnId
                            : data.step.columnId,
                        index:
                          undoRedo === UndoRedoEnum.UNDO
                            ? data.prevStep.sourceIndex
                            : data.step.sourceIndex,
                      },
                    },
                  },
                  {
                    onSuccess: async () => {
                      await onHandleUpdateJourneyMap();
                    },
                  },
                );
              };

              if (undoRedo === UndoRedoEnum.UNDO && data.newStepId) {
                removeColumnStep(
                  { id: data.newStepId },
                  {
                    onSuccess: async () => {
                      updateSteps();
                    },
                  },
                );
              } else if (undoRedo === UndoRedoEnum.REDO && data.newStepId) {
                retrieveColumnStep(
                  { id: data.newStepId },
                  {
                    onSuccess: async () => {
                      updateSteps();
                    },
                  },
                );
              } else {
                updateSteps();
              }

              break;
            }
          }
          break;
        }
        case JourneyMapRowActionEnum.STEPS_BG_COLOR: {
          updateColumnStep(
            {
              addOrUpdateColumnStepInput: {
                update: {
                  id: data.stepId,
                  bgColor: undoRedo === UndoRedoEnum.UNDO ? data.previousBgColor : data.bgColor,
                },
              },
            },
            {
              onSuccess: async () => {
                await onHandleUpdateJourneyMap();
              },
            },
          );
          break;
        }
        case JourneyMapRowActionEnum.MERGE_UNMERGE_COLUMNS: {
          switch (action) {
            case ActionsEnum.MERGE: {
              mergeColumns(
                {
                  mergeColumnInput: {
                    rowId: data.rowId,
                    startStepId: data.startStepId,
                    endStepId: data.endStepId,
                    endColumnId: data.endColumnId,
                    startColumnId: data?.startColumnId,
                  },
                },
                {
                  onSuccess: responseData => {
                    const { startBoxId, endBoxId } = responseData.mergeJourneyMapColumn;

                    updateRedoActions([]);
                    updateUndoActions([
                      ...undoActions,
                      {
                        id: uuidv4(),
                        type: JourneyMapRowActionEnum.MERGE_UNMERGE_COLUMNS,
                        action: ActionsEnum.UNMERGE,
                        data: {
                          startBoxId,
                          endBoxId,
                          ...data,
                        },
                      },
                    ]);

                    let mergePointLeft: null | number = null;
                    let mergePointRight: null | number = null;
                    let mergeSecondPointArray: JourneyMapColumnType[] = [];

                    const rows: JourneyMapRowType[] = journeyMap.rows.map(r => {
                      if (r.id === data.rowId) {
                        return {
                          ...r,
                          boxes: r.boxes?.map((box, index) => {
                            const endColumn = r?.boxes?.find(
                              boxItem => boxItem.step?.id === data.endStepId,
                            );

                            if (box.step?.id === data.startStepId) {
                              if (box.mergeCount === 1) {
                                mergePointLeft = box.columnId!;
                              }
                              return {
                                ...box,
                                id: box?.id || startBoxId,
                                step: box.step
                                  ? {
                                      ...box.step,
                                      isMerged: true,
                                      isNextColumnMerged: !!(
                                        box.mergeCount === 1 &&
                                        r?.boxes &&
                                        r.boxes[index + 1] &&
                                        box.columnId !== r?.boxes[index + 1]?.columnId
                                      ),
                                    }
                                  : null,
                                mergeCount: box.mergeCount + (endColumn?.mergeCount || 0),
                              };
                            } else if (r.boxes && r.boxes[index + 1]?.step?.id === data.endStepId) {
                              mergePointLeft = box.columnId!;
                              return {
                                ...box,
                                id: box?.id || endBoxId,
                                step: box.step
                                  ? {
                                      ...box.step,
                                      isMerged: true,
                                      isNextColumnMerged:
                                        box.columnId !== r.boxes[index + 1]?.columnId,
                                    }
                                  : null,
                              };
                            } else if (box.step?.id === data.endStepId) {
                              mergePointRight = box.columnId!;
                              return {
                                ...box,
                                id: box?.id || endBoxId,
                                step: box.step
                                  ? {
                                      ...box?.step,
                                      isMerged: true,
                                    }
                                  : null,
                                mergeCount: 0,
                              };
                            }
                            return box;
                          }),
                        };
                      } else {
                        return {
                          ...r,
                          boxes: r.boxes?.map((box, boxIndex) => {
                            if (r.boxes && r.boxes[boxIndex + 1]?.step?.id === data.endStepId) {
                              return {
                                ...box,
                                // id: endBoxId,
                                step: box.step
                                  ? {
                                      ...box.step,
                                      isMerged: true,
                                      isNextColumnMerged:
                                        box.columnId !== r.boxes[boxIndex + 1]?.columnId,
                                    }
                                  : null,
                              };
                            } else if (box?.step?.id === data.endStepId) {
                              return {
                                ...box,
                                // id: endBoxId,
                                step: box.step
                                  ? {
                                      ...box.step,
                                      isMerged: true,
                                    }
                                  : null,
                              };
                            }
                            return box;
                          }),
                        };
                      }
                    });
                    const columns = journeyMap.columns.map((column, index) => {
                      if (column?.id === mergePointLeft) {
                        mergeSecondPointArray = journeyMap?.columns.slice(
                          index + 1,
                          index + 1 + data.endBoxMergeCount,
                        );
                        return {
                          ...column,
                          isMerged: true,

                          isNextColumnMerged:
                            mergePointLeft !== mergePointRight ? true : column?.isNextColumnMerged,
                        };
                      } else if (column?.id === mergePointRight) {
                        return {
                          ...column,
                          isMerged: true,
                        };
                      }

                      return column;
                    });

                    updateJourneyMap({ rows, columns });

                    updateStages(
                      {
                        id: data.startColumnId,
                        newColumnId: data.endColumnId,
                        startColumnId: data?.startBoxMergeCount < 2 ? data?.startColumnId : null,
                        mergePointPrevColumnId: mergePointLeft,
                        mergeSecondPointArray,
                      },
                      ActionsEnum.ADD_MERGE_ID,
                    );
                    data.callback();
                  },
                },
              );
              break;
            }
            case ActionsEnum.UNMERGE: {
              unMergeColumns(
                {
                  unmergeColumnInput: {
                    startStepId: data.startStepId,
                    endStepId: data.endStepId,
                    startColumnId: data?.startColumnId,
                    endColumnId: data.endColumnId,
                    startBoxId: data.startBoxId,
                    endBoxId: data.endBoxId,
                    endBoxMergeCount: data.endBoxMergeCount,
                    startBoxMergeCount: data.startBoxMergeCount,
                  },
                },
                {
                  onSuccess: unmergeData => {
                    const {
                      endColumnIsMerged,
                      startColumnIsMerged,
                      startStepIsMerged,
                      endStepIsMerged,
                      nextColumnMergedCandidateIds,
                    } = unmergeData?.unMergeJourneyMapColumn || {
                      endColumnIsMerged: false,
                      startColumnIsMerged: false,
                      startStepIsMerged: false,
                      endStepIsMerged: false,
                      nextColumnMergedCandidateIds: [],
                    };
                    let isColumnTheSameOnSlicePoint = false;

                    const rows: JourneyMapRowType[] = journeyMap.rows.map(r => {
                      if (r.id === data.rowId) {
                        return {
                          ...r,
                          boxes: r.boxes?.map((box, index) => {
                            if (box.step?.id === data.startStepId) {
                              return {
                                ...box,
                                mergeCount: data.startBoxMergeCount,
                                isMerged: data.isMerged,
                                step: box.step
                                  ? {
                                      ...box.step,
                                      isMerged: startStepIsMerged || false,
                                    }
                                  : null,
                              };
                            } else if (box.step?.id === data.endStepId) {
                              isColumnTheSameOnSlicePoint =
                                !!r?.boxes && box?.columnId === r.boxes[index - 1]?.columnId;
                              return {
                                ...box,
                                isNextColumnMerged: data.isNextColumnMerged,
                                mergeCount: data.endBoxMergeCount,
                                step: box.step
                                  ? {
                                      ...box.step,
                                      isMerged: endStepIsMerged || false,
                                    }
                                  : null,
                              };
                            }
                            return box;
                          }),
                        };
                      }
                      return {
                        ...r,
                        boxes: r.boxes?.map(box => {
                          if (box.step?.id === data.startStepId) {
                            return {
                              ...box,
                              step: box.step
                                ? {
                                    ...box.step,
                                    isMerged: startStepIsMerged || false,
                                  }
                                : null,
                            };
                          } else if (box.step?.id === data.endStepId) {
                            return {
                              ...box,
                              step: box.step
                                ? {
                                    ...box.step,
                                    isMerged: endStepIsMerged || false,
                                  }
                                : null,
                            };
                          }

                          return box;
                        }),
                      };
                    });

                    const endColumnIndex = journeyMap.columns.findIndex(
                      column => column.id === data.endColumnId,
                    );
                    const prevEndColumn =
                      endColumnIndex !== -1 ? journeyMap.columns[endColumnIndex - 1] : null;
                    const columns = journeyMap?.columns?.map(column => {
                      if (data.startBoxMergeCount > 1 && column?.id === prevEndColumn?.id) {
                        return {
                          ...column,
                          isMerged: nextColumnMergedCandidateIds?.some(id => id === column?.id),
                          isNextColumnMerged: nextColumnMergedCandidateIds?.some(
                            id => id === column?.id,
                          ),
                        };
                      } else if (column?.id === data.endColumnId) {
                        return {
                          ...column,
                          isMerged: endColumnIsMerged || false,
                          isNextColumnMerged: nextColumnMergedCandidateIds?.some(
                            id => id === column?.id,
                          ),
                        };
                      } else if (column?.id === data?.startColumnId) {
                        return {
                          ...column,
                          isMerged: startColumnIsMerged || false,
                          isNextColumnMerged: nextColumnMergedCandidateIds?.some(
                            id => id === column?.id,
                          ),
                        };
                      }

                      return column;
                    });

                    updateJourneyMap({ rows, columns });

                    updateStages(
                      {
                        id: data.startColumnId,
                        newColumnId: !isColumnTheSameOnSlicePoint ? data.endColumnId : null,
                        startColumnId: data?.startBoxMergeCount < 2 ? data?.startColumnId : null,
                      },
                      ActionsEnum.DELETE_MERGE_ID,
                    );

                    data.callback();
                  },
                },
              );
              break;
            }
          }
          break;
        }
      }
    },
    [
      addBoxElement,
      addLink,
      addMapNewItem,
      addOrUpdateOutcome,
      addTouchPoints,
      deleteMapItem,
      journeyMap.columns,
      journeyMap.rows,
      journeyMapRowsCount,
      mergeColumns,
      onHandleDrag,
      onHandleUpdateJourneyMap,
      redoActions,
      removeBoxElement,
      removeColumn,
      removeColumnStep,
      removeLink,
      removeMetrics,
      removeOutcome,
      removeRow,
      removeTouchPoint,
      restoreMetrics,
      retrieveColumn,
      retrieveColumnStep,
      retrieveRow,
      retryMetrics,
      selectedJourneyMapPersona?.id,
      unMergeColumns,
      undoActions,
      updateBoxElement,
      updateColumn,
      updateColumnStep,
      updateFlippedText,
      updateJourneyMap,
      updateJourneyMapRowsCount,
      updateLanes,
      updateLink,
      updateLinkBGColor,
      updateMetrics,
      updateRedoActions,
      updateRow,
      updateStages,
      updateTouchPoint,
      updateUndoActions,
    ],
  );

  return { updateMapByType };
};
