import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import BaseTabs from '@/Components/Shared/BaseTabs';
import { SettingsRoute } from '@/routes/_authenticated/_primary-sidebar-layout/settings';
import { SETTINGS_TAB_PANELS, SETTINGS_TABS } from '@/Screens/SettingsScreen/constants.tsx';
import { SearchParamsType, TabType } from '@/types';

interface SettingsSearchParams {
  tab?: string;
}

const SettingsScreen = () => {
  const { t } = useTranslation();
  const { tab = 'outcomes' } = SettingsRoute.useSearch() as SettingsSearchParams;
  const navigate = useNavigate();

  const activeTab = SETTINGS_TABS.findIndex(t => t.value === tab) || 0;

  const onSelectTab = (tab: TabType) => {
    navigate({
      to: '.',
      search: (prev: SearchParamsType) => ({
        ...prev,
        tab: tab.value,
      }),
    }).then();
  };

  return (
    <div className={'h-full !pt-8 !px-16 !pb-[0]'}>
      <div data-testid="settings-title-test-id">
        <h3 className={'base-title !text-heading-2'}>{t('settings.title')}</h3>
      </div>
      <div className={'!mt-8'}>
        <BaseTabs
          tabs={SETTINGS_TABS}
          tabPanels={SETTINGS_TAB_PANELS}
          setActiveTab={onSelectTab}
          defaultValue={activeTab}
          tab={tab}
        />
      </div>
    </div>
  );
};

export default SettingsScreen;
