import dayjs from 'dayjs';
import * as yup from 'yup';

import { OutcomeGroupType } from '@/Screens/OutcomeScreen/types.ts';
import { MenuOptionsType, TableColumnType } from '@/types';

const OUTCOME_OPTIONS = ({
  onHandleDelete,
  onHandleEdit,
}: {
  onHandleEdit: (data: OutcomeGroupType) => void;
  onHandleDelete: (data: OutcomeGroupType) => void;
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

const OUTCOME_TABLE_COLUMNS: Array<TableColumnType> = [
  {
    sortFieldName: 'TITLE',
    id: 'title',
    label: 'Title',
    isAscDescSortable: true,
  },
  {
    id: 'status',
    label: 'Status',
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
    id: 'mapName',
    label: 'Map Name',
    renderFunction: ({ map }) => map?.title,
  },
  {
    id: 'column',
    label: 'Stage Name',
    renderFunction: ({ column }) => {
      return column?.label;
    },
  },
  {
    id: 'operation',
    label: ' ',
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

export { OUTCOME_OPTIONS, OUTCOME_TABLE_COLUMNS, OUTCOME_VALIDATION_SCHEMA };
