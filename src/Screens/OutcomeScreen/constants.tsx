import dayjs from 'dayjs';
import * as yup from 'yup';

import { OutcomeGroupOutcomeType } from '@/Screens/OutcomeScreen/types.ts';
import { TableColumnOptionType } from '@/types';

const OUTCOME_TABLE_COLUMNS = ({
  onHandleRowEdit,
  onHandleRowDelete,
}: TableColumnOptionType<OutcomeGroupOutcomeType>) => [
  {
    accessorKey: 'title',
    header: 'Title',
    enableSorting: true,
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'mapName',
    header: 'Map Name',
    cell: ({ cell }: { cell: any }) => {
      return <>{cell.row.original.map.title} </>;
    },
  },
  {
    accessorKey: 'column',
    header: 'Stage Name',
    cell: ({ cell }: { cell: any }) => {
      return <>{cell.row.original.column.label}</>;
    },
  },
  {
    accessorKey: 'createdBy',
    header: 'Created by',
    enableSorting: true,
    cell: ({ cell }: { cell: any }) => {
      return <>{cell.row.original.user.firstName + ' / ' + cell.row.original.user.lastName} </>;
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Date Created',
    enableSorting: true,
    cell: ({ cell }: { cell: any }) => {
      return <>{dayjs(cell.row.original.createdAt)?.format('YYYY-MM-DD HH:mm:ss')}</>;
    },
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    cell: ({ cell }: { cell: any }) => {
      return (
        <div className={'flex justify-center gap-4'}>
          <span
            className={'wm-edit cursor-pointer'}
            onClick={() => onHandleRowEdit?.(cell.row.original)}
            style={{
              fontSize: '1rem',
            }}
          />
          <span className={'wm-delete'} onClick={() => onHandleRowDelete?.(cell.row.original)} />
        </div>
      );
    },
  },
];

const OUTCOME_VALIDATION_SCHEMA = yup
  .object()
  .shape({
    name: yup.string().required('Title is required'),
    description: yup.string().default(''),
    map: yup.number().nullable().default(null),
    stage: yup
      .number()
      .when('map', {
        is: (value: number) => value,
        then: () => yup.number().required(),
        otherwise: () => yup.number().nullable().default(null),
      })
      .nullable()
      .default(null),
    step: yup
      .number()
      .when('stage', {
        is: (value: number) => value,
        then: () => yup.number().required(),
        otherwise: () => yup.number().nullable().default(null),
      })
      .nullable()
      .default(null),
    persona: yup.number().required().nullable().default(null),
  })
  .required();

export { OUTCOME_TABLE_COLUMNS, OUTCOME_VALIDATION_SCHEMA };
