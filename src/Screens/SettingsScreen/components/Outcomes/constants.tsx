import dayjs from 'dayjs';
import fromNow from 'dayjs/plugin/relativeTime';
import * as yup from 'yup';

import { OutcomesElementType } from './types';

import { MenuOptionsType, TableColumnType } from '@/types';

dayjs.extend(fromNow);

const OUTCOME_OPTIONS = ({
  onHandleDelete,
  onHandleEdit,
}: {
  onHandleEdit: (data?: any) => void;
  onHandleDelete: (data: any) => void;
  color?: string;
}): Array<MenuOptionsType> => {
  return [
    {
      icon: <span className={'wm-edit'} />,
      name: 'Edit',
      onClick: onHandleEdit,
    },
    {
      icon: <span className={'wm-delete'} />,
      name: 'Delete',
      onClick: onHandleDelete,
    },
  ];
};

const WORKSPACE_OUTCOMES_COLUMNS: Array<TableColumnType> = [
  {
    sortFieldName: 'ICON',
    id: 'icon',
    label: 'Icon',
    isAscDescSortable: false,
    renderFunction: ({ icon }) => (
      <div className={'outcome-icon'}>
        {icon && (
          <img
            src={icon}
            alt="icon"
            style={{
              width: '1.875rem',
              height: '1.875rem',
            }}
          />
        )}
      </div>
    ),
  },
  {
    sortFieldName: 'NAME',
    id: 'name',
    label: 'Title',
    isAscDescSortable: true,
    renderFunction: ({ name, pluralName }) => name + ' / ' + pluralName,
  },
  {
    sortFieldName: 'CREATED_BY',
    id: 'createdBy',
    label: 'Created by',
    isAscDescSortable: true,
    renderFunction: ({ user }) => user?.firstName + ' ' + user?.lastName,
  },
  {
    sortFieldName: 'CREATED_AT',
    id: 'createdAt',
    label: 'Date Created',
    isAscDescSortable: true,
    renderFunction: ({ createdAt }) => createdAt && dayjs(createdAt)?.format('MMM DD, YYYY'),
  },
  {
    id: 'operation',
    label: ' ',
  },
];

const OUTCOMES_VALIDATION_SCHEMA = yup
  .object()
  .shape({
    name: yup.string().required(`Singular name is required`),
    pluralName: yup.string().required(`Plural name is required`).max(50),
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

export { OUTCOME_OPTIONS, WORKSPACE_OUTCOMES_COLUMNS, OUTCOMES_VALIDATION_SCHEMA };
