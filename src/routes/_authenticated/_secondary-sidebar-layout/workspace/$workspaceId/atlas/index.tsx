import { createFileRoute } from '@tanstack/react-router';

import TechnicalProblemTemplate from '@/Features/TechnicalProblem';
import AtlasScreen from '@/Screens/AtlasScreen';

export const RouteAtlas = createFileRoute(
  '/_authenticated/_secondary-sidebar-layout/workspace/$workspaceId/atlas/',
)({
  component: AtlasScreen,
  errorComponent: TechnicalProblemTemplate,
});

export const Route = RouteAtlas;
