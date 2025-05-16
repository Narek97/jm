import { lazy, Suspense } from "react";

import CustomLoader from "@/Components/Shared/CustomLoader";
import { TabPanelType, TabType } from "@/types";

const Outcomes = lazy(() => import("./components/Outcomes"));
const UserDebug = lazy(() => import("./components/UserDebug"));

const SETTINGS_TABS: TabType[] = [
  { label: "Outcomes", value: "outcomes" },
  { label: "User debug", value: "user-debug" },
];
const SETTINGS_TAB_PANELS: TabPanelType[] = [
  {
    page: (
      <Suspense fallback={<CustomLoader />}>
        <Outcomes />
      </Suspense>
    ),
    value: "outcomes",
  },
  {
    page: (
      <Suspense fallback={<CustomLoader />}>
        <UserDebug />
      </Suspense>
    ),
    value: "user-debug",
  },
];

export { SETTINGS_TABS, SETTINGS_TAB_PANELS };
