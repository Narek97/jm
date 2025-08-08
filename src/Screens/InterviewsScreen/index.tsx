import { useCallback, useMemo, useState } from 'react';

import { WuButton } from '@npm-questionpro/wick-ui-lib';
import { useParams } from '@tanstack/react-router';

import CreateInterviewModal from './components/CreateInterviewModal';
import InterviewCard from './components/InterviewCard';
import InterviewDeleteModal from './components/InterviewDeleteModal';
import { InterviewType } from './types';

import {
  GetInterviewsByWorkspaceIdQuery,
  useGetInterviewsByWorkspaceIdQuery,
} from '@/api/queries/generated/getInterviewsByWorkspaceIdQuery.generated.ts';
import BaseWuLoader from '@/Components/Shared/BaseWuLoader';
import CustomError from '@/Components/Shared/CustomError';
import EmptyDataInfo from '@/Components/Shared/EmptyDataInfo';
import Pagination from '@/Components/Shared/Pagination';
import { querySlateTime } from '@/Constants';
import { INTERVIEWS_LIMIT } from '@/Constants/pagination.ts';
import ErrorBoundary from '@/Features/ErrorBoundary';
import {
  useRemoveQueriesByKey,
  useSetAllQueryDataByKey,
  useSetQueryDataByKeyAdvanced,
} from '@/Hooks/useQueryKey.ts';

