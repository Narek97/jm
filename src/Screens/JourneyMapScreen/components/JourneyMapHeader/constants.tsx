import dayjs from 'dayjs';
import * as yup from 'yup';

import { MenuOptionsType } from '@/types';

const UPDATE_LAYER_VALIDATION_SCHEMA = yup
  .object({
    name: yup.string().required("Layer name can't be empty"),
    columnIds: yup
      .array()
      .of(yup.number().required('Column ID must be a number'))
      .min(1, 'At least one column ID is required')
      .required('Column IDs are required')
      .default([]),
    rowIds: yup
      .array()
      .of(yup.number().required('Row ID must be a number'))
      .min(1, 'At least one row ID is required')
      .required('Row IDs are required')
      .default([]),
    tagIds: yup.array().default([]),
    columnSelectedStepIds: yup.object().nullable().default(null),
    isBase: yup.boolean().default(false),
  })
  .required();

const PARENT_JOURNEY_MAPS_TABLE_COLUMNS = (
  onHandleClickRow: (id: number, title: string) => void,
) => [
  {
    accessorKey: 'title',
    header: <span>Journey map name</span>,
    enableSorting: true,
    cell: ({ cell }: { cell: any }) => {
      return (
        <span
          className={'h-full flex items-center cursor-pointer'}
          onClick={() => onHandleClickRow(cell.row.original.id, cell.row.original.title)}>
          {cell.row.original.title || 'Untitled'}
        </span>
      );
    },
  },
  {
    accessorKey: 'owner',
    header: 'Owner',
    enableSorting: true,
    cell: ({ cell }: { cell: any }) => {
      return (
        <span
          className={'h-full flex items-center cursor-pointer'}
          onClick={() => onHandleClickRow(cell.row.original.id, cell.row.original.title)}>
          {cell.row.original.owner.firstName} {cell.row.original.owner.lastName}
        </span>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created at',
    enableSorting: true,
    cell: ({ cell }: { cell: any }) => {
      return (
        <span
          className={'h-full flex items-center cursor-pointer'}
          onClick={() => onHandleClickRow(cell.row.original.id, cell.row.original.title)}>
          {dayjs(cell.row.original.createdAt)?.format('YYYY-MM-DD HH:mm:ss')}
        </span>
      );
    },
  },
  {
    accessorKey: 'updatedAt',
    header: 'Last update',
    enableSorting: true,
    cell: ({ cell }: { cell: any }) => {
      return (
        <span
          className={'h-full flex items-center cursor-pointer'}
          onClick={() => onHandleClickRow(cell.row.original.id, cell.row.original.title)}>
          {dayjs(cell.row.original.updatedAt)?.format('YYYY-MM-DD HH:mm:ss')}
        </span>
      );
    },
  },
];

const JOURNEY_MAP_VERSION_CARD_OPTIONS = ({
  onHandleEdit,
  onHandleRestore,
  onHandleDelete,
}: {
  onHandleEdit: () => void;
  onHandleRestore: () => void;
  onHandleDelete: () => void;
}): Array<MenuOptionsType> => {
  return [
    {
      icon: <span className={'wm-edit'} />,
      name: 'Edit',
      onClick: onHandleEdit,
    },
    {
      icon: <span className={'wm-device-reset'} />,
      name: 'Restore',
      onClick: onHandleRestore,
    },
    {
      icon: <span className={'wm-delete'} />,
      name: 'Delete',
      onClick: onHandleDelete,
    },
  ];
};

export const UNSELECT_ICON = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="#1B87E6" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <rect x="7" y="10.5" width="10" height="3" rx="1" fill="white" />
  </svg>
);

export {
  UPDATE_LAYER_VALIDATION_SCHEMA,
  PARENT_JOURNEY_MAPS_TABLE_COLUMNS,
  JOURNEY_MAP_VERSION_CARD_OPTIONS,
};
