import { createFileRoute, Outlet } from "@tanstack/react-router";

import {
  MENU_PANEL_BOTTOM_TABS,
  PRIMARY_MENU_PANEL_TOP_TABS,
} from "@/constants/tabs.tsx";
import SidebarLayout from "@/features/sidebar-layout";

export const Route = createFileRoute(
  "/_authenticated/_secondary-sidebar-layout",
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SidebarLayout
      topTabs={PRIMARY_MENU_PANEL_TOP_TABS}
      bottomTabs={MENU_PANEL_BOTTOM_TABS}
    >
      <Outlet />
    </SidebarLayout>
  );
}
