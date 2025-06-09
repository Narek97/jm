import { createFileRoute } from '@tanstack/react-router';

import TechnicalProblemTemplate from '@/Features/TechnicalProblem';
import PersonaGroupScreen from '@/Screens/PersonaGroupScreen';

export const RoutePersonaGroup = createFileRoute(
  '/_authenticated/_secondary-sidebar-layout/workspace/$workspaceId/persona-group/$personaGroupId/',
)({
  component: PersonaGroupScreen,
  errorComponent: TechnicalProblemTemplate,
});

export const Route = RoutePersonaGroup;
