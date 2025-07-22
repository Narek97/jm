import { lazy, Suspense, useCallback, useMemo, useState } from 'react';

import {
  GetErrorLogsQuery,
  useGetErrorLogsQuery,
} from '@/api/queries/generated/getErrorLogs.generated.ts';
import { ErrorLog } from '@/api/types.ts';
import CustomError from '@/Components/Shared/CustomError';
import CustomTable from '@/Components/Shared/CustomTable';
import EmptyDataInfo from '@/Components/Shared/EmptyDataInfo';
import Pagination from '@/Components/Shared/Pagination';
import WuBaseLoader from '@/Components/Shared/WuBaseLoader';
import { querySlateTime } from '@/Constants';
import { ERROR_LOGS_LIMIT } from '@/Constants/pagination';
import { ERROR_TABLE_COLUMNS } from '@/Screens/AdminScreen/components/ErrorLogs/constants.tsx';

const ErrorLogDeleteModal = lazy(() => import('./components/ErrorLogDeleteModal'));

const ErrorLogs = () => {
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const offset = (currentPage - 1) * ERROR_LOGS_LIMIT;

  const { isLoading, error, data } = useGetErrorLogsQuery<GetErrorLogsQuery, Error>(
    {
      paginationInput: {
        limit: ERROR_LOGS_LIMIT,
        offset,
      },
    },
    {
      staleTime: querySlateTime * 10,
    },
  );

  const logsData = useMemo(
    () => (data?.getErrorLogs.errorLogs as Array<ErrorLog>) || [],
    [data?.getErrorLogs.errorLogs],
  );

  const logsDataCount: number = data?.getErrorLogs.count || 0;

  const toggleDeleteModal = useCallback(() => {
    setIsOpenDeleteModal(prev => !prev);
  }, []);

  const columns = useMemo(() => ERROR_TABLE_COLUMNS({ toggleDeleteModal }), [toggleDeleteModal]);

  const onHandleChangePage = useCallback((newPage: number) => {
    setCurrentPage(newPage);
  }, []);

  if (error) {
    return <CustomError error={error?.message} />;
  }

  if (!isLoading && !logsData.length) {
    return <EmptyDataInfo message={'There are no error logs'} />;
  }

  return (
    <div className={`error-logs ${logsDataCount > ERROR_LOGS_LIMIT ? 'with-pagination' : ''}`}>
      {isOpenDeleteModal && (
        <Suspense fallback={''}>
          <ErrorLogDeleteModal handleClose={toggleDeleteModal} isOpen={isOpenDeleteModal} />
        </Suspense>
      )}
      {logsDataCount > ERROR_LOGS_LIMIT && (
        <div className="logs-pagination">
          <Pagination
            perPage={ERROR_LOGS_LIMIT}
            currentPage={currentPage}
            allCount={logsDataCount}
            changePage={onHandleChangePage}
          />
        </div>
      )}
      {isLoading && <WuBaseLoader />}
      {!isLoading && <CustomTable isTableHead={true} rows={logsData} columns={columns} />}
    </div>
  );
};

export default ErrorLogs;
