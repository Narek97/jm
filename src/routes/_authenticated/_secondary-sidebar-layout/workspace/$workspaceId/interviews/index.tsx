import { createFileRoute } from '@tanstack/react-router';

import TechnicalProblemTemplate from '@/Features/TechnicalProblem';
import InterviewsScreen from '@/Screens/InterviewsScreen';

export const InterviewsRoute = createFileRoute(
  '/_authenticated/_secondary-sidebar-layout/workspace/$workspaceId/interviews/',
)({
  component: InterviewsScreen,
  errorComponent: TechnicalProblemTemplate,
});

export const Route = InterviewsRoute;
