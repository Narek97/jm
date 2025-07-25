import { lazy, Suspense } from 'react';

import BaseWuLoader from '@/Components/Shared/BaseWuLoader';
import { TabPanelType, TabType } from '@/types';

const Outcomes = lazy(() => import('./components/Outcomes'));
const UserDebug = lazy(() => import('./components/UserDebug'));

const SETTINGS_TABS: TabType[] = [
  { label: 'Outcomes', value: 'outcomes' },
  { label: 'User debug', value: 'user-debug' },
];
const SETTINGS_TAB_PANELS: TabPanelType[] = [
  {
    page: (
      <Suspense fallback={<BaseWuLoader />}>
        <Outcomes />
      </Suspense>
    ),
    value: 'outcomes',
  },
  {
    page: (
      <Suspense fallback={<BaseWuLoader />}>
        <UserDebug />
      </Suspense>
    ),
    value: 'user-debug',
  },
];

export { SETTINGS_TABS, SETTINGS_TAB_PANELS };
