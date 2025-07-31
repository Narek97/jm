import { FC, UIEvent, useCallback, useMemo, useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useWuShowToast, WuButton } from '@npm-questionpro/wick-ui-lib';
import { Controller, useForm } from 'react-hook-form';
import Skeleton from 'react-loading-skeleton';

import SliderCard from './SliderCard';
import { CREATE_INTERVIEW_VALIDATION_SCHEMA } from '../../constants';
import { BoardsType, InterviewFormType, InterviewType } from '../../types';

import {
  GetMyBoardsQuery,
  useInfiniteGetMyBoardsQuery,
} from '@/api/infinite-queries/generated/getBoards.generated';
import {
  CreateInterviewMutation,
  useCreateInterviewMutation,
} from '@/api/mutations/generated/createInterview.generated.ts';
import {
  GetAiJourneyModelsQuery,
  useGetAiJourneyModelsQuery,
} from '@/api/queries/generated/getAiJourneyModels.generated.ts';
import BaseWuInput from '@/Components/Shared/BaseWuInput';
import BaseWuModal from '@/Components/Shared/BaseWuModal';
import BaseWuSelect from '@/Components/Shared/BaseWuSelect';
import BaseWuTextarea from '@/Components/Shared/BaseWuTextarea';
import SlickCarousel from '@/Components/Shared/SlickCarousel';
import { querySlateTime } from '@/Constants';
import { AI_JOURNEYS_MODEL_LIMIT, BOARDS_LIMIT } from '@/Constants/pagination';

interface ICreateInterviewModal {
  interview: InterviewType | null;
  isOpen: boolean;
  workspaceId: number;
  onHandleAddNewInterview: (newInterview: InterviewType) => void;
  handleClose: () => void;
}

