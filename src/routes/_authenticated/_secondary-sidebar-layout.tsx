import { createFileRoute, Outlet } from '@tanstack/react-router';

import TechnicalProblemTemplate from '@/Features/TechnicalProblem';

export const Route = createFileRoute('/_authenticated/_secondary-sidebar-layout')({
  component: RouteComponent,
  errorComponent: TechnicalProblemTemplate,
});

function RouteComponent() {
  return (
    <>
      <Outlet />
    </>
  );
}
