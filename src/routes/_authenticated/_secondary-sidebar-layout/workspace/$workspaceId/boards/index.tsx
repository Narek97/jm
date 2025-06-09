import { createFileRoute } from '@tanstack/react-router';

import TechnicalProblemTemplate from '@/Features/TechnicalProblem';
import BoardsScreen from '@/Screens/BoardsScreen';

export const RouteBoards = createFileRoute(
  '/_authenticated/_secondary-sidebar-layout/workspace/$workspaceId/boards/',
)({
  component: BoardsScreen,
  errorComponent: TechnicalProblemTemplate,
});

export const Route = RouteBoards;
