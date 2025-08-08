import React, { FC, useCallback, useMemo, useRef, useState } from 'react';

import BoardItem from './BoardItem';
import { WorkspaceBoardsType } from './types';

import {
  GetWorkspaceBoardsQuery,
  useInfiniteGetWorkspaceBoardsQuery,
} from '@/api/infinite-queries/generated/getWorkspaceBoards.generated.ts';
import BaseWuLoader from '@/Components/Shared/BaseWuLoader';
import EmptyDataInfo from '@/Components/Shared/EmptyDataInfo';
import { BOARDS_LIMIT } from '@/Constants/pagination';
import ErrorBoundary from '@/Features/ErrorBoundary';
import { useCopyMapStore } from '@/Store/copyMap';
import { CopyMapLevelTemplateEnum } from '@/types/enum.ts';

interface IWorkspaceBoards {
  workspaceId: number;
  isLoadingCopyMap: boolean;
}

const WorkspaceBoards: FC<IWorkspaceBoards> = ({ workspaceId, isLoadingCopyMap }) => {
  const { setCopyMapState, mapId } = useCopyMapStore();

  const [selectedItem, setSelectedItem] = useState<null | number>(null);

  const childRef = useRef<HTMLUListElement>(null);
  const [processingItemId, setProcessingItemId] = useState<number | null>(null);

  const {
    data: workspaceBoardsData,
    isLoading: workspaceBoardsIsLoading,
    isFetching: workspaceBoardsIsFetching,
    fetchNextPage: workspaceBoardsFetchNextPage,
    hasNextPage: workspaceBoardsHasNextPage,
  } = useInfiniteGetWorkspaceBoardsQuery<{ pages: Array<GetWorkspaceBoardsQuery> }, Error>(
    {
      getWorkspaceBoardsInput: {
        offset: 0,
        limit: BOARDS_LIMIT,
        workspaceId: workspaceId,
      },
    },
    {
      getNextPageParam: function (
        lastPage: GetWorkspaceBoardsQuery,
        allPages: GetWorkspaceBoardsQuery[],
      ) {
        if (!lastPage.getWorkspaceBoards.boards || !lastPage.getWorkspaceBoards.boards.length) {
          return undefined;
        }

        return {
          getWorkspaceBoardsInput: {
            workspaceId: workspaceId,
            limit: BOARDS_LIMIT,
            offset: allPages.length * BOARDS_LIMIT,
          },
        };
      },
      initialPageParam: 0,
      enabled: !!workspaceId,
    },
  );

  const onHandleFetchWorkspaces = (e: React.UIEvent<HTMLElement>, childOffsetHeight: number) => {
    const target = e.currentTarget as HTMLDivElement | null;
    if (
      workspaceBoardsHasNextPage &&
      !workspaceBoardsIsFetching &&
      target &&
      target.offsetHeight + target.scrollTop + 100 >= childOffsetHeight
    ) {
      workspaceBoardsFetchNextPage().then();
    }
  };

  const handlePasteMap = useCallback(
    (boardId: number) => {
      setSelectedItem(boardId);
      setProcessingItemId(boardId);
      if (!mapId) {
        setCopyMapState({
          template: CopyMapLevelTemplateEnum.MAPS,
          boardId: boardId,
        });
      } else {
        setCopyMapState({
          boardId: boardId,
        });
      }
    },
    [mapId, setCopyMapState],
  );

  const renderedOrganizationBoardsData = useMemo<Array<WorkspaceBoardsType>>(() => {
    if (!workspaceBoardsData?.pages) {
      return [];
    }

    return workspaceBoardsData.pages.reduce((acc: Array<WorkspaceBoardsType>, curr) => {
      if (curr?.getWorkspaceBoards.boards) {
        return [...acc, ...(curr.getWorkspaceBoards.boards as Array<WorkspaceBoardsType>)];
      }
      return acc;
    }, []);
  }, [workspaceBoardsData?.pages]);

  return (
    <div
      data-testid="boards-list-id"
      className={`p-2 h-[26rem] ${isLoadingCopyMap ? 'pointer-events-none hover:cursor-pointer hover:text-[var(--text)] hover:path:stroke-[var(--text)]' : ''}`}>
      <div>
        {workspaceBoardsIsLoading && !renderedOrganizationBoardsData?.length ? (
          <div>
            <BaseWuLoader />
          </div>
        ) : (
          <>
            <div
              data-testid="go-back-org"
              onClick={() => {
                setCopyMapState({
                  template: CopyMapLevelTemplateEnum.WORKSPACES,
                  boardId: null,
                });
              }}
              className={
                'w-40 !my-[0.625rem] mb-4 ml-1 flex items-center justify-center gap-2 text-[var(--BASE_GRAY_COLOR)] hover:cursor-pointer hover:!text-[var(--primary)] group'
              }>
              <span className={'wm-arrow-back'} />
              <button disabled={isLoadingCopyMap}>Go to workspaces</button>
            </div>
            {renderedOrganizationBoardsData?.length ? (
              <div
                className={
                  'h-[21.5rem] p-4 mb-4 overflow-x-auto border-b-[0.0625rem] border-b-[var(--soft-gray)]'
                }
                onScroll={e => {
                  onHandleFetchWorkspaces(e, childRef.current?.offsetHeight || 0);
                }}>
                <ul ref={childRef}>
                  {renderedOrganizationBoardsData?.map(board => (
                    <ErrorBoundary key={board.id}>
                      <BoardItem
                        board={board}
                        handlePasteMap={handlePasteMap}
                        isLoadingCopyMap={isLoadingCopyMap && processingItemId === board?.id}
                        isSelected={selectedItem === board?.id}
                      />
                    </ErrorBoundary>
                  ))}
                </ul>
              </div>
            ) : (
              <EmptyDataInfo message={'There are no boards yet'} />
            )}
          </>
        )}
      </div>
    </div>
  );
};
export default WorkspaceBoards;
