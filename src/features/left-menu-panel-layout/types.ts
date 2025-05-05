import { ReactNode } from "react";

type MenuTabType = {
  icon: string | ReactNode;
  name: string;
  url: string;
  breadcrumbSlice?: number;
  regexp?: RegExp;
};

export type { MenuTabType };
