import { useCallback, useMemo, useState } from "react";

import "./style.scss";
import { Box } from "@mui/material";
import { useWuShowToast, WuButton } from "@npm-questionpro/wick-ui-lib";
import { useParams } from "@tanstack/react-router";

import {
  GetOutcomeGroupQuery,
  useInfiniteGetOutcomeGroupQuery,
} from "@/api/infinite-queries/generated/getOutcomeGroup.generated.ts";
import {
  DeleteOutcomeMutation,
  useDeleteOutcomeMutation,
} from "@/api/mutations/generated/deleteOutcome.generated.ts";
import { OrderByEnum, Outcome, OutcomeListEnum, SortByEnum } from "@/api/types";
import CustomError from "@/Components/Shared/CustomError";
import CustomLoader from "@/Components/Shared/CustomLoader";
import CustomTable from "@/Components/Shared/CustomTable";
import EmptyDataInfo from "@/Components/Shared/EmptyDataInfo";
import Pagination from "@/Components/Shared/Pagination";
import { OUTCOMES_LIMIT } from "@/constants/pagination.ts";
import { useSetQueryDataByKey } from "@/hooks/useQueryKey.ts";
import AddUpdateOutcomeItemModal from "@/Screens/OutcomeScreen/components/AddUpdateOutcomeModal";
import {
  OUTCOME_OPTIONS,
  OUTCOME_TABLE_COLUMNS,
} from "@/Screens/OutcomeScreen/constants.tsx";

