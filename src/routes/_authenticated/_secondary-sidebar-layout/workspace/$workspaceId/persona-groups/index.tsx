import { createFileRoute } from '@tanstack/react-router';

import TechnicalProblemTemplate from '@/Features/TechnicalProblem';
import PersonaGroups from '@/Screens/PersonaGroupsScreen';

export const RoutePersonGroups = createFileRoute(
  '/_authenticated/_secondary-sidebar-layout/workspace/$workspaceId/persona-groups/',
)({
  component: PersonaGroups,
  errorComponent: TechnicalProblemTemplate,
});

export const Route = RoutePersonGroups;
