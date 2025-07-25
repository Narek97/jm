import { useEffect } from 'react';

import { createFileRoute, Outlet, useParams } from '@tanstack/react-router';

import {
  GetWorkspaceByIdQuery,
  useGetWorkspaceByIdQuery,
} from '@/api/queries/generated/getWorkspaceById.generated.ts';
import { MENU_PANEL_BOTTOM_TABS } from '@/Constants/tabs.tsx';
import SidebarLayout from '@/Features/SidebarLayout';
import TechnicalProblemTemplate from '@/Features/TechnicalProblem';
import useGetLeftMenuTabs from '@/Hooks/useGetLeftMenuTabs.tsx';
import { useWorkspaceStore } from '@/Store/workspace.ts';

export const Route = createFileRoute(
  '/_authenticated/_secondary-sidebar-layout/workspace/$workspaceId',
)({
  component: RouteComponent,
  errorComponent: TechnicalProblemTemplate,
});

function RouteComponent() {
  const { workspaceId } = useParams({
    from: '/_authenticated/_secondary-sidebar-layout/workspace/$workspaceId',
  });

  const { setWorkspace } = useWorkspaceStore();

  const { data } = useGetWorkspaceByIdQuery<GetWorkspaceByIdQuery, Error>(
    {
      id: +workspaceId!,
    },
    {
      enabled: !!workspaceId,
    },
  );

  useEffect(() => {
    if (data?.getWorkspaceById) {
      setWorkspace(data?.getWorkspaceById);
    }
  }, [data, setWorkspace]);

  const { topTabs } = useGetLeftMenuTabs(+workspaceId!);

  return (
    <SidebarLayout topTabs={topTabs} bottomTabs={MENU_PANEL_BOTTOM_TABS}>
      <Outlet />
    </SidebarLayout>
  );
}
