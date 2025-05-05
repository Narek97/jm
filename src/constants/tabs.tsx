import { MenuTabType } from "@/features/left-menu-panel-layout/types.ts";

const PRIMARY_MENU_PANEL_TOP_TABS: Array<MenuTabType> = [
  {
    icon: "wm-home",
    name: "Workspaces",
    url: "/workspaces",
    regexp: /^(\/workspaces)?$/,
    breadcrumbSlice: 1,
  },
  {
    icon: "wm-verified-user",
    name: "Users",
    url: "/users",
    regexp: /^\/users$/,
    breadcrumbSlice: 1,
  },
];

const MENU_PANEL_BOTTOM_TABS: Array<MenuTabType> = [
  {
    icon: "wc-admin",
    name: "Admin",
    url: "/admin",
    regexp: /^(\/admin)?$/,
    breadcrumbSlice: 1,
  },
  {
    icon: "wm-settings",
    name: "Settings",
    url: "/settings",
    regexp: /^(\/settings)?$/,
    breadcrumbSlice: 1,
  },
];

export { PRIMARY_MENU_PANEL_TOP_TABS, MENU_PANEL_BOTTOM_TABS };
