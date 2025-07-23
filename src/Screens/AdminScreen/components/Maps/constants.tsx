import dayjs from 'dayjs';

const MAPS_TABLE_COLUMNS = [
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ cell }: { cell: any }) => {
      return <>{cell.getValue() || 'Untitled'}</>;
    },
  },
  {
    accessorKey: 'creator_email',
    header: 'Creator Email',
    cell: ({ cell }: { cell: any }) => {
      return <>{cell.row.original.owner.emailAddress}</>;
    },
  },
  {
    accessorKey: 'orgId',
    header: 'OrgId',
    cell: ({ cell }: { cell: any }) => {
      return <>{cell.row.original.owner.orgId}</>;
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created at',
    cell: ({ cell }: { cell: any }) => {
      return <>{dayjs(cell.row.original.createdAt)?.format('YYYY-MM-DD HH:mm:ss')}</>;
    },
  },
];

export { MAPS_TABLE_COLUMNS };
