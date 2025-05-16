import dayjs from "dayjs";

import { TableColumnOptionType, TableColumnType } from "@/types";

const PERFORMANCE_LOGS_TABLE_COLUMNS = ({
  toggleDeleteModal,
}: TableColumnOptionType): Array<TableColumnType> => {
  return [
    {
      id: "path",
      label: "Path",
    },
    {
      id: "createdAt",
      label: "Date",
      renderFunction: (row) => (
        <>{dayjs(row.createdAt)?.format("YYYY-MM-DD HH:mm:ss")}</>
      ),
    },
    {
      id: "responseTime",
      label: "Response Time",
    },
    {
      id: "queryCount",
      label: "Query Count",
    },
    {
      id: "payloadSize",
      label: "Payload Size",
    },
    {
      id: "DeleteTable",
      label: (
        <span
          className={"wm-delete"}
          data-testid={"performance-logs-delete-btn"}
        />
      ),
      onClick: toggleDeleteModal,
    },
  ];
};

export { PERFORMANCE_LOGS_TABLE_COLUMNS };
