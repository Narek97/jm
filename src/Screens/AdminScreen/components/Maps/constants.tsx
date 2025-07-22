import dayjs from 'dayjs';

import { TableColumnType } from '@/types';

const MAPS_TABLE_COLUMNS: Array<TableColumnType> = [
  {
    id: 'title',
    label: 'Title',
  },
  {
    id: 'creator_email',
    label: 'Creator Email',
    renderFunction: row => {
      return <>{row.owner.emailAddress}</>;
    },
  },
  {
    id: 'orgId',
    label: 'OrgId',
    renderFunction: row => {
      return <>{row.owner.orgId}</>;
    },
  },
  {
    id: 'createdAt',
    label: 'Created at',
    renderFunction: row => {
      return <>{dayjs(row.createdAt)?.format('YYYY-MM-DD HH:mm:ss')}</>;
    },
  },
];

export { MAPS_TABLE_COLUMNS };
