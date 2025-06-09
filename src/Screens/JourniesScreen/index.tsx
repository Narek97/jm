import { ChangeEvent, lazy, Suspense, useCallback, useMemo, useState } from 'react';

import './style.scss';
import { useWuShowToast, WuButton, WuTooltip } from '@npm-questionpro/wick-ui-lib';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from '@tanstack/react-router';
import dayjs from 'dayjs';
import fromNow from 'dayjs/plugin/relativeTime';

import AtlasView from './components/AtlasView';
import SortableJourneys from './components/SortableJourneys';
import { JOURNEY_MAP_OPTIONS, JOURNEY_MAPS_TABLE_COLUMNS, JOURNEYS_VIEW_TABS } from './constants';
import WorkspaceAnalytics from '../../Features/WorkspaceAnalytics';

import {
  CreateJourneyMapMutation,
  useCreateJourneyMapMutation,
} from '@/api/mutations/generated/createJourneyMap.generated.ts';
import {
  CreateParentMapMutation,
  useCreateParentMapMutation,
} from '@/api/mutations/generated/createParentMap.generated';
import {
  UpdateJourneyMapMutation,
  useUpdateJourneyMapMutation,
} from '@/api/mutations/generated/updateJourneyMap.generated.ts';
import {
  GetBoardByIdQuery,
  useGetBoardByIdQuery,
} from '@/api/queries/generated/getBoardById.generated';
import {
  GetBoardOutcomesStatQuery,
  useGetBoardOutcomesStatQuery,
} from '@/api/queries/generated/getBoardOutcomesStat.generated.ts';
import {
  GetJourneysQuery,
  useGetJourneysQuery,
} from '@/api/queries/generated/getJourneys.generated.ts';
import { OrderByEnum } from '@/api/types';
import CustomError from '@/Components/Shared/CustomError';
import CustomInput from '@/Components/Shared/CustomInput';
import CustomLoader from '@/Components/Shared/CustomLoader';
import CustomTable from '@/Components/Shared/CustomTable';
import EmptyDataInfo from '@/Components/Shared/EmptyDataInfo';
import Pagination from '@/Components/Shared/Pagination';
import { querySlateTime } from '@/constants';
import { BOARD_JOURNEYS_LIMIT, PINNED_OUTCOMES_LIMIT } from '@/constants/pagination';
import { debounced400 } from '@/hooks/useDebounce.ts';
import { useSetQueryDataByKey } from '@/hooks/useQueryKey';
import { JourniesRoute } from '@/routes/_authenticated/_secondary-sidebar-layout/board/$boardId/journies';
import JourneysFilter from '@/Screens/JourniesScreen/components/JourneysFilter';
import { useUserStore } from '@/store/user.ts';
import { SearchParamsType } from '@/types';
import { MapCopyLevelEnum, WorkspaceAnalyticsEnumType } from '@/types/enum.ts';

const JourneyDeleteModal = lazy(() => import('./components/JourneyDeleteModal'));
const CopyMapModal = lazy(
  () => import('@/Screens/AdminScreen/components/CopyMap/components/CopyMapModal/index.tsx'),
);

dayjs.extend(fromNow);

