import dayjs from 'dayjs';
import fromNow from 'dayjs/plugin/relativeTime';
import * as yup from 'yup';

import { OrderByEnum, OutcomeGroup, OutcomeGroupSortByEnum } from '@/api/types.ts';
import { OutcomesElementType } from '@/Screens/SettingsScreen/components/Outcomes/types.ts';
import { TableColumnOptionType } from '@/types';

dayjs.extend(fromNow);

const DEFAULT_OUTCOMES = ['Opportunities', 'Solutions', 'Actions'];

const WORKSPACE_OUTCOMES_COLUMNS = ({
  onHandleRowEdit,
  onHandleRowDelete,
}: TableColumnOptionType<OutcomeGroup>) => [
  {
    accessorKey: 'icon',
    header: 'Icon',
    cell: ({ cell }: { cell: any }) => {
      return (
        <>
          <div className={'outcome-icon'}>
            {cell.row.original.icon && (
              <img
                src={cell.row.original.icon}
                alt="icon"
                style={{
                  minWidth: '1.875rem',
                  width: '1.875rem',
                  height: '1.875rem',
                }}
              />
            )}
          </div>
        </>
      );
    },
  },
  {
    accessorKey: 'name',
    header: 'Title',
    enableSorting: true,
    cell: ({ cell }: { cell: any }) => {
      return <>{cell.row.original.name + ' / ' + cell.row.original.pluralName} </>;
    },
  },
  {
    accessorKey: 'createdBy',
    header: 'Created by',
    enableSorting: true,
    cell: ({ cell }: { cell: any }) => {
      return (
        <>
          {cell.row.original.user
            ? cell.row.original.user.firstName + ' / ' + cell.row.original.user.lastName
            : 'default'}{' '}
        </>
      );
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
    id: 'actions',
    header: 'Actions',
    cell: ({ cell }: { cell: any }) => {
      return DEFAULT_OUTCOMES.includes(cell.row.original.pluralName) ? null : (
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

const OUTCOMES_VALIDATION_SCHEMA = yup
  .object()
  .shape({
    name: yup
      .string()
      .transform(value => value?.trim())
      .required(`Singular name is required`),
    pluralName: yup
      .string()
      .transform(value => value?.trim())
      .required(`Plural name is required`)
      .max(50),
  })
  .required();

export const OUTCOMES_FORM_ELEMENTS: Array<OutcomesElementType> = [
  {
    name: 'name',
    title: 'Singular',
    placeholder: 'Singular Name',
    type: 'sting',
  },
  {
    name: 'pluralName',
    title: 'Plural',
    placeholder: 'Plural Name',
    type: 'sting',
  },
];

export const DEFAULT_GET_OUTCOMES_PARAMS = {
  sortBy: OutcomeGroupSortByEnum.createdBy,
  orderBy: OrderByEnum.Desc,
};

export { WORKSPACE_OUTCOMES_COLUMNS, OUTCOMES_VALIDATION_SCHEMA };
