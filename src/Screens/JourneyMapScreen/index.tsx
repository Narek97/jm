import { useCallback, useEffect, useMemo, useState } from 'react';

import './styles.scss';

import { Modal } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import { useWuShowToast } from '@npm-questionpro/wick-ui-lib';
import { useParams } from '@tanstack/react-router';
import { v4 as uuidv4 } from 'uuid';

import CommentsDrawer from './components/JourneyMapCardCommentsDrawer';
import JourneyMapFooter from './components/JourneyMapFooter';

import {
  GetJourneyMapRowsQuery,
  useInfiniteGetJourneyMapRowsQuery,
} from '@/api/infinite-queries/generated/getJourneyMapRows.generated';
import {
  ClearUserMapsHistoryMutation,
  useClearUserMapsHistoryMutation,
} from '@/api/mutations/generated/clearUserMapsHistory.generated.ts';
import {
  UpdateJourneyMapColumnMutation,
  useUpdateJourneyMapColumnMutation,
} from '@/api/mutations/generated/updateJourneyMapColumn.generated';
import {
  GetBoardByIdQuery,
  useGetBoardByIdQuery,
} from '@/api/queries/generated/getBoardById.generated.ts';
import {
  GetJourneyMapQuery,
  useGetJourneyMapQuery,
} from '@/api/queries/generated/getJourneyMap.generated';
import {
  GetLayersByMapIdQuery,
  useGetLayersByMapIdQuery,
} from '@/api/queries/generated/getLayersByMapId.generated.ts';
import {
  GetMapByVersionIdQuery,
  useGetMapByVersionIdQuery,
} from '@/api/queries/generated/getMapByVersionId.generated';
import {
  GetMapSelectedPersonasQuery,
  useGetMapSelectedPersonasQuery,
} from '@/api/queries/generated/getMapSelectedPersonas.generated';
import {
  GetOrganizationUsersQuery,
  useGetOrganizationUsersQuery,
} from '@/api/queries/generated/getOrganizationUsers.generated';
import {
  GetMapOutcomeGroupsForRowCreationQuery,
  useGetMapOutcomeGroupsForRowCreationQuery,
} from '@/api/queries/generated/getOutcomeGroupsForMap.generated.ts';
import { MapRowTypeEnum } from '@/api/types.ts';
import CustomError from '@/Components/Shared/CustomError';
import CustomLoader from '@/Components/Shared/CustomLoader';
import CustomModalFooterButtons from '@/Components/Shared/CustomModalFooterButtons';
import CustomModalHeader from '@/Components/Shared/CustomModalHeader';
import { JOURNEY_MAP_LIMIT, USERS_LIMIT } from '@/constants/pagination';
import ErrorBoundary from '@/Features/ErrorBoundary';
import { debounced800 } from '@/hooks/useDebounce.ts';
import JourneyMapColumns from '@/Screens/JourneyMapScreen/components/JourneyMapColumns';
import JourneyMapHeader from '@/Screens/JourneyMapScreen/components/JourneyMapHeader';
import JourneyMapRows from '@/Screens/JourneyMapScreen/components/JourneyMapRows';
import JourneyMapSelectedPersona from '@/Screens/JourneyMapScreen/components/JourneyMapSelectedPersona';
import JourneyMapSteps from '@/Screens/JourneyMapScreen/components/JourneyMapSteps';
import {
  emitToSocketMap,
  socketMap,
  unEmitToSocketMap,
} from '@/Screens/JourneyMapScreen/helpers/socketConnection.ts';
import {
  BoxType,
  JourneyMapRowType,
  JourneyMapType,
  MapOutcomeGroupsForRowCreationType,
  MapSelectedPersonasType,
} from '@/Screens/JourneyMapScreen/types.ts';
import { useBreadcrumbStore } from '@/store/breadcrumb.ts';
import { useNotesAndCommentsDrawerStore } from '@/store/comments.ts';
import { useJourneyMapStore } from '@/store/journeyMap';
import { useLayerStore } from '@/store/layers.ts';
import { useUndoRedoStore } from '@/store/undoRedo.ts';
import { useUserStore } from '@/store/user.ts';
import { ErrorWithStatus, UserType } from '@/types';
import { ActionsEnum, JourneyMapEventsEnum, JourneyMapRowActionEnum } from '@/types/enum.ts';

