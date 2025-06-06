import { FC, useCallback, useMemo, useRef, useState } from 'react';

import './style.scss';

import { Box } from '@mui/material';

import BoardItem from './BoardItem';

import {
  GetWorkspaceBoardsQuery,
  useInfiniteGetWorkspaceBoardsQuery,
} from '@/api/infinite-queries/generated/getWorkspaceBoards.generated.ts';
import { Board } from '@/api/types.ts';
import CustomLoader from '@/Components/Shared/CustomLoader';
import EmptyDataInfo from '@/Components/Shared/EmptyDataInfo';
import { BOARDS_LIMIT } from '@/constants/pagination';
import ErrorBoundary from '@/Features/ErrorBoundary';
import { useCopyMapStore } from '@/store/copyMap';
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
    data: organizationBoardsData,
    isLoading: organizationBoardsIsLoading,
    isFetching: organizationBoardsIsFetching,
    fetchNextPage: organizationBoardsFetchNextPage,
    isFetchingNextPage: organizationBoardsIsFetchingNextPage,
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
        return lastPage.getWorkspaceBoards.boards.length < BOARDS_LIMIT
          ? undefined
          : allPages.length;
      },
      initialPageParam: 0,
      enabled: !!workspaceId,
    },
  );

  const onHandleFetchWorkspaces = (e: React.UIEvent<HTMLElement>, childOffsetHeight: number) => {
    const target = e.currentTarget as HTMLDivElement | null;
    if (
      e.target &&
      childOffsetHeight &&
      target &&
      target.offsetHeight + target.scrollTop + 100 >= childOffsetHeight &&
      !organizationBoardsIsFetching &&
      organizationBoardsIsFetchingNextPage
    ) {
      organizationBoardsFetchNextPage().then();
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

  const renderedOrganizationBoardsData = useMemo<Array<Board>>(() => {
    if (!organizationBoardsData?.pages) {
      return [];
    }

    return organizationBoardsData.pages.reduce((acc: Array<Board>, curr) => {
      if (curr?.getWorkspaceBoards.boards) {
        return [...acc, ...(curr.getWorkspaceBoards.boards as Array<Board>)];
      }
      return acc;
    }, []);
  }, [organizationBoardsData?.pages]);

  return (
    <div
      data-testid="boards-list-id"
      className={`boards-list ${isLoadingCopyMap ? 'disabled-section' : ''}`}>
      <div className={'boards-list--content'}>
        {organizationBoardsIsLoading && !renderedOrganizationBoardsData?.length ? (
          <div className={'boards-list-loading-section'}>
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
              className={`go-back`}>
              <span className={'wm-arrow-back'} />

              <button disabled={isLoadingCopyMap} className={`go-back--text`}>
                Go to workspaces
              </button>
            </div>
            {renderedOrganizationBoardsData?.length ? (
              <div
                className={'boards-list--content-boards'}
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
              <EmptyDataInfo message={'There are no workspaces yet'} />
            )}
          </>
        )}
      </div>
    </div>
  );
};
export default WorkspaceBoards;
