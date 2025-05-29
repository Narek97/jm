import { FC, ReactNode } from 'react';

import { WuSidebar } from '@npm-questionpro/wick-ui-lib';

import HoverMenuPanel from '@/Components/Feature/HoverMenuPanel';
import Footer from '@/Features/Footer';
import { MenuTabType } from '@/Features/SidebarLayout/types.ts';

interface ISidebarLayout {
  children: ReactNode;
  topTabs: Array<MenuTabType>;
  bottomTabs?: Array<MenuTabType>;
}

const SidebarLayout: FC<ISidebarLayout> = ({ children, topTabs, bottomTabs }) => {
  return (
    <WuSidebar Sidebar={<HoverMenuPanel topTabs={topTabs} bottomTabs={bottomTabs} />}>
      <div className={'h-full'}>{children}</div>
      <Footer />
    </WuSidebar>
  );
};

export default SidebarLayout;
