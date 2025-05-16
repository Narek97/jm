import { useCallback, useMemo, useState } from "react";

import { Box } from "@mui/material";

import {
  GetPerformanceLogsQuery,
  useGetPerformanceLogsQuery,
} from "@/api/infinite-queries/generated/getPerformance.generated";
import { PerformanceLog } from "@/api/types.ts";
import CustomError from "@/Components/Shared/CustomError";
import CustomLoader from "@/Components/Shared/CustomLoader";
import CustomTable from "@/Components/Shared/CustomTable";
import EmptyDataInfo from "@/Components/Shared/EmptyDataInfo";
import Pagination from "@/Components/Shared/Pagination";
import { querySlateTime } from "@/constants";
import { PERFORMANCE_LOGS_LIMIT } from "@/constants/pagination.ts";
import PerformanceLogsDeleteModal from "@/Screens/AdminScreen/components/PerformanceLogs/components/PerformanceLogsDeleteModal";
import PerformanceLogsQueryModal from "@/Screens/AdminScreen/components/PerformanceLogs/components/PerformanceLogsQueryModal";
import { PERFORMANCE_LOGS_TABLE_COLUMNS } from "@/Screens/AdminScreen/components/PerformanceLogs/constants.tsx";

const PerformanceLogs = () => {
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);
  const [isOpenQueriesModal, setIsOpenQueriesModal] = useState<boolean>(false);
  const [selectedItemQueries, setSelectedItemQueries] = useState<Array<string>>(
    [],
  );
  const [currentPage, setCurrentPage] = useState<number>(1);

  const offset = (currentPage - 1) * PERFORMANCE_LOGS_LIMIT;

  const { isLoading, error, data } = useGetPerformanceLogsQuery<
    GetPerformanceLogsQuery,
    Error
  >(
    {
      paginationInput: {
        limit: PERFORMANCE_LOGS_LIMIT,
        offset,
      },
    },
    {
      staleTime: querySlateTime * 10,
    },
  );

  const performanceLogs: Array<
    Pick<
      PerformanceLog,
      | "id"
      | "path"
      | "createdAt"
      | "responseTime"
      | "queryCount"
      | "sqlRowQueries"
      | "payloadSize"
    >
  > = useMemo(
    () => data?.getPerformanceLogs.performanceLogs || [],
    [data?.getPerformanceLogs.performanceLogs],
  );

  const performanceLogsCount: number = data?.getPerformanceLogs.count || 0;

  const toggleDeleteModal = useCallback(() => {
    setIsOpenDeleteModal((prev) => !prev);
  }, []);

  const toggleQueriesModal = useCallback((queries?: Array<string>) => {
    if (queries) {
      setSelectedItemQueries(queries);
    } else {
      setSelectedItemQueries([]);
    }
    setIsOpenQueriesModal((prev) => !prev);
  }, []);

  const onHandleChangePage = useCallback((newPage: number) => {
    setCurrentPage(newPage);
  }, []);

  const onHandleClickRow = useCallback(
    (performanceLogItem: PerformanceLog) => {
      toggleQueriesModal(performanceLogItem?.sqlRowQueries || [""]);
    },
    [toggleQueriesModal],
  );

  const columns = useMemo(() => {
    return PERFORMANCE_LOGS_TABLE_COLUMNS({ toggleDeleteModal });
  }, [toggleDeleteModal]);

  if (error) {
    return <CustomError error={error?.message} />;
  }

  if (!isLoading && !performanceLogs.length) {
    return (
      <EmptyDataInfo icon={<Box />} message={"There are no performance logs"} />
    );
  }

  return (
    <div
      className={`performance-logs ${performanceLogsCount > PERFORMANCE_LOGS_LIMIT ? "with-pagination" : ""}`}
    >
      {performanceLogsCount > PERFORMANCE_LOGS_LIMIT && (
        <div className="logs-pagination">
          <Pagination
            perPage={PERFORMANCE_LOGS_LIMIT}
            currentPage={currentPage}
            allCount={performanceLogsCount}
            changePage={onHandleChangePage}
          />
        </div>
      )}
      {isLoading && <CustomLoader />}
      {isOpenDeleteModal && (
        <PerformanceLogsDeleteModal
          handleClose={toggleDeleteModal}
          isOpen={isOpenDeleteModal}
        />
      )}
      {isOpenQueriesModal && (
        <PerformanceLogsQueryModal
          queries={selectedItemQueries}
          isOpen={isOpenQueriesModal}
          handleClose={toggleQueriesModal}
        />
      )}

      {!isLoading && (
        <CustomTable
          isTableHead={true}
          rows={performanceLogs}
          columns={columns}
          onClickRow={onHandleClickRow}
        />
      )}
    </div>
  );
};

export default PerformanceLogs;
