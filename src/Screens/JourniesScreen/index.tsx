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
import { OrderByEnum, SortByEnum } from '@/api/types';
import BaseWuDataTable from '@/Components/Shared/BaseWuDataTable';
import BaseWuInput from '@/Components/Shared/BaseWuInput';
import CustomError from '@/Components/Shared/CustomError';
import EmptyDataInfo from '@/Components/Shared/EmptyDataInfo';
import Pagination from '@/Components/Shared/Pagination';
import WuBaseLoader from '@/Components/Shared/WuBaseLoader';
import { querySlateTime } from '@/Constants';
import { BOARD_JOURNEYS_LIMIT, PINNED_OUTCOMES_LIMIT } from '@/Constants/pagination';
import WorkspaceAnalytics from '@/Features/WorkspaceAnalytics';
import { debounced400 } from '@/Hooks/useDebounce.ts';
import { useSetQueryDataByKeyAdvanced } from '@/Hooks/useQueryKey';
import { JourniesRoute } from '@/routes/_authenticated/_secondary-sidebar-layout/board/$boardId/journies';
import BoardPinnedOutcomesModal from '@/Screens/BoardsScreen/components/PinnedOutcomeModal';
import JourneysFilter from '@/Screens/JourniesScreen/components/JourneysFilter';
import { JourneyMapNameChangeType, JourneyType } from '@/Screens/JourniesScreen/types.ts';
import { useCopyMapStore } from '@/Store/copyMap.ts';
import { useUserStore } from '@/Store/user.ts';
import { SearchParamsType, SortType } from '@/types';
import { CopyMapLevelEnum, WorkspaceAnalyticsEnumType } from '@/types/enum.ts';

const JourneyDeleteModal = lazy(() => import('./components/JourneyDeleteModal'));
const CopyMapModal = lazy(
  () => import('@/Screens/AdminScreen/components/CopyMap/components/CopyMapModal/index.tsx'),
);

dayjs.extend(fromNow);

