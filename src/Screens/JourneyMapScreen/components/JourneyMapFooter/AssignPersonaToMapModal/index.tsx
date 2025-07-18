import { FC, UIEvent, useEffect, useMemo, useRef, useState } from 'react';

import './style.scss';
import { WuModalHeader, WuTooltip } from '@npm-questionpro/wick-ui-lib';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

import {
  GetPersonasQuery,
  useInfiniteGetPersonasQuery,
} from '@/api/infinite-queries/generated/getPersonas.generated.ts';
import {
  ConnectPersonasToMapMutation,
  useConnectPersonasToMapMutation,
} from '@/api/mutations/generated/assignPersonaToJourneyMap.generated.ts';
import {
  CreatePersonaMutation,
  useCreatePersonaMutation,
} from '@/api/mutations/generated/createPersona.generated.ts';
import {
  GetPersonaGroupsModelQuery,
  useGetPersonaGroupsModelQuery,
} from '@/api/queries/generated/getPersonaGroups.generated';
import PersonaImageBox from '@/Components/Feature/PersonaImageBox';
import CustomError from '@/Components/Shared/CustomError';
import CustomModalFooterButtons from '@/Components/Shared/CustomModalFooterButtons';
import CustomModalHeader from '@/Components/Shared/CustomModalHeader';
import EmptyDataInfo from '@/Components/Shared/EmptyDataInfo';
import WuBaseLoader from '@/Components/Shared/WuBaseLoader';
import { querySlateTime } from '@/constants';
import { PERSONAS_LIMIT } from '@/constants/pagination';
import { PersonaType } from '@/Screens/JourneyMapScreen/components/JourneyMapFooter/types.ts';
import { ImageSizeEnum } from '@/types/enum';

interface IAssignPersonaToMapModal {
  isOpen: boolean;
  workspaceId: number;
  mapId: number;
  handleClose: () => void;
}

