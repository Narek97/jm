import { createFileRoute } from '@tanstack/react-router';

import PersonaGroupScreen from '@/Screens/PersonaGroupScreen';

export const RoutePersonaGroup = createFileRoute(
  '/_authenticated/_secondary-sidebar-layout/workspace/$workspaceId/persona-group/$personaGroupId/',
)({
  component: PersonaGroupScreen,
});

export const Route = RoutePersonaGroup;
