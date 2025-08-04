import { useCallback, useEffect, useMemo, useState } from 'react';

import { useWuShowToast } from '@npm-questionpro/wick-ui-lib';
import { useParams } from '@tanstack/react-router';

import GroupCard from './components/GroupCard';
import PersonaGroupDeleteModal from './components/PersonaGroupDeleteModal';
import { PersonaGroupType } from './types';

import {
  CreatePersonaGroupMutation,
  useCreatePersonaGroupMutation,
} from '@/api/mutations/generated/createPersonaGroup.generated';
import {
  GetPersonaGroupsWithPersonasQuery,
  useGetPersonaGroupsWithPersonasQuery,
} from '@/api/queries/generated/getPersonaGroupsWithPersonas.generated.ts';
import BaseWuLoader from '@/Components/Shared/BaseWuLoader';
import CustomError from '@/Components/Shared/CustomError';
import EditableItemForm from '@/Components/Shared/EditableItemForm';
import EmptyDataInfo from '@/Components/Shared/EmptyDataInfo';
import Pagination from '@/Components/Shared/Pagination';
import { querySlateTime } from '@/Constants';
import { PERSONA_GROUP_LIMIT } from '@/Constants/pagination.ts';
import ErrorBoundary from '@/Features/ErrorBoundary';
import {
  useRemoveQueriesByKey,
  useSetAllQueryDataByKey,
  useSetQueryDataByKeyAdvanced,
} from '@/Hooks/useQueryKey';
import { useBreadcrumbStore } from '@/Store/breadcrumb.ts';
import { EditableInputType } from '@/types';

