import { createFileRoute } from '@tanstack/react-router';

import TechnicalProblemTemplate from '@/Features/TechnicalProblem';
import JourniesScreen from '@/Screens/JourniesScreen';

export const JourniesRoute = createFileRoute(
  '/_authenticated/_secondary-sidebar-layout/board/$boardId/journies/',
)({
  component: JourniesScreen,
  errorComponent: TechnicalProblemTemplate,
});

export const Route = JourniesRoute;
