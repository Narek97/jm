import { createFileRoute } from '@tanstack/react-router';

import JourneyMapScreen from '@/Screens/JourneyMapScreen';

export const JourneyMapRoute = createFileRoute(
  '/_authenticated/_secondary-sidebar-layout/board/$boardId/journey-map/$mapId/',
)({
  component: () => <JourneyMapScreen isGuest={false} />,
});

export const Route = JourneyMapRoute;
