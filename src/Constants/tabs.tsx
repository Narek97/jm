import { MenuTabType } from '@/Features/SidebarLayout/types.ts';

const PRIMARY_MENU_PANEL_TOP_TABS: Array<MenuTabType> = [
  {
    icon: 'wm-home',
    name: 'Workspaces',
    url: '/workspaces',
    regexp: /^(\/workspaces)?$/,
    breadcrumbSlice: 1,
  },
  {
    icon: 'wm-verified-user',
    name: 'Users',
    url: '/users',
    regexp: /^\/users$/,
    breadcrumbSlice: 1,
  },
];

const SECONDARY_MENU_PANEL_TOP_TABS = ({
  workspaceID,
  isAdmin,
}: {
  workspaceID: string | undefined;
  isAdmin: boolean;
}): Array<MenuTabType> => {
  const primaryUrl = `/workspace/${workspaceID}/`;
  const TABS = [
    {
      icon: 'wm-grid-view',
      name: 'Boards',
      url: primaryUrl + 'boards',
      regexp: /^\/workspace\/\d+\/boards$/,
      breadcrumbSlice: 2,
    },
    {
      icon: 'wm-group',
      name: 'Persona',
      url: primaryUrl + 'persona-groups',
      regexp: /^\/workspace\/\d+\/persona-groups(?:\/\d+)?s?$/,
      breadcrumbSlice: 2,
    },
    {
      icon: 'wm-forum',
      name: 'Interviews',
      url: primaryUrl + 'interviews',
      regexp: /^\/workspace\/\d+\/interviews(?:\/\d+)?s?$/,
      breadcrumbSlice: 2,
    },
  ];
  if (isAdmin) {
    TABS.push({
      icon: 'wm-draw',
      name: 'Atlas',
      url: primaryUrl + 'atlas',
      regexp: /^\/workspace\/\d+\/atlas(?:\/\d+)?s?$/,
      breadcrumbSlice: 2,
    });
  }
  return TABS;
};

const MENU_PANEL_BOTTOM_TABS: Array<MenuTabType> = [
  {
    icon: 'wc-admin',
    name: 'Admin',
    url: '/admin',
    regexp: /^(\/admin)?$/,
    breadcrumbSlice: 1,
  },
  {
    icon: 'wm-settings',
    name: 'Settings',
    url: '/settings',
    regexp: /^(\/settings)?$/,
    breadcrumbSlice: 1,
  },
];

export { PRIMARY_MENU_PANEL_TOP_TABS, SECONDARY_MENU_PANEL_TOP_TABS, MENU_PANEL_BOTTOM_TABS };
