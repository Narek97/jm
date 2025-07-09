import { FC, ReactNode, useState } from 'react';

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
  const [isOpen, setIsOpen] = useState<boolean>(localStorage.getItem('isOpenSidebar') === 'true');

  return (
    <WuSidebar
      className="sidebar-content"
      open={isOpen}
      defaultOpen={localStorage.getItem('isOpenSidebar') === 'true'}
      onOpenChange={e => {
        setIsOpen(e);
        localStorage.setItem(
          'isOpenSidebar',
          String(!(localStorage.getItem('isOpenSidebar') === 'true')),
        );
      }}
      Sidebar={<HoverMenuPanel topTabs={topTabs} bottomTabs={bottomTabs} />}>
      <div className={'h-full'}>{children}</div>
      <Footer />
    </WuSidebar>
  );
};

export default SidebarLayout;
