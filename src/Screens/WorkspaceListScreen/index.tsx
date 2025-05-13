import { FC, useEffect } from "react";

import "./style.scss";

import { Box } from "@mui/material";

import CustomLoader from "@/Components/Shared/CustomLoader";
import EmptyDataInfo from "@/Components/Shared/EmptyDataInfo";
import ErrorBoundary from "@/Features/ErrorBoundary";
import WorkspaceCard from "@/Screens/WorkspaceListScreen/components/WorkspaceCard";
import {WorkspaceType} from "@/Screens/WorkspaceListScreen/types.ts";
import { useBreadcrumbStore } from "@/store/breadcrumb.ts";

interface IWorkspaceListScreen {
  isLoadingWorkspaces: boolean;
  workspaces: WorkspaceType[];
}

const WorkspaceListScreen: FC<IWorkspaceListScreen> = ({
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

export default WorkspaceListScreen;