const CreateInterviewModal: FC<ICreateInterviewModal> = ({
  interview,
  isOpen,
  workspaceId,
  onHandleAddNewInterview,
  handleClose,
}) => {
  const { showToast } = useWuShowToast();

  const [selectedSliderCardId, setSelectedSliderCardId] = useState<number | null>(
    interview?.aiJourneyModelId || null,
  );

  const { mutate: mutateInterview, isPending: isLoadingCreateInterview } =
    useCreateInterviewMutation<Error, CreateInterviewMutation>({
      onSuccess: response => {
        onHandleAddNewInterview(response.createInterview);
        handleClose();
      },
      onError: error => {
        showToast({
          variant: 'error',
          message: error?.message,
        });
      },
    });

  const { data: dataAiModels, isLoading: isLoadingAiModels } = useGetAiJourneyModelsQuery<
    GetAiJourneyModelsQuery,
    Error
  >(
    {
      getAiJourneyModelsInput: {
        isAdmin: false,
        offset: 0,
        limit: AI_JOURNEYS_MODEL_LIMIT,
      },
    },
    {
      staleTime: querySlateTime,
    },
  );

  const aiModels = useMemo(
    () => dataAiModels?.getAiJourneyModels.aiJourneyModels || [],
    [dataAiModels?.getAiJourneyModels.aiJourneyModels],
  );

  const {
    data: dataBoards,
    isFetching: isFetchingBoards,
    fetchNextPage: fetchNextPageBoards,
    hasNextPage: hasNextPageBoards,
  } = useInfiniteGetMyBoardsQuery<{ pages: Array<GetMyBoardsQuery> }, Error>(
    {
      getMyBoardsInput: {
        workspaceId: +workspaceId!,
        offset: 0,
        limit: BOARDS_LIMIT,
      },
    },
    {
      staleTime: querySlateTime,
      getNextPageParam: function (lastPage: GetMyBoardsQuery, allPages: GetMyBoardsQuery[]) {
        if (!lastPage.getMyBoards.boards || lastPage.getMyBoards.boards.length < BOARDS_LIMIT) {
          return undefined;
        }
        return {
          getMyBoardsInput: {
            workspaceId: +workspaceId!,
            offset: 0,
            limit: allPages.length * BOARDS_LIMIT,
          },
        };
      },
      initialPageParam: 0,
    },
  );
  const renderedBoardsData: Array<BoardsType> = useMemo(() => {
    if (!dataBoards?.pages) {
      return [];
    }

    return dataBoards.pages.reduce((acc: Array<BoardsType>, curr) => {
      if (curr?.getMyBoards.boards) {
        return [...acc, ...(curr.getMyBoards.boards as Array<BoardsType>)];
      }
      return acc;
    }, []);
  }, [dataBoards?.pages]);

  const {
    handleSubmit,
    control,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<InterviewFormType>({
    resolver: yupResolver(CREATE_INTERVIEW_VALIDATION_SCHEMA),
    defaultValues: {
      name: interview?.name || '',
      aiJourneyModelId: interview?.aiJourneyModelId || undefined,
      text: interview?.text || '',
      boardId: interview?.boardId,
    },
  });

  const onHandleSelectAiModel = useCallback(
    (id: number) => {
      if (!interview) {
        setValue('aiJourneyModelId', id);
        clearErrors('aiJourneyModelId');
        setSelectedSliderCardId(id);
      }
    },
    [clearErrors, interview, setValue],
  );

  const onHandleFetchBoards = useCallback(
    async (e: UIEvent<HTMLElement>) => {
      const bottom =
        e.currentTarget.scrollHeight <=
        e.currentTarget.scrollTop + e.currentTarget.clientHeight + 100;

      if (bottom && !isFetchingBoards && hasNextPageBoards) {
        await fetchNextPageBoards();
      }
    },
    [fetchNextPageBoards, hasNextPageBoards, isFetchingBoards],
  );

  const onHandleCreateInterview = (formData: InterviewFormType) => {
    mutateInterview({
      createInterviewInput: {
        ...formData,
      },
    });
  };

  return (
    <BaseWuModal
      modalSize={'lg'}
      isOpen={isOpen}
      handleClose={handleClose}
      headerTitle={`${interview ? 'View' : 'Create'} interview`}
      canCloseWithOutsideClick={true}
      isProcessing={isLoadingCreateInterview}
      ModalConfirmButton={
        <WuButton
          type="submit"
          data-testid={'submit-interview-btn-test-id'}
          onClick={handleSubmit(onHandleCreateInterview)}
          disabled={!!interview || isLoadingCreateInterview}>
          Add
        </WuButton>
      }>
      <form onSubmit={handleSubmit(onHandleCreateInterview)} id="linkform">
        <div className={'flex gap-5 w-full'}>
          <div className={`flex-1`}>
            <label htmlFor="name">Name</label>
            <Controller
              name={'name'}
              control={control}
              render={({ field: { onChange, value } }) => (
                <BaseWuInput
                  data-testid={'create-interview-name-input-test-id'}
                  placeholder={'Name'}
                  id={'name'}
                  onChange={onChange}
                  disabled={!!interview || isLoadingCreateInterview}
                  value={value || ''}
                />
              )}
            />
            <span className={'validation-error'} data-testid={'name-error-test-id'}>
              {(errors && errors.name?.message) || ''}
            </span>
          </div>
          <div className={'flex-1'}>
            <label htmlFor="name">Board</label>
            <Controller
              name={'boardId'}
              control={control}
              render={({ field: { onChange } }) => (
                <BaseWuSelect<BoardsType>
                  name={'board'}
                  accessorKey={{
                    label: 'name',
                    value: 'id',
                  }}
                  data={renderedBoardsData}
                  onSelect={data => {
                    onChange((data as BoardsType).id);
                  }}
                  onScroll={onHandleFetchBoards}
                  disabled={!!interview || isLoadingCreateInterview}
                  placeholder={'Select board'}
                />
              )}
            />
            <span className={'validation-error'}>{errors.boardId?.message}</span>
          </div>
        </div>

        <div className={'mt-[1.25rem]! mb-[1.25rem]!'}>
          <label htmlFor="aiJourneyModelId">Ai Model</label>

          {isLoadingAiModels ? (
            <Skeleton height={'12.5rem'} />
          ) : (
            <SlickCarousel
              cards={aiModels}
              renderFunction={card => (
                <SliderCard
                  card={card}
                  selectedSliderCardId={selectedSliderCardId}
                  onHandleSelectAiModel={onHandleSelectAiModel}
                />
              )}
              restSettings={{
                slidesToShow: aiModels.length > 5 ? 5 : aiModels.length,
              }}
            />
          )}

          <span className={'validation-error'}>{errors.aiJourneyModelId?.message}</span>
        </div>

        <div key={'transcript'}>
          <label htmlFor="transcript">Transcript</label>
          <Controller
            name={'text'}
            control={control}
            render={({ field: { onChange, value } }) => (
              <BaseWuTextarea
                data-testid={`create-interview-name-input-test-id`}
                placeholder={'Transcript'}
                id={'transcript'}
                onChange={onChange}
                disabled={!!interview || isLoadingCreateInterview}
                value={value || ''}
                rows={6}
              />
            )}
          />
          <span className={'validation-error'}>{(errors && errors.text?.message) || ''}</span>
        </div>
      </form>
    </BaseWuModal>
  );
};

export default CreateInterviewModal;
