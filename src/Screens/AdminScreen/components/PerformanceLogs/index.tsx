import { useCallback, useMemo, useState } from 'react';
import './style.scss';

import {
  GetPerformanceLogsQuery,
  useGetPerformanceLogsQuery,
} from '@/api/queries/generated/getPerformance.generated.ts';
import BaseWuDataTable from '@/Components/Shared/BaseWuDataTable';
import CustomError from '@/Components/Shared/CustomError';
import EmptyDataInfo from '@/Components/Shared/EmptyDataInfo';
import { PERFORMANCE_LOGS_LIMIT } from '@/Constants/pagination.ts';
import PerformanceLogsDeleteModal from '@/Screens/AdminScreen/components/PerformanceLogs/components/PerformanceLogsDeleteModal';
import PerformanceLogsQueryModal from '@/Screens/AdminScreen/components/PerformanceLogs/components/PerformanceLogsQueryModal';
import { PERFORMANCE_LOGS_TABLE_COLUMNS } from '@/Screens/AdminScreen/components/PerformanceLogs/constants.tsx';
import { PerformanceLogsType } from '@/Screens/AdminScreen/components/PerformanceLogs/types.ts';

const PerformanceLogs = () => {
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);
  const [isOpenQueriesModal, setIsOpenQueriesModal] = useState<boolean>(false);
  const [selectedItemQueries, setSelectedItemQueries] = useState<Array<string>>([]);

  const { isLoading, error, data } = useGetPerformanceLogsQuery<GetPerformanceLogsQuery, Error>({
    paginationInput: {
      limit: PERFORMANCE_LOGS_LIMIT,
      offset: 0,
    },
  });

  const performanceLogs = useMemo(
    () => data?.getPerformanceLogs.performanceLogs || [],
    [data?.getPerformanceLogs.performanceLogs],
  );

  const toggleDeleteModal = useCallback(() => {
    setIsOpenDeleteModal(prev => !prev);
  }, []);

  const toggleQueriesModal = useCallback((queries?: Array<string>) => {
    if (queries) {
      setSelectedItemQueries(queries);
    } else {
      setSelectedItemQueries([]);
    }
    setIsOpenQueriesModal(prev => !prev);
  }, []);

  const onHandleRowClick = useCallback(
    (performanceLogItem: PerformanceLogsType) => {
      toggleQueriesModal(performanceLogItem?.sqlRowQueries || ['']);
    },
    [toggleQueriesModal],
  );

  const columns = useMemo(() => {
    return PERFORMANCE_LOGS_TABLE_COLUMNS({
      onHandleRowDelete: toggleDeleteModal,
      onHandleRowClick,
    });
  }, [toggleDeleteModal, onHandleRowClick]);

  if (error) {
    return <CustomError error={error?.message} />;
  }

  if (!isLoading && !performanceLogs.length) {
    return <EmptyDataInfo message={'There are no performance logs'} />;
  }

  return (
    <div className={`performance-logs`}>
      {isOpenDeleteModal && (
        <PerformanceLogsDeleteModal handleClose={toggleDeleteModal} isOpen={isOpenDeleteModal} />
      )}
      {isOpenQueriesModal && (
        <PerformanceLogsQueryModal
          queries={selectedItemQueries}
          isOpen={isOpenQueriesModal}
          handleClose={toggleQueriesModal}
        />
      )}

      <BaseWuDataTable isLoading={isLoading} columns={columns} data={performanceLogs} />
    </div>
  );
};

export default PerformanceLogs;