const InterviewsScreen = () => {
  const { workspaceId } = useParams({
    from: '/_authenticated/_secondary-sidebar-layout/workspace/$workspaceId/interviews/',
  });

  const [selectedInterview, setSelectedInterview] = useState<InterviewType | null>(null);
  const [isOpenCreateModal, setIsOpenCreateModal] = useState<boolean>(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [offset, setOffset] = useState<number>(0);

  const setInterviews = useSetQueryDataByKeyAdvanced();
  const setAllInterviews = useSetAllQueryDataByKey('GetInterviewsByWorkspaceId');
  const setRemoveInterviewsQuery = useRemoveQueriesByKey();

  const {
    isLoading: isLoadingInterviews,
    error: errorInterviews,
    data: dataInterviews,
  } = useGetInterviewsByWorkspaceIdQuery<GetInterviewsByWorkspaceIdQuery, Error>(
    {
      getInterviewsInput: {
        workspaceId: +workspaceId!,
        offset,
        limit: INTERVIEWS_LIMIT,
      },
    },
    {
      staleTime: querySlateTime,
    },
  );

  const renderedInterviewsData: InterviewType[] = useMemo(
    () => dataInterviews?.getInterviewsByWorkspaceId.interviews || [],
    [dataInterviews?.getInterviewsByWorkspaceId.interviews],
  );

  const interviewsDataCount: number = useMemo(
    () => dataInterviews?.getInterviewsByWorkspaceId.count || 0,
    [dataInterviews?.getInterviewsByWorkspaceId.count],
  );

  const onToggleCreateModal = useCallback(() => {
    setIsOpenCreateModal(prev => !prev);
    setSelectedInterview(null);
  }, []);

  const onHandleView = useCallback((interview?: InterviewType) => {
    if (interview) {
      setSelectedInterview(interview);
      setIsOpenCreateModal(true);
    }
  }, []);

  const onToggleDeleteModal = useCallback((interview?: InterviewType | null) => {
    setSelectedInterview(interview || null);
    setIsOpenDeleteModal(prev => !prev);
  }, []);

  const onHandleFilterInterview = useCallback(
    (id: number) => {
      if (
        currentPage * INTERVIEWS_LIMIT >= interviewsDataCount &&
        dataInterviews?.getInterviewsByWorkspaceId.interviews.length === 1 &&
        currentPage !== 1
      ) {
        setOffset(prev => prev - INTERVIEWS_LIMIT);
        setCurrentPage(prev => prev - 1);
      } else if (
        currentPage * INTERVIEWS_LIMIT < interviewsDataCount &&
        interviewsDataCount > INTERVIEWS_LIMIT
      ) {
        setRemoveInterviewsQuery('GetInterviewsByWorkspaceId', {
          input: 'getInterviewsInput',
          key: 'offset',
          value: offset,
          deleteUpcoming: true,
        });
      }
      setAllInterviews((oldData: any) => {
        if (oldData) {
          return {
            getInterviewsByWorkspaceId: {
              ...oldData.getInterviewsByWorkspaceId,
              count: oldData.getInterviewsByWorkspaceId.count - 1,
              interviews: oldData.getInterviewsByWorkspaceId.interviews.filter(
                (interview: InterviewType) => interview.id !== id,
              ),
            },
          };
        }
      });
    },
    [
      currentPage,
      dataInterviews?.getInterviewsByWorkspaceId.interviews.length,
      interviewsDataCount,
      offset,
      setAllInterviews,
      setRemoveInterviewsQuery,
    ],
  );

  const onHandleAddNewInterview = useCallback(
    (newInterview: InterviewType) => {
      setRemoveInterviewsQuery('GetInterviewsByWorkspaceId', {
        input: 'getInterviewsInput',
        key: 'offset',
        value: 0,
      });

      setInterviews(
        'GetInterviewsByWorkspaceId',
        {
          input: 'getInterviewsInput',
          key: 'offset',
          value: 0,
        },
        (oldData: any) => {
          if (oldData) {
            return {
              getInterviewsByWorkspaceId: {
                offset: 0,
                limit: INTERVIEWS_LIMIT,
                count: oldData.getInterviewsByWorkspaceId.count + 1,
                interviews: [
                  newInterview,
                  ...oldData.getInterviewsByWorkspaceId.interviews.slice(0, INTERVIEWS_LIMIT - 1),
                ],
              },
            };
          }
        },
      );

      setCurrentPage(1);
      setOffset(0);
    },
    [setRemoveInterviewsQuery, setInterviews],
  );

  const onHandleChangePage = useCallback((newPage: number) => {
    setCurrentPage(newPage);
    setOffset((newPage - 1) * INTERVIEWS_LIMIT);
  }, []);

  if (isLoadingInterviews && !renderedInterviewsData.length) {
    return <BaseWuLoader />;
  }

  if (errorInterviews) {
    return <CustomError error={errorInterviews?.message} />;
  }

  return (
    <div className={'h-full !pt-8 !px-16 !pb-[0]'}>
      {isOpenCreateModal ? (
        <CreateInterviewModal
          isOpen={isOpenCreateModal}
          interview={selectedInterview}
          workspaceId={+workspaceId}
          onHandleAddNewInterview={onHandleAddNewInterview}
          handleClose={onToggleCreateModal}
        />
      ) : null}
      {isOpenDeleteModal ? (
        <InterviewDeleteModal
          isOpen={isOpenDeleteModal}
          interview={selectedInterview}
          onHandleFilterInterview={onHandleFilterInterview}
          handleClose={onToggleDeleteModal}
        />
      ) : null}
      <h3 className={'base-title !text-heading-2'}>Interviews</h3>

      <div className={'flex gap-4 py-4 md:pb-8 border-b border-[var(--light-gray)]'}>
        <WuButton data-testid={'create-interview-btn-test-id'} onClick={onToggleCreateModal}>
          New interview
        </WuButton>
        {interviewsDataCount > INTERVIEWS_LIMIT && (
          <Pagination
            perPage={INTERVIEWS_LIMIT}
            currentPage={currentPage}
            allCount={interviewsDataCount}
            changePage={onHandleChangePage}
          />
        )}
      </div>

      {isLoadingInterviews && !renderedInterviewsData.length ? (
        <BaseWuLoader />
      ) : (
        <>
          {renderedInterviewsData.length ? (
            <ul
              className={
                'h-[calc(100dvh-21rem)] flex flex-wrap gap-4 mt-[1.125rem]! pr-5! overflow-auto'
              }>
              {renderedInterviewsData.map(interview => (
                <ErrorBoundary key={interview.id}>
                  <InterviewCard
                    interview={interview}
                    onHandleView={onHandleView}
                    onHandleDelete={onToggleDeleteModal}
                  />
                </ErrorBoundary>
              ))}
            </ul>
          ) : (
            <EmptyDataInfo message={'There are no interviews yet'} />
          )}
        </>
      )}
    </div>
  );
};

export default InterviewsScreen;
