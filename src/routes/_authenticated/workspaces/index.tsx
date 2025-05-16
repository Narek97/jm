import { createFileRoute } from "@tanstack/react-router";

import WorkspaceListScreen from "@/Screens/WorkspaceListScreen";

export const WorkspacesRoute = createFileRoute("/_authenticated/workspaces/")({
  component: WorkspaceListScreen,
});

export const Route = WorkspacesRoute;