const OutcomeScreen = () => {
  const { workspaceId, outcomeId } = useParams({
    from: "/_authenticated/_secondary-sidebar-layout/workspace/$workspaceId/outcome/$outcomeId/",
  });
  const setOutcomeGroup = useSetQueryDataByKey("GetOutcomeGroup.infinite");

  const { showToast } = useWuShowToast();

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOutcome, setSelectedOutcome] = useState<Outcome | null>(null);
  const [isOpenCreateUpdateModal, setIsOpenCreateUpdateModal] = useState(false);
  const [offset, setOffset] = useState(0);
  const [sortBy, setSortBy] = useState<SortByEnum>(SortByEnum.CreatedAt);
  const [orderBy, setOrderBy] = useState<OrderByEnum>(OrderByEnum.Desc);

  const { isPending: isLoadingDeleteOutcome, mutate: deleteOutcome } =
    useDeleteOutcomeMutation<Error, DeleteOutcomeMutation>();

  const {
    isLoading: isLoadingOutcomes,
    data: dataGetOutcomes,
    isFetchingNextPage: isFetchingNextPageOutcomes,
    error: errorOutcomes,
    refetch,
  } = useInfiniteGetOutcomeGroupQuery<
    { pages: Array<GetOutcomeGroupQuery> },
    Error
  >(
    {
      getOutcomeGroupInput: {
        outcomeGroupId: +outcomeId!,
      },
      getOutcomesInput: {
        workspaceId: +workspaceId!,
        offset,
        limit: OUTCOMES_LIMIT,
        list: OutcomeListEnum.OutcomeGroupLevel,
        sortBy,
        orderBy,
      },
    },
    {
      getNextPageParam: function (
        lastPage: GetOutcomeGroupQuery,
        allPages: GetOutcomeGroupQuery[],
      ) {
        return lastPage.getOutcomeGroup.outcomes.length < OUTCOMES_LIMIT
          ? undefined
          : allPages.length * OUTCOMES_LIMIT;
      },
      initialPageParam: 0,
    },
  );

  const name = useMemo(
    () => dataGetOutcomes?.pages[0].getOutcomeGroup.name || "Outcome",
    [dataGetOutcomes?.pages],
  );

  const pluralName = useMemo(
    () => dataGetOutcomes?.pages[0].getOutcomeGroup.pluralName || "Outcomes",
    [dataGetOutcomes?.pages],
  );

  const count = useMemo(
    () => dataGetOutcomes?.pages[0].getOutcomeGroup.outcomesCount || 0,
    [dataGetOutcomes?.pages],
  );

  const renderedOutcomesData = useMemo(
    () => dataGetOutcomes?.pages[0].getOutcomeGroup.outcomes || [],
    [dataGetOutcomes?.pages],
  );

  const toggleOpenModal = useCallback(() => {
    setSelectedOutcome(null);
    setIsOpenCreateUpdateModal((prev) => !prev);
  }, []);

  const onHandleCreateOutcome = async (newOutcome: Outcome) => {
    setIsOpenCreateUpdateModal(false);

    setOutcomeGroup((oldData: any) => {
      const updatedPages = ((oldData?.pages || []) as Array<any>).map(
        (page) => {
          return {
            ...page,
            getOutcomeGroup: {
              ...page.getOutcomeGroup,
              outcomesCount: page.getOutcomeGroup.outcomesCount + 1,
              outcomes: [
                newOutcome,
                ...page.getOutcomeGroup.outcomes.slice(0, OUTCOMES_LIMIT - 1),
              ],
            },
          };
        },
      );
      return {
        ...oldData,
        pages: updatedPages,
      };
    });
    setCurrentPage(1);
    setOffset(0);
  };

  const onHandleUpdateOutcome = async () => {
    setIsOpenCreateUpdateModal(false);
  };

  const onHandleEditOutcome = useCallback((outcome: Outcome) => {
    setSelectedOutcome(outcome);
    setIsOpenCreateUpdateModal(true);
  }, []);

  const onHandleDeleteOutcome = useCallback(
    (outcome: any) => {
      const { id } = outcome;
      setSelectedOutcome(outcome);
      deleteOutcome(
        { id },
        {
          onSuccess: () => {
            setSelectedOutcome(null);
            setOutcomeGroup((oldData: any) => {
              const updatedPages = (
                oldData?.pages as Array<GetOutcomeGroupQuery>
              ).map((page) => {
                return {
                  ...page,
                  getOutcomeGroup: {
                    ...page.getOutcomeGroup,
                    outcomesCount: page.getOutcomeGroup.outcomesCount - 1,
                    outcomes: page.getOutcomeGroup.outcomes.filter(
                      (item) => item?.id !== id,
                    ),
                  },
                };
              });
              return {
                ...oldData,
                pages: updatedPages,
              };
            });

            if (renderedOutcomesData.length === 1 && currentPage > 1) {
              setCurrentPage((prevPage) => Math.max(1, prevPage - 1));
            }

            if (
              !dataGetOutcomes?.pages[currentPage] &&
              !isFetchingNextPageOutcomes
            ) {
              refetch().then();
            }
          },
          onError: (error) => {
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
      dataGetOutcomes?.pages,
      deleteOutcome,
      isFetchingNextPageOutcomes,
      refetch,
      renderedOutcomesData.length,
      setOutcomeGroup,
      showToast,
    ],
  );

  const sortTableByField = async (
    newOrderBy: OrderByEnum,
    newSortBy: string,
  ) => {
    setSortBy(newSortBy as SortByEnum);
    setOrderBy(newOrderBy);
    setCurrentPage(1);
  };

  const options = useMemo(() => {
    return OUTCOME_OPTIONS({
      onHandleEdit: onHandleEditOutcome,
      onHandleDelete: onHandleDeleteOutcome,
    });
  }, [onHandleDeleteOutcome, onHandleEditOutcome]);

  const columns = useMemo(() => OUTCOME_TABLE_COLUMNS, []);

  const onHandleChangePage = useCallback(
    (page: number) => {
      if (!isLoadingOutcomes && !isFetchingNextPageOutcomes) {
        setCurrentPage(page);
        setOffset((page - 1) * OUTCOMES_LIMIT);
      }
    },
    [isFetchingNextPageOutcomes, isLoadingOutcomes],
  );

  if (isLoadingOutcomes && !renderedOutcomesData.length) {
    return <CustomLoader />;
  }

  if (errorOutcomes) {
    return <CustomError error={errorOutcomes?.message} />;
  }

  return (
    <div className={"outcome-container"}>
      {isOpenCreateUpdateModal && (
        <AddUpdateOutcomeItemModal
          isOpen={isOpenCreateUpdateModal}
          workspaceId={+workspaceId!}
          outcomeGroupId={+outcomeId!}
          singularName={name}
          selectedOutcome={selectedOutcome}
          create={onHandleCreateOutcome}
          update={onHandleUpdateOutcome}
          handleClose={toggleOpenModal}
        />
      )}

      <div className="outcome-container--header">
        <div className="base-page-header">
          <h3 className="base-title !text-heading-2">{pluralName}</h3>
        </div>
        <div className="outcome-container--create-section">
          {name && (
            <WuButton onClick={toggleOpenModal} className="outcome-add-btn">
              Add new {name}
            </WuButton>
          )}
          {count > OUTCOMES_LIMIT && (
            <Pagination
              currentPage={currentPage}
              perPage={OUTCOMES_LIMIT}
              allCount={count}
              changePage={onHandleChangePage}
            />
          )}
        </div>
      </div>

      {isLoadingOutcomes && <CustomLoader />}

      {!isLoadingOutcomes &&
        !isFetchingNextPageOutcomes &&
        !renderedOutcomesData.length && (
          <EmptyDataInfo
            icon={<Box />}
            message={`There are no ${pluralName} yet`}
          />
        )}
      {renderedOutcomesData.length > 0 && (
        <div className="outcome-container--body">
          <CustomTable
            sortAscDescByField={sortTableByField}
            dashedStyle={false}
            isTableHead
            rows={renderedOutcomesData}
            columns={columns}
            options={options}
            processingItemId={
              isLoadingDeleteOutcome ? selectedOutcome?.id : null
            }
          />
        </div>
      )}
    </div>
  );
};

export default OutcomeScreen;
