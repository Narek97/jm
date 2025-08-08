import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useWuShowToast, WuPopover, WuTooltip } from '@npm-questionpro/wick-ui-lib';

import CreateUpdateOutcome from './components/CreateUpdateOutcome';
import SearchNounProjectIcon from './components/SearchNounProjectIcon';
import { DEFAULT_GET_OUTCOMES_PARAMS, WORKSPACE_OUTCOMES_COLUMNS } from './constants';

import {
  CreateOrUpdateOutcomeGroupMutation,
  useCreateOrUpdateOutcomeGroupMutation,
} from '@/api/mutations/generated/createOrUpdateOutcomeGroup.generated.ts';
import {
  DeleteOutcomeGroupMutation,
  useDeleteOutcomeGroupMutation,
} from '@/api/mutations/generated/deleteOutcomeGroup.generated.ts';
import {
  GetOutcomeGroupsQuery,
  useGetOutcomeGroupsQuery,
} from '@/api/queries/generated/getOutcomeGroups.generated.ts';
import { OrderByEnum, OutcomeGroup, OutcomeGroupSortByEnum } from '@/api/types.ts';
import BaseWuDataTable from '@/Components/Shared/BaseWuDataTable';
import BaseWuLoader from '@/Components/Shared/BaseWuLoader';
import CustomError from '@/Components/Shared/CustomError';
import EmptyDataInfo from '@/Components/Shared/EmptyDataInfo';
import Pagination from '@/Components/Shared/Pagination';
import { DEFAULT_OUTCOME_ICON, querySlateTime } from '@/Constants';
import { OUTCOME_GROUPS_LIMIT } from '@/Constants/pagination.ts';
import {
  useRemoveQueriesByKey,
  useSetAllQueryDataByKey,
  useSetQueryDataByKeyAdvanced,
} from '@/Hooks/useQueryKey.ts';
import { useBreadcrumbStore } from '@/Store/breadcrumb';
import { useOutcomePinBoardsStore } from '@/Store/outcomePinBoards';
import { useOutcomePinnedBoardIdsStore } from '@/Store/outcomePinBoardsIds';
import { ObjectKeysType, SortType } from '@/types';

