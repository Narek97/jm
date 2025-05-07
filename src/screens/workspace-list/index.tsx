import { FC, useEffect } from "react";

import "./style.scss";
import { Box } from "@mui/material";

import CustomLoader from "@/components/shared/custom-loader/custom-loader.tsx";
import EmptyDataInfo from "@/components/shared/empty-data-info";
import ErrorBoundary from "@/features/error-boundary";
import WorkspaceCard from "@/screens/workspace-list/components/workspace-card";
import { WorkspaceType } from "@/screens/workspace-list/types.ts";
import { useBreadcrumbStore } from "@/store/breadcrumb.ts";

interface IWorkspaceList {
  isLoadingWorkspaces: boolean;
  workspaces: WorkspaceType[];
}

const WorkspaceList: FC<IWorkspaceList> = ({
  isLoadingWorkspaces,
  workspaces,
}) => {
  const { setBreadcrumbs } = useBreadcrumbStore();

  useEffect(() => {
    setBreadcrumbs([
      {
        name: "Workspaces",
        pathname: "/workspaces",
      },
    ]);
  }, [setBreadcrumbs]);

  return (
    <>
      {isLoadingWorkspaces ? (
        <CustomLoader />
      ) : !workspaces?.length ? (
        <EmptyDataInfo icon={<Box />} message="There are no organizations" />
      ) : (
        <ul className="workspaces-container">
          {workspaces.map((workspace) => (
            <ErrorBoundary key={workspace.id}>
              <WorkspaceCard workspace={workspace} />
            </ErrorBoundary>
          ))}
        </ul>
      )}
    </>
  );
};

export default WorkspaceList;
