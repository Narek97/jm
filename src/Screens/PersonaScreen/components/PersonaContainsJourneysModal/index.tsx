import React, { FC, useMemo, useRef } from 'react';

import './style.scss';
import { Tooltip } from '@mui/material';
import { useNavigate } from '@tanstack/react-router';
import dayjs from 'dayjs';
import fromNow from 'dayjs/plugin/relativeTime';

import {
  GetMapsQuery,
  useInfiniteGetMapsQuery,
} from '@/api/infinite-queries/generated/getJourneyMaps.generated.ts';
import BaseWuModal from '@/Components/Shared/BaseWuModal';
import CustomLoader from '@/Components/Shared/CustomLoader';
import EmptyDataInfo from '@/Components/Shared/EmptyDataInfo';
import { JOURNIES_LIMIT } from '@/constants/pagination.ts';
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
      <div className={'journeys-contains-current-maps'}>
        <div className={'journeys-contains-current-maps--content'}>
          {mapsDataIsLoading && !renderedMaps?.length ? (
            <div className={'journeys-contains-current-maps-loading-section'}>
              <CustomLoader />
            </div>
          ) : (
            <>
              {renderedMaps?.length ? (
                <div
                  className={'journeys-contains-current-maps--content-journeys'}
                  onScroll={e => onHandleFetch(e, childRef.current?.offsetHeight || 0)}>
                  <ul data-testid={'maps-ul-list'} ref={childRef}>
                    {renderedMaps?.map(itm => (
                      <ErrorBoundary key={itm?.id}>
                        <li
                          data-testid="journey-item-test-id"
                          className={`journeys-contains-current-maps--content-journeys-item`}
                          onClick={() => handleOpenPersona(itm?.id, itm.boardId)}>
                          <div className="journeys-contains-current-maps--content-journeys-item--left">
                            <div className={'persona-text-info'}>
                              <Tooltip title={itm?.title} arrow placement={'bottom'}>
                                <div className={'persona-text-info--title'}>{itm?.title}</div>
                              </Tooltip>
                              <div className={'persona-text-info--dates'}>
                                <div>Created at {dayjs(itm?.createdAt).format('MMM D, YYYY')}</div>
                                <div>
                                  Last Updated {dayjs(itm?.updatedAt).format('MMM D, YYYY')}
                                </div>
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
                </div>
              ) : (
                <EmptyDataInfo message={'There are no journeys yet'} />
              )}
            </>
          )}
        </div>
      </div>
    </BaseWuModal>
  );
};

export default PersonaContainsJourneysModal;
