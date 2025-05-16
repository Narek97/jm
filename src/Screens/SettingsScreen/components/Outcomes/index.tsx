import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./style.scss";

import { useWuShowToast } from "@npm-questionpro/wick-ui-lib";

import { OUTCOME_OPTIONS, WORKSPACE_OUTCOMES_COLUMNS } from "./constants";

import {
  GetOutcomeGroupsQuery,
  useInfiniteGetOutcomeGroupsQuery,
} from "@/api/infinite-queries/generated/getOutcomeGroups.generated.ts";
import {
  CreateOrUpdateOutcomeGroupMutation,
  useCreateOrUpdateOutcomeGroupMutation,
} from "@/api/mutations/generated/createOrUpdateOutcomeGroup.generated.ts";
import {
  DeleteOutcomeGroupMutation,
  useDeleteOutcomeGroupMutation,
} from "@/api/mutations/generated/deleteOutcomeGroup.generated.ts";
import { OrderByEnum, OutcomeGroup } from "@/api/types.ts";
import CustomLoader from "@/Components/Shared/CustomLoader";
import CustomTable from "@/Components/Shared/CustomTable";
import { DEFAULT_OUTCOME_ICON } from "@/constants";
import { OUTCOME_GROUPS_LIMIT } from "@/constants/pagination.ts";
import { useSetQueryDataByKey } from "@/hooks/useQueryKey.ts";

