import { createFileRoute } from '@tanstack/react-router';

import BoardsScreen from '@/Screens/BoardsScreen';

export const RouteBoards = createFileRoute(
  '/_authenticated/_secondary-sidebar-layout/workspace/$workspaceId/boards/',
)({
  component: () => <BoardsScreen />,
});

export const Route = RouteBoards;
