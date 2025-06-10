import { ReactNode } from 'react';

import dayjs from 'dayjs';

import { TableColumnType } from '@/types';

export const formatCellValue = (column: TableColumnType, row: any, value: any): ReactNode => {
  if (column?.renderFunction) {
    return column.renderFunction(row);
  }

  if (['created date', 'updated date'].includes(String(column.label))) {
    return dayjs(value as string).format('DD-MM-YYYY');
  }

  return value;
};
