import { FC, lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';

import './style.scss';

import { yupResolver } from '@hookform/resolvers/yup';
import { Switch } from '@mui/material';
import { useWuShowToast, WuButton } from '@npm-questionpro/wick-ui-lib';
import { useParams } from '@tanstack/react-router';
import axios from 'axios';
import dayjs from 'dayjs';
import fromNow from 'dayjs/plugin/relativeTime';
import { Controller, useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';

import {
  CREATE_METRICS_VALIDATION_SCHEMA,
  CUSTOM_METRICS_TABLE_COLUMNS,
  METRIC_CES_DATA_POINT_TABLE_COLUMNS,
  METRIC_CSAT_DATA_POINT_TABLE_COLUMNS,
  METRIC_NPS_DATA_POINT_TABLE_COLUMNS,
  METRICS_DEFAULT_DATA,
  METRICS_SOURCE_ITEM,
  METRICS_TRACK_ITEM,
  METRICS_TYPE_ITEM,
} from '../constants';
import {
  CesType,
  CsatType,
  CustomMetricsType,
  DatapointType,
  MetricsFormType,
  MetricsSurveyItemType,
  MetricsSurveyQuestionItemType,
  MetricsType,
  NpsType,
} from '../types';

import {
  CreateMetricsMutation,
  useCreateMetricsMutation,
} from '@/api/mutations/generated/createMetrics.generated';
import {
  UpdateMetricsMutation,
  useUpdateMetricsMutation,
} from '@/api/mutations/generated/updateMetrics.generated';
import { useGetCustomMetricsItemsQuery } from '@/api/queries/generated/getCustomMetricsItems.generated';
import {
  GetDataPointsQuery,
  useGetDataPointsQuery,
} from '@/api/queries/generated/getDataPoints.generated.ts';
import { MetricsDateRangeEnum, MetricsSourceEnum, MetricsTypeEnum } from '@/api/types';
import BaseWuDataTable from '@/Components/Shared/BaseWuDataTable';
import BaseWuModalHeader from '@/Components/Shared/BaseWuModalHeader';
import CustomDatePicker from '@/Components/Shared/CustomDatePicker';
import CustomDropDown from '@/Components/Shared/CustomDropDown';
import CustomInput from '@/Components/Shared/CustomInput';
import CustomPopover from '@/Components/Shared/CustomPopover';
import WuBaseLoader from '@/Components/Shared/WuBaseLoader';
import { useUpdateMap } from '@/Screens/JourneyMapScreen/hooks/useUpdateMap';
import { useJourneyMapStore } from '@/Store/journeyMap';
import { useUndoRedoStore } from '@/Store/undoRedo.ts';
import { useUserStore } from '@/Store/user.ts';
import { useWorkspaceStore } from '@/Store/workspace.ts';
import { ObjectKeysType } from '@/types';
import { ActionsEnum, JourneyMapRowTypesEnum } from '@/types/enum';

const AddDataPointModal = lazy(() => import('./AddDataPointModal/index.tsx'));
const AddCustomMetricsModal = lazy(() => import('./AddCustomMetricsModal/index.tsx'));
const ImportDataPointModal = lazy(() => import('./ImportDataPointModal/index.tsx'));
const ImportDataPointTableModal = lazy(() => import('./ImportDataPointTableModal/index.tsx'));

dayjs.extend(fromNow);

interface ICreateMetricsDrawer {
  rowItemID: number;
  selectedStepId: number;
  selectedColumnId: number;
  selectedMetrics: MetricsType | null;
  onHandleCloseDrawer: () => void;
}

const initialEndDate = new Date(new Date().setMonth(new Date().getMonth() + 1));

const CreateUpdateMetricsDrawer: FC<ICreateMetricsDrawer> = ({
  rowItemID,
  selectedStepId,
  selectedColumnId,
  selectedMetrics,
  onHandleCloseDrawer,
}) => {
  const { mapId } = useParams({
    from: '/_authenticated/_secondary-sidebar-layout/board/$boardId/journey-map/$mapId/',
  });

  const { updateMapByType } = useUpdateMap();

  const { showToast } = useWuShowToast();

  const { user } = useUserStore();
  const { workspace } = useWorkspaceStore();
  const { selectedJourneyMapPersona } = useJourneyMapStore();
  const { undoActions, updateUndoActions, updateRedoActions } = useUndoRedoStore();

  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(initialEndDate);
  const [surveys, setSurveys] = useState<Array<MetricsSurveyItemType>>([]);
  const [questions, setQuestions] = useState<Array<MetricsSurveyQuestionItemType>>([]);
  const [dataPoints, setDataPoints] = useState<Array<DatapointType>>([]);
  const [datapointFile, setDatapointFile] = useState<ObjectKeysType[]>([]);
  const [customMetrics, setCustomMetrics] = useState<Array<CustomMetricsType>>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState<boolean>(false);
  const [isOpenAddDataPointModal, setIsOpenAddDataPointModal] = useState<boolean>(false);
  const [isOpenAddCustomMetricsModal, setIsOpenAddCustomMetricsModal] = useState<boolean>(false);
  const [isOpenImportDataPointModal, setIsOpenImportDataPointModal] = useState<boolean>(false);
  const [isOpenImportDataPointTableModal, setIsOpenImportDataPointTableModal] =
    useState<boolean>(false);
  const [deletedDataPointsIds, setDeletedDataPointsIds] = useState<Array<number>>([]);
  const [deletedCustomMetricsIds, setDeletedCustomMetricsIds] = useState<Array<number>>([]);

  const { data: dataDataPoints, isLoading: isLoadingDataPoint } = useGetDataPointsQuery<
    GetDataPointsQuery,
    Error
  >(
    {
      getDataPointsInput: {
        metricsId: selectedMetrics?.id || 0,
        type: selectedMetrics?.type || MetricsTypeEnum.Nps,
        offset: 0,
        limit: 100,
      },
    },
    {
      enabled: !!selectedMetrics && selectedMetrics.source === MetricsSourceEnum.Manual,
    },
  );

  const { data: dataCustomMetricsItems, isLoading: isLoadingCustomMetricsItems } =
    useGetCustomMetricsItemsQuery(
      {
        metricsId: selectedMetrics?.id || 0,
      },
      {
        enabled: !!selectedMetrics && selectedMetrics.source === MetricsSourceEnum.Custom,
      },
    );

  const { mutate: mutateCreateMetrics, isPending: isLoadingCreateMetrics } =
    useCreateMetricsMutation<Error, CreateMetricsMutation>({
      onSuccess: response => {
        const data = {
          stepId: selectedStepId,
          ...response.createMetrics,
        };

        updateMapByType(JourneyMapRowTypesEnum.METRICS, ActionsEnum.CREATE, data);
        updateRedoActions([]);
        updateUndoActions([
          ...undoActions,
          {
            id: uuidv4(),
            type: JourneyMapRowTypesEnum.METRICS,
            action: ActionsEnum.DELETE,
            data,
          },
        ]);
        onHandleCloseDrawer();
      },
      onError: error => {
        showToast({
          message: error?.message,
          variant: 'error',
        });
      },
    });

  const { mutate: mutateUpdateMetrics, isPending: isLoadingUpdateMetrics } =
    useUpdateMetricsMutation<Error, UpdateMetricsMutation>({
      onError: error => {
        showToast({
          message: error?.message,
          variant: 'error',
        });
      },
    });

  const getSurveys = useCallback(async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_QP_API}/cx/feedbacks/${workspace?.feedbackId}/surveys`,
      {
        headers: {
          'api-key': user?.userAPIKey,
        },
      },
    );
    setSurveys(res.data?.response || []);
  }, [user?.userAPIKey, workspace?.feedbackId]);

  const getQuestions = useCallback(
    async (id: number) => {
      setIsLoadingQuestions(true);
      const res = await axios.get(`${import.meta.env.VITE_QP_API}/surveys/${id}/questions`, {
        headers: {
          'api-key': user?.userAPIKey,
        },
      });
      setQuestions(res.data.response);
      setIsLoadingQuestions(false);
    },
    [user?.userAPIKey],
  );

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
    reset,
  } = useForm<MetricsFormType>({
    resolver: yupResolver(CREATE_METRICS_VALIDATION_SCHEMA),
    defaultValues: METRICS_DEFAULT_DATA,
  });

  const type = watch('type');
  const descriptionEnabled = watch('descriptionEnabled');
  const source = watch('source');
  const survey = watch('survey');
  const dateRange = watch('dateRange');

  const filterType: ObjectKeysType = {
    NPS: ['net_promoter_score'],
    CSAT: [
      'customer_satisfaction_numeric',
      'customer_satisfaction_star',
      'customer_satisfaction_smiley',
    ],
  };

  const setInitialManualStates = () => {
    setDataPoints([]);
  };

  const setInitialCustomStates = () => {
    setCustomMetrics([]);
  };

  const setInitialSurveyStates = () => {
    // reset({
    //   ...METRICS_DEFAULT_DATA,
    //   name: watch('name'),
    //   description: watch('description'),
    //   descriptionEnabled: watch('descriptionEnabled'),
    //   source: MetricsSourceEnum.Manual,
    // });
    setStartDate(new Date());
    setEndDate(initialEndDate);
  };

  const onToggleAddDataPointModal = useCallback(() => {
    setIsOpenAddDataPointModal(prev => !prev);
  }, []);

  const onToggleAddCustomMetricsModal = useCallback(() => {
    setIsOpenAddCustomMetricsModal(prev => !prev);
  }, []);

  const onToggleImportDataPointModal = useCallback(() => {
    setIsOpenImportDataPointModal(prev => !prev);
  }, []);

  const onToggleImportDataPointTableModal = useCallback(() => {
    setIsOpenImportDataPointModal(false);
    setIsOpenImportDataPointTableModal(prev => !prev);
  }, []);

  const onHandleAddDataPont = useCallback(
    (data: Array<DatapointType>) => {
      setDataPoints(prev => [...prev, ...data]);
      onToggleAddDataPointModal();
    },
    [onToggleAddDataPointModal],
  );

  const onHandleAddCustomMetrics = useCallback(
    (data: CustomMetricsType) => {
      setCustomMetrics(prev => [...prev, data]);
      onToggleAddCustomMetricsModal();
    },
    [onToggleAddCustomMetricsModal],
  );

  const onHandleDeleteDataPont = useCallback((metrics?: DatapointType | CustomMetricsType) => {
    if (metrics && typeof metrics?.id === 'number') {
      setDeletedDataPointsIds(prev => [...prev, metrics.id as number]);
    }
    setDataPoints(prev => prev.filter(r => r.id !== metrics?.id));
  }, []);

  const onHandleDeleteCustomMetrics = useCallback((metrics?: DatapointType | CustomMetricsType) => {
    if (metrics && typeof metrics.id === 'number') {
      setDeletedCustomMetricsIds(prev => [...prev, metrics.id as number]);
    }
    setCustomMetrics(prev => prev.filter(m => m.id !== metrics?.id));
  }, []);

  const onHandleSetUploadFile = useCallback((dataFile: ObjectKeysType[]) => {
    setDatapointFile(dataFile);
  }, []);

  const onHandleMapUpdate = (response: UpdateMetricsMutation) => {
    const data = {
      stepId: selectedStepId,
      ...response.updateMetrics,
    };

    updateMapByType(JourneyMapRowTypesEnum.METRICS, ActionsEnum.UPDATE, data);
    updateRedoActions([]);
    updateUndoActions([
      ...undoActions,
      {
        id: uuidv4(),
        type: JourneyMapRowTypesEnum.METRICS,
        action: ActionsEnum.UPDATE,
        data: {
          stepId: selectedStepId,
          ...selectedMetrics,
        },
      },
    ]);

    onHandleCloseDrawer();
  };

  const onFormSubmit = (formData: MetricsFormType) => {
    if (formData.source === MetricsSourceEnum.Manual) {
      let isError = null;

      dataPoints.forEach(dp => {
        if (dp.repeat) {
          showToast({
            message: 'Dates cannot be repeated',
            variant: 'warning',
          });
          isError = true;
          return;
        }
      });

      if (isError) {
        return;
      }
    }

    const reqBody = {
      name: formData.name,
      descriptionEnabled: formData.descriptionEnabled,
      description: formData.description,
      source: formData.source,
      type: formData.type,
      goal: formData.goal,
      startDate,
      endDate,
    };

    const dataPointsInput: ObjectKeysType = {};

    if (selectedMetrics) {
      const updateMetricsInput = {
        id: selectedMetrics.id,
        surveyId: formData.survey,
        questionId: formData.question,
        dateRange: formData.dateRange || MetricsDateRangeEnum.Custom,
        ...reqBody,
      };

      switch (formData.source) {
        case MetricsSourceEnum.Survey: {
          mutateUpdateMetrics(
            {
              updateMetricsInput,
            },
            {
              onSuccess: response => {
                onHandleMapUpdate(response);
              },
            },
          );
          break;
        }

        case MetricsSourceEnum.Custom: {
          mutateUpdateMetrics(
            {
              updateMetricsInput,
              updateCustomMetricsInput: {
                deletedCustomMetricsIds,
                customMetrics: customMetrics
                  .filter(dp => typeof dp.id === 'string')
                  .map(m => ({
                    date: m.date,
                    value: m.value,
                  })),
              },
            },
            {
              onSuccess: response => {
                onHandleMapUpdate(response);
              },
            },
          );
          break;
        }
        case MetricsSourceEnum.Manual: {
          switch (formData.type) {
            case MetricsTypeEnum.Nps: {
              dataPointsInput.npsPointsInput = dataPoints
                .filter(dp => typeof dp.id === 'string')
                .map(dp => {
                  const nps = dp as NpsType;
                  return {
                    date: nps.date,
                    detractor: nps.detractor,
                    passive: nps.passive,
                    promoter: nps.promoter,
                  };
                });
              break;
            }
            case MetricsTypeEnum.Csat: {
              dataPointsInput.csatPointsInput = dataPoints
                .filter(dp => typeof dp.id === 'string')
                .map(dp => {
                  const nps = dp as CsatType;
                  return {
                    date: nps.date,
                    dissatisfied: nps.dissatisfied,
                    satisfied: nps.satisfied,
                    neutral: nps.neutral,
                  };
                });
              break;
            }
            case MetricsTypeEnum.Ces: {
              dataPointsInput.cesPointsInput = dataPoints
                .filter(dp => typeof dp.id === 'string')
                .map(dp => {
                  const nps = dp as CesType;
                  return {
                    date: nps.date,
                    easy: nps.easy,
                    difficult: nps.difficult,
                    neutral: nps.neutral,
                  };
                });
              break;
            }
          }

          const updateDataPointsInput = {
            deleteInput: deletedDataPointsIds,
            ...dataPointsInput,
          };

          mutateUpdateMetrics(
            {
              updateMetricsInput,
              updateDataPointsInput,
            },
            {
              onSuccess: response => {
                onHandleMapUpdate(response);
              },
            },
          );
          break;
        }
      }
    } else {
      switch (formData.source) {
        case MetricsSourceEnum.Survey: {
          mutateCreateMetrics({
            createMetricsInput: {
              ...reqBody,
              surveyId: formData.survey,
              questionId: formData.question,
              dateRange: formData.dateRange || MetricsDateRangeEnum.Custom,
              columnId: selectedColumnId,
              rowId: rowItemID,
              mapId: +mapId,
              stepId: selectedStepId,
              personaId: selectedJourneyMapPersona?.id || null,
            },
          });
          break;
        }
        case MetricsSourceEnum.Custom: {
          const sum = customMetrics.reduce((acc, obj) => acc + obj.value, 0);
          const average = sum / customMetrics.length;

          mutateCreateMetrics({
            createMetricsInput: {
              ...reqBody,
              dateRange: formData.dateRange || MetricsDateRangeEnum.Custom,
              columnId: selectedColumnId,
              rowId: rowItemID,
              mapId: +mapId,
              stepId: selectedStepId,
              personaId: selectedJourneyMapPersona?.id || null,
              value: Math.floor(average),
            },
            createCustomMetricsInput: {
              customMetrics: customMetrics.map(m => ({
                date: m.date,
                value: Math.floor(m.value),
              })),
            },
          });
          break;
        }
        case MetricsSourceEnum.Manual: {
          switch (formData.type) {
            case MetricsTypeEnum.Nps: {
              dataPointsInput.npsPointsInput = dataPoints.map(dp => {
                const nps = dp as NpsType;
                return {
                  date: nps.date,
                  detractor: nps.detractor,
                  passive: nps.passive,
                  promoter: nps.promoter,
                };
              });
              break;
            }
            case MetricsTypeEnum.Csat: {
              dataPointsInput.csatPointsInput = dataPoints.map(dp => {
                const nps = dp as CsatType;
                return {
                  date: nps.date,
                  dissatisfied: nps.dissatisfied,
                  satisfied: nps.satisfied,
                  neutral: nps.neutral,
                };
              });
              break;
            }
            case MetricsTypeEnum.Ces: {
              dataPointsInput.cesPointsInput = dataPoints.map(dp => {
                const nps = dp as CesType;
                return {
                  date: nps.date,
                  easy: nps.easy,
                  difficult: nps.difficult,
                  neutral: nps.neutral,
                };
              });
              break;
            }
          }

          mutateCreateMetrics({
            createDataPointsInput: {
              ...dataPointsInput,
            },
            createMetricsInput: {
              ...reqBody,
              columnId: selectedColumnId,
              rowId: rowItemID,
              mapId: +mapId,
              stepId: selectedStepId,
              personaId: selectedJourneyMapPersona?.id || null,
            },
          });
          break;
        }
      }
    }
  };

  const dataPointsColumns: ObjectKeysType = useMemo(() => {
    return {
      [MetricsTypeEnum.Nps]: METRIC_NPS_DATA_POINT_TABLE_COLUMNS({
        onHandleRowDelete: onHandleDeleteDataPont,
      }),
      [MetricsTypeEnum.Csat]: METRIC_CSAT_DATA_POINT_TABLE_COLUMNS({
        onHandleRowDelete: onHandleDeleteDataPont,
      }),
      [MetricsTypeEnum.Ces]: METRIC_CES_DATA_POINT_TABLE_COLUMNS({
        onHandleRowDelete: onHandleDeleteDataPont,
      }),
    };
  }, [onHandleDeleteDataPont]);

  const customMetricColumns = useMemo(
    () =>
      CUSTOM_METRICS_TABLE_COLUMNS({
        onHandleRowDelete: onHandleDeleteCustomMetrics,
      }),
    [onHandleDeleteCustomMetrics],
  );

  const calcIsDateRepeat = useCallback((data: DatapointType[] | CustomMetricsType[]) => {
    data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const dateCount: { [key: string]: number } = {};

    data.forEach(item => {
      const date = dayjs(item.date).format('MM-DD-YYYY');
      if (dateCount[date]) {
        dateCount[date]++;
      } else {
        dateCount[date] = 1;
      }
    });

    data.forEach(item => {
      const date = dayjs(item.date).format('MM-DD-YYYY');
      if (dateCount[date] > 1) {
        item.repeat = true;
      } else {
        item.repeat = null;
      }
    });

    return data;
  }, []);

  // const manualMetricsRows = useMemo(() => {
  //   dataPoints.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  //
  //   const dateCount: { [key: string]: number } = {};
  //
  //   dataPoints.forEach(item => {
  //     const date = dayjs(item.date).format('MM-DD-YYYY');
  //     if (dateCount[date]) {
  //       dateCount[date]++;
  //     } else {
  //       dateCount[date] = 1;
  //     }
  //   });
  //
  //   dataPoints.forEach(item => {
  //     const date = dayjs(item.date).format('MM-DD-YYYY');
  //     if (dateCount[date] > 1) {
  //       item.repeat = true;
  //     } else {
  //       item.repeat = null;
  //     }
  //   });
  //
  //   return dataPoints;
  // }, [dataPoints]);

  useEffect(() => {
    getSurveys().then();
    if (selectedMetrics) {
      setStartDate(selectedMetrics.startDate || new Date());
      setEndDate(selectedMetrics.endDate || initialEndDate);
      reset({
        name: selectedMetrics.name,
        descriptionEnabled: selectedMetrics.descriptionEnabled,
        description: selectedMetrics.description,
        source: selectedMetrics.source,
        type: selectedMetrics.type,
        survey: selectedMetrics.surveyId,
        question: selectedMetrics.questionId,
        goal: selectedMetrics.goal || 0,
        dateRange: selectedMetrics.dateRange || MetricsDateRangeEnum.Daily,
      });
      if (selectedMetrics.source === MetricsSourceEnum.Survey) {
        getQuestions(selectedMetrics.surveyId!).then();
      }
    }
  }, [getQuestions, getSurveys, reset, selectedMetrics]);

  useEffect(() => {
    if (dataDataPoints) {
      setDataPoints((dataDataPoints.getDataPoints?.dataPoints as Array<DatapointType>) || []);
    }
    if (dataCustomMetricsItems) {
      setCustomMetrics(
        (dataCustomMetricsItems?.getCustomMetricsItems as Array<CustomMetricsType>) || [],
      );
    }
  }, [dataCustomMetricsItems, dataDataPoints]);

  const renderDropdownBlock = (
    name: keyof MetricsFormType,
    label: string,
    placeholder: string,
    menuItems: any[],
    onSelect?: (value: any) => void,
    disabled?: boolean,
  ) => (
    <div className="create-update-metrics-drawer--data-settings-block--item">
      <label className="create-update-metrics-drawer--label" htmlFor={name}>
        {label}
      </label>
      <div className="create-update-metrics-drawer--data-settings-block--validation-block">
        <Controller
          name={name}
          control={control}
          render={({ field: { onChange: fieldOnChange, value: fieldValue } }) => (
            <CustomDropDown
              name={name}
              id={`${name}-dropdown`}
              menuItems={menuItems}
              onChange={fieldOnChange}
              onSelect={onSelect}
              selectItemValue={fieldValue?.toString()}
              placeholder={placeholder}
              disabled={disabled}
            />
          )}
        />
        <span className="validation-error">{errors[name]?.message}</span>
      </div>
    </div>
  );

  return (
    <>
      {isOpenAddDataPointModal && (
        <Suspense fallback={''}>
          <AddDataPointModal
            metricsType={type}
            isOpen={isOpenAddDataPointModal}
            onHandleAddDataPont={onHandleAddDataPont}
            handleClose={onToggleAddDataPointModal}
          />
        </Suspense>
      )}
      {isOpenAddCustomMetricsModal && (
        <Suspense fallback={''}>
          <AddCustomMetricsModal
            metricsType={type}
            isOpen={isOpenAddCustomMetricsModal}
            onHandleAddCustomMetrics={onHandleAddCustomMetrics}
            handleClose={onToggleAddCustomMetricsModal}
          />
        </Suspense>
      )}

      {isOpenImportDataPointModal && (
        <Suspense fallback={''}>
          <ImportDataPointModal
            metricsType={type}
            isOpen={isOpenImportDataPointModal}
            onHandleSetUploadFile={onHandleSetUploadFile}
            onToggleImportDataPointTableModal={onToggleImportDataPointTableModal}
            handleClose={onToggleImportDataPointModal}
          />
        </Suspense>
      )}
      {isOpenImportDataPointTableModal && (
        <Suspense fallback={''}>
          <ImportDataPointTableModal
            metricsType={type}
            isOpen={isOpenImportDataPointTableModal}
            datapointFile={datapointFile}
            onHandleAddDataPont={onHandleAddDataPont}
            handleClose={onToggleImportDataPointTableModal}
          />
        </Suspense>
      )}
      <div
        className={'create-update-metrics-drawer'}
        data-testid={'create-update-metrics-drawer-test-id'}>
        <BaseWuModalHeader title={`${selectedMetrics ? 'Update' : 'Create new'} metric`} />
        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className={'create-update-metrics-drawer--form'}>
          <div className={'create-update-metrics-drawer--content'}>
            <div className={'create-update-metrics-drawer--general-block'}>
              <p className={'create-update-metrics-drawer--title'}>General</p>
              <div className={'create-update-metrics-drawer--general-block--item'}>
                <label className={'create-update-metrics-drawer--label'} htmlFor="name">
                  Name
                </label>
                <div className={'create-update-metrics-drawer--general-block--validation-block'}>
                  <Controller
                    name={'name'}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <CustomInput
                        id={'name'}
                        value={value}
                        data-testid={'create-update-metrics-name-test-id'}
                        placeholder={`Metric name`}
                        onChange={onChange}
                      />
                    )}
                  />
                  <span
                    className={'validation-error'}
                    data-testid={'create-update-metrics-name-validation-test-id'}>
                    {errors.name?.message}
                  </span>
                </div>
              </div>
              <div className={'create-update-metrics-drawer--general-block--item'}>
                <label className={'create-update-metrics-drawer--label'} htmlFor="description">
                  Description
                </label>
                <div className={'create-update-metrics-drawer--general-block--switch-validation'}>
                  <Controller
                    name={'descriptionEnabled'}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Switch
                        id={'description'}
                        color="primary"
                        disableRipple={true}
                        data-testid={'create-update-metrics-switch-test-id'}
                        checked={value}
                        onChange={onChange}
                      />
                    )}
                  />
                </div>
              </div>
              {
                <div
                  className={`create-update-metrics-drawer--general-block--description-validation ${
                    descriptionEnabled
                      ? 'create-update-metrics-drawer--general-block--description-validation-open'
                      : 'create-update-metrics-drawer--general-block--description-validation-close'
                  }`}>
                  <Controller
                    name={'description'}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <CustomInput
                        placeholder={'Description of your metric'}
                        data-testid={'create-update-metrics-description-test-id'}
                        autoFocus={true}
                        multiline={true}
                        rows={3}
                        value={value}
                        onChange={onChange}
                      />
                    )}
                  />
                  <span className={'validation-error'}>{errors.description?.message}</span>
                </div>
              }
            </div>

            <div className={'create-update-metrics-drawer--data-settings-block'}>
              <p className={'create-update-metrics-drawer--title'}>Import data settings</p>

              {renderDropdownBlock(
                'source',
                'Source',
                'Select source',
                METRICS_SOURCE_ITEM,
                item => {
                  const actionsMap = {
                    [MetricsSourceEnum.Survey]: () => {
                      setInitialCustomStates();
                      setInitialManualStates();
                    },
                    [MetricsSourceEnum.Custom]: () => {
                      setInitialManualStates();
                      setInitialSurveyStates();
                    },
                    [MetricsSourceEnum.Manual]: () => {
                      setInitialCustomStates();
                      setInitialSurveyStates();
                    },
                  };

                  const action = actionsMap[item.value as MetricsSourceEnum];
                  if (action) action();
                },
              )}

              {source &&
                renderDropdownBlock(
                  'type',
                  'Type',
                  'Select source',
                  source === MetricsSourceEnum.Survey
                    ? METRICS_TYPE_ITEM.slice(0, 2)
                    : METRICS_TYPE_ITEM,
                  () => {
                    setDataPoints([]);
                  },
                )}

              {source === MetricsSourceEnum.Survey ? (
                <>
                  {renderDropdownBlock(
                    'survey',
                    'Select Survey',
                    'Select',
                    surveys.map(s => ({
                      id: s.surveyID,
                      name: s.name,
                      value: s.surveyID,
                    })),
                    item => {
                      if (item.id !== survey) {
                        getQuestions(item.id!).then();
                      }
                    },
                  )}

                  {renderDropdownBlock(
                    'question',
                    'Select Question',
                    'Select',
                    questions
                      .filter(q => (filterType[type] as Array<string>).includes(q.type))
                      .map(q => ({
                        id: q.questionID,
                        name: q.text,
                        value: q.questionID,
                      })),
                    () => {},
                    !survey || isLoadingQuestions,
                  )}

                  {renderDropdownBlock('dateRange', 'Track changes', 'Select', METRICS_TRACK_ITEM)}

                  {dateRange === MetricsDateRangeEnum.Custom ? (
                    <div
                      className={
                        'create-update-metrics-drawer--data-settings-block--item create-update-metrics-drawer--data-settings-block--date-picker-item'
                      }>
                      <label
                        className={'create-update-metrics-drawer--label'}
                        htmlFor="range-date-picker">
                        Date range
                      </label>
                      <div
                        className={
                          'create-update-metrics-drawer--data-settings-block--date-picker'
                        }>
                        <CustomPopover
                          popoverButton={
                            <div
                              className={
                                'create-update-metrics-drawer--data-settings-block--date-picker'
                              }>
                              <div>
                                <span>{dayjs(startDate).format('MM/DD/YYYY')}</span>
                                <span> - </span>
                                <span>{dayjs(endDate).format('MM/DD/YYYY')}</span>
                              </div>
                              <span className={'wm-calendar-month'} />
                            </div>
                          }>
                          <div
                            className={
                              'create-update-metrics-drawer--data-settings-block--date-picker-block'
                            }>
                            <CustomDatePicker
                              defaultDate={startDate}
                              onHandleChangeDate={date => {
                                setStartDate(date);
                              }}
                            />
                            <CustomDatePicker
                              defaultDate={endDate}
                              onHandleChangeDate={date => {
                                setEndDate(date);
                              }}
                            />
                          </div>
                        </CustomPopover>
                      </div>
                    </div>
                  ) : null}
                </>
              ) : null}

              <div
                className={
                  'create-update-metrics-drawer--data-settings-block--item create-update-metrics-drawer--data-settings-block--goal-item'
                }>
                <label className={'create-update-metrics-drawer--label'} htmlFor="goal">
                  Goal
                </label>
                <div
                  className={'create-update-metrics-drawer--data-settings-block--validation-block'}>
                  <Controller
                    name={'goal'}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <CustomInput
                        id={'goal'}
                        placeholder={'Type NPS Goal here'}
                        data-testid={'create-update-metrics-goal-test-id'}
                        type={'number'}
                        min={0}
                        max={100}
                        sxStyles={{
                          width: '12.5rem',
                        }}
                        value={(+value).toString()}
                        onChange={e => {
                          if (+e.target.value >= 0 && +e.target.value <= 100) {
                            onChange(e.target.value);
                          }
                        }}
                      />
                    )}
                  />
                  <span className={'validation-error'}>{errors.goal?.message}</span>
                </div>
              </div>

              {source === MetricsSourceEnum.Manual || source === MetricsSourceEnum.Custom ? (
                <>
                  <div className={'create-update-metrics-drawer--data-settings-block--item '}>
                    <label
                      className={'create-update-metrics-drawer--label'}
                      htmlFor="range-date-picker">
                      Date range
                    </label>

                    <CustomPopover
                      popoverButton={
                        <div
                          className={
                            'create-update-metrics-drawer--data-settings-block--date-picker'
                          }>
                          <div>
                            <span>{dayjs(startDate).format('MM/DD/YYYY')}</span>
                            <span> - </span>
                            <span>{dayjs(endDate).format('MM/DD/YYYY')}</span>
                          </div>
                          <span className={'wm-calendar-month'} />
                        </div>
                      }>
                      <div
                        className={
                          'create-update-metrics-drawer--data-settings-block--date-picker-block'
                        }>
                        <CustomDatePicker
                          defaultDate={startDate}
                          onHandleChangeDate={date => {
                            setStartDate(date);
                          }}
                        />
                        <CustomDatePicker
                          defaultDate={endDate}
                          defaultMinDate={startDate}
                          onHandleChangeDate={date => {
                            setEndDate(date);
                          }}
                        />
                      </div>
                    </CustomPopover>
                  </div>
                  <div className={'create-update-metrics-drawer--data-points-block'}>
                    <div className={'create-update-metrics-drawer--data-points-block--header'}>
                      <p className={'create-update-metrics-drawer--title'}>Data Points</p>
                      <div
                        className={'create-update-metrics-drawer--data-points-block--btns-block'}>
                        <WuButton
                          data-testid={'add-data-point-btn-test-id'}
                          variant={'outline'}
                          type={'button'}
                          onClick={
                            source === MetricsSourceEnum.Manual
                              ? onToggleAddDataPointModal
                              : onToggleAddCustomMetricsModal
                          }>
                          Add data point
                        </WuButton>
                        {source === MetricsSourceEnum.Manual && (
                          <WuButton
                            type={'button'}
                            data-testid={'import-data-point-btn-test-id'}
                            onClick={onToggleImportDataPointModal}>
                            Import in bulk
                          </WuButton>
                        )}
                      </div>
                    </div>

                    <div className="create-update-metrics-drawer--data-points-block--table-block">
                      {(selectedMetrics?.source === MetricsSourceEnum.Manual &&
                        isLoadingDataPoint) ||
                      (selectedMetrics?.source === MetricsSourceEnum.Custom &&
                        isLoadingCustomMetricsItems) ? (
                        <WuBaseLoader />
                      ) : dataPoints.length > 0 || customMetrics.length > 0 ? (
                        <>
                          {/* Render the table if rows exist */}
                          {dataPoints.length > 0 && (
                            <BaseWuDataTable<DatapointType | CustomMetricsType>
                              columns={dataPointsColumns[type]}
                              data={calcIsDateRepeat(dataPoints)}
                            />
                          )}

                          {/* Render custom metrics if they exist */}
                          {customMetrics.length > 0 && (
                            <BaseWuDataTable<DatapointType | CustomMetricsType>
                              columns={customMetricColumns}
                              data={calcIsDateRepeat(customMetrics)}
                            />
                          )}
                        </>
                      ) : (
                        <div className="create-update-metrics-drawer--data-points-block--empty-table-title">
                          <span>There are no data yet</span>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </div>

          <div className={'create-update-metrics-drawer--footer'}>
            <div className={'base-modal-footer'}>
              <button
                type={'button'}
                data-testid={'cancel-metrics-btn-test-id'}
                className={'base-modal-footer--cancel-btn'}
                onClick={onHandleCloseDrawer}
                disabled={isLoadingCreateMetrics || isLoadingUpdateMetrics}>
                Cancel
              </button>
              <WuButton
                type={'submit'}
                data-testid={'create-update-metrics-submit-btn-test-id'}
                disabled={isLoadingCreateMetrics || isLoadingUpdateMetrics}>
                {selectedMetrics ? 'Update' : 'Create'}
              </WuButton>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateUpdateMetricsDrawer;
