import HighlightedText from '@/Components/Shared/HightlitedText';

const ORGS_TABLE_COLUMNS = (search: string, onHandleRowSelect: (orgId: number) => void) => {
  return [
    {
      accessorKey: 'orgId',
      header: 'OrgId',
      cell: ({ cell }: { cell: any }) => {
        return (
          <span
            className={'h-full flex items-center cursor-pointer'}
            onClick={() => onHandleRowSelect(cell.row.original.orgId)}>
            <HighlightedText name={cell.row.original.orgId.toString()} search={search} />
          </span>
        );
      },
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ cell }: { cell: any }) => {
        return (
          <span
            className={'h-full flex items-center cursor-pointer'}
            onClick={() => onHandleRowSelect(cell.row.original.orgId)}>
            <HighlightedText name={cell.row.original.name || ''} search={search} />
          </span>
        );
      },
    },
  ];
};

export { ORGS_TABLE_COLUMNS };
