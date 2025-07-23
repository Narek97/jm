import dayjs from 'dayjs';
import fromNow from 'dayjs/plugin/relativeTime';

import { JourneyType } from '@/Screens/JourniesScreen/types.ts';
import { MenuOptionsType, TableColumnOptionType } from '@/types';

dayjs.extend(fromNow);

const JOURNEYS_VIEW_TABS = [
  { iconClassName: 'wm-grid-view', name: 'grid', tooltipContent: 'Board View' },
  { iconClassName: 'wm-view-list', name: 'list', tooltipContent: 'List View' },
  { iconClassName: 'wc-hierarchy', name: 'atlas', tooltipContent: 'Tree View' },
];

const JOURNEY_MAPS_TABLE_COLUMNS = ({
  onHandleRowDelete,
  onHandleCopy,
  onHandleCopyShareUrl,
}: TableColumnOptionType<JourneyType>) => [
  {
    accessorKey: 'title',
    header: 'Journey map name',
    enableSorting: true,
    cell: ({ cell }: { cell: any }) => {
      return <span>{cell.row.original.title.trim() || 'Untitled'}</span>;
    },
  },
  {
    accessorKey: 'parent',
    header: 'Parent',
    enableSorting: true,
    cell: ({ cell }: { cell: any }) => {
      return (
        <>
          {(cell.row.original.parentMaps?.length &&
            cell.row.original.parentMaps[0].parentMap?.title) ||
            'None'}
        </>
      );
    },
  },
  {
    accessorKey: 'emailAddress',
    header: 'Owner',
    enableSorting: true,
    cell: ({ cell }: { cell: any }) => {
      return <>{cell.row.original.owner.emailAddress}</>;
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created at',
    enableSorting: true,
    cell: ({ cell }: { cell: any }) => {
      return <>{dayjs(cell.row.original.createdAt)?.format('YYYY-MM-DD HH:mm:ss')}</>;
    },
  },
  {
    accessorKey: 'updatedAt',
    header: 'Last update',
    enableSorting: true,
    cell: ({ cell }: { cell: any }) => {
      return <>{dayjs(cell.row.original.updatedAt)?.format('YYYY-MM-DD HH:mm:ss')}</>;
    },
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    cell: ({ cell }: { cell: any }) => {
      return (
        <div className={'flex justify-center gap-4'}>
          <span
            className={'wm-content-copy cursor-pointer'}
            style={{
              fontSize: '1rem',
            }}
            onClick={() => onHandleCopy?.(cell.row.original)}
          />
          <span
            className={'wm-share-windows cursor-pointer'}
            style={{
              fontSize: '1rem',
            }}
            onClick={() => onHandleCopyShareUrl?.(cell.row.original)}
          />
          <span className={'wm-delete'} onClick={() => onHandleRowDelete?.(cell.row.original)} />
        </div>
      );
    },
  },
];

const JOURNEY_MAP_OPTIONS = ({
  onHandleDelete,
  onHandleCopyShareUrl,
  onHandleCopy,
}: {
  onHandleDelete: (journey: JourneyType) => void;
  onHandleCopyShareUrl: (journey: JourneyType) => void;
  onHandleCopy: (journey: JourneyType) => void;
}): Array<MenuOptionsType> => {
  return [
    {
      icon: <span className={'wm-content-copy'} />,
      name: 'Copy',
      onClick: onHandleCopy,
    },
    {
      icon: <span className={'wm-share-windows'} />,
      name: 'Share',
      onClick: onHandleCopyShareUrl,
    },
    {
      icon: <span className={'wm-delete'} />,
      name: 'Delete',
      onClick: item => onHandleDelete(item),
    },
  ];
};

export { JOURNEYS_VIEW_TABS, JOURNEY_MAPS_TABLE_COLUMNS, JOURNEY_MAP_OPTIONS };
