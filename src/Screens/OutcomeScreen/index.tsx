import { useCallback, useEffect, useMemo, useState } from 'react';

import './style.scss';
import { useWuShowToast, WuButton } from '@npm-questionpro/wick-ui-lib';
import { useParams } from '@tanstack/react-router';

import AddUpdateOutcomeItemModal from './components/AddUpdateOutcomeModal';
import { OUTCOME_TABLE_COLUMNS } from './constants';
import { OutcomeGroupOutcomeType } from './types';

import {
  DeleteOutcomeMutation,
  useDeleteOutcomeMutation,
} from '@/api/mutations/generated/deleteOutcome.generated.ts';
import {
  GetOutcomeGroupQuery,
  useGetOutcomeGroupQuery,
} from '@/api/queries/generated/getOutcomeGroup.generated.ts';
import { OrderByEnum, OutcomeListEnum, SortByEnum } from '@/api/types';
import BaseWuDataTable from '@/Components/Shared/BaseWuDataTable';
import BaseWuLoader from '@/Components/Shared/BaseWuLoader';
import CustomError from '@/Components/Shared/CustomError';
import EmptyDataInfo from '@/Components/Shared/EmptyDataInfo';
import Pagination from '@/Components/Shared/Pagination';
import { OUTCOMES_LIMIT } from '@/Constants/pagination.ts';
import {
  useRemoveQueriesByKey,
  useSetAllQueryDataByKey,
  useSetQueryDataByKeys,
} from '@/Hooks/useQueryKey.ts';
import { useBreadcrumbStore } from '@/Store/breadcrumb.ts';
import { SortType } from '@/types';

const OutcomeScreen = () => {
  const { workspaceId, outcomeId } = useParams({
    from: '/_authenticated/_secondary-sidebar-layout/workspace/$workspaceId/outcome/$outcomeId/',
  });

  const setAllOutcomeGroup = useSetAllQueryDataByKey('GetOutcomeGroup');
  const setRemoveOutcomeGroupQuery = useRemoveQueriesByKey();

  const { showToast } = useWuShowToast();
  const { setBreadcrumbs } = useBreadcrumbStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOutcome, setSelectedOutcome] = useState<OutcomeGroupOutcomeType | null>(null);
  const [isOpenCreateUpdateModal, setIsOpenCreateUpdateModal] = useState(false);
  const [offset, setOffset] = useState(0);
  const [sortBy, setSortBy] = useState<SortByEnum>(SortByEnum.CreatedAt);
  const [orderBy, setOrderBy] = useState<OrderByEnum>(OrderByEnum.Desc);

  const setOutcomeGroup = useSetQueryDataByKeys('GetOutcomeGroup', [
    {
      key: ['sortBy', 'orderBy'],
      value: [sortBy, orderBy],
      input: 'getOutcomesInput',
    },
    {
      key: 'outcomeGroupId',
      value: +outcomeId,
      input: 'getOutcomeGroupInput',
    },
  ]);

  const { mutate: deleteOutcome } = useDeleteOutcomeMutation<Error, DeleteOutcomeMutation>({
    onSuccess: () => {
      showToast({
        variant: 'success',
        message: 'Outcome deleted successfully',
      });
    },
    onError: error => {
      showToast({
        variant: 'error',
        message: error?.message,
      });
    },
  });

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

  const onHandleUpdateOutcome = async (updatedData: OutcomeGroupOutcomeType) => {
    setOutcomeGroup((oldData: any) => {
      if (oldData) {
        return {
          ...oldData,
          getOutcomeGroup: {
            ...oldData.getOutcomeGroup,
            outcomesCount: oldData.getOutcomeGroup.outcomesCount + 1,
            outcomes: oldData.getOutcomeGroup.outcomes.map((item: OutcomeGroupOutcomeType) => {
              if (item.id === selectedOutcome?.id) {
                return {
                  ...item,
                  ...updatedData,
                };
              }
              return item;
            }),
          },
        };
      }
    });
    setIsOpenCreateUpdateModal(false);
  };

  const onHandleEditOutcome = useCallback((outcome: OutcomeGroupOutcomeType) => {
    setSelectedOutcome(outcome);
    setIsOpenCreateUpdateModal(true);
  }, []);

  const onHandleCreateOutcome = async (newOutcome: OutcomeGroupOutcomeType) => {
    setIsOpenCreateUpdateModal(false);
    setRemoveOutcomeGroupQuery('GetOutcomeGroup', {
      input: 'getOutcomesInput',
      key: 'offset',
      value: 0,
    });

    setOutcomeGroup((oldData: any) => {
      if (oldData) {
        return {
          ...oldData,
          getOutcomeGroup: {
            ...oldData.getOutcomeGroup,
            outcomesCount: oldData.getOutcomeGroup.outcomesCount + 1,
            outcomes: [newOutcome, ...oldData.getOutcomeGroup.outcomes],
          },
        };
      }
    });
    setCurrentPage(1);
    setOffset(0);
  };

  const onHandleDeleteOutcome = useCallback(
    (outcome?: OutcomeGroupOutcomeType) => {
      if (outcome) {
        deleteOutcome(
          { id: outcome.id },
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
              setAllOutcomeGroup((oldData: any) => {
                if (oldData) {
                  return {
                    getOutcomeGroup: {
                      ...oldData.getOutcomeGroup.outcomeGroups,
                      outcomesCount: oldData.getMyBoards.count - 1,
                      outcomes: oldData.getMyBoards.outcomeGroups.filter(
                        (oc: OutcomeGroupOutcomeType) => oc.id !== outcome.id,
                      ),
                    },
                  };
                }
              });
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
      currentPage,
      dataOutcomesGroup?.getOutcomeGroup.outcomes.length,
      deleteOutcome,
      offset,
      outcomeGroupCount,
      setAllOutcomeGroup,
      setRemoveOutcomeGroupQuery,
      showToast,
    ],
  );

  const sortTableByField = (newOrderBy: SortType) => {
    setSortBy(newOrderBy.id as SortByEnum);
    setOrderBy(newOrderBy.desc ? OrderByEnum.Desc : OrderByEnum.Asc);
    setCurrentPage(1);
  };

  const columns = useMemo(
    () =>
      OUTCOME_TABLE_COLUMNS({
        onHandleRowEdit: onHandleEditOutcome,
        onHandleRowDelete: onHandleDeleteOutcome,
      }),
    [onHandleDeleteOutcome, onHandleEditOutcome],
  );

  const onHandleChangePage = useCallback((newPage: number) => {
    setCurrentPage(newPage);
    setOffset((newPage - 1) * OUTCOMES_LIMIT);
  }, []);

  useEffect(() => {
    setBreadcrumbs([
      {
        name: 'Workspaces',
        pathname: '/workspaces',
      },
    ]);
  }, [setBreadcrumbs]);

  if (isLoadingOutcomesGroup && !outcomesGroup.length) {
    return <BaseWuLoader />;
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

      {!isLoadingOutcomesGroup && !outcomesGroup.length && (
        <EmptyDataInfo message={`There are no ${pluralName} yet`} />
      )}
      {outcomesGroup.length > 0 && (
        <div className="outcome-container--body">
          <BaseWuDataTable
            isLoading={isLoadingOutcomesGroup}
            columns={columns}
            data={outcomesGroup}
            onHandleSort={sortTableByField}
          />
        </div>
      )}
    </div>
  );
};

export default OutcomeScreen;
