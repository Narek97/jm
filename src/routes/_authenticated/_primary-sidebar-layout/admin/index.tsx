import { createFileRoute } from '@tanstack/react-router';

import AdminScreen from '@/Screens/AdminScreen';

export const AdminRoute = createFileRoute('/_authenticated/_primary-sidebar-layout/admin/')({
  component: AdminScreen,
});

export const Route = AdminRoute;
