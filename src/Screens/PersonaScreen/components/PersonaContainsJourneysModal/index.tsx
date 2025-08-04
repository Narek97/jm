import React, { FC, useMemo, useRef } from 'react';

import { WuTooltip } from '@npm-questionpro/wick-ui-lib';
import { useNavigate } from '@tanstack/react-router';
import dayjs from 'dayjs';
import fromNow from 'dayjs/plugin/relativeTime';

import {
  GetMapsQuery,
  useInfiniteGetMapsQuery,
} from '@/api/infinite-queries/generated/getJourneyMaps.generated.ts';
import BaseWuLoader from '@/Components/Shared/BaseWuLoader';
import BaseWuModal from '@/Components/Shared/BaseWuModal';
import EmptyDataInfo from '@/Components/Shared/EmptyDataInfo';
import { JOURNIES_LIMIT } from '@/Constants/pagination.ts';
import ErrorBoundary from '@/Features/ErrorBoundary';
import PersonaImages from '@/Features/PersonaImages';
import { PersonaType } from '@/Screens/PersonaGroupScreen/types.ts';
import { PersonaJourneyMap } from '@/Screens/PersonaScreen/types.ts';
import { SelectedPersonasViewModeEnum } from '@/types/enum.ts';

dayjs.extend(fromNow);

interface IAssignPersonaToMapModal {
  isOpen: boolean;
  personaId: number;
  handleClose: () => void;
}

const PersonaContainsJourneysModal: FC<IAssignPersonaToMapModal> = ({
  isOpen,
  personaId,
  handleClose,
}) => {
  const navigate = useNavigate();
  const childRef = useRef<HTMLUListElement>(null);

  const {
    data: mapsData,
    isLoading: mapsDataIsLoading,
    isFetching: mapsDataIsFetchingNextPage,
    hasNextPage: mapsDataHasNextPage,
    fetchNextPage: mapsDataFetchNextPage,
  } = useInfiniteGetMapsQuery<{ pages: Array<GetMapsQuery> }, Error>(
    {
      getMapsInput: {
        personaIds: [personaId],
        limit: JOURNIES_LIMIT,
        offset: 0,
      },
    },
    {
      getNextPageParam(lastPage, allPages) {
        if (!lastPage.getMaps.maps || !lastPage.getMaps.maps.length) {
          return undefined;
        }
        return {
          getMapsInput: {
            personaIds: [personaId],
            limit: JOURNIES_LIMIT,
            offset: allPages.length * JOURNIES_LIMIT,
          },
        };
      },
      initialPageParam: {
        getMapsInput: { personaIds: [personaId], limit: JOURNIES_LIMIT, offset: 0 },
      },
      enabled: !!personaId,
    },
  );

  const renderedMaps = useMemo<Array<PersonaJourneyMap>>(() => {
    if (!mapsData?.pages) {
      return [];
    }
    return mapsData.pages.reduce<Array<PersonaJourneyMap>>((acc, curr) => {
      if (curr?.getMaps.maps) {
        return [...acc, ...curr.getMaps.maps];
      }
      return acc;
    }, []);
  }, [mapsData?.pages]);

  const onHandleFetch = (e: React.UIEvent<HTMLElement>, childOffsetHeight: number) => {
    const target = e.currentTarget as HTMLDivElement | null;
    if (
      target &&
      childOffsetHeight &&
      target.offsetHeight + target.scrollTop + 100 >= childOffsetHeight &&
      !mapsDataIsFetchingNextPage &&
      mapsDataHasNextPage
    ) {
      mapsDataFetchNextPage().then();
    }
  };

  const handleOpenPersona = (mapId: number, boardId: number) => {
    navigate({
      to: `/board/${boardId}/journey-map/${mapId}`,
    }).then();
  };

  return (
    <BaseWuModal
      headerTitle={'Assigned journeys'}
      isOpen={isOpen}
      handleClose={handleClose}
      canCloseWithOutsideClick={!mapsDataIsLoading}
      modalSize={'md'}
      isProcessing={mapsDataIsLoading}>
      <>
        <div
          className={
            'h-[22.5rem] p-4 mb-4 overflow-x-auto border-b border-solid border-[var(--medium-light-gray)]'
          }
          onScroll={e => onHandleFetch(e, childRef.current?.offsetHeight || 0)}>
          {mapsDataIsLoading && !renderedMaps?.length ? (
            <BaseWuLoader />
          ) : (
            <>
              {renderedMaps?.length ? (
                <ul data-testid={'maps-ul-list'} ref={childRef}>
                  {renderedMaps?.map(itm => (
                    <ErrorBoundary key={itm?.id}>
                      <li
                        data-testid="journey-item-test-id"
                        className={`card-borders mb-4! px-3 py-2 flex justify-between items-end`}
                        onClick={() => handleOpenPersona(itm?.id, itm.boardId)}>
                        <div className="w-1/2">
                          <div className={'persona-text-info'}>
                            <WuTooltip content={itm?.title} position="bottom" showArrow>
                              <div className={'reduce-text text-[var(--primary)] mb-4!'}>
                                {itm?.title}
                              </div>
                            </WuTooltip>
                            <div className={'text-[0.75rem]'}>
                              <div>Created at {dayjs(itm?.createdAt).format('MMM D, YYYY')}</div>
                              <div>Last Updated {dayjs(itm?.updatedAt).format('MMM D, YYYY')}</div>
                            </div>
                          </div>
                        </div>
                        <PersonaImages
                          mapId={itm.id}
                          disableDisconnect={true}
                          viewMode={SelectedPersonasViewModeEnum.MAP}
                          personas={itm.selectedPersonas as PersonaType[]}
                        />
                      </li>
                    </ErrorBoundary>
                  ))}
                </ul>
              ) : (
                <EmptyDataInfo message={'There are no journeys yet'} />
              )}
            </>
          )}
        </div>
      </>
    </BaseWuModal>
  );
};

export default PersonaContainsJourneysModal;
