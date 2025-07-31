import { lazy, useCallback, useEffect, useMemo, useState } from 'react';

import { WuButton } from '@npm-questionpro/wick-ui-lib';
import { useNavigate, useParams } from '@tanstack/react-router';

import PersonaCard from './components/PersonaCard';
import { PersonaType } from './types';

import {
  GetPersonasQuery,
  useGetPersonasQuery,
} from '@/api/infinite-queries/generated/getPersonas.generated.ts';
import { useCreatePersonaMutation } from '@/api/mutations/generated/createPersona.generated.ts';
import BaseWuLoader from '@/Components/Shared/BaseWuLoader';
import CustomError from '@/Components/Shared/CustomError';
import EmptyDataInfo from '@/Components/Shared/EmptyDataInfo';
import Pagination from '@/Components/Shared/Pagination';
import { querySlateTime } from '@/Constants';
import { PERSONAS_LIMIT } from '@/Constants/pagination';
import ErrorBoundary from '@/Features/ErrorBoundary';
import { useRemoveQueriesByKey, useSetAllQueryDataByKey } from '@/Hooks/useQueryKey.ts';
import { useBreadcrumbStore } from '@/Store/breadcrumb.ts';

const PersonaDeleteModal = lazy(() => import('./components/PersonaDeleteModal'));
const PersonaAIModal = lazy(() => import('./components/PersonaAiModal'));

const PersonaGroupScreen = () => {
  const { workspaceId, personaGroupId } = useParams({
    from: '/_authenticated/_secondary-sidebar-layout/workspace/$workspaceId/persona-group/$personaGroupId/',
  });

  const navigate = useNavigate();

  const { setBreadcrumbs } = useBreadcrumbStore();

  const [selectedPersona, setSelectedPersona] = useState<PersonaType | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [offset, setOffset] = useState<number>(0);

  const setAllPersonas = useSetAllQueryDataByKey('GetPersonas');
  const setRemovePersonasQuery = useRemoveQueriesByKey();

  const {
    isLoading: isLoadingGetPersonas,
    error: errorGetPersonas,
    data: dataGetPersonas,
  } = useGetPersonasQuery<GetPersonasQuery, Error>(
    {
      getPersonasInput: {
        workspaceId: +workspaceId!,
        personaGroupId: +personaGroupId,
        offset,
        limit: PERSONAS_LIMIT,
      },
    },
    {
      staleTime: querySlateTime,
    },
  );

  const { mutate: mutateCreatePersona, isPending: isLoadingCreatePersona } =
    useCreatePersonaMutation({
      onSuccess: response => {
        navigate({
          to: `/workspace/${workspaceId}/persona/${response.createPersona.id}`,
        }).then();
      },
    });

  const personasData = useMemo(
    () => dataGetPersonas?.getPersonas.personas,
    [dataGetPersonas?.getPersonas.personas],
  );

  const personasDataCount = useMemo(
    () => dataGetPersonas?.getPersonas.count || 0,
    [dataGetPersonas?.getPersonas.count],
  );

  const onHandleChangePage = useCallback((newPage: number) => {
    setCurrentPage(newPage);
    setOffset((newPage - 1) * PERSONAS_LIMIT);
  }, []);

  const onToggleDeletePersonaModal = useCallback((persona?: PersonaType) => {
    setSelectedPersona(persona || null);
  }, []);

  const onHandleUpdatePersonas = useCallback(
    (id: number) => {
      setAllPersonas((oldData: any) => {
        if (oldData) {
          return {
            getPersonas: {
              ...oldData.getPersonas,
              count: oldData.getPersonas.count - 1,
              interviews: oldData.getPersonas.personas.filter(
                (persona: PersonaType) => persona.id !== id,
              ),
            },
          };
        }
      });
    },
    [setAllPersonas],
  );

  const onHandleFilterPersona = (id: number) => {
    if (
      currentPage * PERSONAS_LIMIT >= personasDataCount &&
      dataGetPersonas?.getPersonas.personas.length === 1 &&
      currentPage !== 1
    ) {
      setOffset(prev => prev - PERSONAS_LIMIT);
    }
    if (currentPage * PERSONAS_LIMIT < personasDataCount && personasDataCount > PERSONAS_LIMIT) {
      setRemovePersonasQuery('GetPersonas', {
        input: 'getPersonasInput',
        key: 'offset',
        value: offset,
        deleteUpcoming: true,
      });
    }
    onHandleUpdatePersonas(id);
  };

  const onHandleCreatePersona = () => {
    mutateCreatePersona({
      createPersonaInput: {
        workspaceId: +workspaceId,
        personaGroupId: +personaGroupId,
      },
    });
  };

  useEffect(() => {
    if (dataGetPersonas) {
      setBreadcrumbs([
        {
          name: 'Workspaces',
          pathname: '/workspaces',
        },
        {
          name: dataGetPersonas.getPersonas.workspace?.name?.trim() || 'Untitled',
          pathname: `/workspace/${dataGetPersonas?.getPersonas.workspace?.id}/boards`,
        },
        {
          name: dataGetPersonas.getPersonas.personaGroup?.name?.trim() || 'Untitled',
          pathname: `/workspace/${dataGetPersonas.getPersonas.workspace?.id}/persona-group/${dataGetPersonas.getPersonas.personaGroup?.id}`,
        },
      ]);
    }
  }, [dataGetPersonas, setBreadcrumbs]);

  if (errorGetPersonas) {
    return (
      <div className={'personas-container'}>
        <CustomError error={errorGetPersonas?.message} />
      </div>
    );
  }

  if (isLoadingGetPersonas) {
    return (
      <div className={'personas-container'}>
        <BaseWuLoader />
      </div>
    );
  }
  return (
    <div className={'h-full !pt-8 !px-16 !pb-[0]'}>
      {selectedPersona && (
        <PersonaDeleteModal
          isOpen={!!selectedPersona.id}
          personaId={selectedPersona.id}
          handleClose={onToggleDeletePersonaModal}
          onHandleFilterPersona={onHandleFilterPersona}
        />
      )}

      <h3 className={'base-title !text-heading-2'}>Personas</h3>

      <div className={'flex gap-4 py-4 md:pb-8 border-b border-[var(--light-gray)]'}>
        <div className={'flex gap-1'}>
          <WuButton
            onClick={onHandleCreatePersona}
            disabled={isLoadingCreatePersona}
            data-testid={'create-persona-btn-test-id'}>
            New persona
          </WuButton>
          <PersonaAIModal workspaceId={+workspaceId} personaGroupId={+personaGroupId} />
        </div>

        {personasDataCount > PERSONAS_LIMIT && (
          <Pagination
            perPage={PERSONAS_LIMIT}
            currentPage={currentPage}
            allCount={personasDataCount}
            changePage={onHandleChangePage}
          />
        )}
      </div>

      {personasData?.length ? (
        <ul
          className={
            'h-[calc(100dvh-16rem)] flex flex-wrap gap-4 mt-[1.125rem]! pr-5! overflow-auto'
          }>
          {personasData?.map(persona => (
            <ErrorBoundary key={persona.id}>
              <PersonaCard
                persona={persona}
                workspaceId={workspaceId}
                onToggleDeletePersonaModal={onToggleDeletePersonaModal}
              />
            </ErrorBoundary>
          ))}
        </ul>
      ) : (
        <EmptyDataInfo message={'There are no personas yet'} />
      )}
    </div>
  );
};

export default PersonaGroupScreen;