const Outcomes = () => {
  const { showToast } = useWuShowToast();
  const { setBreadcrumbs } = useBreadcrumbStore();

  const [selectedOutcomeGroup, setSelectedOutcomeGroup] = useState<{
    id: number;
    name: string;
    pluralName: string;
  } | null>(null);

  const [isOpenCreateUpdateBoard, setIsOpenCreateUpdateBoard] = useState(false);
  const [iconUrl, setIconUrl] = useState<string>(DEFAULT_OUTCOME_ICON);
  const [currentPage, setCurrentPage] = useState(1);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const { setOutcomePinnedBoardIds } = useOutcomePinnedBoardIdsStore();
  const { setSelectedIdList } = useOutcomePinBoardsStore();

  const [offset, setOffset] = useState(0);
  const [sortData, setSortData] = useState<{
    sortBy: OutcomeGroupSortByEnum;
    orderBy: OrderByEnum;
  }>(DEFAULT_GET_OUTCOMES_PARAMS);

  const setOutcomeGroups = useSetQueryDataByKeyAdvanced();
  const setAllOutcomeGroups = useSetAllQueryDataByKey('GetOutcomeGroups');
  const setRemoveOutcomeGroupsQuery = useRemoveQueriesByKey();
  const {
    isLoading: isLoadingOutcomes,
    data: dataOutcomes,
    error: errorOutcomes,
  } = useGetOutcomeGroupsQuery<GetOutcomeGroupsQuery, Error>(
    {
      getOutcomeGroupsInput: {
        limit: OUTCOME_GROUPS_LIMIT,
        offset,
        sortBy: sortData.sortBy,
        orderBy: sortData.orderBy,
      },
    },
    {
      staleTime: querySlateTime,
    },
  );
  console.log(errorOutcomes, 'errorOutcomes');
  const { isPending: isLoadingCrateOrUpdateOutcome, mutate: createOutcome } =
    useCreateOrUpdateOutcomeGroupMutation<Error, CreateOrUpdateOutcomeGroupMutation>();

  const { isPending: isLoadingDeleteOrUpdateOutcome, mutate: deleteOutcome } =
    useDeleteOutcomeGroupMutation<Error, DeleteOutcomeGroupMutation>();

  const outcomeGroups = useMemo(
    () => dataOutcomes?.getOutcomeGroups.outcomeGroups || [],
    [dataOutcomes?.getOutcomeGroups.outcomeGroups],
  );

  const count = useMemo(
    () => dataOutcomes?.getOutcomeGroups.count || 0,
    [dataOutcomes?.getOutcomeGroups.count],
  );

  const onHandleCreateOutcomeGroup = useCallback(
    (data: ObjectKeysType, reset: () => void) => {
      createOutcome(
        {
          createOrUpdateOutcomeGroupInput: {
            ...data,
            icon: iconUrl,
          },
        },
        {
          onSuccess: response => {
            setSortData(DEFAULT_GET_OUTCOMES_PARAMS);
            setIconUrl(DEFAULT_OUTCOME_ICON);
            setTimeout(() => {
              setIsOpenCreateUpdateBoard(false);
              reset();
            }, 500);
            setOutcomePinnedBoardIds((prev: any) => ({
              ...prev,
              [data.id as number]: {
                ...(prev?.new || {}),
              },
              new: {},
            }));

            setRemoveOutcomeGroupsQuery('GetOutcomeGroups', {
              input: 'getOutcomeGroupsInput',
              key: 'offset',
              value: 0,
            });

            setOutcomeGroups(
              'GetOutcomeGroups',
              {
                input: 'getOutcomeGroupsInput',
                key: 'offset',
                value: 0,
              },
              (oldData: any) => {
                if (oldData) {
                  return {
                    getOutcomeGroups: {
                      offset: 0,
                      limit: OUTCOME_GROUPS_LIMIT,
                      count: oldData.getOutcomeGroups.count + 1,
                      outcomeGroups: [
                        ...oldData.getOutcomeGroups.outcomeGroups.slice(0, 3),
                        response.createOrUpdateOutcomeGroup,
                        ...oldData.getOutcomeGroups.outcomeGroups.slice(
                          3,
                          OUTCOME_GROUPS_LIMIT - 1,
                        ),
                      ],
                    },
                  };
                }
              },
            );
            setCurrentPage(1);
            setOffset(0);
          },
          onError: error => {
            showToast({
              variant: 'error',
              message: error?.message,
            });
          },
        },
      );
    },
    [
      createOutcome,
      iconUrl,
      setOutcomeGroups,
      setOutcomePinnedBoardIds,
      setRemoveOutcomeGroupsQuery,
      showToast,
    ],
  );

  const onHandleUpdateOutcome = (data: any, reset: () => void) => {
    createOutcome(
      {
        createOrUpdateOutcomeGroupInput: {
          id: selectedOutcomeGroup?.id,
          icon: iconUrl,
          ...data,
        },
      },
      {
        onSuccess: () => {
          setSelectedOutcomeGroup(null);
          setTimeout(() => {
            reset();
            setIsOpenCreateUpdateBoard(false);
          }, 500);

          setOutcomePinnedBoardIds(prev => {
            const outcomeGroupId = data.id as string;

            const previousDefault = prev?.[outcomeGroupId]?.default || [];

            const updated = [
              ...(data.connectBoardIds as string[]),
              ...previousDefault.filter((item: number) => !data.disconnectBoardIds.includes(item)),
            ];
            return {
              ...prev,
              [outcomeGroupId]: {
                selected: updated,
                default: updated,
              },
            };
          });
          setOutcomeGroups(
            'GetOutcomeGroups',
            {
              input: 'getOutcomeGroupsInput',
              key: 'offset',
              value: offset,
            },
            (oldData: any) => {
              if (oldData) {
                return {
                  getOutcomeGroups: {
                    count: oldData?.getOutcomeGroups.count,
                    outcomeGroups: oldData.getOutcomeGroups.outcomeGroups.map(
                      (item: OutcomeGroup) =>
                        item.id === selectedOutcomeGroup?.id
                          ? { ...item, ...data, icon: iconUrl }
                          : item,
                    ),
                  },
                };
              }
            },
          );
          setIconUrl(DEFAULT_OUTCOME_ICON);
        },
        onError: error => {
          showToast({
            variant: 'error',
            message: error?.message,
          });
        },
      },
    );
  };

  const sortTableByField = async (newOrderBy: SortType) => {
    setSortData({
      sortBy: OutcomeGroupSortByEnum[newOrderBy.id as keyof typeof OutcomeGroupSortByEnum],
      orderBy: newOrderBy.desc ? OrderByEnum.Desc : OrderByEnum.Asc,
    });
    setCurrentPage(1);
  };

  const onToggleCreateUpdateBoard = useCallback(
    (outcome?: OutcomeGroup) => {
      if (outcome) {
        setSelectedOutcomeGroup({
          id: outcome?.id,
          name: outcome?.name,
          pluralName: outcome?.pluralName,
        });
        setIconUrl(outcome?.icon);
        setIsOpenCreateUpdateBoard(true);
        setSelectedIdList([]);
      } else {
        setSelectedOutcomeGroup(null);
        setIsOpenCreateUpdateBoard(prev => !prev);
        setSelectedIdList([]);
        nameInputRef.current?.focus();
      }
    },
    [setSelectedIdList],
  );

  const onHandleEditItem = useCallback(
    (data: OutcomeGroup) => {
      onToggleCreateUpdateBoard(data);
    },
    [onToggleCreateUpdateBoard],
  );

  const onHandleUpdateOutcomeGroups = useCallback(
    (id: number) => {
      setAllOutcomeGroups((oldData: any) => {
        if (oldData) {
          return {
            getOutcomeGroups: {
              count: oldData.getOutcomeGroups.count - 1,
              outcomeGroups: oldData.getOutcomeGroups.outcomeGroups.filter(
                (outcomeGroup: OutcomeGroup) => outcomeGroup.id !== id,
              ),
            },
          };
        }
      });
    },
    [setAllOutcomeGroups],
  );

  const onHandleDeleteItem = useCallback(
    (data?: OutcomeGroup) => {
      if (data) {
        deleteOutcome(
          { id: data.id },
          {
            onSuccess: () => {
              if (
                currentPage * OUTCOME_GROUPS_LIMIT >= count &&
                dataOutcomes?.getOutcomeGroups.outcomeGroups.length === 1 &&
                currentPage !== 1
              ) {
                setOffset(offset - OUTCOME_GROUPS_LIMIT);
                setCurrentPage(prev => prev - 1);
              } else if (
                currentPage * OUTCOME_GROUPS_LIMIT < count &&
                count > OUTCOME_GROUPS_LIMIT
              ) {
                setRemoveOutcomeGroupsQuery('GetOutcomeGroups', {
                  input: 'getOutcomeGroupsInput',
                  key: 'offset',
                  value: offset,
                  deleteUpcoming: true,
                });
              }
              onHandleUpdateOutcomeGroups(data.id);
            },
            onError: error => {
              showToast({
                variant: 'error',
                message: error?.message,
              });
            },
          },
        );
      }
    },
    [
      count,
      currentPage,
      dataOutcomes?.getOutcomeGroups.outcomeGroups,
      deleteOutcome,
      offset,
      onHandleUpdateOutcomeGroups,
      setRemoveOutcomeGroupsQuery,
      showToast,
    ],
  );

  const columns = useMemo(() => {
    return WORKSPACE_OUTCOMES_COLUMNS({
      onHandleRowEdit: onHandleEditItem,
      onHandleRowDelete: onHandleDeleteItem,
    });
  }, [onHandleDeleteItem, onHandleEditItem]);

  const onHandleChangePage = useCallback((page: number) => {
    setCurrentPage(page);
    setOffset((page - 1) * OUTCOME_GROUPS_LIMIT);
  }, []);

  const handleSelectIcon = useCallback((thumbnailUrl: string) => {
    setIconUrl(thumbnailUrl);
  }, []);

  useEffect(() => {
    setBreadcrumbs([
      {
        name: 'Workspaces',
        pathname: '/workspaces',
      },
    ]);
  }, [setBreadcrumbs]);

  if (errorOutcomes) {
    return <CustomError error={errorOutcomes?.message} />;
  }

  return (
    <>
      <div
        className={
          'flex items-start md:items-center py-4 md:pb-8 border-b border-[var(--light-gray)]'
        }>
        <div
          className={`h-[1.875rem] cursor-pointer ${
            isOpenCreateUpdateBoard ? 'max-w-[2.5rem] w-[2.5rem] visible' : 'max-w-[0] invisible'
          }`}>
          <WuPopover
            Trigger={
              <div>
                <WuTooltip
                  className="break-all"
                  content="Select an icon"
                  position="bottom">
                  <div className={'selected-icon'}>
                    <img
                      src={iconUrl}
                      alt="Selected File Preview"
                      style={{
                        width: '1.875rem',
                        height: '1.875rem',
                      }}
                    />
                  </div>
                </WuTooltip>
              </div>
            }>
            <SearchNounProjectIcon onIconSelect={handleSelectIcon} />
          </WuPopover>
        </div>

        <div className="flex items-center justify-between w-full">
          <CreateUpdateOutcome
            formData={selectedOutcomeGroup}
            isLoading={isLoadingCrateOrUpdateOutcome}
            onToggleCreateUpdateFunction={onToggleCreateUpdateBoard}
            isOpenCreateUpdateItem={isOpenCreateUpdateBoard}
            onHandleCreateFunction={onHandleCreateOutcomeGroup}
            onHandleUpdateFunction={onHandleUpdateOutcome}
          />

          {count > OUTCOME_GROUPS_LIMIT && (
            <Pagination
              currentPage={currentPage}
              perPage={OUTCOME_GROUPS_LIMIT}
              allCount={count}
              changePage={onHandleChangePage}
            />
          )}
        </div>
      </div>

      {isLoadingOutcomes && <BaseWuLoader />}

      {!isLoadingOutcomes && !isLoadingDeleteOrUpdateOutcome && !outcomeGroups.length && (
        <EmptyDataInfo message="There are no outcomes yet" />
      )}

      {outcomeGroups.length ? (
        <div className="mt-[1.125rem]! h-[calc(100dvh-21rem)]">
          <BaseWuDataTable data={outcomeGroups} columns={columns} onHandleSort={sortTableByField} />
        </div>
      ) : null}
    </>
  );
};

export default Outcomes;
