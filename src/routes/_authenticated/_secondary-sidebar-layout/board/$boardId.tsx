import { useEffect } from 'react';

import { createFileRoute, Outlet, useParams } from '@tanstack/react-router';

import {
  GetBoardByIdQuery,
  useGetBoardByIdQuery,
} from '@/api/queries/generated/getBoardById.generated';
import CustomError from '@/Components/Shared/CustomError';
import { querySlateTime } from '@/Constants';
import { MENU_PANEL_BOTTOM_TABS } from '@/Constants/tabs.tsx';
import SidebarLayout from '@/Features/SidebarLayout';
import TechnicalProblemTemplate from '@/Features/TechnicalProblem';
import useGetLeftMenuTabs from '@/Hooks/useGetLeftMenuTabs';
import { useWorkspaceStore } from '@/Store/workspace.ts';

export const Route = createFileRoute('/_authenticated/_secondary-sidebar-layout/board/$boardId')({
  component: RouteComponent,
  errorComponent: TechnicalProblemTemplate,
});

function RouteComponent() {
  const { boardId } = useParams({
    from: '/_authenticated/_secondary-sidebar-layout/board/$boardId',
  });

  const { setWorkspace } = useWorkspaceStore();

  const { data: dataBoard, error } = useGetBoardByIdQuery<GetBoardByIdQuery, Error>(
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

  if (error) {
    return <CustomError error={error.message} />;
  }

  return (
    <SidebarLayout topTabs={topTabs} bottomTabs={MENU_PANEL_BOTTOM_TABS}>
      {/*<TechnicalProblemTemplate />*/}
      <Outlet />
    </SidebarLayout>
  );
}
