import './style.scss';
import { useCallback, useMemo, useState } from 'react';

import { WuButton } from '@npm-questionpro/wick-ui-lib';

import AiModelCard from './components/AiModelCard';
import AiModelDeleteModal from './components/AiModelDeleteModal';
import CreateUpdateAiModelModal from './components/CreateUpdateAiModelModal';
import { AiModelType } from './types';

import {
  GetAiJourneyModelsQuery,
  useGetAiJourneyModelsQuery,
} from '@/api/queries/generated/getAiJourneyModels.generated.ts';
import CustomError from '@/Components/Shared/CustomError';
import CustomLoader from '@/Components/Shared/CustomLoader';
import EmptyDataInfo from '@/Components/Shared/EmptyDataInfo';
import Pagination from '@/Components/Shared/Pagination';
import { querySlateTime } from '@/constants';
import { AI_MODEL_LIMIT } from '@/constants/pagination';
import ErrorBoundary from '@/Features/ErrorBoundary';
import {
  useRemoveQueriesByKey,
  useSetAllQueryDataByKey,
  useSetQueryDataByKeyAdvanced,
} from '@/hooks/useQueryKey.ts';
import { BoardType } from '@/Screens/BoardsScreen/types.ts';

const AiModel = () => {
  const setAiJourneyModels = useSetQueryDataByKeyAdvanced();
  const setAllAiJourneyModels = useSetAllQueryDataByKey('GetAiJourneyModels');
  const setRemoveAiJourneyModelsQuery = useRemoveQueriesByKey();

  const [isOpenCreateUpdateModal, setIsOpenCreateUpdateModal] = useState<boolean>(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);
  const [selectedAiModel, setSelectedAiModel] = useState<AiModelType | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [offset, setOffset] = useState<number>(0);

  const {
    data: dataAiModels,
    isLoading: isLoadingAiModels,
    error: errorAiModels,
  } = useGetAiJourneyModelsQuery<GetAiJourneyModelsQuery, Error>(
    {
      getAiJourneyModelsInput: {
        isAdmin: true,
        offset,
        limit: AI_MODEL_LIMIT,
      },
    },
    {
      staleTime: querySlateTime,
    },
  );

  const aiJourneyModelsCount = useMemo(
    () => dataAiModels?.getAiJourneyModels.count || 0,
    [dataAiModels?.getAiJourneyModels.count],
  );

  const aiJourneyModels = useMemo(
    () => dataAiModels?.getAiJourneyModels.aiJourneyModels || [],
    [dataAiModels?.getAiJourneyModels.aiJourneyModels],
  );

  const onToggleCreateUpdateModal = useCallback((aiModel: AiModelType | null) => {
    setSelectedAiModel(aiModel);
    setIsOpenCreateUpdateModal(prev => !prev);
  }, []);

  const onToggleDeleteModal = useCallback((aiModel: AiModelType | null) => {
    setSelectedAiModel(aiModel);
    setIsOpenDeleteModal(prev => !prev);
  }, []);

  const onHandleAddNewAiModel = useCallback(
    (aiModel: AiModelType) => {
      setRemoveAiJourneyModelsQuery('getMyBoards', {
        input: 'getMyBoardsInput',
        key: 'offset',
        value: 0,
      });

      setAiJourneyModels(
        'GetAiJourneyModels',
        {
          input: 'getAiJourneyModelsInput',
          key: 'offset',
          value: 0,
        },
        (oldData: any) => {
          if (oldData) {
            return {
              getAiJourneyModels: {
                offset: 0,
                limit: AI_MODEL_LIMIT,
                count: oldData.getAiJourneyModels.count + 1,
                aiJourneyModels: [
                  aiModel,
                  ...oldData.getAiJourneyModels.aiJourneyModels.slice(0, AI_MODEL_LIMIT - 1),
                ],
              },
            };
          }
        },
      );

      setCurrentPage(1);
      setOffset(0);
    },
    [setAiJourneyModels, setRemoveAiJourneyModelsQuery],
  );

  const onHandleUpdateAiModel = useCallback(
    (newAiModel: AiModelType) => {
      setAiJourneyModels(
        'GetAiJourneyModels',
        {
          input: 'getAiJourneyModelsInput',
          key: 'offset',
          value: 0,
        },
        (oldData: any) => {
          if (oldData) {
            return {
              getAiJourneyModels: {
                ...oldData.getAiJourneyModels,
                aiJourneyModels: oldData.getAiJourneyModels.aiJourneyModels.map(
                  (aiModel: AiModelType) => {
                    if (aiModel.id === newAiModel.id) {
                      return { ...newAiModel };
                    }
                    return aiModel;
                  },
                ),
              },
            };
          }
        },
      );
    },
    [setAiJourneyModels],
  );

  const onHandleFilterAiModel = useCallback(
    (id: number) => {
      if (
        currentPage * AI_MODEL_LIMIT >= aiJourneyModelsCount &&
        dataAiModels?.getAiJourneyModels.aiJourneyModels.length === 1 &&
        currentPage !== 1
      ) {
        setOffset(prev => prev - AI_MODEL_LIMIT);
        setCurrentPage(prev => prev - 1);
      } else if (
        currentPage * AI_MODEL_LIMIT < aiJourneyModelsCount &&
        aiJourneyModelsCount > AI_MODEL_LIMIT
      ) {
        setRemoveAiJourneyModelsQuery('GetAiJourneyModels', {
          input: 'getAiJourneyModelsInput',
          key: 'offset',
          value: offset,
          deleteUpcoming: true,
        });
      }
      setAllAiJourneyModels((oldData: any) => {
        if (oldData) {
          return {
            getAiJourneyModels: {
              ...oldData.getAiJourneyModels,
              count: oldData.getAiJourneyModels.count - 1,
              aiJourneyModels: oldData.getAiJourneyModels.aiJourneyModels.filter(
                (board: BoardType) => board.id !== id,
              ),
            },
          };
        }
      });
    },
    [
      aiJourneyModelsCount,
      currentPage,
      dataAiModels?.getAiJourneyModels.aiJourneyModels.length,
      offset,
      setAllAiJourneyModels,
      setRemoveAiJourneyModelsQuery,
    ],
  );

  const onHandleChangePage = useCallback((newPage: number) => {
    setCurrentPage(newPage);
    setOffset((newPage - 1) * AI_MODEL_LIMIT);
  }, []);

  if (errorAiModels) {
    return <CustomError error={errorAiModels?.message} />;
  }

  return (
    <div className={'ai-model'}>
      {isOpenCreateUpdateModal && (
        <CreateUpdateAiModelModal
          isOpen={isOpenCreateUpdateModal}
          handleClose={() => onToggleCreateUpdateModal(null)}
          aiModel={selectedAiModel}
          onHandleAddNewAiModel={onHandleAddNewAiModel}
          onHandleUpdateAiModel={onHandleUpdateAiModel}
        />
      )}

      {isOpenDeleteModal && selectedAiModel ? (
        <AiModelDeleteModal
          isOpen={isOpenDeleteModal}
          aiModel={selectedAiModel}
          onHandleFilterAiModel={onHandleFilterAiModel}
          handleClose={onToggleDeleteModal}
        />
      ) : null}

      <div className={'ai-model--create-section'}>
        <WuButton
          data-testid={'create-ai-model-btn-test-id'}
          onClick={() => onToggleCreateUpdateModal(null)}>
          New Ai model
        </WuButton>
        {aiJourneyModelsCount > AI_MODEL_LIMIT && (
          <Pagination
            perPage={AI_MODEL_LIMIT}
            currentPage={currentPage}
            allCount={aiJourneyModelsCount}
            changePage={onHandleChangePage}
          />
        )}
      </div>

      {isLoadingAiModels && !dataAiModels ? (
        <CustomLoader />
      ) : (
        <>
          {aiJourneyModels.length ? (
            <div className={'ai-model--list'}>
              {aiJourneyModels.map(aiModel => (
                <ErrorBoundary key={aiModel.id}>
                  <AiModelCard
                    aiModel={aiModel}
                    onHandleDelete={onToggleDeleteModal}
                    onHandleEdit={onToggleCreateUpdateModal}
                  />
                </ErrorBoundary>
              ))}
            </div>
          ) : (
            <EmptyDataInfo message={'There are no AI models yet'} />
          )}
        </>
      )}
    </div>
  );
};

export default AiModel;
