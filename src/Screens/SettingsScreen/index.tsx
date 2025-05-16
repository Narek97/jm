import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import CustomTabs from "@/Components/Shared/CustomTabs";
import { SettingsRoute } from "@/routes/_authenticated/_primary-sidebar-layout/settings";
import {
  SETTINGS_TAB_PANELS,
  SETTINGS_TABS,
} from "@/Screens/SettingsScreen/constants.tsx";
import { SearchParamsType } from "@/types";

const SettingsScreen = () => {
  const { t } = useTranslation();
  const { tab } = SettingsRoute.useSearch();
  const navigate = useNavigate();

  const onSelectTab = (tabValue: string) => {
    navigate({
      to: ".",
      search: (prev: SearchParamsType) => ({
        ...prev,
        tab: tabValue,
      }),
    }).then();
  };

  return (
    <div className={"h-full !pt-8 !px-16 !pb-[0]"}>
      <div data-testid="settings-title-test-id">
        <h3 className={"base-title !text-heading-2"}>{t("settings.title")}</h3>
      </div>
      <div className={"!mt-8"}>
        <CustomTabs
          tabValue={tab || "outcomes"}
          setTabValue={onSelectTab}
          showTabsBottomLine={true}
          activeColor={"#545E6B"}
          inactiveColor={"#9B9B9B"}
          tabsBottomBorderColor={"#D8D8D8"}
          tabs={SETTINGS_TABS}
          tabPanels={SETTINGS_TAB_PANELS}
        />
      </div>
    </div>
  );
};

export default SettingsScreen;
