import dayjs from 'dayjs';

import { PerformanceLogsType } from '@/Screens/AdminScreen/components/PerformanceLogs/types.ts';
import { TableColumnOptionType } from '@/types';

const ERROR_TABLE_COLUMNS = ({ onHandleRowDelete }: TableColumnOptionType<PerformanceLogsType>) => {
  return [
    {
      accessorKey: 'path',
      header: 'Path',
    },
    {
      accessorKey: 'message',
      header: 'Message',
    },
    {
      accessorKey: 'status',
      header: 'Status',
    },
    {
      accessorKey: 'updatedAt',
      header: 'Time',
      cell: ({ cell }: { cell: any }) => {
        return <>{dayjs(cell.row.original.updatedAt)?.format('YYYY-MM-DD HH:mm:ss')}</>;
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

export { ERROR_TABLE_COLUMNS };
