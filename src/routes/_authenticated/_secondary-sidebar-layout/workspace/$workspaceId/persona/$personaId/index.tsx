import { createFileRoute } from '@tanstack/react-router';

import PersonaScreen from '@/Screens/PersonaScreen';

export const PersonaRoute = createFileRoute(
  '/_authenticated/_secondary-sidebar-layout/workspace/$workspaceId/persona/$personaId/',
)({
  component: PersonaScreen,
});

export const Route = PersonaRoute;
