import dayjs from 'dayjs';
import * as yup from 'yup';

import { MetricsDateRangeEnum, MetricsSourceEnum, MetricsTypeEnum } from '@/api/types.ts';
import CustomDatePicker from '@/Components/Shared/CustomDatePicker';
import { NPSDataPointElementType } from '@/Screens/JourneyMapScreen/components/JourneyMapRows/RowItems/Metrics/types.ts';
import {
  DropdownSelectItemType,
  MenuOptionsType,
  TableColumnOptionType,
  TableColumnType,
} from '@/types';
import { isValidNumberFormat } from '@/utils/isValidNumberFormat.ts';

const METRICS_DEFAULT_DATA = {
  name: '',
  descriptionEnabled: false,
  description: '',
  source: undefined,
  dateRange: undefined,
  type: MetricsTypeEnum.Nps,
  survey: null,
  question: null,
  goal: 0,
};

const NPS_TEMPLATE = [
  { Date: new Date(), Detractor: 0, Passive: 0, Promoter: 0 },
  { Date: new Date(), Detractor: 0, Passive: 0, Promoter: 0 },
  { Date: new Date(), Detractor: 0, Passive: 0, Promoter: 0 },
  { Date: new Date(), Detractor: 0, Passive: 0, Promoter: 0 },
  { Date: new Date(), Detractor: 0, Passive: 0, Promoter: 0 },
];

const CSAT_TEMPLATE = [
  { Date: new Date(), Satisfied: 0, Neutral: 0, Dissatisfied: 0 },
  { Date: new Date(), Satisfied: 0, Neutral: 0, Dissatisfied: 0 },
  { Date: new Date(), Satisfied: 0, Neutral: 0, Dissatisfied: 0 },
  { Date: new Date(), Satisfied: 0, Neutral: 0, Dissatisfied: 0 },
  { Date: new Date(), Satisfied: 0, Neutral: 0, Dissatisfied: 0 },
];

const CES_TEMPLATE = [
  { Date: new Date(), Easy: 0, Neutral: 0, Difficult: 0 },
  { Date: new Date(), Easy: 0, Neutral: 0, Difficult: 0 },
  { Date: new Date(), Easy: 0, Neutral: 0, Difficult: 0 },
  { Date: new Date(), Easy: 0, Neutral: 0, Difficult: 0 },
  { Date: new Date(), Easy: 0, Neutral: 0, Difficult: 0 },
];

