import React, { FC, useMemo, useRef } from 'react';

import './style.scss';
import { Box, Tooltip } from '@mui/material';
import { useNavigate } from '@tanstack/react-router';
import dayjs from 'dayjs';
import fromNow from 'dayjs/plugin/relativeTime';

import {
  GetMapsQuery,
  useInfiniteGetMapsQuery,
} from '@/api/infinite-queries/generated/getJourneyMaps.generated.ts';
import CustomLoader from '@/Components/Shared/CustomLoader';
import CustomModal from '@/Components/Shared/CustomModal';
import CustomModalHeader from '@/Components/Shared/CustomModalHeader';
import EmptyDataInfo from '@/Components/Shared/EmptyDataInfo';
import { JOURNIES_LIMIT } from '@/constants/pagination.ts';
import ErrorBoundary from '@/Features/ErrorBoundary';
import PersonaImages from '@/Features/PersonaImages';
import { PersonaType } from '@/Screens/PersonaGroupScreen/types.ts';
import { JourneyMaps } from '@/Screens/PersonaScreen/types.ts';
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
    data: organizationPersonasData,
    isLoading: organizationPersonasIsLoading,
    isFetching: organizationPersonasIsFetchingNextPage,
    fetchNextPage: organizationPersonasFetchNextPage,
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
        const totalItemsFetched = allPages.reduce(
          (acc, page) => acc + (page.getMaps.maps?.length || 0),
          0
        );
        return lastPage.getMaps.maps.length < JOURNIES_LIMIT
          ? undefined
          : { getMapsInput: { personaIds: [personaId], limit: JOURNIES_LIMIT, offset: totalItemsFetched } };
      },
      initialPageParam: { getMapsInput: { personaIds: [personaId], limit: JOURNIES_LIMIT, offset: 0 } },
      enabled: !!personaId,
    },
  );

  const renderedMaps = useMemo<JourneyMaps>(() => {
    if (!organizationPersonasData?.pages) {
      return [];
    }
    return organizationPersonasData.pages.reduce((acc: JourneyMaps, curr) => {
      if (curr?.getMaps.maps) {
        return [...acc, ...(curr.getMaps.maps as JourneyMaps)];
      }
      return acc;
    }, []);
  }, [organizationPersonasData?.pages]);

  const onHandleFetch = (e: React.UIEvent<HTMLElement>, childOffsetHeight: number) => {
    const target = e.currentTarget as HTMLDivElement | null;
    if (
      target &&
      childOffsetHeight &&
      target.offsetHeight + target.scrollTop + 100 >= childOffsetHeight &&
      !organizationPersonasIsFetchingNextPage &&
      !organizationPersonasIsLoading
    ) {
      organizationPersonasFetchNextPage().then();
    }
  };

  const handleOpenPersona = (mapId: number, boardId: number) => {
    navigate({
      to: `/board/${boardId}/journey-map/${mapId}`,
    }).then();
  };

  const disconnectPersonaFromMap = (personaId: number, mapId: number) => {
    renderedMaps.forEach(map => {
      if (map?.id === mapId) {
        map.selectedPersonas = map.selectedPersonas?.filter(persona => persona?.id !== personaId);
      }
    });
  };

  return (
    <CustomModal
      isOpen={isOpen}
      modalSize={'md'}
      handleClose={handleClose}
      canCloseWithOutsideClick={!organizationPersonasIsLoading}>
      <CustomModalHeader title={<div className={'assign-modal-header'}>Assigned journeys</div>} />
      <div className={'journeys-contains-current-maps'}>
        <div className={'journeys-contains-current-maps--content'}>
          {organizationPersonasIsLoading && !renderedMaps?.length ? (
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
                            disconnectPersona={personaId =>
                              disconnectPersonaFromMap(personaId, itm?.id)
                            }
                          />
                        </li>
                      </ErrorBoundary>
                    ))}
                  </ul>
                </div>
              ) : (
                <EmptyDataInfo icon={<Box />} message={'There are no journeys yet'} />
              )}
            </>
          )}
        </div>
      </div>
    </CustomModal>
  );
};

export default PersonaContainsJourneysModal;
