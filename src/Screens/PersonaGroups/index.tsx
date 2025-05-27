import './style.scss';
import { useCallback, useMemo, useState } from 'react';

import { Box } from '@mui/material';
import { useWuShowToast } from '@npm-questionpro/wick-ui-lib';
import { useParams } from '@tanstack/react-router';

import GroupCard from './components/GroupCard';

import {
  CreatePersonaGroupMutation,
  useCreatePersonaGroupMutation,
} from '@/api/mutations/generated/createPersonaGroup.generated';
import {
  GetPersonaGroupsWithPersonasQuery,
  useGetPersonaGroupsWithPersonasQuery,
} from '@/api/queries/generated/getPersonaGroupsWithPersonas.generated.ts';
import { PersonaGroup } from '@/api/types.ts';
import CustomError from '@/Components/Shared/CustomError';
import CustomLoader from '@/Components/Shared/CustomLoader';
import EditableItemForm from '@/Components/Shared/EditableItemForm';
import EmptyDataInfo from '@/Components/Shared/EmptyDataInfo';
import Pagination from '@/Components/Shared/Pagination';
import { querySlateTime } from '@/constants';
import { PERSONA_GROUP_LIMIT } from '@/constants/pagination.ts';
import ErrorBoundary from '@/Features/ErrorBoundary';
import { useSetQueryDataByKey } from '@/hooks/useQueryKey';

const PersonaGroups = () => {
  const { showToast } = useWuShowToast();

  const { workspaceId } = useParams({
    from: '/_authenticated/_secondary-sidebar-layout/workspace/$workspaceId/persona-groups/',
  });

  const setPersonaGroupQueryData = useSetQueryDataByKey('GetPersonaGroupsWithPersonas');

  const [currentPage, setCurrentPage] = useState<number>(1);
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
        offset: 0,
        limit: PERSONA_GROUP_LIMIT * 3,
      },
    },
    {
      staleTime: querySlateTime,
    },
  );

  const count = useMemo(
    () => dataPersonaGroups?.getPersonaGroupsWithPersonas.count || 0,
    [dataPersonaGroups?.getPersonaGroupsWithPersonas.count],
  );

  const personaGroups = useMemo(
    () => dataPersonaGroups?.getPersonaGroupsWithPersonas.personaGroups || [],
    [dataPersonaGroups?.getPersonaGroupsWithPersonas.personaGroups],
  );

  const onHandleChangePage = useCallback((page: number) => {
    setCurrentPage(page);
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
            setPersonaGroupQueryData((oldData: any) => {
              const updatedPages = ((oldData?.pages || []) as Array<any>).map(page => {
                return {
                  ...page,
                  getPersonaGroupsWithPersonas: {
                    ...page.getPersonaGroupsWithPersonas,
                    count: page.getPersonaGroupsWithPersonas.count + 1,
                    personaGroups: [
                      { ...response.createPersonaGroup, persona: [] },
                      ...page.getPersonaGroupsWithPersonas.personaGroups,
                    ],
                  },
                };
              });
              return {
                ...oldData,
                pages: updatedPages,
              };
            });
            setCurrentPage(1);
          },
          onError: (error: any) => {
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

  const onHandleDeletePersonaGroup = useCallback(() => {}, []);

  const onTogglePersonaGroupDeleteModal = useCallback((personaGroup?: PersonaGroup) => {
    setSelectedPersonaGroup(personaGroup || null);
  }, []);

  if (errorPersonaGroups) {
    return <CustomError error={errorPersonaGroups?.message} />;
  }

  return (
    <div className={'persona-group'}>
      {/*{selectedPersonaGroup && (*/}
      {/*  <GroupDeleteModal*/}
      {/*    isOpen={!!selectedPersonaGroup}*/}
      {/*    groupId={selectedPersonaGroup.id}*/}
      {/*    handleDelete={onHandleDeletePersonaGroup}*/}
      {/*    handleClose={onTogglePersonaGroupDeleteModal}*/}
      {/*  />*/}
      {/*)}*/}
      <div className={'persona-group--header'}>
        <div className="base-page-header">
          <h3 className={'base-title !text-heading-2'}>Persona Group</h3>
        </div>
        <div className="persona-group--create-section">
          <EditableItemForm
            createButtonText={'New persona group'}
            inputPlaceholder={'Persona group name'}
            value={''}
            isLoading={isLoadingCreatePersonaGroup}
            onHandleCreate={onHandleCreatePersonaGroup}
          />
          {count > PERSONA_GROUP_LIMIT && (
            <Pagination
              perPage={PERSONA_GROUP_LIMIT}
              currentPage={currentPage}
              allCount={count}
              changePage={onHandleChangePage}
            />
          )}
        </div>
      </div>
      <div className={'persona-group--body'}>
        {isPendingPersonaGroups ? (
          <CustomLoader />
        ) : (
          <>
            {personaGroups.length ? (
              personaGroups.map(group => (
                <ErrorBoundary key={group.id}>
                  <GroupCard
                    group={group}
                    workspaceId={workspaceId}
                    onTogglePersonaGroupDeleteModal={onTogglePersonaGroupDeleteModal}
                  />
                </ErrorBoundary>
              ))
            ) : (
              <EmptyDataInfo icon={<Box />} message={'There are no persona groups yet'} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PersonaGroups;
