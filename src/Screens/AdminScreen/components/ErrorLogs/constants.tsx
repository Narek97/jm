import dayjs from 'dayjs';

import { TableColumnOptionType, TableColumnType } from '@/types';

const ERROR_TABLE_COLUMNS = ({
  toggleDeleteModal,
}: TableColumnOptionType): Array<TableColumnType> => {
  return [
    {
      id: 'path',
      label: 'Path',
    },
    {
      id: 'message',
      label: 'Message',
    },
    {
      id: 'status',
      label: 'Status',
    },
    {
      id: 'updatedAt',
      label: 'Time',
      renderFunction: row => {
        return <>{dayjs(row.updatedAt)?.format('YYYY-MM-DD HH:mm:ss')}</>;
      },
    },
    {
      id: 'DeleteTable',
      label: <span className={'wm-delete'} data-testid={'error-logs-delete-btn'} />,
      onClick: toggleDeleteModal,
    },
  ];
};

export { ERROR_TABLE_COLUMNS };