const JourniesScreen = () => {
  const { boardId } = useParams({
    from: '/_authenticated/_secondary-sidebar-layout/board/$boardId/journies/',
  });

  const setJourneys = useSetQueryDataByKeyAdvanced();
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const { showToast } = useWuShowToast();
  const { setCopyMapState } = useCopyMapStore();

  const { tab = 'list' } = JourniesRoute.useSearch();

  const { user } = useUserStore();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [offset, setOffset] = useState<number>(0);
  const [selectedJourneys, setSelectedJourneys] = useState<JourneyType[]>([]);
  const [selectedJourney, setSelectedJourney] = useState<JourneyType | null>(null);
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
  } | null>({
    key: 'updatedAt',
    orderBY: OrderByEnum.Desc,
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
    isFetching: isFetchingJourneys,
  } = useGetJourneysQuery<GetJourneysQuery, Error>(
    {
      getMapsInput: {
        boardId: +boardId,
        offset,
        limit: BOARD_JOURNEYS_LIMIT,
        query: searchedText,
        order: tab === 'list' ? order : null,
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
  >({
    onError: err => {
      showToast({
        variant: 'error',
        message: err.message,
      });
    },
  });

  const { mutate: createParentMap } = useCreateParentMapMutation<Error, CreateParentMapMutation>({
    onError: err => {
      showToast({
        variant: 'error',
        message: err.message,
      });
    },
  });

  const { mutate: mutateCreateMap, isPending: isLoadingCreateMap } = useCreateJourneyMapMutation<
    Error,
    CreateJourneyMapMutation
  >({
    onError: err => {
      showToast({
        variant: 'error',
        message: err.message,
      });
    },
  });

  const onHandleCreateNewJourney = useCallback(
    (parentId?: number) => {
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
              queryKey: [['GetParentMapsByBoardId'], ['GetJourneys']],
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
                  onSuccess: () => {
                    navigate({
                      to: `/board/${boardId}/journey-map/${childId}`,
                    }).then();
                  },
                },
              );
            } else {
              navigate({
                to: `/board/${boardId}/journey-map/${response?.createJourneyMap?.mapId}`,
              }).then();
            }
          },
          onError: err => {
            showToast({
              variant: 'error',
              message: err.message,
            });
          },
        },
      );
    },
    [boardId, createParentMap, mutateCreateMap, navigate, queryClient, showToast],
  );

  const onHandleFilterJourney = useCallback(() => {
    if (journeysData.length <= 1 && currentPage !== 1) {
      setCurrentPage(prev => prev - 1);
      setOffset((currentPage - 2) * BOARD_JOURNEYS_LIMIT);
    }
  }, [currentPage, journeysData]);

  const onHandleNameChange = useCallback(
    (data: JourneyMapNameChangeType) => {
      const { newValue, mapId } = data;
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
              setJourneys(
                'GetJourneys',
                {
                  input: 'getMapsInput',
                  key: 'offset',
                  value: offset,
                },
                (oldData: any) => {
                  if (oldData) {
                    return {
                      getMaps: {
                        count: oldData.getMaps.count,
                        maps: oldData.getMaps.maps.map((journey: JourneyType) => {
                          if (journey.id === mapId) {
                            journey.title = newValue;
                          }
                          return journey;
                        }),
                      },
                    };
                  }
                },
              );
            },
            onError: error => {
              showToast({
                variant: 'error',
                message: error.message,
              });
            },
          },
        );
      });
    },
    [mutateUpdateJourneyMap, offset, setJourneys, showToast],
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
    setSelectedJourneys([]);
  }, [onHandleToggleDeleteModal]);

  const onHandleDeleteJourney = useCallback(
    (journey?: JourneyType) => {
      console.log(journey, 'journey');
      if (journey) {
        setSelectedJourney(journey);
      }
      onHandleToggleDeleteModal();
    },
    [onHandleToggleDeleteModal],
  );

  const onHandleCopyMap = useCallback(
    (journey: JourneyType) => {
      setCopyMapState({
        mapId: journey.id,
      });
      onToggleMapCopyModal();
    },
    [onToggleMapCopyModal, setCopyMapState],
  );

  const onHandleCopyShareUrl = useCallback(
    async (journey: JourneyType) => {
      await navigator.clipboard?.writeText(
        `${import.meta.env.VITE_APP_URL}/guest/board/${boardId}/journey-map/${journey.id}`,
      );
      showToast({
        variant: 'success',
        message: 'The page URL was copied successfully.',
      });
    },
    [boardId, showToast],
  );

  const onHandleSortTableByField = useCallback((newOrderBy: SortType) => {
    setOrder({
      key: newOrderBy.id as SortByEnum,
      orderBY: newOrderBy.desc ? OrderByEnum.Desc : OrderByEnum.Asc,
    });
  }, []);

  const handleCopySuccess = useCallback(() => {
    setCurrentPage(1);
    setOffset(0);
  }, []);

  const columns = useMemo(() => {
    return JOURNEY_MAPS_TABLE_COLUMNS({
      onHandleRowDelete: onHandleDeleteJourney,
      onHandleCopy: onHandleCopyMap,
      onHandleCopyShareUrl,
    });
  }, [onHandleCopyMap, onHandleCopyShareUrl, onHandleDeleteJourney]);

  const options = useMemo(() => {
    return JOURNEY_MAP_OPTIONS({
      onHandleDelete: onHandleDeleteJourney,
      onHandleCopy: onHandleCopyMap,
      onHandleCopyShareUrl: onHandleCopyShareUrl,
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
              ids={
                selectedJourney ? [selectedJourney.id] : selectedJourneys.map(journey => journey.id)
              }
              isOpen={isOpenDeleteMapModal}
              isHasPagination={journeysDataCount > BOARD_JOURNEYS_LIMIT}
              onHandleFilterJourney={onHandleFilterJourney}
              handleClose={onHandleCloseDeleteModal}
            />
          </Suspense>
        )}
        {isOpenAllPinnedOutcomesModal && (
          <Suspense fallback={''}>
            <BoardPinnedOutcomesModal
              handleClose={onToggleAllPinnedOutcomesModal}
              isOpen={isOpenAllPinnedOutcomesModal}
              boardId={+boardId}
            />
          </Suspense>
        )}
        {isOpenCopyPasteMapModal && user?.orgID && (
          <Suspense fallback={''}>
            <CopyMapModal
              orgId={user?.orgID}
              level={CopyMapLevelEnum.WORKSPACE}
              isOpen={isOpenCopyPasteMapModal}
              handleClose={onToggleMapCopyModal}
              currentBoardId={boardId}
              handleOnSuccess={handleCopySuccess}
            />
          </Suspense>
        )}
        <div className="journeys--top-section">
          <div className="journeys--top-section--name-block">
            <div className={'journeys--top-section--name-block--container'}>
              <p className={'base-title !text-heading-2'}>
                {dataBoard?.getBoardById.name?.trim() || 'Untitled'}
              </p>
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
                <WuTooltip
                  className="wu-tooltip-content"
                  content={tooltipContent}
                  position="top"
                  key={name}>
                  <li data-testid={name} className={'journeys--header--view-list-block--list'}>
                    <WuButton
                      className={`${tab === name ? 'active-tab' : ''} `}
                      onClick={() => onHandleChangeViewType(name)}
                      Icon={<span className={iconClassName} />}
                      variant="iconOnly"
                    />
                  </li>
                </WuTooltip>
              ))}
            </ul>
            <BaseWuInput
              isIconInput={true}
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

        {isLoadingJourneys || isFetchingJourneys ? (
          <WuBaseLoader />
        ) : (
          <>
            {journeysData.length ? (
              <>
                {tab === 'grid' ? (
                  <>
                    <SortableJourneys
                      boardId={boardId}
                      currentPage={currentPage}
                      maps={journeysData}
                      options={options}
                      onNameChange={onHandleNameChange}
                    />
                  </>
                ) : tab === 'atlas' ? (
                  <>
                    <AtlasView
                      onHandleDeleteJourney={data => {
                        setCreateMode('child');
                        onHandleDeleteJourney(data);
                      }}
                      createMap={callback => {
                        setCreateMode('child');
                        onHandleCreateNewJourney(callback);
                      }}
                      maps={journeysData}
                    />
                  </>
                ) : (
                  <BaseWuDataTable<JourneyType>
                    columns={columns}
                    data={journeysData}
                    selectedRows={selectedJourneys}
                    onHandleSort={onHandleSortTableByField}
                    onHandleDelete={onHandleDeleteJourney}
                    onHandleRowSelect={data => {
                      setSelectedJourneys(data);
                    }}
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
