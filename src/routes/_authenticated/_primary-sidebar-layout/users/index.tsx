import { createFileRoute } from '@tanstack/react-router';

import UsersScreen from '@/Screens/UsersScreen';

export const Route = createFileRoute('/_authenticated/_primary-sidebar-layout/users/')({
  component: UsersScreen,
});
