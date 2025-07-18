import { FC, Suspense } from 'react';
import './style.scss';

import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import { Tab, Tabs } from '@mui/material';

import WuBaseLoader from '@/Components/Shared/WuBaseLoader';
import { TabPanelType, TabType } from '@/types';

type indicatorTypes = 'linear' | 'circular';

interface ICustomTabs {
  orientation?: 'vertical' | 'horizontal';
  tabsBottomBorderColor: string;
  tabs: TabType[];
  tabValue: string;
  setTabValue: (tab: string, label?: string) => void;
  tabPanels: TabPanelType[];
  indicatorType?: indicatorTypes;
  showTabsBottomLine?: boolean;
  disableRipple?: boolean;
  activeColor?: string;
  inactiveColor: string;
  variant?: 'standard' | 'scrollable' | 'fullWidth';
}

const CustomTabs: FC<ICustomTabs> = ({
  orientation = 'horizontal',
  tabValue,
  setTabValue,
  tabs = [],
  tabPanels,
  tabsBottomBorderColor,
  indicatorType = 'linear',
  showTabsBottomLine = true,
  disableRipple = true,
  activeColor,
  inactiveColor,
  variant,
}) => {
  const onPageChange = (tabName: string, label: string) => {
    setTabValue(tabName, label);
  };
  const getTabStyleByIndicatorType = (type: indicatorTypes) => {
    const primaryStyle = {
      '&.MuiTabs-root': {
        '.MuiTabScrollButton-root': {
          width: '2rem',
        },
      },
      '& .MuiTab-root': {
        color: inactiveColor,
      },
      '& .MuiTab-root.Mui-selected': {
        color: activeColor,
      },
    };
    let tabStyle = {};
    switch (type) {
      case 'linear':
        tabStyle = {
          minHeight: '1.5625rem',
        };
        break;
      case 'circular':
        tabStyle = {
          '& .MuiTab-root.Mui-selected': {
            color: activeColor,
          },
          '& .MuiTabs-indicator': {
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: 'transparent',
          },
        };
        break;
    }
    return {
      ...primaryStyle,
      ...tabStyle,
    };
  };

  const tabsStyles = getTabStyleByIndicatorType(indicatorType);

  return (
    <div className={'custom-tabs'}>
      <TabContext value={tabValue}>
        <div className={'custom-tabs--content'}>
          {showTabsBottomLine && (
            <div
              className={'tabs-divider-line'}
              style={{ backgroundColor: tabsBottomBorderColor }}
            />
          )}
          <Tabs
            orientation={orientation}
            value={tabValue}
            sx={tabsStyles}
            variant={variant}
            className={'custom-tabs--tabs'}>
            {tabs.map((tab, index) => (
              <Tab
                {...tab}
                key={index}
                className={'custom-tabs--tab'}
                data-testid="custom-tab-test-id"
                disableRipple={disableRipple}
                sx={{ minWidth: 0 }}
                onClick={() => onPageChange(tab.value, tab?.label as string)}
              />
            ))}
          </Tabs>
        </div>
        {tabPanels.map(({ page, value }, index) => (
          <TabPanel value={value} key={index} className={'custom-tabs--panel'} sx={{ padding: 0 }}>
            <Suspense fallback={<WuBaseLoader />}>{page}</Suspense>
          </TabPanel>
        ))}
      </TabContext>
    </div>
  );
};

export default CustomTabs;
