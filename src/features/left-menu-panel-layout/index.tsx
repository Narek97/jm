import { FC, ReactNode } from "react";

import { WuSidebar } from "@npm-questionpro/wick-ui-lib";

import HoverMenuPanel from "@/components/feature/hover-menu-panel";
import Footer from "@/features/footer";
import { MenuTabType } from "@/features/left-menu-panel-layout/types.ts";

interface ILeftMenuPanelLayout {
  children: ReactNode;
  topTabs: Array<MenuTabType>;
  bottomTabs?: Array<MenuTabType>;
}

const LeftMenuPanelLayout: FC<ILeftMenuPanelLayout> = ({
  children,
  topTabs,
  bottomTabs,
}) => {
  // const isOpenSidebar = localStorage.getItem(IS_OPEN_SIDEBAR) === 'true';

  return (
    <WuSidebar
      Sidebar={<HoverMenuPanel topTabs={topTabs} bottomTabs={bottomTabs} />}
    >
      <div>{children}</div>
      <Footer />
    </WuSidebar>
  );
};

export default LeftMenuPanelLayout;
