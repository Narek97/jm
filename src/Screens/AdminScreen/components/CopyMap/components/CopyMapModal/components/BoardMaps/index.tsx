import React, { FC, useMemo, useRef } from "react";

import "./style.scss";

import { Box } from "@mui/material";

import MapItem from "./MapItem";

import {
  GetJourneysForCopyQuery,
  useInfiniteGetJourneysForCopyQuery,
} from "@/api/infinite-queries/generated/getJourniesForCopy.generated.ts";
import { Map } from "@/api/types.ts";
import CustomLoader from "@/Components/Shared/CustomLoader";
import EmptyDataInfo from "@/Components/Shared/EmptyDataInfo";
import { JOURNIES_LIMIT } from "@/constants/pagination.ts";
import ErrorBoundary from "@/Features/ErrorBoundary";
import { useCopyMapStore } from "@/store/copyMap.ts";
import { CopyMapLevelTemplateEnum } from "@/types/enum.ts";

interface IWorkspaceBoardsModal {
  boardId: number;
}

const BoardMaps: FC<IWorkspaceBoardsModal> = ({ boardId }) => {
  const { setCopyMapState, isProcessing } = useCopyMapStore();

  const childRef = useRef<HTMLUListElement>(null);

  const {
    data: journeysForCopyData,
    isLoading: journeysForCopyIsLoading,
    isFetching: journeysForCopyIsFetchingNextPage,
    fetchNextPage: journeysForCopyFetchNextPage,
  } = useInfiniteGetJourneysForCopyQuery<
    { pages: Array<GetJourneysForCopyQuery> },
    Error
  >(
    {
      getMapsInput: {
        offset: 0,
        limit: JOURNIES_LIMIT,
        boardId: boardId,
      },
    },
    {
      getNextPageParam(
        lastPage: GetJourneysForCopyQuery,
        allPages: Array<GetJourneysForCopyQuery>,
      ) {
        return lastPage.getMaps.maps.length < JOURNIES_LIMIT
          ? undefined
          : allPages.length;
      },
      initialPageParam: 0,
      enabled: !!boardId,
    },
  );

  const onHandleFetch = (
    e: React.UIEvent<HTMLElement>,
    childOffsetHeight: number,
  ) => {
    const target = e.currentTarget as HTMLDivElement | null;
    if (
      e.target &&
      childOffsetHeight &&
      target &&
      target.offsetHeight + target.scrollTop + 100 >= childOffsetHeight &&
      journeysForCopyIsFetchingNextPage &&
      !journeysForCopyIsLoading
    ) {
      journeysForCopyFetchNextPage().then();
    }
  };

  const renderedJourneysForCopyData = useMemo<Array<Map>>(() => {
    if (!journeysForCopyData?.pages) {
      return [];
    }

    return journeysForCopyData.pages.reduce((acc: Array<Map>, curr) => {
      if (curr?.getMaps.maps) {
        return [...acc, ...(curr.getMaps.maps as Array<Map>)];
      }
      return acc;
    }, []);
  }, [journeysForCopyData?.pages]);

  return (
    <div
      data-testid="boards-list-id"
      className={`boards-list ${isProcessing ? "disabled-section" : ""}`}
    >
      <div className={"boards-list--content"}>
        {journeysForCopyIsLoading && !renderedJourneysForCopyData?.length ? (
          <div className={"boards-list-loading-section"}>
            <CustomLoader />
          </div>
        ) : (
          <>
            <div
              onClick={() => {
                setCopyMapState({
                  template: CopyMapLevelTemplateEnum.WORKSPACES,
                  boardId: null,
                });
              }}
              className={`go-back`}
            >
              <span className={"wm-arrow-back"} />
              <button disabled={isProcessing} className={`go-back--text  `}>
                Go to workspaces
              </button>
            </div>
            {renderedJourneysForCopyData?.length ? (
              <div
                className={"boards-list--content-boards"}
                onScroll={(e) => {
                  onHandleFetch(e, childRef.current?.offsetHeight || 0);
                }}
              >
                <ul ref={childRef}>
                  {renderedJourneysForCopyData?.map((map) => (
                    <ErrorBoundary key={map?.id}>
                      <MapItem key={map?.id} map={map} />
                    </ErrorBoundary>
                  ))}
                </ul>
              </div>
            ) : (
              <EmptyDataInfo icon={<Box />} message={"There are no maps yet"} />
            )}
          </>
        )}
      </div>
    </div>
  );
};
export default BoardMaps;
