import { createFileRoute } from '@tanstack/react-router';

import TechnicalProblemTemplate from '@/Features/TechnicalProblem';
import OutcomeScreen from '@/Screens/OutcomeScreen';

export const OutcomeRoute = createFileRoute(
  '/_authenticated/_secondary-sidebar-layout/workspace/$workspaceId/outcome/$outcomeId/',
)({
  component: OutcomeScreen,
  errorComponent: TechnicalProblemTemplate,
});

export const Route = OutcomeRoute;
