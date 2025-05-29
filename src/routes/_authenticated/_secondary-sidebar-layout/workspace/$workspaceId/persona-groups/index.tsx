import { createFileRoute } from '@tanstack/react-router';

import PersonaGroups from '@/Screens/PersonaGroupsScreen';

export const RoutePersonGroups = createFileRoute(
  '/_authenticated/_secondary-sidebar-layout/workspace/$workspaceId/persona-groups/',
)({
  component: () => <PersonaGroups />,
});

export const Route = RoutePersonGroups;
