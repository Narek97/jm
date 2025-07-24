import { FC, UIEvent, useMemo, useRef, useState } from 'react';

import './style.scss';
import { WuCheckbox, WuDateRangePicker, WuPopover } from '@npm-questionpro/wick-ui-lib';

import {
  GetPersonasQuery,
  useInfiniteGetPersonasQuery,
} from '@/api/infinite-queries/generated/getPersonas.generated.ts';
import {
  GetPersonaGroupsModelQuery,
  useGetPersonaGroupsModelQuery,
} from '@/api/queries/generated/getPersonaGroups.generated.ts';
import EmptyDataInfo from '@/Components/Shared/EmptyDataInfo';
import WuBaseLoader from '@/Components/Shared/WuBaseLoader';
import { querySlateTime } from '@/Constants';
import { PERSONAS_LIMIT } from '@/Constants/pagination';
import { PersonaType } from '@/Screens/PersonaGroupScreen/types.ts';

interface IJourneysFilter {
  workspaceId: number;
  startDate: Date | null;
  endDate: Date | null;
  personaIds: number[];
  changePersonaIds: (ids: number[]) => void;
  changeEndDate: (date: Date | null) => void;
  changeStartDate: (date: Date | null) => void;
}

const JourneysFilter: FC<IJourneysFilter> = ({
  workspaceId,
  startDate,
  endDate,
  changeStartDate,
  changeEndDate,
  personaIds,
  changePersonaIds,
}) => {
  const [personaGroupId, setPersonaGroupId] = useState<number | null>(null);

  const childRef = useRef<HTMLUListElement>(null);

  const { data: dataPersonaGroup, isLoading: isLoadingPersonaGroup } =
    useGetPersonaGroupsModelQuery<GetPersonaGroupsModelQuery, Error>(
      {
        getPersonaGroupsInput: {
          workspaceId,
        },
      },
      {
        enabled: !!workspaceId,
        staleTime: querySlateTime,
      },
    );

  const { data, isFetching, fetchNextPage, hasNextPage } = useInfiniteGetPersonasQuery<
    { pages: GetPersonasQuery[] },
    Error
  >(
    {
      getPersonasInput: {
        workspaceId,
        personaGroupId: personaGroupId!,
        limit: PERSONAS_LIMIT,
        offset: 0,
      },
    },
    {
      enabled: !!personaGroupId,
      staleTime: querySlateTime,
      getNextPageParam: (lastPage, allPages) => {
        if (!lastPage.getPersonas.personas || !lastPage.getPersonas.personas.length) {
          return undefined;
        }
        return {
          getPersonasInput: {
            workspaceId,
            personaGroupId: personaGroupId!,
            limit: PERSONAS_LIMIT,
            offset: allPages.length * PERSONAS_LIMIT,
          },
        };
      },
      initialPageParam: 0,
    },
  );

  const personaData: Array<PersonaType> = useMemo(() => {
    if (data?.pages && data?.pages[0] !== undefined) {
      return data.pages.reduce<Array<PersonaType>>(
        (acc, curr) => [...acc, ...curr.getPersonas.personas],
        [],
      );
    }
    return [];
  }, [data?.pages]);

  const onHandleFetch = async (e: UIEvent<HTMLElement>) => {
    const target = e.currentTarget as HTMLDivElement | null;
    const childOffsetHeight = childRef.current?.offsetHeight || 0;

    if (
      e.target &&
      childOffsetHeight &&
      target &&
      target.offsetHeight + target.scrollTop + 100 >= childOffsetHeight &&
      !isFetching &&
      hasNextPage
    ) {
      fetchNextPage().then();
    }
  };

  const handleChangeFilter = (personaId: number) => {
    let selectedPathsList = [...personaIds];
    if (selectedPathsList.some(itm => itm === personaId)) {
      selectedPathsList = selectedPathsList.filter(pathItem => pathItem !== personaId);
    } else {
      selectedPathsList = [...selectedPathsList, personaId];
    }
    changePersonaIds(selectedPathsList);
  };

  return (
    <WuPopover
      className="w-114 !mt-22"
      side="right"
      Trigger={
        <div className="journeys-filter--button">
          <span className={'wm-filter-alt'} />
        </div>
      }>
      <div className="journeys-filter--container">
        <>
          {personaGroupId ? (
            <>
              <p className={'journeys-filter--container--persona-title'}>Persona</p>
              <div className={'journeys-filter--container--go-back-btn-block'}>
                <button
                  className={'journeys-filter--container--go-back-btn'}
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
              <div className="journeys-filter--container--personas-block" onScroll={onHandleFetch}>
                <>
                  {!personaData.length && !isFetching ? (
                    <EmptyDataInfo message={'There are no persona group yet'} />
                  ) : (
                    <>
                      <ul ref={childRef} data-testid="persona-list">
                        {personaData?.map(persona => (
                          <WuCheckbox
                            label={persona?.name?.trim() || 'Untitled'}
                            key={persona?.id}
                            checked={personaIds?.some(item => item === +persona?.id) || false}
                            onChange={() => handleChangeFilter(+persona?.id)}
                            data-testid={'persona-list-item'}
                            className="wu-checkbox-container wu-checkbox-label wu-checkbox"
                          />
                        ))}
                      </ul>
                      {isFetching && (
                        <div className={'relative w-full h-[40px]'}>
                          <WuBaseLoader />
                        </div>
                      )}
                    </>
                  )}
                </>
              </div>
            </>
          ) : (
            <>
              <p className={`journeys-filter--container--persona-group-title`}>Persona Group</p>

              {isLoadingPersonaGroup ? (
                <WuBaseLoader />
              ) : (
                <ul className="journeys-filter--container--persona-group">
                  {dataPersonaGroup?.getPersonaGroups.personaGroups.map(personaGroup => (
                    <li
                      key={personaGroup.id}
                      className={`journeys-filter--container--personas-item`}
                      onClick={() => setPersonaGroupId(personaGroup.id)}>
                      {personaGroup.name?.trim() || 'Undefined'}
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </>

        <WuDateRangePicker
          onChange={function Ki(data) {
            const { from, to } = data;
            changeStartDate(from);
            changeEndDate(to);
          }}
          value={{
            from: startDate ? new Date(startDate) : new Date(),
            to: endDate ? new Date(endDate) : new Date(),
          }}
        />
      </div>
    </WuPopover>
  );
};

export default JourneysFilter;
