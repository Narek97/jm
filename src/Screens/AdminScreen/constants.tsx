import { lazy, Suspense } from "react";

import CustomLoader from "@/Components/Shared/CustomLoader";
import { TabPanelType, TabType } from "@/types";

const ErrorLogs = lazy(() => import("./components/ErrorLogs"));
const PerformanceLogs = lazy(() => import("./components/PerformanceLogs"));
const Organizations = lazy(() => import("./components/Organizations"));

const ADMIN_TABS: TabType[] = [
  { label: "Error Logs", value: "error-logs" },
  { label: "Performance Logs", value: "performance-logs" },
  { label: "Organizations", value: "organizations" },
];

const ADMIN_TAB_PANELS: TabPanelType[] = [
  {
    page: (
      <Suspense fallback={<CustomLoader />}>
        <ErrorLogs />
      </Suspense>
    ),
    value: "error-logs",
  },
  {
    page: (
      <Suspense fallback={<CustomLoader />}>
        <PerformanceLogs />
      </Suspense>
    ),
    value: "performance-logs",
  },
  {
    page: (
      <Suspense fallback={<CustomLoader />}>
        <Organizations />
      </Suspense>
    ),
    value: "organizations",
  },
];

export { ADMIN_TABS, ADMIN_TAB_PANELS };
