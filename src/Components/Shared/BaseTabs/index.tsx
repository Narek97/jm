import { FC } from 'react';

import { CustomTabs, Tab, TabPanel } from '@/Components/Shared/CustomTabs';
import { TabPanelType, TabType } from '@/types';

interface IBaseTabs {
  tabs: TabType[];
  tabPanels: TabPanelType[];
  setActiveTab: (tab: TabType) => void;
  defaultValue: number;
  tab: string;
  orientation?: 'horizontal' | 'vertical';
}

const BaseTabs: FC<IBaseTabs> = ({
  tabs,
  tabPanels,
  setActiveTab,
  defaultValue = 0,
  tab,
  orientation = 'horizontal',
}) => {
  const onHandleTabChange = (index: number) => {
    setActiveTab(tabs[index]);
  };

  return (
    <>
      <CustomTabs
        defaultValue={defaultValue}
        onChange={onHandleTabChange}
        orientation={orientation}>
        {tabs.map(tab => (
          <Tab icon={tab.icon} key={tab.value}>
            {tab.label}
          </Tab>
        ))}
        {tabPanels.map((panel, index) => (
          <TabPanel key={index} active={panel.value === tab}>
            {panel.page}
          </TabPanel>
        ))}
      </CustomTabs>
    </>
  );
};

export default BaseTabs;
