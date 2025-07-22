import { useEffect } from 'react';

import { createFileRoute, Outlet, useParams } from '@tanstack/react-router';

import {
  GetBoardByIdQuery,
  useGetBoardByIdQuery,
} from '@/api/queries/generated/getBoardById.generated';
import { querySlateTime } from '@/constants';
import { MENU_PANEL_BOTTOM_TABS } from '@/constants/tabs.tsx';
import SidebarLayout from '@/Features/SidebarLayout';
import TechnicalProblemTemplate from '@/Features/TechnicalProblem';
import useGetLeftMenuTabs from '@/hooks/useGetLeftMenuTabs';
import { useWorkspaceStore } from '@/store/workspace.ts';

export const Route = createFileRoute('/_authenticated/_secondary-sidebar-layout/board/$boardId')({
  component: RouteComponent,
  errorComponent: TechnicalProblemTemplate,
});

function RouteComponent() {
  const { boardId } = useParams({
    from: '/_authenticated/_secondary-sidebar-layout/board/$boardId',
  });

  const { setWorkspace } = useWorkspaceStore();

  const { data: dataBoard } = useGetBoardByIdQuery<GetBoardByIdQuery, Error>(
    {
      id: +boardId,
    },
    {
      staleTime: querySlateTime,
      enabled: !!boardId,
    },
  );

  const { topTabs } = useGetLeftMenuTabs(dataBoard?.getBoardById.workspace.id || null);

  useEffect(() => {
    if (dataBoard?.getBoardById) {
      setWorkspace(dataBoard?.getBoardById.workspace);
    }
  }, [dataBoard?.getBoardById, setWorkspace]);

  return (
    <SidebarLayout topTabs={topTabs} bottomTabs={MENU_PANEL_BOTTOM_TABS}>
      {/*<TechnicalProblemTemplate />*/}
      <Outlet />
    </SidebarLayout>
  );
}
