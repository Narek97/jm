import { FC, UIEvent, useMemo, useRef, useState } from 'react';

import './style.css';
import { WuCheckbox, WuDateRangePicker, WuPopover } from '@npm-questionpro/wick-ui-lib';

import {
  GetPersonasQuery,
  useInfiniteGetPersonasQuery,
} from '@/api/infinite-queries/generated/getPersonas.generated.ts';
import {
  GetPersonaGroupsModelQuery,
  useGetPersonaGroupsModelQuery,
} from '@/api/queries/generated/getPersonaGroups.generated.ts';
import BaseWuLoader from '@/Components/Shared/BaseWuLoader';
import EmptyDataInfo from '@/Components/Shared/EmptyDataInfo';
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
        <div className="min-w-[2rem] h-[2rem] rounded-[0.125rem] flex items-center justify-center hover:bg-[#eeeeee]">
          <span className={'wm-filter-alt'} />
        </div>
      }>
      <div className="relative p-4 w-[28.25rem] h-[16rem] text-sm">
        <>
          {personaGroupId ? (
            <>
              <p className={'!mb-2'}>Persona</p>
              <div className={'w-[90%] bg-white'}>
                <button
                  className={'flex items-center justify-center text-[var(--primary)]'}
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
              <div className="!h-32 !overflow-y-auto !flex gap-1.5 !flex-wrap mb-4" onScroll={onHandleFetch}>
                <>
                  {!personaData.length && !isFetching ? (
                      <EmptyDataInfo message={'There are no persona group yet'} minHeight={'4rem'} />
                  ) : (
                    <>
                      <ul ref={childRef} data-testid="persona-list" className={'grid grid-cols-2 w-full gap-y-2'}>
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
                          <BaseWuLoader />
                        </div>
                      )}
                    </>
                  )}
                </>
              </div>
            </>
          ) : (
            <>
              <p>Persona Group</p>
              {isLoadingPersonaGroup ? (
                <BaseWuLoader />
              ) : (
                <ul className="h-[9.4rem] p-4 mb-4 overflow-auto">
                  {dataPersonaGroup?.getPersonaGroups.personaGroups.map(personaGroup => (
                    <li
                      key={personaGroup.id}
                      className={`selectable-item`}
                      onClick={() => setPersonaGroupId(personaGroup.id)}>
                      {personaGroup.name?.trim() || 'Untitled'}
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
