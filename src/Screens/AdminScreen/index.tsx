import { lazy, Suspense } from "react";
import "./style.scss";

import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { ADMIN_TABS } from "./constants";

import CustomLoader from "@/Components/Shared/CustomLoader";
import CustomTabs from "@/Components/Shared/CustomTabs";
import { AdminRoute } from "@/routes/_authenticated/_primary-sidebar-layout/admin";
import { ADMIN_TAB_PANELS } from "@/Screens/AdminScreen/constants.tsx";
import { useUserStore } from "@/store/user";
import { SearchParamsType } from "@/types";

const SuperAdmin = lazy(() => import("./components/SuperAdmin"));
const CopyMap = lazy(() => import("./components/CopyMap"));
const AiModel = lazy(() => import("./components/AiModel"));

const AdminScreen = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { tab } = AdminRoute.useSearch();
  const { user } = useUserStore();

  const onSelectTab = (tabValue: string) => {
    navigate({
      to: ".",
      search: (prev: SearchParamsType) => ({
        ...prev,
        tab: tabValue,
      }),
    }).then();
  };

  const tabs = [...ADMIN_TABS];
  const tabPanels = [...ADMIN_TAB_PANELS];

  if (user?.emailAddress === "ani.badalyan@questionpro.com") {
    tabs.push({ label: "Super admin", value: "super-admin" });
    tabPanels.push({
      page: (
        <Suspense fallback={<CustomLoader />}>
          <SuperAdmin />
        </Suspense>
      ),
      value: "super-admin",
    });
  }

  if (user?.superAdmin) {
    tabs.push(
      { label: "Copy map", value: "copy-map" },
      { label: "Ai model", value: "ai-model" },
    );
    tabPanels.push(
      {
        page: (
          <Suspense fallback={<CustomLoader />}>
            <CopyMap />
          </Suspense>
        ),
        value: "copy-map",
      },
      {
        page: (
          <Suspense fallback={<CustomLoader />}>
            <AiModel />
          </Suspense>
        ),
        value: "ai-model",
      },
    );
  }

  return (
    <div className={"h-full !pt-8 !px-16 !pb-[0]"}>
      <div data-testid="admin-title-test-id">
        <h3 className={"base-title !text-heading-2"}>{t("admin.title")}</h3>
      </div>
      <div className={"!mt-8"}>
        <CustomTabs
          tabValue={tab || "error-logs"}
          setTabValue={onSelectTab}
          showTabsBottomLine={true}
          activeColor={"#545E6B"}
          inactiveColor={"#9B9B9B"}
          tabsBottomBorderColor={"#D8D8D8"}
          tabs={tabs}
          tabPanels={tabPanels}
        />
      </div>
    </div>
  );
};

export default AdminScreen;
