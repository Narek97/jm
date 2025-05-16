import { useEffect } from "react";

import "./style.scss";

import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";

import {
  GetWorkspacesByOrganizationIdQuery,
  useGetWorkspacesByOrganizationIdQuery,
} from "@/api/queries/generated/getWorkspaces.generated.ts";
import CustomError from "@/Components/Shared/CustomError";
import CustomLoader from "@/Components/Shared/CustomLoader";
import EmptyDataInfo from "@/Components/Shared/EmptyDataInfo";
import { querySlateTime } from "@/constants";
import { WORKSPACES_LIMIT } from "@/constants/pagination.ts";
import ErrorBoundary from "@/Features/ErrorBoundary";
import WorkspaceCard from "@/Screens/WorkspaceListScreen/components/WorkspaceCard";
import { useBreadcrumbStore } from "@/store/breadcrumb.ts";
import { useUserStore } from "@/store/user.ts";

const WorkspaceListScreen = () => {
  const { t } = useTranslation();
  const { user } = useUserStore();
  const { setBreadcrumbs } = useBreadcrumbStore();

  const {
    isLoading: isLoadingWorkspaces,
    error: errorWorkspaces,
    data: dataWorkspaces,
  } = useGetWorkspacesByOrganizationIdQuery<
    GetWorkspacesByOrganizationIdQuery,
    Error
  >(
    {
      getWorkspacesInput: {
        limit: WORKSPACES_LIMIT,
        offset: 0,
        organizationId: Number(user!.orgID),
      },
    },
    {
      enabled: !!user?.orgID,
      staleTime: querySlateTime,
    },
  );

  useEffect(() => {
    setBreadcrumbs([
      {
        name: "Workspaces",
        pathname: "/workspaces",
      },
    ]);
  }, [setBreadcrumbs]);

  if (errorWorkspaces) {
    return <CustomError error={errorWorkspaces?.message} />;
  }

  return (
    <div className={"!py-[2rem] !px-[4rem]"}>
      <div>
        <h3 className={"!text-heading-2"} data-testid="workspace-title-test-id">
          {t("workspace.title")}
        </h3>
      </div>
      <>
        {isLoadingWorkspaces ? (
          <CustomLoader />
        ) : !dataWorkspaces?.getWorkspacesByOrganizationId.workspaces.length ? (
          <EmptyDataInfo icon={<Box />} message="There are no organizations" />
        ) : (
          <ul className="workspaces-container">
            {dataWorkspaces.getWorkspacesByOrganizationId.workspaces.map(
              (workspace) => (
                <ErrorBoundary key={workspace.id}>
                  <WorkspaceCard workspace={workspace} />
                </ErrorBoundary>
              ),
            )}
          </ul>
        )}
      </>
    </div>
  );
};

export default WorkspaceListScreen;
