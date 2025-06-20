import Checkbox from '@mui/material/Checkbox';
import dayjs from 'dayjs';
import fromNow from 'dayjs/plugin/relativeTime';

import { JourneyType } from '@/Screens/JourniesScreen/types.ts';
import { MenuOptionsType, TableColumnOptionType, TableColumnType } from '@/types';

dayjs.extend(fromNow);

const JOURNEYS_VIEW_TABS = [
  { iconClassName: 'wm-grid-view', name: 'grid', tooltipContent: 'Board View' },
  { iconClassName: 'wm-view-list', name: 'list', tooltipContent: 'List View' },
  { iconClassName: 'wc-hierarchy', name: 'atlas', tooltipContent: 'Tree View' },
];

const JOURNEY_MAPS_TABLE_COLUMNS = ({
  onHandleRowClick,
  toggleDeleteModal,
  checkedItemsCount,
}: TableColumnOptionType): Array<TableColumnType> => [
  {
    id: 'checkbox',
    label: (
      <Checkbox
        checked={!!checkedItemsCount}
        onChange={() => onHandleRowClick && onHandleRowClick(0, 'checkAll')}
      />
    ),
    style: {
      '.custom-table--header-head': {
        backgroundColor: checkedItemsCount ? '#404040' : '',
      },
    },
    renderFunction: row => {
      return (
        <div>
          <Checkbox
            checked={!!row.checked}
            onChange={() => onHandleRowClick && onHandleRowClick(row.id, 'checkbox')}
          />
        </div>
      );
    },
  },

  {
    sortFieldName: 'title',
    id: 'title',
    label: (
      <>
        {checkedItemsCount ? (
          <span
            style={{
              color: '#ffffff',
            }}>
            {checkedItemsCount} selected
          </span>
        ) : (
          <span>Journey map name</span>
        )}
      </>
    ),
    isAscDescSortable: true,
    style: {
      '.custom-table--header-head': {
        backgroundColor: checkedItemsCount ? '#404040' : '',
      },
      '.custom-table--header-item-sort': {
        visibility: checkedItemsCount ? 'hidden' : 'visible',
      },
    },
    renderFunction: row => {
      return (
        <div
          className={'table-title-column'}
          onClick={() => onHandleRowClick && onHandleRowClick(row.id, 'title')}>
          {!!row?.parentMaps?.length && <span className={'wc-level-child'} />}
          <span>{row.title.trim() || 'Untitled'}</span>
        </div>
      );
    },
  },
  {
    sortFieldName: 'parent',
    id: 'parent',
    label: 'Parent',
    isAscDescSortable: true,
    style: {
      '.custom-table--header-head': {
        backgroundColor: checkedItemsCount ? '#404040' : '',
      },
      '.custom-table--header-item, .custom-table--header-item-sort': {
        visibility: checkedItemsCount ? 'hidden' : 'visible',
      },
    },
    renderFunction: row => {
      return <div>{(row.parentMaps?.length && row.parentMaps[0].parentMap?.title) || 'None'}</div>;
    },
  },
  {
    sortFieldName: 'emailAddress',
    id: 'emailAddress',
    label: 'Owner',
    isAscDescSortable: true,
    style: {
      '.custom-table--header-head': {
        backgroundColor: checkedItemsCount ? '#404040' : '',
      },
      '.custom-table--header-item, .custom-table--header-item-sort': {
        visibility: checkedItemsCount ? 'hidden' : 'visible',
      },
    },
    renderFunction: row => {
      return <div>{row.owner.emailAddress}</div>;
    },
  },
  {
    sortFieldName: 'createdAt',
    id: 'createdAt',
    label: 'Created at',
    isAscDescSortable: true,
    style: {
      '.custom-table--header-head': {
        backgroundColor: checkedItemsCount ? '#404040' : '',
      },
      '.custom-table--header-item, .custom-table--header-item-sort': {
        visibility: checkedItemsCount ? 'hidden' : 'visible',
      },
    },
    renderFunction: row => {
      return <div>{dayjs(row.createdAt).format('MMM D YYYY')}</div>;
    },
  },
  {
    sortFieldName: 'updatedAt',
    id: 'updatedAt',
    label: 'Last update',
    isAscDescSortable: true,
    style: {
      '.custom-table--header-head': {
        backgroundColor: checkedItemsCount ? '#404040' : '',
      },
      '.custom-table--header-item, .custom-table--header-item-sort': {
        visibility: checkedItemsCount ? 'hidden' : 'visible',
      },
    },
    renderFunction: row => {
      return <div>{dayjs(row.updatedAt).format('MMM D YYYY')}</div>;
    },
  },
  {
    id: 'operation',
    label: checkedItemsCount ? (
      <span className={'wm-delete'} data-testid={'error-logs-delete-btn'} />
    ) : (
      ''
    ),
    style: {
      '.custom-table--header-head': {
        justifyContent: 'flex-end',
        backgroundColor: checkedItemsCount ? '#404040' : '',
      },
    },
    onClick: toggleDeleteModal,
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