const JOURNEY_MAP_METRICS_OPTIONS = ({
  onHandleEdit,
  onHandleDelete,
}: {
  onHandleEdit: () => void;
  onHandleDelete: () => void;
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

const METRICS_DATA_POINT_EXEL_OPTIONS = ({
  onHandleDelete,
}: {
  onHandleDelete: (data: { id: string | number }) => void;
}): Array<MenuOptionsType> => {
  return [
    {
      icon: <span className={'wm-delete'} />,
      name: 'Delete',
      onClick: onHandleDelete,
    },
  ];
};

const CUSTOM_METRICS_OPTIONS = ({
  onHandleDelete,
}: {
  onHandleDelete: (data: { id: string | number }) => void;
}): Array<MenuOptionsType> => {
  return [
    {
      icon: <span className={'wm-delete'} />,
      name: 'Delete',
      onClick: onHandleDelete,
    },
  ];
};

const CREATE_METRICS_VALIDATION_SCHEMA = yup
  .object()
  .shape({
    name: yup.string().required('Name is required').max(40),
    descriptionEnabled: yup.boolean().default(false),
    description: yup
      .string()
      .when('descriptionEnabled', {
        is: (value: boolean) => value,
        then: () => yup.string().required('Description is required'),
        otherwise: () => yup.string().default(''),
      })
      .nullable()
      .default(null),
    type: yup.mixed<MetricsTypeEnum>().default(MetricsTypeEnum.Nps),
    source: yup.mixed<MetricsSourceEnum>().required('Source is required'),
    dateRange: yup.mixed<MetricsDateRangeEnum>().default(MetricsDateRangeEnum.Custom),
    survey: yup
      .number()
      .when('source', {
        is: (value: MetricsSourceEnum) => value === MetricsSourceEnum.Survey,
        then: () => yup.number().required('Survey is required'),
        otherwise: () => yup.number().nullable().default(null),
      })
      .nullable()
      .default(null),
    question: yup
      .number()
      .when('survey', {
        is: (value: number | null) => typeof value === 'number',
        then: () => yup.number().required('Question is required'),
        otherwise: () => yup.number().nullable().default(null),
      })
      .nullable()
      .default(null),
    goal: yup
      .number()
      .transform(value => (isNaN(value) ? undefined : value))
      .nullable()
      .required('Goal is required'),
  })
  .required();

const METRIC_NPS_DATA_POINT_EXEL_TABLE_COLUMNS = ({
  onHandleRowChange,
}: TableColumnOptionType): Array<TableColumnType> => {
  const getCorrectInputValue = (value: unknown) => {
    return isValidNumberFormat(value) ? (+value).toString() : undefined;
  };

  return [
    {
      id: 'date',
      label: 'Date',
      renderFunction: row => {
        return (
          <div
            style={{
              borderBottom: row.date ? '' : '1px solid #e53251',
            }}>
            <CustomDatePicker
              isInline={false}
              defaultDate={row.date}
              onHandleChangeDate={date =>
                onHandleRowChange
                  ? onHandleRowChange({ id: row.id, key: 'date', value: date.toString() })
                  : {}
              }
            />
          </div>
        );
      },
    },
    {
      id: 'detractor',
      label: 'Detractor',
      renderFunction: row => {
        const value = getCorrectInputValue(row.detractor);
        return (
          <div
            style={{
              borderBottom: value ? '' : '1px solid #e53251',
            }}>
            <input
              data-testid={'data-point-table-detractor-test-id'}
              type="number"
              min={0}
              value={value}
              onChange={e =>
                onHandleRowChange
                  ? onHandleRowChange({ id: row.id, key: 'detractor', value: +e.target.value })
                  : {}
              }
            />
          </div>
        );
      },
    },
    {
      id: 'passive',
      label: 'Passive',
      renderFunction: row => {
        const value = getCorrectInputValue(row.passive);
        return (
          <div
            style={{
              borderBottom: value ? '' : '1px solid #e53251',
            }}>
            <input
              data-testid={'data-point-table-passive-test-id'}
              type="number"
              min={0}
              value={value}
              onChange={e =>
                onHandleRowChange
                  ? onHandleRowChange({ id: row.id, key: 'passive', value: +e.target.value })
                  : {}
              }
            />
          </div>
        );
      },
    },
    {
      id: 'promoter',
      label: 'Promoter',
      renderFunction: row => {
        const value = getCorrectInputValue(row.promoter);

        return (
          <div
            style={{
              borderBottom: value ? '' : '1px solid #e53251',
            }}>
            <input
              data-testid={'data-point-table-promoter-test-id'}
              type="number"
              min={0}
              value={value}
              onChange={e =>
                onHandleRowChange
                  ? onHandleRowChange({ id: row.id, key: 'promoter', value: +e.target.value })
                  : {}
              }
            />
          </div>
        );
      },
    },
    {
      id: 'operation',
      label: ' ',
      align: 'right',
    },
  ];
};

const METRIC_CSAT_DATA_POINT_EXEL_TABLE_COLUMNS = ({
  onHandleRowChange,
}: TableColumnOptionType): Array<TableColumnType> => {
  const getCorrectInputValue = (value: unknown) => {
    return isValidNumberFormat(value) ? (+value).toString() : undefined;
  };

  return [
    {
      id: 'date',
      label: 'Date',
      renderFunction: row => {
        return (
          <div
            style={{
              borderBottom: row.date ? '' : '1px solid #e53251',
            }}>
            <CustomDatePicker
              isInline={false}
              defaultDate={row.date}
              onHandleChangeDate={date =>
                onHandleRowChange
                  ? onHandleRowChange({ id: row.id, key: 'date', value: date.toString() })
                  : {}
              }
            />
          </div>
        );
      },
    },
    {
      id: 'satisfied',
      label: 'Satisfied',
      renderFunction: row => {
        const value = getCorrectInputValue(row.satisfied);

        return (
          <div
            style={{
              borderBottom: value ? '' : '1px solid #e53251',
            }}>
            <input
              type="number"
              min={0}
              value={value}
              onChange={e =>
                onHandleRowChange
                  ? onHandleRowChange({ id: row.id, key: 'satisfied', value: +e.target.value })
                  : {}
              }
            />
          </div>
        );
      },
    },
    {
      id: 'neutral',
      label: 'Neutral',
      renderFunction: row => {
        const value = getCorrectInputValue(row.neutral);

        return (
          <div
            style={{
              borderBottom: value ? '' : '1px solid #e53251',
            }}>
            <input
              type="number"
              min={0}
              value={value}
              onChange={e =>
                onHandleRowChange
                  ? onHandleRowChange({ id: row.id, key: 'neutral', value: +e.target.value })
                  : {}
              }
            />
          </div>
        );
      },
    },
    {
      id: 'dissatisfied',
      label: 'Dissatisfied',
      renderFunction: row => {
        const value = getCorrectInputValue(row.dissatisfied);

        return (
          <div
            style={{
              borderBottom: value ? '' : '1px solid #e53251',
            }}>
            <input
              type="number"
              min={0}
              value={value}
              onChange={e =>
                onHandleRowChange
                  ? onHandleRowChange({ id: row.id, key: 'dissatisfied', value: +e.target.value })
                  : {}
              }
            />
          </div>
        );
      },
    },
    {
      id: 'operation',
      label: ' ',
    },
  ];
};

const METRIC_CES_DATA_POINT_EXEL_TABLE_COLUMNS = ({
  onHandleRowChange,
}: TableColumnOptionType): Array<TableColumnType> => {
  const getCorrectInputValue = (value: unknown) => {
    return isValidNumberFormat(value) ? (+value).toString() : undefined;
  };

  return [
    {
      id: 'date',
      label: 'Date',
      renderFunction: row => {
        return (
          <div
            style={{
              borderBottom: row.date ? '' : '1px solid #e53251',
            }}>
            <CustomDatePicker
              isInline={false}
              defaultDate={row.date}
              onHandleChangeDate={date =>
                onHandleRowChange
                  ? onHandleRowChange({ id: row.id, key: 'date', value: date.toString() })
                  : {}
              }
            />
          </div>
        );
      },
    },
    {
      id: 'easy',
      label: 'Easy',
      renderFunction: row => {
        const value = getCorrectInputValue(row.easy);

        return (
          <div
            style={{
              borderBottom: value ? '' : '1px solid #e53251',
            }}>
            <input
              type="number"
              value={value}
              min={0}
              onChange={e =>
                onHandleRowChange
                  ? onHandleRowChange({ id: row.id, key: 'easy', value: +e.target.value })
                  : {}
              }
            />
          </div>
        );
      },
    },
    {
      id: 'neutral',
      label: 'Neutral',
      renderFunction: row => {
        const value = getCorrectInputValue(row.neutral);

        return (
          <div
            style={{
              borderBottom: value ? '' : '1px solid #e53251',
            }}>
            <input
              type="number"
              min={0}
              value={value}
              onChange={e =>
                onHandleRowChange
                  ? onHandleRowChange({ id: row.id, key: 'neutral', value: +e.target.value })
                  : {}
              }
            />
          </div>
        );
      },
    },
    {
      id: 'difficult',
      label: 'Difficult',
      renderFunction: row => {
        const value = getCorrectInputValue(row.difficult);

        return (
          <div
            style={{
              borderBottom: value ? '' : '1px solid #e53251',
            }}>
            <input
              type="number"
              min={0}
              value={value}
              onChange={e =>
                onHandleRowChange
                  ? onHandleRowChange({ id: row.id, key: 'difficult', value: +e.target.value })
                  : {}
              }
            />
          </div>
        );
      },
    },
    {
      id: 'operation',
      label: ' ',
    },
  ];
};

const METRIC_NPS_DATA_POINT_TABLE_COLUMNS = (): Array<TableColumnType> => {
  return [
    {
      id: 'date',
      label: 'Date',
      renderFunction: row => {
        return (
          <div
            style={{
              borderBottom: row.repeat ? '1px solid #e53251' : '',
            }}>
            {dayjs(row.date).format('MM-DD-YYYY')}
          </div>
        );
      },
    },
    {
      id: 'detractor',
      label: 'Detractor',
    },
    {
      id: 'passive',
      label: 'Passive',
    },
    {
      id: 'promoter',
      label: 'Promoter',
    },
    {
      id: 'operation',
      label: ' ',
      align: 'right',
    },
  ];
};

const METRIC_CSAT_DATA_POINT_TABLE_COLUMNS = (): Array<TableColumnType> => {
  return [
    {
      id: 'date',
      label: 'Date',
      renderFunction: row => {
        return (
          <div
            style={{
              borderBottom: row.repeat ? '1px solid #e53251' : '',
            }}>
            {dayjs(row.date).format('MM-DD-YYYY')}
          </div>
        );
      },
    },
    {
      id: 'satisfied',
      label: 'Satisfied',
    },
    {
      id: 'neutral',
      label: 'Neutral',
    },
    {
      id: 'dissatisfied',
      label: 'Dissatisfied',
    },
    {
      id: 'operation',
      label: ' ',
    },
  ];
};

const METRIC_CES_DATA_POINT_TABLE_COLUMNS = (): Array<TableColumnType> => {
  return [
    {
      id: 'date',
      label: 'Date',
      renderFunction: row => {
        return (
          <div
            style={{
              borderBottom: row.repeat ? '1px solid #e53251' : '',
            }}>
            {dayjs(row.date).format('MM-DD-YYYY')}
          </div>
        );
      },
    },
    {
      id: 'easy',
      label: 'Easy',
    },
    {
      id: 'neutral',
      label: 'Neutral',
    },
    {
      id: 'difficult',
      label: 'Difficult',
    },
    {
      id: 'operation',
      label: ' ',
    },
  ];
};

const METRICS_SOURCE_ITEM: Array<DropdownSelectItemType> = [
  {
    id: 1,
    name: 'CX Surveys',
    value: MetricsSourceEnum.Survey,
  },
  {
    id: 2,
    name: 'Manual/CSV import',
    value: MetricsSourceEnum.Manual,
  },
  {
    id: 3,
    name: 'Custom Metrics',
    value: MetricsSourceEnum.Custom,
  },
];

const METRICS_TYPE_ITEM: Array<DropdownSelectItemType> = [
  {
    id: 1,
    name: MetricsTypeEnum.Nps,
    value: MetricsTypeEnum.Nps,
  },
  {
    id: 2,
    name: MetricsTypeEnum.Csat,
    value: MetricsTypeEnum.Csat,
  },
  {
    id: 3,
    name: MetricsTypeEnum.Ces,
    value: MetricsTypeEnum.Ces,
  },
];

const METRICS_TRACK_ITEM: Array<DropdownSelectItemType> = [
  {
    id: 1,
    name: 'Daily',
    value: MetricsDateRangeEnum.Daily,
  },
  {
    id: 2,
    name: 'Weekly',
    value: MetricsDateRangeEnum.Weekly,
  },
  {
    id: 3,
    name: 'Monthly',
    value: MetricsDateRangeEnum.Monthly,
  },
  {
    id: 4,
    name: 'Yearly',
    value: MetricsDateRangeEnum.Yearly,
  },
  {
    id: 5,
    name: 'Custom',
    value: MetricsDateRangeEnum.Custom,
  },
];

const CUSTOM_METRICS_TABLE_COLUMNS: Array<TableColumnType> = [
  {
    id: 'date',
    label: 'Date',
    renderFunction: row => {
      return (
        <div
          style={{
            borderBottom: row.repeat ? '1px solid #e53251' : '',
          }}>
          {dayjs(row.date).format('MM-DD-YYYY')}
        </div>
      );
    },
  },
  {
    id: 'value',
    label: 'Metrics value',
  },
  {
    id: 'operation',
    label: ' ',
  },
];

const ADD_DATA_POINT_VALIDATION_SCHEMA = yup.object().shape({
  valueOne: yup.number().typeError('This field is required').required('This field is required'),
  valueTwo: yup.number().typeError('This field is required').required('This field is required'),
  valueThree: yup.number().typeError('This field is required').required('This field is required'),
});

const NPS_DATA_POINT_ELEMENTS: Array<NPSDataPointElementType> = [
  {
    name: 'valueOne',
    title: 'Detractors',
    placeholder: 'Set detractors',
    type: 'number',
  },
  {
    name: 'valueTwo',
    title: 'Passive',
    placeholder: 'Set neutral',
    type: 'number',
  },
  {
    name: 'valueThree',
    title: 'Promoter',
    placeholder: 'Set promoter',
    type: 'number',
  },
];

const CSAT_DATA_POINT_ELEMENTS: Array<NPSDataPointElementType> = [
  {
    name: 'valueOne',
    title: 'Satisfied',
    placeholder: 'Set dissatisfied',
    type: 'number',
  },
  {
    name: 'valueTwo',
    title: 'Neutral',
    placeholder: 'Set neutral',
    type: 'number',
  },
  {
    name: 'valueThree',
    title: 'Dissatisfied',
    placeholder: 'Set satisfied',
    type: 'number',
  },
];

const CES_DATA_POINT_ELEMENTS: Array<NPSDataPointElementType> = [
  {
    name: 'valueOne',
    title: 'Easy',
    placeholder: 'Set detractors',
    type: 'number',
  },
  {
    name: 'valueTwo',
    title: 'Neutral',
    placeholder: 'Set neutral',
    type: 'number',
  },
  {
    name: 'valueThree',
    title: 'Difficult',
    placeholder: 'Set promoter',
    type: 'number',
  },
];

const ADD_CUSTOM_METRICS_VALIDATION_SCHEMA = (metricsType: MetricsTypeEnum) =>
  yup.object().shape({
    value: yup
      .number()
      .typeError('This field is required')
      .required('This field is required')
      .min(
        metricsType === MetricsTypeEnum.Nps ? -100 : 0,
        `${metricsType} min value can be ${metricsType === MetricsTypeEnum.Nps ? -100 : 0}.`,
      )
      .max(100, `${metricsType} max value can be 100.`),
  });

export {
  METRICS_DEFAULT_DATA,
  NPS_TEMPLATE,
  CSAT_TEMPLATE,
  CES_TEMPLATE,
  JOURNEY_MAP_METRICS_OPTIONS,
  METRICS_DATA_POINT_EXEL_OPTIONS,
  CUSTOM_METRICS_OPTIONS,
  CREATE_METRICS_VALIDATION_SCHEMA,
  METRIC_NPS_DATA_POINT_EXEL_TABLE_COLUMNS,
  METRIC_CSAT_DATA_POINT_EXEL_TABLE_COLUMNS,
  METRIC_CES_DATA_POINT_EXEL_TABLE_COLUMNS,
  METRIC_NPS_DATA_POINT_TABLE_COLUMNS,
  METRIC_CSAT_DATA_POINT_TABLE_COLUMNS,
  METRIC_CES_DATA_POINT_TABLE_COLUMNS,
  METRICS_SOURCE_ITEM,
  METRICS_TYPE_ITEM,
  METRICS_TRACK_ITEM,
  CUSTOM_METRICS_TABLE_COLUMNS,
  ADD_DATA_POINT_VALIDATION_SCHEMA,
  NPS_DATA_POINT_ELEMENTS,
  CSAT_DATA_POINT_ELEMENTS,
  CES_DATA_POINT_ELEMENTS,
  ADD_CUSTOM_METRICS_VALIDATION_SCHEMA,
};
