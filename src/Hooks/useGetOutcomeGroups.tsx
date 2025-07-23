import { useEffect, useMemo } from 'react';

import {
  GetOutcomeGroupsQuery,
  useInfiniteGetOutcomeGroupsQuery,
} from '@/api/infinite-queries/generated/getOutcomeGroups.generated.ts';
import { OrderByEnum, OutcomeGroup, OutcomeGroupSortByEnum } from '@/api/types.ts';
import { OUTCOME_GROUPS_LIMIT } from '@/Constants/pagination.ts';

const useGetOutcomeGroups = (needToGet: boolean) => {
  const {
    isLoading: isLoadingOutcomes,
    fetchNextPage: fetchNextPageOutcomes,
    data: dataGetOutcomes,
    isFetchingNextPage: isFetchingNextPageOutcomes,
  } = useInfiniteGetOutcomeGroupsQuery<{ pages: Array<GetOutcomeGroupsQuery> }, Error>(
    {
      getOutcomeGroupsInput: {
        limit: OUTCOME_GROUPS_LIMIT,
        offset: 0,
        sortBy: OutcomeGroupSortByEnum.createdBy,
        orderBy: OrderByEnum.Asc,
      },
    },
    {
      getNextPageParam: function (
        lastPage: GetOutcomeGroupsQuery,
        allPages: GetOutcomeGroupsQuery[],
      ) {
        return lastPage.getOutcomeGroups.outcomeGroups.length < OUTCOME_GROUPS_LIMIT
          ? undefined
          : allPages.length;
      },

      initialPageParam: 0,
      enabled: needToGet,
    },
  );

  const renderedDataOutcomes = useMemo<Array<OutcomeGroup>>(() => {
    if (!dataGetOutcomes?.pages) {
      return [];
    }

    return dataGetOutcomes.pages.reduce((acc: Array<OutcomeGroup>, curr) => {
      if (curr?.getOutcomeGroups.outcomeGroups) {
        return [...acc, ...(curr.getOutcomeGroups.outcomeGroups as Array<OutcomeGroup>)];
      }
      return acc;
    }, []);
  }, [dataGetOutcomes]);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      const isAtBottom = target.scrollTop + target.clientHeight >= target.scrollHeight - 200;
      if (isAtBottom && !isFetchingNextPageOutcomes && !isLoadingOutcomes) {
        fetchNextPageOutcomes().then(() => {});
      }
    };

    const hoverMenuPanelTop = document.querySelector('.hover-menu-panel--top');

    if (hoverMenuPanelTop) {
      hoverMenuPanelTop.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (hoverMenuPanelTop) {
        hoverMenuPanelTop.removeEventListener('scroll', handleScroll);
      }
    };
  }, [fetchNextPageOutcomes, isFetchingNextPageOutcomes, isLoadingOutcomes]);

  return {
    renderedDataOutcomes,
  };
};

export default useGetOutcomeGroups;
