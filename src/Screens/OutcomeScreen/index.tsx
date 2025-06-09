import { useCallback, useMemo, useState } from 'react';

import './style.scss';
import { useWuShowToast, WuButton } from '@npm-questionpro/wick-ui-lib';
import { useParams } from '@tanstack/react-router';

import {
  DeleteOutcomeMutation,
  useDeleteOutcomeMutation,
} from '@/api/mutations/generated/deleteOutcome.generated.ts';
import {
  GetOutcomeGroupQuery,
  useGetOutcomeGroupQuery,
} from '@/api/queries/generated/getOutcomeGroup.generated.ts';
import { OrderByEnum, OutcomeListEnum, SortByEnum } from '@/api/types';
import CustomError from '@/Components/Shared/CustomError';
import CustomLoader from '@/Components/Shared/CustomLoader';
import CustomTable from '@/Components/Shared/CustomTable';
import EmptyDataInfo from '@/Components/Shared/EmptyDataInfo';
import Pagination from '@/Components/Shared/Pagination';
import { OUTCOMES_LIMIT } from '@/constants/pagination.ts';
import {
  useRemoveQueriesByKey,
  useSetAllQueryDataByKey,
  useSetQueryDataByKeyAdvanced,
} from '@/hooks/useQueryKey.ts';
import AddUpdateOutcomeItemModal from '@/Screens/OutcomeScreen/components/AddUpdateOutcomeModal';
import { OUTCOME_OPTIONS, OUTCOME_TABLE_COLUMNS } from '@/Screens/OutcomeScreen/constants.tsx';
import { OutcomeType } from '@/Screens/OutcomeScreen/types.ts';

