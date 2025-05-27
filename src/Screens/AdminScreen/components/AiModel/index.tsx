import './style.scss';
import { useCallback, useState } from 'react';

import { Box } from '@mui/material';
import { WuButton } from '@npm-questionpro/wick-ui-lib';

import AiModelCard from './components/AiModelCard';
import AiModelDeleteModal from './components/AiModelDeleteModal';

import {
  GetAiJourneyModelsQuery,
  useGetAiJourneyModelsQuery,
} from '@/api/queries/generated/getAiJourneyModels.generated.ts';
import { AiJourneyModelResponse } from '@/api/types.ts';
import CustomError from '@/Components/Shared/CustomError';
import CustomLoader from '@/Components/Shared/CustomLoader';
import EmptyDataInfo from '@/Components/Shared/EmptyDataInfo';
import Pagination from '@/Components/Shared/Pagination';
import { querySlateTime } from '@/constants';
import { AI_MODEL_LIMIT } from '@/constants/pagination';
import ErrorBoundary from '@/Features/ErrorBoundary';
import CreateUpdateAiModelModal from '@/Screens/AdminScreen/components/AiModel/components/CreateUpdateAiModelModal';

const AiModel = () => {
  // todo: setAiJourneyModels
  // const setAiJourneyModels = useSetQueryDataByKey("GetAiJourneyModels");

  const [isOpenCreateUpdateModal, setIsOpenCreateUpdateModal] = useState<boolean>(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);
  const [selectedAiModel, setSelectedAiModel] = useState<AiJourneyModelResponse | null>(null);
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
        offset: AI_MODEL_LIMIT * 3 * offset,
        limit: AI_MODEL_LIMIT * 3,
      },
    },
    {
      staleTime: querySlateTime,
    },
  );

  const dataCount = dataAiModels?.getAiJourneyModels.count || 0;
  const aiJourneyModels = dataAiModels?.getAiJourneyModels.aiJourneyModels || [];

  const onToggleCreateUpdateModal = useCallback((aiModel: AiJourneyModelResponse | null) => {
    setSelectedAiModel(aiModel);
    setIsOpenCreateUpdateModal(prev => !prev);
  }, []);

  const onToggleDeleteModal = useCallback((aiModel: AiJourneyModelResponse | null) => {
    setSelectedAiModel(aiModel);
    setIsOpenDeleteModal(prev => !prev);
  }, []);

  const onHandleAddNewAiModel = useCallback((aiModel: AiJourneyModelResponse) => {
    setCurrentPage(1);
    //   todo add ai model and count
  }, []);

  const onHandleUpdateAiModel = useCallback((aiModel: AiJourneyModelResponse) => {
    //   todo update ai model
  }, []);

  const onHandleFilterAiModel = useCallback((id: number) => {
    // todo delete ai model and count
  }, []);

  const onHandleChangePage = useCallback(
    (newPage: number) => {
      if (aiJourneyModels.length < dataCount && newPage % 2 === 0) {
        setOffset(prev => prev + 1);
      }
      if (
        aiJourneyModels.length >= newPage * AI_MODEL_LIMIT ||
        aiJourneyModels.length + AI_MODEL_LIMIT > dataCount
      ) {
        setCurrentPage(newPage);
      }
    },
    [aiJourneyModels.length, dataCount],
  );

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
        {dataCount > AI_MODEL_LIMIT && (
          <Pagination
            perPage={AI_MODEL_LIMIT}
            currentPage={currentPage}
            allCount={dataCount}
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
              {(
                aiJourneyModels.slice(
                  (currentPage - 1) * AI_MODEL_LIMIT,
                  currentPage * AI_MODEL_LIMIT,
                ) || []
              ).map(aiModel => (
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
            <EmptyDataInfo icon={<Box />} message={'There are no AI models yet'} />
          )}
        </>
      )}
    </div>
  );
};

export default AiModel;
