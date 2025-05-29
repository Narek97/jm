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
  updateBreadcrumb: (index: number, breadcrumb: Breadcrumb) => void;
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
  updateBreadcrumb: (index, breadcrumb) =>
    set((state) => ({
      breadcrumbs: state.breadcrumbs.map((item, i) =>
        i === index ? { ...item, ...breadcrumb } : item,
      ),
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