const OutcomeScreen = () => {
  const { workspaceId, outcomeId } = useParams({
    from: '/_authenticated/_secondary-sidebar-layout/workspace/$workspaceId/outcome/$outcomeId/',
  });

  const setOutcomeGroup = useSetQueryDataByKeyAdvanced();
  const setAllOutcomeGroup = useSetAllQueryDataByKey('GetOutcomeGroup');
  const setRemoveOutcomeGroupQuery = useRemoveQueriesByKey();

  const { showToast } = useWuShowToast();

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOutcome, setSelectedOutcome] = useState<OutcomeType | null>(null);
  const [isOpenCreateUpdateModal, setIsOpenCreateUpdateModal] = useState(false);
  const [offset, setOffset] = useState(0);
  const [sortBy, setSortBy] = useState<SortByEnum>(SortByEnum.CreatedAt);
  const [orderBy, setOrderBy] = useState<OrderByEnum>(OrderByEnum.Desc);

  const { isPending: isLoadingDeleteOutcome, mutate: deleteOutcome } = useDeleteOutcomeMutation<
    Error,
    DeleteOutcomeMutation
  >();

  const {
    data: dataOutcomesGroup,
    isLoading: isLoadingOutcomesGroup,
    error: errorOutcomesGroup,
  } = useGetOutcomeGroupQuery<GetOutcomeGroupQuery, Error>({
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
  });

  const name = useMemo(
    () => dataOutcomesGroup?.getOutcomeGroup.name || 'Outcome',
    [dataOutcomesGroup?.getOutcomeGroup.name],
  );

  const pluralName = useMemo(
    () => dataOutcomesGroup?.getOutcomeGroup.pluralName || 'Outcomes',
    [dataOutcomesGroup?.getOutcomeGroup.pluralName],
  );

  const outcomeGroupCount = useMemo(
    () => dataOutcomesGroup?.getOutcomeGroup.outcomesCount || 0,
    [dataOutcomesGroup?.getOutcomeGroup.outcomesCount],
  );

  const outcomesGroup = useMemo(
    () => dataOutcomesGroup?.getOutcomeGroup.outcomes || [],
    [dataOutcomesGroup?.getOutcomeGroup.outcomes],
  );

  const toggleOpenModal = useCallback(() => {
    setSelectedOutcome(null);
    setIsOpenCreateUpdateModal(prev => !prev);
  }, []);

  const onHandleUpdateOutcome = async () => {
    setIsOpenCreateUpdateModal(false);
  };

  const onHandleEditOutcome = useCallback((outcome: OutcomeType) => {
    setSelectedOutcome(outcome);
    setIsOpenCreateUpdateModal(true);
  }, []);

  const onHandleCreateOutcome = async (newOutcome: OutcomeType) => {
    setIsOpenCreateUpdateModal(false);
    setRemoveOutcomeGroupQuery('GetOutcomeGroup', {
      input: 'getOutcomesInput',
      key: 'offset',
      value: 0,
    });

    setOutcomeGroup(
      'GetOutcomeGroup',
      {
        input: 'getOutcomesInput',
        key: 'offset',
        value: 0,
      },
      (oldData: any) => {
        if (oldData) {
          return {
            getOutcomeGroup: {
              outcomeGroups: {
                ...oldData.getOutcomeGroup.outcomeGroups,
                outcomesCount: oldData.getOutcomeGroup.outcomesCount + 1,
                outcomes: [
                  newOutcome,
                  ...oldData.getOutcomeGroup.outcomes.slice(0, OUTCOMES_LIMIT - 1),
                ],
              },
            },
          };
        }
      },
    );
    setCurrentPage(1);
    setOffset(0);
  };

  const onHandleUpdateOutcomeGroups = useCallback(
    (id: number) => {
      setAllOutcomeGroup((oldData: any) => {
        if (oldData) {
          return {
            getOutcomeGroup: {
              ...oldData.getOutcomeGroup.outcomeGroups,
              outcomesCount: oldData.getMyBoards.count - 1,
              outcomes: oldData.getMyBoards.outcomeGroups.filter(
                (outcome: OutcomeType) => outcome.id !== id,
              ),
            },
          };
        }
      });
    },
    [setAllOutcomeGroup],
  );

  const onHandleDeleteOutcome = useCallback(
    (outcome: OutcomeType) => {
      const { id } = outcome;
      deleteOutcome(
        { id },
        {
          onSuccess: () => {
            if (
              currentPage * OUTCOMES_LIMIT >= outcomeGroupCount &&
              dataOutcomesGroup?.getOutcomeGroup.outcomes.length === 1 &&
              currentPage !== 1
            ) {
              setOffset(prev => prev - OUTCOMES_LIMIT);
              setCurrentPage(prev => prev - 1);
            } else if (
              currentPage * OUTCOMES_LIMIT < outcomeGroupCount &&
              outcomeGroupCount > OUTCOMES_LIMIT
            ) {
              setRemoveOutcomeGroupQuery('GetOutcomeGroup', {
                input: 'getOutcomesInput',
                key: 'offset',
                value: offset,
                deleteUpcoming: true,
              });
            }
            onHandleUpdateOutcomeGroups(id);
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
      currentPage,
      dataOutcomesGroup?.getOutcomeGroup.outcomes.length,
      deleteOutcome,
      offset,
      onHandleUpdateOutcomeGroups,
      outcomeGroupCount,
      setRemoveOutcomeGroupQuery,
      showToast,
    ],
  );

  const sortTableByField = async (newOrderBy: OrderByEnum, newSortBy: string) => {
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

  const onHandleChangePage = useCallback((newPage: number) => {
    setCurrentPage(newPage);
    setOffset((newPage - 1) * OUTCOMES_LIMIT);
  }, []);

  if (isLoadingOutcomesGroup && !outcomesGroup.length) {
    return <CustomLoader />;
  }

  if (errorOutcomesGroup) {
    return <CustomError error={errorOutcomesGroup?.message} />;
  }

  return (
    <div className={'outcome-container'}>
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
          {outcomeGroupCount > OUTCOMES_LIMIT && (
            <Pagination
              currentPage={currentPage}
              perPage={OUTCOMES_LIMIT}
              allCount={outcomeGroupCount}
              changePage={onHandleChangePage}
            />
          )}
        </div>
      </div>

      {isLoadingOutcomesGroup && <CustomLoader />}

      {!isLoadingOutcomesGroup && !outcomesGroup.length && (
        <EmptyDataInfo message={`There are no ${pluralName} yet`} />
      )}
      {outcomesGroup.length > 0 && (
        <div className="outcome-container--body">
          <CustomTable
            sortAscDescByField={sortTableByField}
            dashedStyle={false}
            isTableHead
            rows={outcomesGroup}
            columns={columns}
            options={options}
            processingItemId={isLoadingDeleteOutcome ? selectedOutcome?.id : null}
          />
        </div>
      )}
    </div>
  );
};

export default OutcomeScreen;
