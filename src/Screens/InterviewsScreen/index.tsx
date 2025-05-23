import "./style.scss";
import { useCallback, useMemo, useState } from "react";

import { Box } from "@mui/material";
import { WuButton } from "@npm-questionpro/wick-ui-lib";
import { useParams } from "@tanstack/react-router";

import {
  GetInterviewsByWorkspaceIdQuery,
  useGetInterviewsByWorkspaceIdQuery,
} from "@/api/queries/generated/getInterviewsByWorkspaceIdQuery.generated.ts";
import CustomError from "@/Components/Shared/CustomError";
import CustomLoader from "@/Components/Shared/CustomLoader";
import EmptyDataInfo from "@/Components/Shared/EmptyDataInfo";
import Pagination from "@/Components/Shared/Pagination";
import { querySlateTime } from "@/constants";
import { INTERVIEWS_LIMIT } from "@/constants/pagination.ts";
import ErrorBoundary from "@/Features/ErrorBoundary";
import {
  useRemoveQueriesByKey,
  useSetQueryDataByKey,
} from "@/hooks/useQueryKey.ts";
import CreateInterviewModal from "@/Screens/InterviewsScreen/components/CreateInterviewModal";
import InterviewCard from "@/Screens/InterviewsScreen/components/InterviewCard";
import InterviewDeleteModal from "@/Screens/InterviewsScreen/components/InterviewDeleteModal";
import { InterviewType } from "@/Screens/InterviewsScreen/types.ts";

const InterviewsScreen = () => {
  const { workspaceId } = useParams({
    from: "/_authenticated/_secondary-sidebar-layout/workspace/$workspaceId/interviews/",
  });

  const [selectedInterview, setSelectedInterview] =
    useState<InterviewType | null>(null);
  const [isOpenCreateModal, setIsOpenCreateModal] = useState<boolean>(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [offset, setOffset] = useState<number>(0);

  const setInterviews = useSetQueryDataByKey("GetInterviewsByWorkspaceId", {
    input: "getInterviewsInput",
    key: "offset",
    value: offset,
  });
  const setRemoveInterviews = useRemoveQueriesByKey();

  const {
    isLoading: isLoadingInterviews,
    error: errorInterviews,
    data: dataInterviews,
  } = useGetInterviewsByWorkspaceIdQuery<
    GetInterviewsByWorkspaceIdQuery,
    Error
  >(
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
    setIsOpenCreateModal((prev) => !prev);
    setSelectedInterview(null);
  }, []);

  const onHandleView = useCallback((interview: InterviewType) => {
    setSelectedInterview(interview);
    setIsOpenCreateModal(true);
  }, []);

  const onToggleDeleteModal = useCallback((interview: InterviewType | null) => {
    setSelectedInterview(interview);
    setIsOpenDeleteModal((prev) => !prev);
  }, []);

  const onHandleFilterInterview = useCallback(
    (id: number) => {
      if (
        currentPage * INTERVIEWS_LIMIT >= interviewsDataCount &&
        dataInterviews?.getInterviewsByWorkspaceId.interviews.length === 1
      ) {
        setOffset((prev) => prev - INTERVIEWS_LIMIT);
      } else {
        if (
          currentPage * INTERVIEWS_LIMIT < interviewsDataCount &&
          interviewsDataCount > INTERVIEWS_LIMIT
        ) {
          setRemoveInterviews("GetInterviewsByWorkspaceId", {
            input: "getInterviewsInput",
            key: "offset",
            value: offset,
            deleteUpcoming: true,
          });
        } else {
          setInterviews((oldData: any) => {
            if (oldData) {
              return {
                getInterviewsByWorkspaceId: {
                  ...oldData.getInterviewsByWorkspaceId,
                  count: oldData.getInterviewsByWorkspaceId.count - 1,
                  interviews:
                    oldData.getInterviewsByWorkspaceId.interviews.filter(
                      (interview: InterviewType) => interview.id !== id,
                    ),
                },
              };
            }
          });
        }
      }
    },
    [
      currentPage,
      dataInterviews?.getInterviewsByWorkspaceId.interviews.length,
      interviewsDataCount,
      offset,
      setInterviews,
      setRemoveInterviews,
    ],
  );

  const onHandleAddNewInterview = useCallback(
    (newInterview: InterviewType) => {
      setRemoveInterviews("GetInterviewsByWorkspaceId", {
        input: "getInterviewsInput",
        key: "offset",
        value: 0,
      });

      setInterviews((oldData: any) => {
        if (oldData) {
          return {
            getInterviewsByWorkspaceId: {
              offset: 0,
              limit: INTERVIEWS_LIMIT,
              count: oldData.getInterviewsByWorkspaceId.count + 1,
              interviews: [
                newInterview,
                ...oldData.getInterviewsByWorkspaceId.interviews.slice(
                  0,
                  INTERVIEWS_LIMIT - 1,
                ),
              ],
            },
          };
        }
      });

      setCurrentPage(1);
      setOffset(0);
    },
    [setRemoveInterviews, setInterviews],
  );

  const onHandleChangePage = useCallback((newPage: number) => {
    setCurrentPage(newPage);
    setOffset((newPage - 1) * INTERVIEWS_LIMIT);
  }, []);

  if (isLoadingInterviews && !renderedInterviewsData.length) {
    return <CustomLoader />;
  }

  if (errorInterviews) {
    return <CustomError error={errorInterviews?.message} />;
  }

  return (
    <div className={"interviews-container"}>
      {isOpenCreateModal ? (
        <CreateInterviewModal
          isOpen={isOpenCreateModal}
          interview={selectedInterview}
          workspaceId={workspaceId}
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
      <div className={"interviews-container--header"}>
        <div className={"base-page-header"}>
          <h3 className={"base-title !text-heading-2"}>Interviews</h3>
        </div>
        <div className={"interviews-container--create-section"}>
          <WuButton
            data-testid={"create-interview-btn-test-id"}
            onClick={onToggleCreateModal}
          >
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
      </div>
      <div className={"interviews-container--body"}>
        {isLoadingInterviews && !renderedInterviewsData.length ? (
          <CustomLoader />
        ) : (
          <>
            {renderedInterviewsData.length ? (
              <ul className={"interviews-container--body--list"}>
                {renderedInterviewsData.map((interview) => (
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
              <EmptyDataInfo
                icon={<Box />}
                message={"There are no interviews yet"}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default InterviewsScreen;
