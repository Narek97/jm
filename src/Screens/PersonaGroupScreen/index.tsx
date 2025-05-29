import "./style.scss";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Box } from "@mui/material";
import { WuButton } from "@npm-questionpro/wick-ui-lib";
import { useNavigate, useParams } from "@tanstack/react-router";

import { useCreatePersonaMutation } from "@/api/mutations/generated/createPersona.generated.ts";
import {
  GetPersonasQuery,
  useGetPersonasQuery,
} from "@/api/queries/generated/getPersonas.generated.ts";
import CustomError from "@/Components/Shared/CustomError";
import CustomLoader from "@/Components/Shared/CustomLoader";
import EmptyDataInfo from "@/Components/Shared/EmptyDataInfo";
import Pagination from "@/Components/Shared/Pagination";
import { querySlateTime } from "@/constants";
import { PERSONAS_LIMIT } from "@/constants/pagination";
import ErrorBoundary from "@/Features/ErrorBoundary";
import PersonaCard from "@/Screens/PersonaGroupScreen/components/PersonaCard";
import PersonaDeleteModal from "@/Screens/PersonaGroupScreen/components/PersonaDeleteModal";
import { PersonaType } from "@/Screens/PersonaGroupScreen/types.ts";
import { useBreadcrumbStore } from "@/store/breadcrumb.ts";

const PersonaGroupScreen = () => {
  const { workspaceId, personaGroupId } = useParams({
    from: "/_authenticated/_secondary-sidebar-layout/workspace/$workspaceId/persona-group/$personaGroupId/",
  });

  const navigate = useNavigate();

  const { setBreadcrumbs } = useBreadcrumbStore();

  const [selectedPersona, setSelectedPersona] = useState<PersonaType | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [offset, setOffset] = useState<number>(0);

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
      onSuccess: (response) => {
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

  const onHandleFilterPersona = (id: number) => {};

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
          name: "Workspaces",
          pathname: "/workspaces",
        },
        {
          name: dataGetPersonas.getPersonas.workspace?.name || "...",
          pathname: `/workspace/${dataGetPersonas?.getPersonas.workspace?.id}/boards`,
        },
        {
          name: dataGetPersonas.getPersonas.personaGroup?.name || "...",
          pathname: `/workspace/${dataGetPersonas.getPersonas.workspace?.id}/persona-group/${dataGetPersonas.getPersonas.personaGroup?.id}`,
        },
      ]);
    }
  }, [dataGetPersonas, setBreadcrumbs]);

  if (errorGetPersonas) {
    return (
      <div className={"personas-container"}>
        <CustomError error={errorGetPersonas?.message} />
      </div>
    );
  }

  if (isLoadingGetPersonas) {
    return (
      <div className={"personas-container"}>
        <CustomLoader />
      </div>
    );
  }
  return (
    <div className={"persona-group"}>
      {selectedPersona && (
        <PersonaDeleteModal
          isOpen={!!selectedPersona.id}
          personaId={selectedPersona.id}
          handleClose={onToggleDeletePersonaModal}
          onHandleFilterPersona={onHandleFilterPersona}
        />
      )}

      <div className={"persona-group--header"}>
        <div className={"base-page-header"}>
          <h3 className={"base-title !text-heading-2"}>Personas</h3>
        </div>
        <div className={"persona-group--create-section"}>
          <WuButton
            onClick={onHandleCreatePersona}
            disabled={isLoadingCreatePersona}
            data-testid={"create-persona-btn-test-id"}
          >
            New persona
          </WuButton>
          {personasDataCount > PERSONAS_LIMIT && (
            <Pagination
              perPage={PERSONAS_LIMIT}
              currentPage={currentPage}
              allCount={personasDataCount}
              changePage={onHandleChangePage}
            />
          )}
        </div>
      </div>
      <ul className={"persona-group--body"}>
        {personasData?.length ? (
          <>
            {personasData?.map((persona) => (
              <ErrorBoundary key={persona.id}>
                <PersonaCard
                  persona={persona}
                  workspaceId={workspaceId}
                  onToggleDeletePersonaModal={onToggleDeletePersonaModal}
                />
              </ErrorBoundary>
            ))}
          </>
        ) : (
          <EmptyDataInfo icon={<Box />} message={"There are no personas yet"} />
        )}
      </ul>
    </div>
  );
};

export default PersonaGroupScreen;
