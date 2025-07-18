import React, { FC, useMemo, useRef } from 'react';

import './style.scss';

import dayjs from 'dayjs';
import fromNow from 'dayjs/plugin/relativeTime';

import {
  GetMapLogsQuery,
  useInfiniteGetMapLogsQuery,
} from '@/api/infinite-queries/generated/getMapLogs.generated';
import CustomModalHeader from '@/Components/Shared/CustomModalHeader';
import WuBaseLoader from '@/Components/Shared/WuBaseLoader';
import { JOURNEY_MAP_HISTORY_LIMIT } from '@/constants/pagination.ts';
import HistoryCard from '@/Screens/JourneyMapScreen/components/JourneyMapHeader/JourneyMapHistoryDrawer/HistoryCard';
import { MapLogsType } from '@/Screens/JourneyMapScreen/components/JourneyMapHeader/types.ts';

interface IHistoryDrawer {
  mapID: number;
  onHandleClose: () => void;
}

dayjs.extend(fromNow);

const HistoryDrawer: FC<IHistoryDrawer> = ({ mapID, onHandleClose }) => {
  const childRef = useRef<HTMLUListElement>(null);

  const {
    data: historyData,
    isFetching: historyIsFetchingNextPage,
    hasNextPage: historyHasNextPage,
    fetchNextPage: historyFetchNextPage,
  } = useInfiniteGetMapLogsQuery(
    {
      mapId: mapID,
      paginationInput: {
        limit: JOURNEY_MAP_HISTORY_LIMIT,
        offset: 0,
      },
    },
    {
      enabled: !!mapID,
      getNextPageParam: function (lastPage: GetMapLogsQuery, allPages: GetMapLogsQuery[]): unknown {
        if (!lastPage.getMapLogs.mapLogs || !lastPage.getMapLogs.mapLogs.length) {
          return undefined;
        }
        return {
          mapId: mapID,
          paginationInput: {
            limit: JOURNEY_MAP_HISTORY_LIMIT,
            offset: allPages.length * JOURNEY_MAP_HISTORY_LIMIT,
          },
        };
      },
      initialPageParam: 0,
    },
  );

  const renderedHistoryData = useMemo<Array<MapLogsType>>(() => {
    if (!historyData?.pages) {
      return [];
    }

    return historyData.pages.reduce((acc: Array<MapLogsType>, curr) => {
      if (curr?.getMapLogs.mapLogs) {
        return [...acc, ...(curr.getMapLogs.mapLogs as Array<MapLogsType>)];
      }
      return acc;
    }, []);
  }, [historyData?.pages]);

  const onHandleFetch = (e: React.UIEvent<HTMLElement>, childOffsetHeight: number) => {
    const target = e.currentTarget as HTMLDivElement | null;
    if (
      target &&
      target.offsetHeight + target.scrollTop + 100 >= childOffsetHeight &&
      historyHasNextPage
    ) {
      historyFetchNextPage().then();
    }
  };

  return (
    <div className={'history-drawer'} data-testid="history-drawer">
      <CustomModalHeader title={'History'} />
      <button onClick={onHandleClose} aria-label={'close drawer'} className={'close-drawer'}>
        <span className={'wm-close'} />
      </button>
      <div
        className={'history-drawer--body'}
        onScroll={e => {
          onHandleFetch(e, childRef.current?.offsetHeight || 0);
        }}>
        <ul ref={childRef} className={'history-drawer--ul'}>
          {renderedHistoryData.map(history => (
            <HistoryCard key={history.id} history={history} />
          ))}
        </ul>
        {historyIsFetchingNextPage && (
          <div
            className={renderedHistoryData.length ? 'history-drawer--relative-loading-block' : ''}>
            <WuBaseLoader />
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryDrawer;