const AssignPersonaToMapModal: FC<IAssignPersonaToMapModal> = ({
  workspaceId,
  mapId,
  handleClose,
}) => {
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const [personaGroupId, setPersonaGroupId] = useState<number | null>(null);
  const [personaIdList, setPersonaIdList] = useState<number[]>([]);
  const [personaIdUnselectedList, setPersonaIdUnselectedList] = useState<number[]>([]);

  const childRef = useRef<HTMLUListElement>(null);

  const { mutate: mutateCreatePersona, isPending: isLoadingCreatePersona } =
    useCreatePersonaMutation<Error, CreatePersonaMutation>();

  const { data: dataPersonaGroup, isLoading: isLoadingPersonaGroup } =
    useGetPersonaGroupsModelQuery<GetPersonaGroupsModelQuery, Error>({
      getPersonaGroupsInput: {
        workspaceId,
      },
    });

  const { data, isFetching, hasNextPage, fetchNextPage } = useInfiniteGetPersonasQuery<
    { pages: GetPersonasQuery[] },
    Error
  >(
    {
      getPersonasInput: {
        workspaceId,
        personaGroupId: personaGroupId!,
        mapId: +mapId,
        limit: PERSONAS_LIMIT,
        offset: 0,
      },
    },
    {
      enabled: !!personaGroupId,
      staleTime: querySlateTime,
      getNextPageParam: function (
        lastPage: GetPersonasQuery,
        allPages: GetPersonasQuery[],
      ): unknown {
        if (!lastPage.getPersonas.personas || !lastPage.getPersonas.personas.length) {
          return undefined;
        }
        return {
          workspaceId,
          personaGroupId: personaGroupId!,
          mapId: +mapId,
          limit: PERSONAS_LIMIT,
          offset: allPages.length * PERSONAS_LIMIT,
        };
      },
      initialPageParam: 0,
    },
  );

  const renderPersonaData: Array<PersonaType> = useMemo(() => {
    if (data?.pages && data?.pages[0] !== undefined) {
      return data.pages.reduce<Array<PersonaType>>(
        (acc, curr) => [...acc, ...curr.getPersonas.personas],
        [],
      );
    }
    return [];
  }, [data?.pages]);

  const {
    mutate: connectOrDisconnectPersonas,
    isPending: connectPersonasIsLoading,
    error: connectPersonasError,
  } = useConnectPersonasToMapMutation<Error, ConnectPersonasToMapMutation>();

  const onHandleFetch = (e: UIEvent<HTMLElement>) => {
    const target = e.currentTarget as HTMLDivElement | null;
    const childOffsetHeight = childRef.current?.offsetHeight || 0;
    if (
      target &&
      target.offsetHeight + target.scrollTop + 100 >= childOffsetHeight &&
      !isFetching &&
      hasNextPage
    ) {
      fetchNextPage().then();
    }
  };

  const handleSelectPersona = (id: number) => {
    if (personaIdList.includes(id)) {
      setPersonaIdList(prev => prev.filter(item => item !== id));
      setPersonaIdUnselectedList(prev => [...prev, id]);
    } else {
      setPersonaIdList(prev => [...prev, id]);
      setPersonaIdUnselectedList(prev => prev.filter(item => item !== id));
    }
  };

  const onHandleConnectPersonasToMap = () => {
    connectOrDisconnectPersonas(
      {
        connectPersonasToMapInput: {
          mapId: +mapId,
          connectPersonaIds: personaIdList,
          disconnectPersonaIds: personaIdUnselectedList,
        },
      },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({ queryKey: ['GetMapSelectedPersonas'] });
          handleClose();
        },
      },
    );
  };

  const handleCreateAndNavigateToPersona = () => {
    if (personaGroupId) {
      mutateCreatePersona(
        {
          createPersonaInput: {
            personaGroupId,
            workspaceId: workspaceId!,
          },
        },
        {
          onSuccess: response => {
            navigate({
              to: `/workspace/${workspaceId}/persona/${response.createPersona.id}`,
            }).then();
          },
        },
      );
    }
  };

  useEffect(() => {
    if (renderPersonaData.length) {
      setPersonaIdList(prev => {
        const selectedPersonaIds = renderPersonaData
          .filter(persona => persona.isSelected)
          .map(persona => persona.id);

        return Array.from(new Set([...prev, ...selectedPersonaIds]));
      });
    }
  }, [renderPersonaData]);

  if (connectPersonasError) {
    return <CustomError error={connectPersonasError.message} />;
  }

  return (
    <>
      <WuModalHeader>
        <CustomModalHeader
          title={
            <div className={'assign-modal-header'}>
              Add personas <span className={'question-sign'}>?</span>
            </div>
          }
        />
      </WuModalHeader>
      <div className={'assign-persona-to-map'}>
        <div className={'assign-persona-to-map--content'}>
          {isLoadingPersonaGroup || isFetching ? (
            <div className={'assign-persona-to-map-loading-section'}>
              <WuBaseLoader />
            </div>
          ) : (
            <>
              {personaGroupId ? (
                <>
                  <div className={'assign-persona-to-map--content--go-back-btn-block'}>
                    <button
                      className={'assign-persona-to-map--content--go-back-btn'}
                      onClick={() => setPersonaGroupId(null)}>
                      <span
                        className={'wm-arrow-back-ios'}
                        style={{
                          color: '#1b87e6',
                        }}
                      />
                      Go back
                    </button>
                  </div>

                  {renderPersonaData?.length ? (
                    <div
                      data-testid={'assign-persona-to-map--content--persona-block'}
                      className={'assign-persona-to-map--content--persona-block'}
                      onScroll={e => {
                        onHandleFetch(e);
                      }}>
                      <ul ref={childRef}>
                        {renderPersonaData?.map(persona => (
                          <li
                            key={persona?.id}
                            data-testid="persona-item-test-id"
                            className={`assign-persona-to-map--content--personas-item ${
                              personaIdList.includes(persona?.id)
                                ? 'assign-persona-to-map--content--selected-persona'
                                : ''
                            }`}
                            onClick={() => handleSelectPersona(persona?.id)}>
                            <div className="assign-persona-to-map--content--personas-item-left-block">
                              <PersonaImageBox
                                title={''}
                                size={ImageSizeEnum.MD}
                                imageItem={{
                                  color: persona?.color || '',
                                  attachment: {
                                    id: persona?.attachment?.id || 0,
                                    url: persona?.attachment?.url || '',
                                    key: persona?.attachment?.key || '',
                                    croppedArea: persona?.croppedArea,
                                  },
                                }}
                              />
                              <div className={'assign-persona-to-map--content--personas-item-info'}>
                                <WuTooltip
                                  className={'wu-tooltip-content'}
                                  positionOffset={10}
                                  content={persona?.name}
                                  position={'bottom'}>
                                  <div
                                    className={
                                      'assign-persona-to-map--content--personas-item-info--title'
                                    }>
                                    {persona?.name}
                                  </div>
                                </WuTooltip>
                                <div className="assign-persona-to-map--content--personas-item-info--bottom">
                                  <div
                                    className={
                                      'assign-persona-to-map--content--personas-item-info--bottom--type'
                                    }>
                                    {persona?.type}
                                  </div>
                                  <div className="assign-persona-to-map--content--personas-item-right-block">
                                    <span className={'wm-map'} />
                                    <span className={'journeys-info--text'}>
                                      {persona?.journeys || 0} journeys
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <EmptyDataInfo message={'There are no assigned personas yet'} />
                  )}
                </>
              ) : (
                <>
                  <div>
                    <p className={`assign-persona-to-map--content--personas-title`}>
                      Persona Group
                    </p>
                    <ul>
                      {dataPersonaGroup?.getPersonaGroups.personaGroups.map(personaGroup => (
                        <li
                          key={personaGroup.id}
                          className={`assign-persona-to-map--content--personas-item`}
                          onClick={() => setPersonaGroupId(personaGroup.id)}>
                          <div
                            className={'assign-persona-to-map--content--personas-item-info--title'}>
                            <WuTooltip
                              className={'wu-tooltip-content'}
                              positionOffset={10}
                              content={personaGroup.name?.trim() || 'Untitled'}
                              position={'bottom'}>
                              {personaGroup.name?.trim() || 'Untitled'}
                            </WuTooltip>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </>
          )}
        </div>
        <CustomModalFooterButtons
          handleFirstButtonClick={handleCreateAndNavigateToPersona}
          handleSecondButtonClick={onHandleConnectPersonasToMap}
          isLoading={connectPersonasIsLoading}
          isDisableFirstButton={isLoadingCreatePersona || !personaGroupId}
          firstButtonName={'Create new persona'}
          secondButtonName={'Add persona'}
        />
      </div>
    </>
  );
};

export default AssignPersonaToMapModal;
