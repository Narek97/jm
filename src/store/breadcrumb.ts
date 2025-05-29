import { create } from 'zustand';

type Breadcrumb = {
  name: string;
  pathname?: string;
  search?: string;
};

type BreadcrumbStore = {
  breadcrumbs: Breadcrumb[];
  setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void;
  addBreadcrumb: (breadcrumb: Breadcrumb) => void;
  resetBreadcrumbs: () => void;
};

export const useBreadcrumbStore = create<BreadcrumbStore>(set => ({
  breadcrumbs: [
    {
      name: 'Workspaces',
      pathname: '/workspaces',
    },
  ],
  setBreadcrumbs: breadcrumbs => set({ breadcrumbs }),
  addBreadcrumb: breadcrumb =>
    set(state => ({
      breadcrumbs: [...state.breadcrumbs, breadcrumb],
    })),
  resetBreadcrumbs: () =>
    set({
      breadcrumbs: [
        {
          name: 'Workspaces',
          pathname: '/workspaces',
        },
      ],
    }),
}));
