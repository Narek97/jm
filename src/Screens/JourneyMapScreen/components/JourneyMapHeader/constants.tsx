import * as yup from 'yup';

import { LayerType } from '@/Screens/JourneyMapScreen/types.ts';
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

const LAYER_ITEM_OPTIONS = ({
  onHandleDelete,
}: {
  onHandleDelete: (data: LayerType) => void;
}): Array<MenuOptionsType> => {
  return [
    {
      icon: <span className={'wm-delete'} />,
      name: 'Delete',
      onClick: onHandleDelete,
    },
  ];
};

export { UPDATE_LAYER_VALIDATION_SCHEMA, LAYER_ITEM_OPTIONS };
