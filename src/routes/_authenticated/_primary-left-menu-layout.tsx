import { createFileRoute, Outlet } from "@tanstack/react-router";

import {
  MENU_PANEL_BOTTOM_TABS,
  PRIMARY_MENU_PANEL_TOP_TABS,
} from "@/constants/tabs.tsx";
import LeftMenuPanelLayout from "@/features/left-menu-panel-layout";

export const Route = createFileRoute(
  "/_authenticated/_primary-left-menu-layout",
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <LeftMenuPanelLayout
      topTabs={PRIMARY_MENU_PANEL_TOP_TABS}
      bottomTabs={MENU_PANEL_BOTTOM_TABS}
    >
      <Outlet />
    </LeftMenuPanelLayout>
  );
}
