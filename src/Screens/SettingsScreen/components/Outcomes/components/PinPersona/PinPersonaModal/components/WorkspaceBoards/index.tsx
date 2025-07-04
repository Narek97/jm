import React, { FC, useEffect, useRef, useState } from 'react';

import './style.scss';

import WorkspaceBoardItem from '../WorkspaceBoardsItem';

import {
  GetBoardsForOutcomeGroupQuery,
  useInfiniteGetBoardsForOutcomeGroupQuery,
} from '@/api/infinite-queries/generated/getBoardsForOutcomeGroup.generated';
import CustomLoader from '@/Components/Shared/CustomLoader';
import EmptyDataInfo from '@/Components/Shared/EmptyDataInfo';
import { BOARDS_LIMIT } from '@/constants/pagination';
import ErrorBoundary from '@/Features/ErrorBoundary';
import { useOutcomePinBoardsStore } from '@/store/outcomePinBoards';
import { useOutcomePinnedBoardIdsStore } from '@/store/outcomePinBoardsIds.ts';

interface IWorkspaceBoards {
  workspaceId: number;
  outcomeGroupId?: number;
  handleClose: () => void;
}

const WorkspaceBoards: FC<IWorkspaceBoards> = ({ handleClose, workspaceId, outcomeGroupId }) => {
  const { selectedIdList, setSelectedIdList } = useOutcomePinBoardsStore();
  const { setOutcomePinnedBoardIds } = useOutcomePinnedBoardIdsStore();

  const [boards, setBoards] = useState<any[]>([]);
  const childRef = useRef<HTMLUListElement>(null);

  const {
    data,
    isLoading: organizationBoardsIsLoading,
    isFetching: organizationBoardsIsFetching,
    fetchNextPage: organizationBoardsFetchNextPage,
    isFetchingNextPage: organizationBoardsIsFetchingNextPage,
  } = useInfiniteGetBoardsForOutcomeGroupQuery<
    { pages: Array<GetBoardsForOutcomeGroupQuery> },
    Error
  >(
    {
      getBoardsFourOutcomeGroupInput: {
        workspaceId: workspaceId,
        outcomeGroupId,
        limit: BOARDS_LIMIT,
        offset: 0,
      },
    },
    {
      getNextPageParam: function (
        lastPage: GetBoardsForOutcomeGroupQuery,
        allPages: GetBoardsForOutcomeGroupQuery[],
      ) {
        return lastPage.getBoardsForOutcomeGroup.boards.length < BOARDS_LIMIT
          ? undefined
          : allPages.length;
      },
      initialPageParam: 0,
      enabled: !!workspaceId,
    },
  );

  const handleSelectBoard = (id: number, isPinned: boolean) => {
    const boardsNewList = [...boards];
    boardsNewList.forEach(itm => {
      if (itm?.id === id) {
        setSelectedIdList(prev => {
          return !isPinned ? prev.filter(item => item !== id) : [...prev, id];
        });
        if (outcomeGroupId) {
          setOutcomePinnedBoardIds(prev => {
            const group = prev[outcomeGroupId];
            const selected = isPinned
              ? [...group.selected, id]
              : group.selected.filter((item: number) => item !== id);

            return {
              ...prev,
              [outcomeGroupId]: {
                ...group,
                selected,
              },
            };
          });
        }
        itm.isPinned = isPinned;
      }
    });
    setBoards(boardsNewList);
  };

  const onHandleFetch = (e: React.UIEvent<HTMLElement>, childOffsetHeight: number) => {
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

  useEffect(() => {
    const newBoards: any = [];
    data?.pages.forEach(personaData => {
      newBoards.push(...((personaData?.getBoardsForOutcomeGroup?.boards as any) || []));
    });
    setBoards(newBoards);
  }, [data]);

  return (
    <div className={'boards-list'}>
      <div className={'boards-list--content'}>
        {organizationBoardsIsLoading && !boards?.length ? (
          <div className={'boards-list-loading-section'}>
            <CustomLoader />
          </div>
        ) : (
          <>
            <div onClick={handleClose} className={'go-back'}>
              <div className={'go-back--icon'}>
                <span className="wm-arrow-back-ios-new"></span>
              </div>
              <div className={'go-back--text'}>Go to workspaces</div>
            </div>
            {boards?.length ? (
              <div
                data-testid={'boards-list--content-boards'}
                className={'boards-list--content-boards'}
                onScroll={e => {
                  onHandleFetch(e, childRef.current?.offsetHeight || 0);
                }}>
                <ul ref={childRef} data-testid="boards-list--content-board-ul">
                  {boards?.map(itm => (
                    <ErrorBoundary key={itm?.id}>
                      <WorkspaceBoardItem
                        key={itm?.id}
                        itm={itm}
                        isSelected={!!selectedIdList?.find(idItem => idItem === itm?.id)}
                        handleSelectBoard={(id: number, isSelected: boolean) =>
                          handleSelectBoard(id, isSelected)
                        }
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