const PersonaGroups = () => {
  const { workspaceId } = useParams({
    from: '/_authenticated/_secondary-sidebar-layout/workspace/$workspaceId/persona-groups/',
  });

  const { showToast } = useWuShowToast();

  const { setBreadcrumbs } = useBreadcrumbStore();
  const setPersonaGroup = useSetQueryDataByKeyAdvanced();
  const setAllPersonaGroup = useSetAllQueryDataByKey('GetPersonaGroupsWithPersonas');
  const setRemovePersonaGroupQuery = useRemoveQueriesByKey();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [offset, setOffset] = useState<number>(0);

  const [selectedPersonaGroup, setSelectedPersonaGroup] = useState<PersonaGroupType | null>(null);

  const { isPending: isLoadingCreatePersonaGroup, mutateAsync: mutateAsyncCreatePersonaGroup } =
    useCreatePersonaGroupMutation<Error, CreatePersonaGroupMutation>();

  const {
    data: dataPersonaGroups,
    error: errorPersonaGroups,
    isPending: isPendingPersonaGroups,
  } = useGetPersonaGroupsWithPersonasQuery<GetPersonaGroupsWithPersonasQuery, Error>(
    {
      getPersonaGroupsWithPersonasInput: {
        workspaceId: +workspaceId,
        offset,
        limit: PERSONA_GROUP_LIMIT,
      },
    },
    {
      staleTime: querySlateTime,
    },
  );

  const personaGroupsCount = useMemo(
    () => dataPersonaGroups?.getPersonaGroupsWithPersonas.count || 0,
    [dataPersonaGroups?.getPersonaGroupsWithPersonas.count],
  );

  const personaGroups = useMemo(
    () => dataPersonaGroups?.getPersonaGroupsWithPersonas.personaGroups || [],
    [dataPersonaGroups?.getPersonaGroupsWithPersonas.personaGroups],
  );

  const onHandleChangePage = useCallback((newPage: number) => {
    setCurrentPage(newPage);
    setOffset((newPage - 1) * PERSONA_GROUP_LIMIT);
  }, []);

  const onHandleCreatePersonaGroup = async (value: string): Promise<boolean> => {
    try {
      await mutateAsyncCreatePersonaGroup(
        {
          createPersonaGroupInput: {
            name: value,
            workspaceId: +workspaceId!,
          },
        },
        {
          onSuccess: response => {
            setRemovePersonaGroupQuery('GetPersonaGroupsWithPersonas', {
              input: 'getPersonaGroupsWithPersonasInput',
              key: 'offset',
              value: 0,
            });
            setPersonaGroup(
              'GetPersonaGroupsWithPersonas',
              {
                input: 'getPersonaGroupsWithPersonasInput',
                key: 'offset',
                value: 0,
              },
              (oldData: any) => {
                if (oldData) {
                  return {
                    getPersonaGroupsWithPersonas: {
                      ...oldData,
                      count: oldData.getPersonaGroupsWithPersonas.count + 1,
                      personaGroups: [
                        {
                          ...response.createPersonaGroup,
                          persona: [],
                        },
                        ...oldData.getPersonaGroupsWithPersonas.personaGroups.slice(
                          0,
                          PERSONA_GROUP_LIMIT - 1,
                        ),
                      ],
                    },
                  };
                }
              },
            );
            setCurrentPage(1);
            setOffset(0);
          },
          onError: error => {
            showToast({
              variant: 'error',
              message: error?.message,
            });
          },
        },
      );
      return true;
    } catch (error) {
      console.error(error);
      showToast({
        variant: 'error',
        message: 'Error creating persona group',
      });
      return false;
    }
  };

  const onHandleUpdatePersonaGroups = useCallback(
    (id: number) => {
      setAllPersonaGroup((oldData: any) => {
        if (oldData) {
          return {
            getPersonaGroupsWithPersonas: {
              ...oldData.getPersonaGroupsWithPersonas,
              count: oldData.getPersonaGroupsWithPersonas.count - 1,
              personaGroups: oldData.getPersonaGroupsWithPersonas.personaGroups.filter(
                (personaGroup: PersonaGroupType) => personaGroup.id !== id,
              ),
            },
          };
        }
      });
    },
    [setAllPersonaGroup],
  );

  const onHandleFilterPersonaGroup = useCallback(
    (id: number) => {
      if (
        currentPage * PERSONA_GROUP_LIMIT >= personaGroupsCount &&
        dataPersonaGroups?.getPersonaGroupsWithPersonas.personaGroups.length === 1 &&
        currentPage !== 1
      ) {
        setOffset(prev => prev - PERSONA_GROUP_LIMIT);
      }
      if (
        currentPage * PERSONA_GROUP_LIMIT < personaGroupsCount &&
        personaGroupsCount > PERSONA_GROUP_LIMIT
      ) {
        setRemovePersonaGroupQuery('GetPersonaGroupsWithPersonas', {
          input: 'getPersonaGroupsWithPersonasInput',
          key: 'offset',
          value: offset,
          deleteUpcoming: true,
        });
      }
      onHandleUpdatePersonaGroups(id);
    },
    [
      currentPage,
      dataPersonaGroups?.getPersonaGroupsWithPersonas.personaGroups.length,
      offset,
      onHandleUpdatePersonaGroups,
      personaGroupsCount,
      setRemovePersonaGroupQuery,
    ],
  );

  const onUpdatePersonaGroup = useCallback(
    (personaGroup?: EditableInputType) => {
      setPersonaGroup(
        'GetInterviewsByWorkspaceId',
        {
          input: 'GetPersonaGroupsWithPersonas',
          key: 'offset',
          value: offset,
        },
        (oldData: any) => {
          if (oldData) {
            return {
              getPersonaGroupsWithPersonas: {
                ...oldData,
                personaGroups: oldData.getPersonaGroupsWithPersonas.personaGroups.map(
                  (group: PersonaGroupType) => {
                    if (group.id === personaGroup?.id) {
                      return {
                        ...group,
                        name: personaGroup.value,
                      };
                    }
                    return group;
                  },
                ),
              },
            };
          }
        },
      );
    },
    [offset, setPersonaGroup],
  );

  useEffect(() => {
    setBreadcrumbs([
      {
        name: 'Workspaces',
        pathname: '/workspaces',
      },
    ]);
  }, [setBreadcrumbs]);

  const onTogglePersonaGroupDeleteModal = useCallback((personaGroup?: PersonaGroupType) => {
    setSelectedPersonaGroup(personaGroup || null);
  }, []);

  if (errorPersonaGroups) {
    return <CustomError error={errorPersonaGroups?.message} />;
  }

  return (
    <div className={'h-full !pt-8 !px-16 !pb-[0]'}>
      {selectedPersonaGroup && (
        <PersonaGroupDeleteModal
          isOpen={!!selectedPersonaGroup}
          groupId={selectedPersonaGroup.id}
          handleDelete={onHandleFilterPersonaGroup}
          handleClose={onTogglePersonaGroupDeleteModal}
        />
      )}
      <h3 className={'base-title !text-heading-2'}>Persona Group</h3>

      <div className="flex gap-4 py-4 md:pb-8 border-b border-[var(--light-gray)]">
        <EditableItemForm
          createButtonText={'New persona group'}
          inputPlaceholder={'Persona group name'}
          value={''}
          isLoading={isLoadingCreatePersonaGroup}
          onHandleCreate={onHandleCreatePersonaGroup}
        />
        {personaGroupsCount > PERSONA_GROUP_LIMIT && (
          <Pagination
            perPage={PERSONA_GROUP_LIMIT}
            currentPage={currentPage}
            allCount={personaGroupsCount}
            changePage={onHandleChangePage}
          />
        )}
      </div>

      {isPendingPersonaGroups ? (
        <BaseWuLoader />
      ) : (
        <>
          {personaGroups.length ? (
            <div
              className={
                'h-[calc(100dvh-16rem)] flex flex-col gap-4 mt-[1.125rem]! pr-5! overflow-auto'
              }>
              {personaGroups.map(group => (
                <ErrorBoundary key={group.id}>
                  <GroupCard
                    group={group}
                    workspaceId={workspaceId}
                    onUpdatePersonaGroup={onUpdatePersonaGroup}
                    onTogglePersonaGroupDeleteModal={onTogglePersonaGroupDeleteModal}
                  />
                </ErrorBoundary>
              ))}
            </div>
          ) : (
            <EmptyDataInfo message={'There are no persona groups yet'} />
          )}
        </>
      )}
    </div>
  );
};

export default PersonaGroups;
