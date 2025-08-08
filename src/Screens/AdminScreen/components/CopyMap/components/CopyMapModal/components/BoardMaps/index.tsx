import React, { FC, useMemo, useRef } from 'react';

import MapItem from './MapItem';

import {
  GetJourneysForCopyQuery,
  useInfiniteGetJourneysForCopyQuery,
} from '@/api/infinite-queries/generated/getJourniesForCopy.generated.ts';
import BaseWuLoader from '@/Components/Shared/BaseWuLoader';
import EmptyDataInfo from '@/Components/Shared/EmptyDataInfo';
import { JOURNIES_LIMIT } from '@/Constants/pagination.ts';
import ErrorBoundary from '@/Features/ErrorBoundary';
import {
  JourneysForCopyType
} from '@/Screens/AdminScreen/components/CopyMap/components/CopyMapModal/components/BoardMaps/types.ts';
import { useCopyMapStore } from '@/Store/copyMap.ts';
import { CopyMapLevelTemplateEnum } from '@/types/enum.ts';

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
  } = useInfiniteGetJourneysForCopyQuery<{ pages: Array<GetJourneysForCopyQuery> }, Error>(
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
        return lastPage.getMaps.maps.length < JOURNIES_LIMIT ? undefined : allPages.length;
      },
      initialPageParam: 0,
      enabled: !!boardId,
    },
  );

  const onHandleFetch = (e: React.UIEvent<HTMLElement>, childOffsetHeight: number) => {
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

  const renderedJourneysForCopyData = useMemo<Array<JourneysForCopyType>>(() => {
    if (!journeysForCopyData?.pages) {
      return [];
    }

    return journeysForCopyData.pages.reduce((acc: Array<JourneysForCopyType>, curr) => {
      if (curr?.getMaps.maps) {
        return [...acc, ...(curr.getMaps.maps as Array<JourneysForCopyType>)];
      }
      return acc;
    }, []);
  }, [journeysForCopyData?.pages]);

  return (
    <div
      data-testid="boards-list-id"
      className={`h-[25.3rem] ${isProcessing ? 'pointer-events-none hover:cursor-pointer hover:!text-[var(--text)] hover:[&>svg_path]:stroke-[var(--text)]' : ''}`}>
      {journeysForCopyIsLoading && !renderedJourneysForCopyData?.length ? (
        <div className={'w-full h-full relative'}>
          <BaseWuLoader />
        </div>
      ) : (
        <>
          <div
            data-testid="go-back-org"
            onClick={() => {
              setCopyMapState({
                template: CopyMapLevelTemplateEnum.BOARDS,
                boardId: null,
              });
            }}
            className={
              'w-40 !my-[0.625rem] mb-4 ml-1 flex items-center justify-center gap-2 text-[var(--BASE_GRAY_COLOR)] hover:cursor-pointer hover:!text-[var(--primary)] group'
            }>
            <span className={'wm-arrow-back'} />
            <button disabled={isProcessing}>
              Go to boards
            </button>
          </div>
          {renderedJourneysForCopyData?.length ? (
            <div
              className={'h-[calc(100%-3em)] p-4 mb-4 overflow-x-auto border-b-[0.0625rem] border-b-[#e8e8e8]'}
              onScroll={e => {
                onHandleFetch(e, childRef.current?.offsetHeight || 0);
              }}>
              <ul ref={childRef}>
                {renderedJourneysForCopyData?.map(map => (
                  <ErrorBoundary key={map?.id}>
                    <MapItem key={map?.id} map={map} />
                  </ErrorBoundary>
                ))}
              </ul>
            </div>
          ) : (
            <EmptyDataInfo message={'There are no maps yet'} />
          )}
        </>
      )}
    </div>
  );
};
export default BoardMaps;


