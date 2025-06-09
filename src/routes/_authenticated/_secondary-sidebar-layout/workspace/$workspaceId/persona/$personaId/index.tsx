import { createFileRoute } from '@tanstack/react-router';

import TechnicalProblemTemplate from '@/Features/TechnicalProblem';
import PersonaScreen from '@/Screens/PersonaScreen';

export const PersonaRoute = createFileRoute(
  '/_authenticated/_secondary-sidebar-layout/workspace/$workspaceId/persona/$personaId/',
)({
  component: PersonaScreen,
  errorComponent: TechnicalProblemTemplate,
});

export const Route = PersonaRoute;
