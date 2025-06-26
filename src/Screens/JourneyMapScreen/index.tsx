import { useCallback, useEffect, useMemo, useState } from 'react';

import './styles.scss';

import { useWuShowToast } from '@npm-questionpro/wick-ui-lib';
import { useParams } from '@tanstack/react-router';
import { v4 as uuidv4 } from 'uuid';

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
import { JOURNEY_MAP_LIMIT } from '@/constants/pagination';
import { debounced800 } from '@/hooks/useDebounce.ts';
import JourneyMapHeader from '@/Screens/JourneyMapScreen/components/JourneyMapHeader';
import { useSelectLayerForMap } from '@/Screens/JourneyMapScreen/hooks/useSelectLayerForMap.tsx';
import { JourneyMapType } from '@/Screens/JourneyMapScreen/types.ts';
import { useBreadcrumbStore } from '@/store/breadcrumb.ts';
import { useJourneyMapStore } from '@/store/journeyMap';
import { useLayerStore } from '@/store/layers.ts';
import { useUndoRedoStore } from '@/store/undoRedo.ts';
import { useUserStore } from '@/store/user.ts';
import { ErrorWithStatus, UserType } from '@/types';
import { ActionsEnum, JourneyMapRowActionEnum } from '@/types/enum.ts';

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
    updateSelectedJourneyMapPersona,
    updateIsOpenSelectedJourneyMapPersonaInfo,
  } = useJourneyMapStore();

  const { currentLayer, setCurrentLayer, setLayers } = useLayerStore();
  const { undoActions, updateUndoActions, updateRedoActions } = useUndoRedoStore();
  const { setBreadcrumbs } = useBreadcrumbStore();

  const isLayerModeOn = !currentLayer?.isBase;

  const [isLoadingFullJourneyMap, setIsLoadingFullJourneyMap] = useState<boolean>(false);
  const [isLoadingJourneyMapRows, setIsLoadingJourneyMapRows] = useState<boolean>(true);
  const [isScrollPagination, setIsScrollPagination] = useState<boolean>(false);
  const [replaceMapUser, setReplaceMapUser] = useState<UserType | null>(null);

  const { mutate: clearUserMapsHistory } = useClearUserMapsHistoryMutation<
    Error,
    ClearUserMapsHistoryMutation
  >();

  const { mutate: updateColumn } = useUpdateJourneyMapColumnMutation<
    ErrorWithStatus,
    UpdateJourneyMapColumnMutation
  >();

  const { isLoading: isLoadingMapSelectedPersonas } = useGetMapSelectedPersonasQuery<
    GetMapSelectedPersonasQuery,
    Error
  >(
    {
      mapId: +mapId,
    },
    {
      // onSuccess: response => {
      //   setMapAssignedPersonas(response?.getMapSelectedPersonas);
      // },
    },
  );

  useGetOrganizationUsersQuery<GetOrganizationUsersQuery, Error>(
    {
      paginationInput: {
        page: 1,
        perPage: 100,
      },
    },
    {
      enabled: !isGuest,
    },
  );

  useGetMapOutcomeGroupsForRowCreationQuery<GetMapOutcomeGroupsForRowCreationQuery, Error>({
    mapId: +mapId,
  });

  useGetMapByVersionIdQuery<GetMapByVersionIdQuery, Error>(
    {
      getMapByVersionIdInput: {
        versionId: journeyMapVersion?.id,
      },
    },
    {
      // onSuccess: response => {
      //   setDefaultJourneyMap(journeyMap);
      //   setJourneyMap(prev => ({
      //     ...prev,
      //     title: response.getMapByVersionId.title?.trim() || 'Untitled',
      //     columns: response.getMapByVersionId.columns || [],
      //     rows: response.getMapByVersionId.rows as any,
      //   }));
      //   setMapAssignedPersonas(response.getMapByVersionId.personas);
      // },
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
    isFetching: isFetchingNextPageJourneyMapRows,
    hasNextPage: hasNextPageJourneyMapRows,
    fetchNextPage: fetchNextPageJourneyMapRows,
  } = useInfiniteGetJourneyMapRowsQuery<GetJourneyMapRowsQuery, Error>(
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
            const newBoxes: Array<BoxItemType> = [...boxes];
            const dragBoxes: Array<BoxItemType> = [];

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
    setIsScrollPagination(true);
    if (!isLayerModeOn && hasNextPageJourneyMapRows) {
      await fetchNextPageJourneyMapRows();
    }
  }, [fetchNextPageJourneyMapRows, hasNextPageJourneyMapRows, isLayerModeOn]);

  const onHandleCloseDrawer = () => {
    // setCommentsDrawer(prev => ({
    //   ...prev,
    //   isOpen: !prev?.isOpen,
    // }));
  };

  const mapColumns = useMemo(() => {
    return journeyMap?.columns || [];
  }, [journeyMap?.columns]);

  const mapSteps = useMemo(() => {
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
      // todo
      // setSelectedPersona(null);
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
    // todo
    // emitToSocketMap(JourneyMapEventsEnum.JOIN_MAP, {
    //   id: mapID,
    //   // personaId: selectedPersona?.id,
    // });
    // socketMap?.on(JourneyMapEventsEnum.REPLACE_MAP_VERSION, ({ user }: { user: Usertype }) => {
    //   setReplaceMapUser(user);
    // });
    // return () => {
    //   unEmitToSocketMap(JourneyMapEventsEnum.LEAVE_MAP, {
    //     id: mapID,
    //     // personaId: selectedPersona?.id,
    //   });
    // };
  }, []);

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
    if (dataBoardById) {
      updateJourneyMap({
        workspaceId: dataBoardById?.getBoardById.workspace?.id || null,
      });
    }
  }, [dataBoardById, updateJourneyMap]);

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
      {/*{replaceMapUser && user.userID !== replaceMapUser.userID && (*/}
      {/*  <Modal open={true}>*/}
      {/*    <div className={'version-modal'}>*/}
      {/*      <ModalHeader title={'Version'} />*/}
      {/*      <div className={'version-modal--content'}>*/}
      {/*        <span>{replaceMapUser.emailAddress} changed map version</span>*/}
      {/*      </div>*/}

      {/*      <ModalFooterButtons*/}
      {/*        handleSecondButtonClick={() => window.location.reload()}*/}
      {/*        secondButtonName={'Reload'}*/}
      {/*      />*/}
      {/*    </div>*/}
      {/*  </Modal>*/}
      {/*)}*/}
      {/*<ErrorBoundary>*/}
      {/*  <Drawer*/}
      {/*    anchor={'left'}*/}
      {/*    data-testid="drawer-test-id"*/}
      {/*    open={commentsDrawer.isOpen}*/}
      {/*    onClose={() => onHandleCloseDrawer()}>*/}
      {/*    <CommentsDrawer commentsDrawer={commentsDrawer} onClose={() => onHandleCloseDrawer()} />*/}
      {/*  </Drawer>*/}
      {/*</ErrorBoundary>*/}
      <JourneyMapHeader
        title={journeyMap?.title}
        mapId={+mapId}
        boardId={+boardId}
        isGuest={isGuest}
        changeMapFullLoadingState={changeMapFullLoadingState}
      />

      <div className={'journey-map-wrapper'}>
        {/*<ErrorBoundary>*/}
        {/*  <JourneyMapSelectedPersona />*/}
        {/*</ErrorBoundary>*/}

        <div className={'journey-map-wrapper--map-block'}>
          <div
            className={`${isGuest || journeyMapVersion ? 'journey-map-guest' : ''} journey-map`}
            id={'journey-map'}>
            <>
              {/*<ErrorBoundary>*/}
              {/*  <JourneyMapColumns*/}
              {/*    onColumnDragEnd={onColumnDragEnd}*/}
              {/*    columns={mapColumns}*/}
              {/*    isGuest={isGuest || !!journeyMapVersion}*/}
              {/*  />*/}
              {/*</ErrorBoundary>*/}

              {isLoadingJourneyMapRows ? (
                <>
                  <CustomLoader />
                </>
              ) : (
                <>
                  {/*<ErrorBoundary>*/}
                  {/*  <JourneyMapSteps*/}
                  {/*    steps={mapSteps}*/}
                  {/*    columns={mapColumns}*/}
                  {/*    isGuest={isGuest || !!journeyMapVersion}*/}
                  {/*  />*/}
                  {/*</ErrorBoundary>*/}
                  {/*<ErrorBoundary>*/}
                  {/*  <JourneyMapRows*/}
                  {/*    isGuest={isGuest || !!journeyMapVersion}*/}
                  {/*    isScrollPagination={isScrollPagination}*/}
                  {/*    isFetchingNextPageJourneyMapRows={isFetchingNextPageJourneyMapRows}*/}
                  {/*    onHandleFetchNextPageJourneyMapRows={onHandleFetchNextPageJourneyMapRows}*/}
                  {/*  />*/}
                  {/*</ErrorBoundary>*/}
                </>
              )}
            </>
          </div>
        </div>
      </div>

      {/*<JourneyMapFooter isGuest={isGuest} workspaceId={boardById?.getBoardById.workspace.id!} />*/}
    </>
  );
};

export default JourneyMapScreen;
