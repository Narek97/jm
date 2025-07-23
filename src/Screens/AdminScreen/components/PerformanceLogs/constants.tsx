import dayjs from 'dayjs';

import { PerformanceLogsType } from '@/Screens/AdminScreen/components/PerformanceLogs/types.ts';
import { TableColumnOptionType } from '@/types';

const getStyle = (value: number | string) => {
  let className = 'inline-block min-w-[3.75rem] w-auto rounded-sm text-center ';
  if (+value <= 1) {
    className += 'bg-[#51b87a]';
  }
  if (+value > 1 && +value <= 10) {
    className += 'bg-[#ffa04a]';
  }
  if (+value > 10) {
    className += 'bg-[#e53251]';
  }
  return className;
};

const PERFORMANCE_LOGS_TABLE_COLUMNS = ({
  onHandleRowDelete,
}: TableColumnOptionType<PerformanceLogsType>) => {
  return [
    {
      accessorKey: 'path',
      header: 'Path',
    },
    {
      accessorKey: 'createdAt',
      header: 'Date',
      cell: ({ cell }: { cell: any }) => {
        return <>{dayjs(cell.row.original.createdAt)?.format('YYYY-MM-DD HH:mm:ss')}</>;
      },
    },
    {
      accessorKey: 'responseTime',
      header: 'Response Time',
    },
    {
      accessorKey: 'queryCount',
      header: 'Query Count',
    },
    {
      accessorKey: 'payloadSize',
      header: 'Payload Size',
      cell: ({ cell }: { cell: any }) => {
        return (
          <div className={`custom-table--${cell.id} ${getStyle(cell.getValue() || 0)}`}>
            {cell.getValue()}
          </div>
        );
      },
    },
    {
      accessorKey: 'delete',
      header: (
        <div className={'text-center'}>
          <span
            className={'wm-delete'}
            data-testid={'error-logs-delete-btn'}
            onClick={() => onHandleRowDelete?.()}
          />
        </div>
      ),
    },
  ];
};

export { PERFORMANCE_LOGS_TABLE_COLUMNS };
