import dayjs from 'dayjs';

import { TableColumnType } from '@/types';

const USERS_TABLE_COLUMNS: Array<TableColumnType> = [
  {
    id: 'email',
    label: 'Email',
    renderFunction: row => {
      return <>{row.member.emailAddress}</>;
    },
  },
  {
    id: 'orgId',
    label: 'OrgId',
    renderFunction: row => {
      return <>{row.member.orgId}</>;
    },
  },
  {
    id: 'sessionCount',
    label: 'Session Count',
  },
  {
    id: 'createdAt',
    label: 'Last logged in',
    renderFunction: row => {
      return <>{dayjs(row.createdAt)?.format('YYYY-MM-DD HH:mm:ss')}</>;
    },
  },
];

export { USERS_TABLE_COLUMNS };
