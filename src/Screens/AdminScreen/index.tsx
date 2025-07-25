import { lazy, Suspense } from 'react';
import './style.scss';

import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { ADMIN_TABS } from './constants';

import BaseTabs from '@/Components/Shared/BaseTabs';
import BaseWuLoader from '@/Components/Shared/BaseWuLoader';
import { AdminRoute } from '@/routes/_authenticated/_primary-sidebar-layout/admin';
import { ADMIN_TAB_PANELS } from '@/Screens/AdminScreen/constants.tsx';
import { useUserStore } from '@/Store/user';
import { SearchParamsType, TabType } from '@/types';

const SuperAdmin = lazy(() => import('./components/SuperAdmin'));
const CopyMap = lazy(() => import('./components/CopyMap'));
const AiModel = lazy(() => import('./components/AiModel'));

const AdminScreen = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { tab = 'error-logs' } = AdminRoute.useSearch();
  const { user } = useUserStore();

  const onSelectTab = (tab: TabType) => {
    navigate({
      to: '.',
      search: (prev: SearchParamsType) => ({
        ...prev,
        tab: tab.value,
      }),
    }).then();
  };

  const tabs = [...ADMIN_TABS];
  const tabPanels = [...ADMIN_TAB_PANELS];

  const activeTab = tabs.findIndex(t => t.value === tab) || 0;

  if (user?.emailAddress === 'ani.badalyan@questionpro.com') {
    tabs.push({ label: 'Super admin', value: 'super-admin' });
    tabPanels.push({
      page: (
        <Suspense fallback={<BaseWuLoader />}>
          <SuperAdmin />
        </Suspense>
      ),
      value: 'super-admin',
    });
  }

  if (user?.superAdmin) {
    tabs.push({ label: 'Copy map', value: 'copy-map' }, { label: 'Ai model', value: 'ai-model' });
    tabPanels.push(
      {
        page: (
          <Suspense fallback={<BaseWuLoader />}>
            <CopyMap />
          </Suspense>
        ),
        value: 'copy-map',
      },
      {
        page: (
          <Suspense fallback={<BaseWuLoader />}>
            <AiModel />
          </Suspense>
        ),
        value: 'ai-model',
      },
    );
  }

  return (
    <div className={'h-full !pt-8 !px-16 !pb-[0]'}>
      <div data-testid="admin-title-test-id">
        <h3 className={'base-title !text-heading-2'}>{t('admin.title')}</h3>
      </div>
      <div className={'!mt-8'}>
        <BaseTabs
          tabs={tabs}
          tabPanels={tabPanels}
          setActiveTab={onSelectTab}
          defaultValue={activeTab}
          tab={tab}
        />
      </div>
    </div>
  );
};

export default AdminScreen;
