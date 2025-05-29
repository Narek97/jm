import { createFileRoute } from '@tanstack/react-router';

import OutcomeScreen from '@/Screens/OutcomeScreen';

export const OutcomeRoute = createFileRoute(
  '/_authenticated/_secondary-sidebar-layout/workspace/$workspaceId/outcome/$outcomeId/',
)({
  component: OutcomeScreen,
});

export const Route = OutcomeRoute;
