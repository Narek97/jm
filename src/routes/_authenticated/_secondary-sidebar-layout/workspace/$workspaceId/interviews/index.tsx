import { createFileRoute } from '@tanstack/react-router';

import InterviewsScreen from '@/Screens/InterviewsScreen';

export const InterviewsRoute = createFileRoute(
  '/_authenticated/_secondary-sidebar-layout/workspace/$workspaceId/interviews/',
)({
  component: () => <InterviewsScreen />,
});

export const Route = InterviewsRoute;
