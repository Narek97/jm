import dayjs from 'dayjs';

const USERS_TABLE_COLUMNS = [
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ cell }: { cell: any }) => {
      return <>{cell.row.original.member.emailAddress}</>;
    },
  },
  {
    accessorKey: 'orgId',
    header: 'OrgId',
    cell: ({ cell }: { cell: any }) => {
      return <>{cell.row.original.member.orgId}</>;
    },
  },
  {
    accessorKey: 'sessionCount',
    header: 'Session Count',
  },
  {
    accessorKey: 'createdAt',
    header: 'Last logged in',
    cell: ({ cell }: { cell: any }) => {
      return <>{dayjs(cell.row.original.createdAt)?.format('YYYY-MM-DD HH:mm:ss')}</>;
    },
  },
];

export { USERS_TABLE_COLUMNS };
