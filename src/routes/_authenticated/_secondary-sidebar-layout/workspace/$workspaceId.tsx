import { useEffect } from 'react';

import { createFileRoute, Outlet, useParams } from '@tanstack/react-router';

import {
  GetWorkspaceByIdQuery,
  useGetWorkspaceByIdQuery,
} from '@/api/queries/generated/getWorkspaceById.generated.ts';
import CustomError from '@/Components/Shared/CustomError';
import { MENU_PANEL_BOTTOM_TABS } from '@/constants/tabs.tsx';
import SidebarLayout from '@/Features/SidebarLayout';
import useGetLeftMenuTabs from '@/hooks/useGetLeftMenuTabs.tsx';
import { useWorkspaceStore } from '@/store/workspaceById.ts';

export const Route = createFileRoute(
  '/_authenticated/_secondary-sidebar-layout/workspace/$workspaceId',
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { workspaceId } = useParams({
    from: '/_authenticated/_secondary-sidebar-layout/workspace/$workspaceId',
  });

  const { setWorkspace } = useWorkspaceStore();

  const { data, error } = useGetWorkspaceByIdQuery<GetWorkspaceByIdQuery, Error>(
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

  if (error) {
    return <CustomError error={error?.message} />;
  }

  return (
    <SidebarLayout topTabs={topTabs} bottomTabs={MENU_PANEL_BOTTOM_TABS}>
      <Outlet />
    </SidebarLayout>
  );
}
