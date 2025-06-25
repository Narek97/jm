'use client';

import React, { FC, useMemo, useRef } from 'react';

import './style.scss';

import dayjs from 'dayjs';
import fromNow from 'dayjs/plugin/relativeTime';

import CustomLoader from '@/components/molecules/custom-loader/custom-loader';
import HistoryCard from '@/containers/journey-map-container/journey-map-header/journey-map-history-drawer/history-card';
import { useInfiniteGetMapLogsQuery } from '@/gql/infinite-queries/generated/getMapLogs.generated';
import CloseIcon from '@/public/base-icons/close.svg';
import { BOARDS_LIMIT, JOURNEY_MAP_HISTORY_LIMIT } from '@/utils/constants/pagination';
import { HistoryItemType } from '@/utils/ts/types/journey-map/journey-map-types';

import ModalHeader from '../../../../components/molecules/modal-header';

interface IHistoryDrawer {
  mapID: number;
  onHandleClose: () => void;
}
dayjs.extend(fromNow);

const HistoryDrawer: FC<IHistoryDrawer> = ({ mapID, onHandleClose }) => {
  const childRef = useRef<HTMLUListElement>(null);

  const {
    data: history,
    isLoading: historyIsLoading,
    isFetching: historyIsFetchingNextPage,
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
    },
  );

  const historyData: Array<HistoryItemType> = useMemo(() => {
    if (history?.pages && history?.pages[0] !== undefined) {
      return history.pages.reduce<Array<HistoryItemType>>(
        (acc, curr) => [...acc, ...curr.getMapLogs.mapLogs],
        [],
      );
    }
    return [];
  }, [history?.pages]);

  const onHandleFetch = (e: React.UIEvent<HTMLElement>, childOffsetHeight: number) => {
    const target = e.currentTarget as HTMLDivElement | null;
    if (
      e.target &&
      childOffsetHeight &&
      target &&
      target.offsetHeight + target.scrollTop + 100 >= childOffsetHeight &&
      !historyIsFetchingNextPage &&
      !historyIsLoading &&
      historyData.length < history?.pages[0].getMapLogs.count!
    ) {
      historyFetchNextPage({
        pageParam: {
          mapId: mapID,

          paginationInput: {
            limit: BOARDS_LIMIT,
            offset: historyData.length,
          },
        },
      }).then();
    }
  };

  return (
    <div className={'history-drawer'} data-testid="history-drawer">
      <ModalHeader title={'History'} />
      <button onClick={onHandleClose} aria-label={'close drawer'} className={'close-drawer'}>
        <CloseIcon fill={'#545E6B'} />
      </button>
      <div
        className={'history-drawer--body'}
        onScroll={e => {
          onHandleFetch(e, childRef.current?.offsetHeight || 0);
        }}>
        <ul ref={childRef} className={'history-drawer--ul'}>
          {historyData.map(history => (
            <HistoryCard key={history.id} history={history} />
          ))}
        </ul>
        {historyIsFetchingNextPage && (
          <div className={historyData.length ? 'history-drawer--relative-loading-block' : ''}>
            <CustomLoader />
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryDrawer;
