import { createFileRoute } from '@tanstack/react-router';

import SettingsScreen from '@/Screens/SettingsScreen';

export const SettingsRoute = createFileRoute('/_authenticated/_primary-sidebar-layout/settings/')({
  component: SettingsScreen,
});

export const Route = SettingsRoute;
