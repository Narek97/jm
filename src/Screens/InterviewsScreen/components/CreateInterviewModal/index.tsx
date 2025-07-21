import React, { FC, useCallback, useMemo, useState } from 'react';

import './style.scss';
import { yupResolver } from '@hookform/resolvers/yup';
import { Skeleton } from '@mui/material';
import { useWuShowToast, WuButton } from '@npm-questionpro/wick-ui-lib';
import { Controller, useForm } from 'react-hook-form';

import SliderCard from './SliderCard';
import { CREATE_INTERVIEW_VALIDATION_SCHEMA } from '../../constants';
import { InterviewFormType, InterviewType } from '../../types';

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
import { BoardResponse } from '@/api/types.ts';
import BaseWuModal from '@/Components/Shared/BaseWuModal';
import CustomDropDown from '@/Components/Shared/CustomDropDown';
import CustomInput from '@/Components/Shared/CustomInput';
import SlickCarousel from '@/Components/Shared/SlickCarousel';
import { querySlateTime } from '@/constants';
import { AI_JOURNEYS_MODEL_LIMIT, BOARDS_LIMIT } from '@/constants/pagination';
import { DropdownSelectItemType } from '@/types';

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

  const renderedBoardsData = useMemo<Array<DropdownSelectItemType>>(() => {
    if (!dataBoards?.pages) {
      return [];
    }

    return dataBoards.pages
      .reduce((acc: Array<BoardResponse>, curr) => {
        if (curr?.getMyBoards.boards) {
          return [...acc, ...(curr.getMyBoards.boards as Array<BoardResponse>)];
        }
        return acc;
      }, [])
      .map(board => {
        return {
          id: board.id,
          name: board.name,
          value: board.id,
        };
      });
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
    async (e: React.UIEvent<HTMLElement>) => {
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
          disabled={!!interview || isLoadingCreateInterview}>
          Add
        </WuButton>
      }>
      <div className={'create-interview-modal'}>
        <form
          className={'create-interview-modal--form'}
          onSubmit={handleSubmit(onHandleCreateInterview)}
          id="linkform">
          <div className={'create-interview-modal--content-top'}>
            <div
              className={`create-interview-modal--content-input create-interview-modal--content-top-item`}>
              <label className={'create-interview-modal--content-input--label'} htmlFor="name">
                Name
              </label>
              <Controller
                name={'name'}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <CustomInput
                    data-testid={'create-interview-name-input-test-id'}
                    inputType={'primary'}
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
            <div
              className={
                'create-interview-modal--content-dropdown create-interview-modal--content-top-item'
              }>
              <label className={'create-interview-modal--content-input--label'} htmlFor="name">
                Board
              </label>
              <Controller
                name={'boardId'}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <CustomDropDown
                    name={'board'}
                    menuItems={renderedBoardsData}
                    onChange={onChange}
                    onScroll={onHandleFetchBoards}
                    selectItemValue={value?.toString()}
                    disabled={!!interview || isLoadingCreateInterview}
                    placeholder={'Select board'}
                  />
                )}
              />
              <span className={'validation-error'}>{errors.boardId?.message}</span>
            </div>
          </div>

          <div className={'create-interview-modal--content-dropdown'}>
            <label
              className={'create-interview-modal--content-input--label'}
              htmlFor="aiJourneyModelId">
              Ai Model
            </label>

            {isLoadingAiModels ? (
              <div
                style={{
                  height: '12.5rem',
                }}>
                <Skeleton
                  sx={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 1,
                  }}
                  animation="wave"
                  variant="rectangular"
                />
              </div>
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

          <div className={`create-interview-modal--content-input`} key={'transcript'}>
            <label className={'create-interview-modal--content-input--label'} htmlFor="transcript">
              Transcript
            </label>
            <Controller
              name={'text'}
              control={control}
              render={({ field: { onChange, value } }) => (
                <CustomInput
                  data-testid={`create-interview-name-input-test-id`}
                  inputType={'primary'}
                  placeholder={'Transcript'}
                  id={'transcript'}
                  onChange={onChange}
                  disabled={!!interview || isLoadingCreateInterview}
                  value={value || ''}
                  multiline={true}
                  rows={6}
                />
              )}
            />
            <span className={'validation-error'}>{(errors && errors.text?.message) || ''}</span>
          </div>
        </form>
      </div>
    </BaseWuModal>
  );
};

export default CreateInterviewModal;
