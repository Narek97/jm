import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import {
  GetWorkspacesByOrganizationIdQuery,
  useGetWorkspacesByOrganizationIdQuery,
} from "@/api/queries/generated/getWorkspaces.generated.ts";
import CustomError from "@/Components/Shared/CustomError";
import { querySlateTime } from "@/constants";
import { WORKSPACES_LIMIT } from "@/constants/pagination.ts";
import WorkspaceListScreen from "@/Screens/WorkspaceListScreen";
import { useUserStore } from "@/store/user.ts";


export const Route = createFileRoute("/_authenticated/workspaces/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();
  const { user } = useUserStore();

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

  if (errorWorkspaces) {
    return <CustomError error={errorWorkspaces?.message} />;
  }

  return (
    <section>
      <div className={"!py-[2rem] !px-[4rem]"}>
        <div>
          <h3
            className={"!text-heading-2"}
            data-testid="workspace-title-test-id"
          >
            {t("workspace.title")}
          </h3>
        </div>
        <WorkspaceListScreen
          isLoadingWorkspaces={isLoadingWorkspaces}
          workspaces={
            dataWorkspaces?.getWorkspacesByOrganizationId?.workspaces || []
          }
        />
      </div>
    </section>
  );
}