const JourneyMapScreen = ({ isGuest }: { isGuest: boolean }) => {
  const { boardId, mapId } = useParams({
    from: '/_authenticated/_secondary-sidebar-layout/board/$boardId/journey-map/$mapId/',
  });

  const { showToast } = useWuShowToast();
  const { user } = useUserStore();
  const {
    journeyMap,
    journeyMapVersion,
    mapAssignedPersonas,
    selectedJourneyMapPersona,
    updateJourneyMap,
    updateJourneyMapVersion,
    updateMapAssignedPersonas,
    updateSelectedJourneyMapPersona,
    updateDefaultJourneyMap,
    updateJourneyMapRowsCount,
    updateIsOpenSelectedJourneyMapPersonaInfo,
    updateMapOutcomeGroups,
  } = useJourneyMapStore();

  const { currentLayer, setCurrentLayer, setLayers } = useLayerStore();
  const { undoActions, updateUndoActions, updateRedoActions } = useUndoRedoStore();
  const { setBreadcrumbs } = useBreadcrumbStore();
  const { notesAndCommentsDrawer, updateNotesAndCommentsDrawer } = useNotesAndCommentsDrawerStore();

  const isLayerModeOn = !currentLayer?.isBase;

  const [isLoadingFullJourneyMap, setIsLoadingFullJourneyMap] = useState<boolean>(false);
  const [isLoadingJourneyMapRows, setIsLoadingJourneyMapRows] = useState<boolean>(true);
  const [replaceMapUser, setReplaceMapUser] = useState<UserType | null>(null);

  const { mutate: clearUserMapsHistory } = useClearUserMapsHistoryMutation<
    Error,
    ClearUserMapsHistoryMutation
  >();

  const { mutate: updateColumn } = useUpdateJourneyMapColumnMutation<
    ErrorWithStatus,
    UpdateJourneyMapColumnMutation
  >();

  const { data: dataMapSelectedPersonas, isLoading: isLoadingMapSelectedPersonas } =
    useGetMapSelectedPersonasQuery<GetMapSelectedPersonasQuery, Error>({
      mapId: +mapId,
    });

  useGetOrganizationUsersQuery<GetOrganizationUsersQuery, Error>(
    {
      paginationInput: {
        page: 1,
        perPage: USERS_LIMIT,
      },
    },
    {
      enabled: !isGuest,
    },
  );

  const { data: dataMapOutcomeGroups } = useGetMapOutcomeGroupsForRowCreationQuery<
    GetMapOutcomeGroupsForRowCreationQuery,
    Error
  >({
    mapId: +mapId,
  });

  const { data: dataMapByVersionId } = useGetMapByVersionIdQuery<GetMapByVersionIdQuery, Error>(
    {
      getMapByVersionIdInput: {
        versionId: journeyMapVersion?.id,
      },
    },
    {
      enabled: !!journeyMapVersion,
    },
  );

  const getActiveHeaderPersonas = useCallback(() => {
    const activePersonas: number[] = [];
    mapAssignedPersonas.forEach(itm => {
      if (itm.isSelected) {
        activePersonas.push(itm.id);
      }
    });
    return activePersonas;
  }, [mapAssignedPersonas]);

  const inputParams = useMemo(
    () => ({
      mapId: +mapId,
      personaIds: selectedJourneyMapPersona
        ? [selectedJourneyMapPersona.id]
        : getActiveHeaderPersonas(),
      overView: !selectedJourneyMapPersona,
      columnLimit: 100,
      columnOffset: 0,
    }),
    [getActiveHeaderPersonas, mapId, selectedJourneyMapPersona],
  );

  const {
    data: dataJourneyMapRows,
    isFetching: isFetchingNextPageJourneyMapRows,
    hasNextPage: hasNextPageJourneyMapRows,
    fetchNextPage: fetchNextPageJourneyMapRows,
  } = useInfiniteGetJourneyMapRowsQuery<{ pages: GetJourneyMapRowsQuery[] }, Error>(
    {
      getJourneyMapInput: {
        ...inputParams,
        rowLimit: JOURNEY_MAP_LIMIT,
        rowOffset: 0,
        ...(!currentLayer?.isBase
          ? {
              layerId: currentLayer.id,
            }
          : {}),
      },
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        if (!lastPage.getJourneyMap.rows || !lastPage.getJourneyMap.rows.length) {
          return undefined;
        }
        return {
          getJourneyMapInput: {
            ...inputParams,
            rowLimit: JOURNEY_MAP_LIMIT,
            rowOffset: allPages.length * JOURNEY_MAP_LIMIT,
            ...(!currentLayer?.isBase
              ? {
                  layerId: currentLayer.id,
                }
              : {}),
          },
        };
      },
      initialPageParam: 0,
      enabled: !isLoadingMapSelectedPersonas,
    },
  );

  const { data: dataBoardById } = useGetBoardByIdQuery<GetBoardByIdQuery, Error>(
    {
      id: +boardId,
    },
    {
      enabled: !isGuest,
    },
  );

  const {
    data: dataJourneyMap,
    isPending: isLoadingJourneyMap,
    isFetching: isFetchingJourneyMap,
    error: errorJourneyMap,
  } = useGetJourneyMapQuery<GetJourneyMapQuery, Error>(
    {
      getJourneyMapInput: {
        mapId: +mapId,
        rowLimit: JOURNEY_MAP_LIMIT,
        rowOffset: 0,
        columnLimit: 100,
        columnOffset: 0,
        ...(!currentLayer?.isBase
          ? {
              layerId: currentLayer.id,
            }
          : {}),
      },
    },
    {
      enabled: isGuest || !!dataBoardById?.getBoardById.workspace?.id,
    },
  );

  const { data: dataLayers } = useGetLayersByMapIdQuery<GetLayersByMapIdQuery, Error>(
    {
      getLayersInput: {
        mapId: +mapId,
      },
    },
    {
      enabled: !isGuest,
    },
  );

  const updateColumnByFieldName = useCallback(
    ({
      fieldName,
      value,
      columnId,
      dragColumnId,
      initialMap,
    }: {
      fieldName: string;
      value: string | number;
      columnId: number;
      dragColumnId: number;
      initialMap: JourneyMapType;
    }) => {
      debounced800(() => {
        const updatedColumns = journeyMap?.columns?.map(itm => {
          if (itm?.id === columnId) {
            return { ...itm, [fieldName]: value };
          }
          return itm;
        });
        updateJourneyMap({ columns: updatedColumns });

        updateColumn(
          {
            updateColumnInput: {
              columnId,
              dragColumnId,
              [fieldName]: value,
            },
          },
          {
            onError: error => {
              updateJourneyMap(initialMap);
              if (error.status === 400) {
                showToast({
                  variant: 'warning',
                  message: "You can't drop items between the merged columns.",
                });
              }
            },
          },
        );
      });
    },
    [journeyMap?.columns, showToast, updateColumn, updateJourneyMap],
  );

  const checkDropDestination = useCallback(
    (columnIndex: number) => {
      const destinationColumnIsMerged =
        journeyMap?.columns && journeyMap?.columns[columnIndex].isMerged;
      if (destinationColumnIsMerged) {
        showToast({
          variant: 'warning',
          message: 'Action denied, destination place contains merged boxes',
        });
        return false;
      }
      return true;
    },
    [journeyMap?.columns, showToast],
  );

  const onColumnDragEnd = useCallback(
    (result: any) => {
      if (!result.destination) return;
      const { source, destination } = result;
      if (destination?.index !== source?.index) {
        const journeyMapColumns = journeyMap.columns || [];
        const journeyMapRows = journeyMap.rows || [];
        const destinationIndex = result.destination.index;
        const index =
          source.index < destinationIndex && destinationIndex + 1 < journeyMapColumns?.length
            ? destinationIndex + 1
            : destinationIndex;

        const destinationColumnId = journeyMapColumns[index]?.id;
        const isDropAllowed = checkDropDestination(index);

        if (isDropAllowed) {
          const [draggedItem] = journeyMapColumns.splice(result.source.index, 1);

          journeyMapColumns.splice(destinationIndex, 0, draggedItem);

          const newJourneyMapRows = journeyMapRows.map(row => {
            const boxes = row.boxes ? [...row.boxes] : [];
            const newBoxes: Array<BoxType> = [...boxes];
            const dragBoxes: Array<BoxType> = [];

            boxes.forEach((box, index) => {
              if (box.columnId === +result.draggableId) {
                newBoxes.splice(index - dragBoxes.length, 1);
                dragBoxes.push(box);
              }
            });

            if (destinationIndex) {
              let startIndex = 0;
              const beforeDropColumns = journeyMapColumns.slice(0, destinationIndex);

              beforeDropColumns.forEach(c => {
                startIndex += c.size;
              });

              newBoxes.splice(startIndex, 0, ...dragBoxes);
            } else {
              newBoxes.splice(0, 0, ...dragBoxes);
            }

            if (row?.rowFunction === MapRowTypeEnum.Sentiment) {
              const newRowWithPersonas = row.rowWithPersonas.map(rowPersonaItem => {
                const statesList = rowPersonaItem?.personaStates
                  ? [...(rowPersonaItem?.personaStates || [])]
                  : [];
                const newPersonaStates = [...statesList];
                const dragPersonaBoxes: any[] = [];
                statesList.forEach((box, index) => {
                  if (box.columnId === +result.draggableId) {
                    newPersonaStates.splice(index - dragPersonaBoxes.length, 1);
                    dragPersonaBoxes.push(box);
                  }
                });
                if (destinationIndex) {
                  let startIndex = 0;
                  const beforeDropColumns = journeyMapColumns.slice(0, destinationIndex);
                  beforeDropColumns.forEach(c => {
                    startIndex += c.size;
                  });
                  newPersonaStates.splice(startIndex, 0, ...dragPersonaBoxes);
                } else {
                  newPersonaStates.splice(0, 0, ...dragPersonaBoxes);
                }
                return { ...rowPersonaItem, personaStates: newPersonaStates };
              });
              return {
                ...row,
                rowWithPersonas: newRowWithPersonas,
                boxes: newBoxes,
              };
            }
            return {
              ...row,
              boxes: newBoxes,
            };
          });

          updateRedoActions([]);

          updateUndoActions([
            ...undoActions,
            {
              id: uuidv4(),
              type: JourneyMapRowActionEnum.COLUMN,
              action: ActionsEnum.DRAG,
              data: {
                sourceIndex: source.index + 1,
                destinationIndex: destination.index + 1,
                column: draggedItem,
              },
            },
          ]);

          updateJourneyMap({
            rows: newJourneyMapRows,
            columns: journeyMapColumns,
          });
          updateColumnByFieldName({
            fieldName: 'index',
            value: destination?.index + 1,
            columnId: draggedItem?.id,
            dragColumnId: destinationColumnId,
            initialMap: journeyMap,
          });
        }
      }
    },
    [
      checkDropDestination,
      journeyMap,
      undoActions,
      updateColumnByFieldName,
      updateJourneyMap,
      updateRedoActions,
      updateUndoActions,
    ],
  );

  const onHandleFetchNextPageJourneyMapRows = useCallback(async () => {
    if (!isLayerModeOn && hasNextPageJourneyMapRows) {
      await fetchNextPageJourneyMapRows();
    }
  }, [fetchNextPageJourneyMapRows, hasNextPageJourneyMapRows, isLayerModeOn]);

  const onHandleCloseDrawer = () => {
    updateNotesAndCommentsDrawer({
      isOpen: false,
    });
  };

  const mapColumns = useMemo(() => {
    return journeyMap?.columns || [];
  }, [journeyMap?.columns]);

  const mapStep = useMemo(() => {
    return journeyMap?.rows[0] || [];
  }, [journeyMap?.rows]);

  const changeMapFullLoadingState = () => {
    setIsLoadingFullJourneyMap(true);
  };

  useEffect(() => {
    return () => {
      clearUserMapsHistory({});
      updateJourneyMapVersion(null);
      updateJourneyMap({
        title: 'Untitled',
        workspaceId: null,
        columns: [],
        rows: [],
      });
      updateSelectedJourneyMapPersona(null);
      updateIsOpenSelectedJourneyMapPersonaInfo(false);
    };
  }, [
    clearUserMapsHistory,
    setCurrentLayer,
    updateIsOpenSelectedJourneyMapPersonaInfo,
    updateJourneyMap,
    updateJourneyMapVersion,
    updateSelectedJourneyMapPersona,
  ]);

  useEffect(() => {
    emitToSocketMap(JourneyMapEventsEnum.JOIN_MAP, {
      id: mapId,
      // personaId: selectedPersona?.id,
    });
    socketMap?.on(JourneyMapEventsEnum.REPLACE_MAP_VERSION, ({ user }: { user: UserType }) => {
      setReplaceMapUser(user);
    });
    return () => {
      unEmitToSocketMap(JourneyMapEventsEnum.LEAVE_MAP, {
        id: mapId,
        // personaId: selectedPersona?.id,
      });
    };
  }, [mapId]);

  useEffect(() => {
    if (dataLayers) {
      if (dataLayers.getLayersByMapId?.layers[0]) {
        setCurrentLayer({
          ...(dataLayers?.getLayersByMapId?.layers[0] || {}),
          isBase: true,
        });
      }
      setLayers(dataLayers?.getLayersByMapId?.layers || []);
    }
  }, [dataLayers, setCurrentLayer, setLayers]);

  useEffect(() => {
    if (dataJourneyMap) {
      updateJourneyMap({
        title: dataJourneyMap.getJourneyMap.map.title?.trim() || 'Untitled',
        columns: dataJourneyMap.getJourneyMap.columns || [],
      });
    }
  }, [dataJourneyMap, updateJourneyMap]);

  useEffect(() => {
    if (dataJourneyMapRows) {
      setIsLoadingFullJourneyMap(false);
      updateJourneyMapRowsCount(
        isLayerModeOn
          ? dataJourneyMapRows.pages[0].getJourneyMap.rows.length
          : dataJourneyMapRows.pages[0].getJourneyMap.rowCount,
      );

      const rows = dataJourneyMapRows.pages.reduce((acc: Array<JourneyMapRowType>, curr) => {
        if (curr?.getJourneyMap.rows) {
          return [...acc, ...(curr.getJourneyMap.rows as Array<JourneyMapRowType>)];
        }
        return acc;
      }, []);

      updateJourneyMap({
        rows,
      });
      setIsLoadingJourneyMapRows(false);
    }
  }, [dataJourneyMapRows, isLayerModeOn, updateJourneyMap, updateJourneyMapRowsCount]);

  useEffect(() => {
    if (dataBoardById) {
      updateJourneyMap({
        workspaceId: dataBoardById?.getBoardById.workspace?.id || null,
      });
    }
  }, [dataBoardById, updateJourneyMap]);

  useEffect(() => {
    if (dataMapOutcomeGroups) {
      updateMapOutcomeGroups(
        (dataMapOutcomeGroups.getMapOutcomeGroupsForRowCreation as MapOutcomeGroupsForRowCreationType[]) ||
          [],
      );
    }
  }, [dataMapOutcomeGroups, updateMapOutcomeGroups]);

  useEffect(() => {
    if (dataMapSelectedPersonas) {
      updateMapAssignedPersonas(dataMapSelectedPersonas.getMapSelectedPersonas);
    }
  }, [dataMapSelectedPersonas, updateMapAssignedPersonas]);

  useEffect(() => {
    if (dataMapByVersionId) {
      updateDefaultJourneyMap(journeyMap);
      updateJourneyMap({
        title: dataMapByVersionId.getMapByVersionId.title?.trim() || 'Untitled',
        columns: dataMapByVersionId.getMapByVersionId.columns || [],
        rows: (dataMapByVersionId.getMapByVersionId.rows as unknown as JourneyMapRowType[]) || [],
      });
      updateMapAssignedPersonas(
        (dataMapByVersionId.getMapByVersionId.personas as MapSelectedPersonasType[]) || [],
      );
    }
  }, [
    dataMapByVersionId,
    journeyMap,
    updateDefaultJourneyMap,
    updateJourneyMap,
    updateMapAssignedPersonas,
  ]);

  useEffect(() => {
    setBreadcrumbs([
      {
        name: 'Workspaces',
        pathname: '/workspaces',
      },
      {
        name: `${dataBoardById?.getBoardById.workspace.name || '...'}`,
        pathname: `/workspace/${dataBoardById?.getBoardById.workspace.id}/boards`,
      },
      {
        name: `${dataBoardById?.getBoardById.name || '...'}`,
        pathname: `/board/${dataBoardById?.getBoardById.id}/journies`,
      },
      {
        name: `${journeyMap.title?.trim() || 'Untitled'}`,
      },
    ]);
  }, [
    dataBoardById?.getBoardById.id,
    dataBoardById?.getBoardById.name,
    dataBoardById?.getBoardById.workspace.id,
    dataBoardById?.getBoardById.workspace.name,
    journeyMap.title,
    setBreadcrumbs,
  ]);

  if (isLoadingJourneyMap || isLoadingFullJourneyMap || (isLayerModeOn && isFetchingJourneyMap)) {
    return (
      <div className={'journey-map-wrapper'}>
        <CustomLoader />
      </div>
    );
  }

  if (errorJourneyMap) {
    return (
      <div className={'journey-map-wrapper'}>
        <CustomError error={errorJourneyMap?.message} />
      </div>
    );
  }

  return (
    <>
      {replaceMapUser && user?.userID !== replaceMapUser.userID && (
        <Modal open={true}>
          <div className={'version-modal'}>
            <CustomModalHeader title={'Version'} />
            <div className={'version-modal--content'}>
              <span>{replaceMapUser.emailAddress} changed map version</span>
            </div>

            <CustomModalFooterButtons
              handleSecondButtonClick={() => window.location.reload()}
              secondButtonName={'Reload'}
            />
          </div>
        </Modal>
      )}
      <ErrorBoundary>
        <Drawer
          anchor={'left'}
          data-testid="drawer-test-id"
          open={notesAndCommentsDrawer.isOpen}
          onClose={onHandleCloseDrawer}>
          <CommentsDrawer onClose={onHandleCloseDrawer} />
        </Drawer>
      </ErrorBoundary>
      <JourneyMapHeader
        title={journeyMap?.title}
        mapId={+mapId}
        boardId={+boardId}
        isGuest={isGuest}
        changeMapFullLoadingState={changeMapFullLoadingState}
      />

      <div className={'journey-map-wrapper'}>
        <ErrorBoundary>
          <JourneyMapSelectedPersona mapId={+mapId} />
        </ErrorBoundary>

        <div className={'journey-map-wrapper--map-block'}>
          <div
            className={`${isGuest || journeyMapVersion ? 'journey-map-guest' : ''} journey-map`}
            id={'journey-map'}>
            <>
              <ErrorBoundary>
                <JourneyMapColumns
                  onColumnDragEnd={onColumnDragEnd}
                  columns={mapColumns}
                  mapId={+mapId}
                  isGuest={isGuest || !!journeyMapVersion}
                />
              </ErrorBoundary>

              {isLoadingJourneyMapRows ? (
                <>
                  <CustomLoader />
                </>
              ) : (
                <>
                  <ErrorBoundary>
                    <JourneyMapSteps
                      step={mapStep}
                      columns={mapColumns}
                      isGuest={isGuest || !!journeyMapVersion}
                    />
                  </ErrorBoundary>
                  <ErrorBoundary>
                    <JourneyMapRows
                      isGuest={isGuest || !!journeyMapVersion}
                      isFetchingNextPageJourneyMapRows={isFetchingNextPageJourneyMapRows}
                      onHandleFetchNextPageJourneyMapRows={onHandleFetchNextPageJourneyMapRows}
                    />
                  </ErrorBoundary>
                </>
              )}
            </>
          </div>
        </div>
      </div>

      <JourneyMapFooter
        isGuest={isGuest}
        workspaceId={dataBoardById?.getBoardById.workspace.id}
        mapId={mapId}
      />
    </>
  );
};

export default JourneyMapScreen;