const JourniesScreen = () => {
  const { boardId } = useParams({
    from: '/_authenticated/_secondary-sidebar-layout/board/$boardId/journies/',
  });
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const { showToast } = useWuShowToast();

  const { tab = 'list' } = JourniesRoute.useSearch();

  const { user } = useUserStore();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [offset, setOffset] = useState<number>(0);
  const [selectedJourneyIds, setSelectedJourneyIds] = useState<Array<number>>([]);
  const [selectedJourney, setSelectedJourney] = useState<
    JourneyMapCardType | SelectedJourneyParentMap | null
  >(null);
  const [isOpenDeleteMapModal, setIsOpenDeleteMapModal] = useState<boolean>(false);
  const [isOpenAllPinnedOutcomesModal, setIsOpenAllPinnedOutcomesModal] = useState<boolean>(false);
  const [isOpenCopyPasteMapModal, setIsOpenCopyPasteMapModal] = useState<boolean>(false);
  const [searchedText, setSearchedText] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [personaIds, setPersonaIds] = useState<number[]>([]);
  const [createMode, setCreateMode] = useState<'general' | 'child'>('general');
  const [order, setOrder] = useState<{
    key: string;
    orderBY: OrderByEnum;
  }>({
    key: 'updatedAt',
    orderBY: OrderByEnum.Desc,
  });

  const setJourneys = useSetQueryDataByKey('GetJourneys', {
    key: 'order',
    value: order,
    input: 'getMapsInput',
  });

  const { data: dataBoard, error: errorBoard } = useGetBoardByIdQuery<GetBoardByIdQuery, Error>(
    {
      id: +boardId,
    },
    {
      enabled: !!boardId,
    },
  );

  const {
    data: dataJourneys,
    isLoading: isLoadingJourneys,
    refetch: refetchJourneys,
  } = useGetJourneysQuery<GetJourneysQuery, Error>(
    {
      getMapsInput: {
        boardId: +boardId,
        offset,
        limit: BOARD_JOURNEYS_LIMIT,
        query: searchedText,
        order,
        ...(personaIds.length > 0 && { personaIds }),
        ...(startDate && { startDate: dayjs(startDate) }),
        ...(endDate && { endDate: dayjs(endDate) }),
      },
    },
    {
      staleTime: querySlateTime,
    },
  );

  const journeysDataCount = useMemo(
    () => dataJourneys?.getMaps.count || 0,
    [dataJourneys?.getMaps.count],
  );

  const journeysData = useMemo(
    () => dataJourneys?.getMaps.maps || [],
    [dataJourneys?.getMaps.maps],
  );

  const { data: pinnedOutcomes } = useGetBoardOutcomesStatQuery<GetBoardOutcomesStatQuery, Error>(
    {
      boardId: +boardId,
      limit: PINNED_OUTCOMES_LIMIT,
    },
    {
      enabled: !!boardId,
    },
  );

  const { mutate: mutateUpdateJourneyMap } = useUpdateJourneyMapMutation<
    Error,
    UpdateJourneyMapMutation
  >();

  const { mutate: createParentMap } = useCreateParentMapMutation<Error, CreateParentMapMutation>();

  const { mutate: mutateCreateMap, isPending: isLoadingCreateMap } = useCreateJourneyMapMutation<
    Error,
    CreateJourneyMapMutation
  >();

  const onHandleCreateNewJourney = useCallback((parentId?: number) => {
    mutateCreateMap(
      {
        createJourneyMapInput: {
          boardId: +boardId,
          title: 'Untitled',
        },
      },
      {
        onSuccess: async response => {
          await queryClient.refetchQueries({
            queryKey: ['GetParentMapsByBoardId'],
            exact: true,
            type: 'active',
          });
          if (parentId) {
            const childId = response.createJourneyMap.mapId;
            createParentMap(
              {
                createParentMapInput: {
                  parentId,
                  childId,
                },
              },
              {
                onSuccess: childResponse => {
                  // setJourneys((oldData: any) => {
                  //   const updatedPages = (oldData?.pages as Array<JourneysGetResponseType>).map(
                  //     page => {
                  //       return {
                  //         ...page,
                  //         getMaps: {
                  //           ...page.getMaps,
                  //           count: (page.getMaps.count || 0) + 1,
                  //           maps: page.getMaps.maps.map(journey => {
                  //             if (journey?.id === parentId) {
                  //               return {
                  //                 ...journey,
                  //                 childMaps: [
                  //                   { childId, id: childResponse?.createParentMap?.id },
                  //                   ...(journey?.childMaps || []),
                  //                 ],
                  //               };
                  //             }
                  //             return journey;
                  //           }),
                  //         },
                  //       };
                  //     },
                  //   );
                  //   return {
                  //     ...oldData,
                  //     pages: updatedPages,
                  //   };
                  // });
                  // startTransition(() => {
                  //   // router.push(`/board/${boardID}/journey-map/${childId}`);
                  // });
                },
              },
            );
          } else {
            // startTransition(() => {
            //   // router.push(`/board/${boardID}/journey-map/${response?.createJourneyMap?.mapId}`);
            // });
          }
        },
      },
    );
  }, []);

  const onHandleFilterJourney = useCallback((ids: Array<number>) => {
    setJourneys((oldData: any) => {
      const updatedPages = (oldData?.pages as Array<JourneysGetResponseType>).map(page => {
        return {
          ...page,
          getMaps: {
            ...page.getMaps,
            count: (page.getMaps.count || 0) - 1,
            maps: page.getMaps.maps
              .filter(journey => !ids.includes(journey.id))
              .map(journey => ({
                ...journey,
                childMaps:
                  journey.childMaps?.filter(child => {
                    return !ids.includes(child?.childId!);
                  }) || [],
              })),
          },
        };
      });
      return {
        ...oldData,
        pages: updatedPages,
      };
    });

    if (journeysData.length === 1 && currentPage > 1) {
      setCurrentPage(prevPage => Math.max(1, prevPage - 1));
    }

    // if (!data?.pages[currentPage] && !isFetchingNextPage) {
    //   refetchJourneys().then();
    // }
    //
    // if (createMode === 'child') {
    //   setParentChildren((prev: GetParentMapChildrenQuery) => {
    //     return {
    //       getParentMapChildren: prev.getParentMapChildren?.filter(
    //         child => !ids.includes(child?.id!),
    //       ),
    //     };
    //   });
    // }
  }, []);

  const onHandleAddOrFilterJourneyIds = useCallback(
    (id: number) => {
      if (selectedJourneyIds.includes(id)) {
        setSelectedJourneyIds(prev => prev.filter(journeyId => journeyId !== id));
      } else {
        setSelectedJourneyIds(prev => [...prev, id]);
      }
    },
    [selectedJourneyIds],
  );

  const onHandleCheckAllMaps = useCallback(() => {
    const ids: Array<number> = [];
    setJourneys((oldData: any) => {
      if (oldData) {
        const updatedPages = (oldData?.pages as Array<JourneysGetResponseType>).map(page => {
          return {
            ...page,
            getMaps: {
              ...page.getMaps,
              maps: page.getMaps.maps.map(journey => {
                if (!selectedJourneyIds.length && journeysData.includes(journey)) {
                  ids.push(journey.id);
                }
                journey.checked = !selectedJourneyIds.length && journeysData.includes(journey);
                return journey;
              }),
            },
          };
        });
        return {
          ...oldData,
          pages: updatedPages,
        };
      }
    });
    setSelectedJourneyIds(ids);
  }, [journeysData, selectedJourneyIds.length, setJourneys]);

  const onHandleCheckMap = useCallback(
    (id: number) => {
      setJourneys((oldData: any) => {
        const updatedPages = (oldData?.pages as Array<JourneysGetResponseType>).map(page => {
          return {
            ...page,
            getMaps: {
              ...page.getMaps,
              maps: page.getMaps.maps.map(journey => {
                if (journey.id === id) {
                  journey.checked = !journey.checked;
                }
                return journey;
              }),
            },
          };
        });
        return {
          ...oldData,
          pages: updatedPages,
        };
      });

      onHandleAddOrFilterJourneyIds(id);
    },
    [onHandleAddOrFilterJourneyIds, setJourneys],
  );

  const onHandleNameChange = useCallback(
    (newValue: string, mapId: number) => {
      debounced400(() => {
        mutateUpdateJourneyMap(
          {
            updateJourneyMapInput: {
              mapId: mapId,
              title: newValue,
            },
          },
          {
            onSuccess: () => {
              setJourneys((oldData: any) => {
                const updatedPages = (oldData?.pages as Array<JourneysGetResponseType>).map(
                  page => {
                    return {
                      ...page,
                      getMaps: {
                        ...page.getMaps,
                        maps: page.getMaps.maps.map(journey =>
                          journey.id === mapId! ? { ...journey, title: newValue } : journey,
                        ),
                      },
                    };
                  },
                );
                return {
                  ...oldData,
                  pages: updatedPages,
                };
              });
            },
          },
        );
      });
    },
    [mutateUpdateJourneyMap, setJourneys],
  );

  const onHandleChangeViewType = (tabName: string) => {
    navigate({
      to: '.',
      search: (prev: SearchParamsType) => ({
        ...prev,
        tab: tabName,
      }),
    }).then();
  };

  const onHandleSearchMap = (e: ChangeEvent<HTMLInputElement>) => {
    debounced400(() => {
      setSearchedText(e.target.value);
    });
  };

  const onToggleAllPinnedOutcomesModal = useCallback(() => {
    setIsOpenAllPinnedOutcomesModal(prev => !prev);
  }, []);

  const onHandleChangePage = useCallback((newPage: number) => {
    setCurrentPage(newPage);
    setOffset((newPage - 1) * BOARD_JOURNEYS_LIMIT);
  }, []);

  const onHandleToggleDeleteModal = useCallback(() => {
    setIsOpenDeleteMapModal(prev => !prev);
  }, []);

  const onToggleMapCopyModal = useCallback(() => {
    setIsOpenCopyPasteMapModal(prev => !prev);
  }, []);

  const onHandleCloseDeleteModal = useCallback(() => {
    onHandleToggleDeleteModal();
    setSelectedJourneyIds([]);
  }, [onHandleToggleDeleteModal]);

  const onHandleDeleteJourney = useCallback(
    (journey: JourneyMapCardType | SelectedJourneyParentMap) => {
      setSelectedJourney(journey);
      onHandleToggleDeleteModal();
    },
    [onHandleToggleDeleteModal],
  );

  const onHandleCopyMap = useCallback(
    (journey: JourneyMapCardType) => {
      onToggleMapCopyModal();
      // setCopyMapDetailsData(prev => ({
      //   ...prev,
      //   mapId: journey.id,
      //   orgId: user.orgID!,
      //   template: CopyMapLevelTemplateEnum.WORKSPACES,
      // }));
    },
    [onToggleMapCopyModal],
  );

  const onHandleCopyShareUrl = useCallback(
    async (journey: JourneyMapCardType) => {
      await navigator.clipboard?.writeText(
        `${process.env.NEXT_PUBLIC_APP}/guest/board/${boardId}/journey-map/${journey.id}`,
      );
      showToast({
        variant: 'success',
        message: 'The page URL was copied successfully.',
      });
    },
    [boardId, showToast],
  );

  const onHandleCloseCopyMapModal = useCallback(() => {
    onToggleMapCopyModal();
    // setCopyMapDetailsData({
    //   mapId: null,
    //   workspaceId: null,
    //   orgId: null,
    //   boardId: null,
    //   template: CopyMapLevelTemplateEnum.WORKSPACES,
    //   isProcessing: false,
    // });
  }, [onToggleMapCopyModal]);

  const onHandleSortTableByField = useCallback(
    (type: OrderByEnum, _: string, id: 'name' | 'createdAt' | 'user') => {
      setOrder({
        key: id,
        orderBY: type,
      });
    },
    [],
  );

  const handleCopySuccess = useCallback(
    (copyMap: JourneyMapCardType) => {
      setJourneys((oldData: any) => {
        const updatedPages = (oldData?.pages as Array<JourneysGetResponseType>).map(page => {
          return {
            ...page,
            getMaps: {
              ...page.getMaps,
              count: (page.getMaps.count || 0) + 1,
              maps: [
                { ...copyMap, childMaps: [], parentMaps: [], selectedPersonas: [] },
                ...page.getMaps.maps,
              ],
            },
          };
        });
        return {
          ...oldData,
          pages: updatedPages,
        };
      });
      setCurrentPage(1);
    },
    [setJourneys],
  );

  const columns = useMemo(() => {
    return JOURNEY_MAPS_TABLE_COLUMNS({
      checkedItemsCount: selectedJourneyIds.length,
      toggleDeleteModal: onHandleToggleDeleteModal,
      onHandleRowClick: (id, key) => {
        if (key === 'title') {
          // startTransition(() => {
          //   router.push(`/board/${boardID}/journey-map/${id}`);
          // });
        }
        if (key === 'checkAll') {
          onHandleCheckAllMaps();
        }
        if (key === 'checkbox') {
          onHandleCheckMap(id);
        }
      },
    });
  }, [
    onHandleCheckAllMaps,
    onHandleCheckMap,
    onHandleToggleDeleteModal,
    selectedJourneyIds.length,
  ]);

  const options = useMemo(() => {
    return JOURNEY_MAP_OPTIONS({
      // onHandleEdit: journey => {},
      onHandleDelete: onHandleDeleteJourney,
      onHandleCopy: journey => {
        onHandleCopyMap(journey);
      },
      onHandleCopyShareUrl: journey => {
        onHandleCopyShareUrl(journey).then();
      },
    });
  }, [onHandleCopyMap, onHandleCopyShareUrl, onHandleDeleteJourney]);

  if (errorBoard) {
    return <CustomError error={errorBoard.message} />;
  }

  return (
    <div className={'journeys'} data-testid="journeys-test-id">
      <>
        {isOpenDeleteMapModal && (
          <Suspense fallback={''}>
            <JourneyDeleteModal
              ids={selectedJourney ? [selectedJourney.id] : selectedJourneyIds}
              isOpen={isOpenDeleteMapModal}
              handleClose={onHandleCloseDeleteModal}
              onHandleFilterJourney={onHandleFilterJourney}
            />
          </Suspense>
        )}
        {isOpenAllPinnedOutcomesModal && (
          <Suspense fallback={''}>
            {/*<BoardPinnedOutcomesModal*/}
            {/*  handleClose={onToggleAllPinnedOutcomesModal}*/}
            {/*  isOpen={isOpenAllPinnedOutcomesModal}*/}
            {/*  boardId={+boardID}*/}
            {/*/>*/}
          </Suspense>
        )}
        {isOpenCopyPasteMapModal && (
          <Suspense fallback={''}>
            <CopyMapModal
              level={MapCopyLevelEnum.WORKSPACE}
              isOpen={isOpenCopyPasteMapModal}
              handleClose={onHandleCloseCopyMapModal}
              handleOnSuccess={handleCopySuccess}
            />
          </Suspense>
        )}
        <div className="journeys--top-section">
          <div className="journeys--top-section--name-block">
            <div className={'journeys--top-section--name-block--container'}>
              <p className={'base-title !text-heading-2'}>{dataBoard?.getBoardById.name}</p>
              {dataBoard?.getBoardById.workspace.id && (
                <JourneysFilter
                  workspaceId={dataBoard?.getBoardById.workspace.id}
                  startDate={startDate}
                  endDate={endDate}
                  personaIds={personaIds}
                  changePersonaIds={ids => setPersonaIds(ids)}
                  changeEndDate={date => setEndDate(date)}
                  changeStartDate={date => setStartDate(date)}
                />
              )}
            </div>
            <div className={'journeys--top-section--name-block--date'}>
              {dayjs(dataBoard?.getBoardById.createdAt)?.format('MMM D, YYYY')}
            </div>
          </div>
          <div className="journeys--top-section--analytics">
            <WorkspaceAnalytics
              showType={WorkspaceAnalyticsEnumType.BIG}
              outcomeGroups={pinnedOutcomes?.getBoardOutcomesStat?.outcomeStats}
              data={{
                journeyMapCount: pinnedOutcomes?.getBoardOutcomesStat?.journeysCount || 0,
                personasCount: pinnedOutcomes?.getBoardOutcomesStat?.personasCount || 0,
              }}
              viewAll={onToggleAllPinnedOutcomesModal}
              pinnedOutcomeGroupCount={dataBoard?.getBoardById.pinnedOutcomeGroupCount}
            />
          </div>
        </div>
        <div className={'journeys--header'}>
          <WuButton
            Icon={<span className="wm-add" />}
            data-testid={'create-new-journey-test-id'}
            color="primary"
            iconPosition="left"
            disabled={isLoadingCreateMap && createMode === 'general'}
            loading={isLoadingCreateMap && createMode === 'general'}
            onClick={() => {
              setCreateMode('general');
              onHandleCreateNewJourney();
            }}
            size="md"
            style={{
              width: '200px',
            }}
            variant="primary">
            New journey
          </WuButton>
          <div className={'journeys--header--search-pagination-block'}>
            <ul className={'journeys--header--view-list-block'}>
              {JOURNEYS_VIEW_TABS?.map(({ iconClassName, name, tooltipContent }) => (
                <WuTooltip content={tooltipContent} position="top">
                  <li
                    key={name}
                    data-testid={name}
                    className={'journeys--header--view-list-block--list'}>
                    <WuButton
                      key={name}
                      className={`${tab === name ? 'active-tab' : ''} `}
                      onClick={() => onHandleChangeViewType(name)}
                      Icon={<span className={iconClassName} />}
                      variant="iconOnly"
                    />
                  </li>
                </WuTooltip>
              ))}
            </ul>
            <CustomInput
              sxStyles={{
                width: '12.5rem',
              }}
              rows={2}
              placeholder={'Search for your map'}
              onChange={onHandleSearchMap}
            />
            {journeysDataCount > BOARD_JOURNEYS_LIMIT && (
              <Pagination
                perPage={BOARD_JOURNEYS_LIMIT}
                currentPage={currentPage}
                allCount={journeysDataCount}
                changePage={onHandleChangePage}
              />
            )}
          </div>
        </div>

        {isLoadingJourneys ? (
          <CustomLoader />
        ) : (
          <>
            {journeysData.length ? (
              <>
                {tab === 'grid' ? (
                  <>
                    <SortableJourneys
                      boardId={boardId}
                      maps={journeysData}
                      options={options}
                      onNameChange={onHandleNameChange}
                    />
                  </>
                ) : tab === 'atlas' ? (
                  <>
                    <AtlasView
                      boardId={boardId}
                      maps={journeysData}
                      onHandleDeleteJourney={data => {
                        setCreateMode('child');
                        onHandleDeleteJourney(data);
                      }}
                      createMap={callback => {
                        setCreateMode('child');
                        onHandleCreateNewJourney(callback);
                      }}
                    />
                  </>
                ) : (
                  <CustomTable
                    columns={columns}
                    rows={journeysData}
                    sortAscDescByField={onHandleSortTableByField}
                    options={options}
                  />
                )}
              </>
            ) : (
              <EmptyDataInfo
                message={searchedText ? 'Journeys not found' : 'There are no journeys yet'}
              />
            )}
          </>
        )}
      </>
    </div>
  );
};

export default JourniesScreen;