const Outcomes = () => {
  const setOutcomeGroups = useSetQueryDataByKey("GetOutcomeGroups.infinite");

  const { showToast } = useWuShowToast();

  const [selectedOutcomeGroup, setSelectedOutcomeGroup] = useState<{
    id: number;
    name: string;
    pluralName: string;
  } | null>(null);
  const [sortData, setSortData] = useState<{
    id: "name" | "createdAt" | "user";
    type: OrderByEnum;
  } | null>();
  const [iconUrl, setIconUrl] = useState<string>(DEFAULT_OUTCOME_ICON);
  const [currentPage, setCurrentPage] = useState(1);

  const nameInputRef = useRef<HTMLInputElement>(null);

  const {
    isLoading: isLoadingOutcomes,
    fetchNextPage: fetchNextPageOutcomes,
    data: dataOutcomes,
    isFetchingNextPage: isFetchingNextPageOutcomes,
    error: errorOutcomes,
    refetch,
  } = useInfiniteGetOutcomeGroupsQuery<
    { pages: Array<GetOutcomeGroupsQuery> },
    Error
  >(
    {
      getOutcomeGroupsInput: {
        limit: OUTCOME_GROUPS_LIMIT,
        offset: 0,
      },
    },
    {
      getNextPageParam: function (
        lastPage: GetOutcomeGroupsQuery,
        allPages: GetOutcomeGroupsQuery[],
      ): unknown {
        return lastPage.getOutcomeGroups.outcomeGroups.length <
          OUTCOME_GROUPS_LIMIT
          ? undefined
          : allPages.length;
      },
      initialPageParam: OUTCOME_GROUPS_LIMIT,
    },
  );

  const { isPending: isLoadingCrateOrUpdateOutcome, mutate: createOutcome } =
    useCreateOrUpdateOutcomeGroupMutation<
      CreateOrUpdateOutcomeGroupMutation,
      Error
    >();

  const { isPending: isLoadingDeleteOrUpdateOutcome, mutate: deleteOutcome } =
    useDeleteOutcomeGroupMutation<DeleteOutcomeGroupMutation, Error>();

  const outcomeGroupsLogsData: Array<OutcomeGroup> = useMemo(() => {
    if (dataOutcomes?.pages && dataOutcomes?.pages[0] !== undefined) {
      const totalData = dataOutcomes.pages.reduce<Array<OutcomeGroup>>(
        (acc: Array<OutcomeGroup>, curr) => [
          ...acc,
          ...(curr.getOutcomeGroups.outcomeGroups as Array<OutcomeGroup>),
        ],
        [],
      );
      const seenIds = new Set<number>();

      const uniqueData = totalData.filter((item) => {
        if (seenIds.has(item.id)) {
          return false;
        }
        seenIds.add(item.id);
        return true;
      });

      if (currentPage > 1) {
        return uniqueData
          .slice((currentPage - 1) * OUTCOME_GROUPS_LIMIT)
          .slice(0, OUTCOME_GROUPS_LIMIT);
      } else {
        return uniqueData.slice(0, OUTCOME_GROUPS_LIMIT);
      }
    }
    return [];
  }, [currentPage, dataOutcomes?.pages]);

  const compareByField = (
    fieldName: "name" | "createdAt" | "user",
    orderType: OrderByEnum,
  ) => {
    return function (a: OutcomeGroup, b: OutcomeGroup) {
      const aValue = a[fieldName] ?? "";
      const bValue = b[fieldName] ?? "";
      const compareResult = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return orderType === OrderByEnum.Desc ? -compareResult : compareResult;
    };
  };

  const sortTableByField = (
    type: OrderByEnum,
    _: string,
    id: "name" | "createdAt" | "user",
  ) => {
    setSortData({
      type,
      id,
    });
  };

  const onToggleCreateUpdateBoard = useCallback((outcome?: OutcomeGroup) => {
    if (outcome) {
      setSelectedOutcomeGroup({
        id: outcome?.id,
        name: outcome?.name,
        pluralName: outcome?.pluralName,
      });
      setIconUrl(outcome?.icon);
      // todo
      // setOutcomePinBoards({ selectedIdList: [] });
    } else {
      setSelectedOutcomeGroup(null);
      // setOutcomePinBoards({ selectedIdList: [] });
      nameInputRef.current?.focus();
    }
  }, []);

  const onHandleEditItem = useCallback(
    (data: OutcomeGroup) => {
      onToggleCreateUpdateBoard(data);
    },
    [onToggleCreateUpdateBoard],
  );

  const onHandleDeleteItem = useCallback(
    (data: OutcomeGroup) => {
      setSelectedOutcomeGroup(data);
      deleteOutcome(
        { id: data?.id },
        {
          onSuccess: () => {
            setSelectedOutcomeGroup(null);
            setOutcomeGroups((oldData: any) => {
              const updatedPages = (
                oldData?.pages as Array<GetOutcomeGroupsQuery>
              ).map((page) => {
                return {
                  ...page,
                  getOutcomeGroups: {
                    ...page.getOutcomeGroups,
                    count: (page.getOutcomeGroups.count || 0) - 1,
                    outcomeGroups: page.getOutcomeGroups.outcomeGroups.filter(
                      (item) => item?.id !== data?.id,
                    ),
                  },
                };
              });
              return {
                ...oldData,
                pages: updatedPages,
              };
            });

            if (outcomeGroupsLogsData.length === 1 && currentPage > 1) {
              setCurrentPage((prevPage) => Math.max(1, prevPage - 1));
            }

            if (
              !dataOutcomes?.pages[currentPage] &&
              !isFetchingNextPageOutcomes
            ) {
              refetch().then();
            }
          },
          onError: (error: any) => {
            showToast({
              variant: "error",
              message: error?.message,
            });
          },
        },
      );
    },
    [
      currentPage,
      dataOutcomes?.pages,
      deleteOutcome,
      isFetchingNextPageOutcomes,
      outcomeGroupsLogsData.length,
      refetch,
      setOutcomeGroups,
      showToast,
    ],
  );

  const options = useMemo(() => {
    return OUTCOME_OPTIONS({
      onHandleEdit: onHandleEditItem,
      onHandleDelete: onHandleDeleteItem,
    });
  }, [onHandleDeleteItem, onHandleEditItem]);

  const columns = useMemo(() => {
    return WORKSPACE_OUTCOMES_COLUMNS;
  }, []);

  useEffect(() => {
    if (errorOutcomes) {
      showToast({
        variant: "error",
        message: errorOutcomes?.message,
      });
    }
    // eslint-disable-next-line
  }, [errorOutcomes]);

  return (
    <div className={"outcomes"}>
      {isLoadingOutcomes && <CustomLoader />}
      {outcomeGroupsLogsData.length ? (
        <div className="outcomes--table-container">
          <CustomTable
            sortAscDescByField={sortTableByField}
            dashedStyle={false}
            isTableHead
            rows={
              sortData?.id && sortData?.type
                ? outcomeGroupsLogsData.sort(
                    compareByField(sortData.id, sortData.type),
                  )
                : outcomeGroupsLogsData
            }
            columns={columns}
            options={options}
            permissionCheckKey="isDefault"
            processingItemId={
              isLoadingOutcomes ? selectedOutcomeGroup?.id : null
            }
          />
        </div>
      ) : null}
    </div>
  );
};

export default Outcomes;
