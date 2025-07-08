import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import './style.scss';

import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';

import { yupResolver } from '@hookform/resolvers/yup';
import { Switch } from '@mui/material';
import { useWuShowToast } from '@npm-questionpro/wick-ui-lib';
import axios from 'axios';
import dayjs from 'dayjs';
import fromNow from 'dayjs/plugin/relativeTime';
import { Controller, useForm } from 'react-hook-form';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { v4 as uuidv4 } from 'uuid';

import CustomButton from '@/components/atoms/custom-button/custom-button';
import CustomDatePicker from '@/components/atoms/custom-date-picker/custom-date-picker';
import CustomDropDown from '@/components/atoms/custom-drop-down/custom-drop-down';
import CustomInput from '@/components/atoms/custom-input/custom-input';
import CustomPopover from '@/components/atoms/custom-popover/custom-popover';
import CustomTable from '@/components/atoms/custom-table/custom-table';
import CustomLoader from '@/components/molecules/custom-loader/custom-loader';
import { useUpdateMap } from '@/containers/journey-map-container/hooks/useUpdateMap';
import { useCreateMetricsMutation } from '@/gql/mutations/generated/createMetrics.generated';
import {
  UpdateMetricsMutation,
  useUpdateMetricsMutation,
} from '@/gql/mutations/generated/updateMetrics.generated';
import { useGetCustomMetricsItemsQuery } from '@/gql/queries/generated/getCustomMetricsItems.generated';
import { useGetDataPointsQuery } from '@/gql/queries/generated/getDataPoints.generated';
import { MetricsDateRangeEnum, MetricsSourceEnum, MetricsTypeEnum } from '@/gql/types';
import CalendarIcon from '@/public/base-icons/calendar.svg';
import { selectedJourneyMapPersona } from '@/store/atoms/journeyMap.atom';
import { redoActionsState, undoActionsState } from '@/store/atoms/undoRedo.atom';
import { userState } from '@/store/atoms/user.atom';
import { workspaceState } from '@/store/atoms/workspace.atom';
import {
  metricsSourceItems,
  metricsTrackItems,
  metricsTypeItems,
} from '@/utils/constants/dropdown';
import { CREATE_METRICS_VALIDATION_SCHEMA } from '@/utils/constants/form/yup-validation';
import { METRICS_DEFAULT_DATA } from '@/utils/constants/metrics';
import { CUSTOM_METRICS_OPTIONS, METRICS_DATA_POINT_EXEL_OPTIONS } from '@/utils/constants/options';
import {
  CUSTOM_METRICS_TABLE_COLUMNS,
  METRIC_CES_DATA_POINT_TABLE_COLUMNS,
  METRIC_CSAT_DATA_POINT_TABLE_COLUMNS,
  METRIC_NPS_DATA_POINT_TABLE_COLUMNS,
} from '@/utils/constants/table';
import { ActionsEnum, JourneyMapRowTypesEnum } from '@/utils/ts/enums/global-enums';
import { ObjectKeysType, TableColumnType } from '@/utils/ts/types/global-types';
import { MetricsType } from '@/utils/ts/types/journey-map/journey-map-types';
import {
  CesType,
  CsatType,
  CustomMetricsType,
  DatapointType,
  MetricsFormType,
  MetricsSurveyItemType,
  MetricsSurveyQuestionItemType,
  NpsType,
} from '@/utils/ts/types/metrics/metrics-type';

import ModalHeader from '../../../../../../components/molecules/modal-header';

const AddDataPointModal = dynamic(() => import('./add-data-point-modal'), {
  ssr: false,
});
const AddCustomMetricsModal = dynamic(() => import('./add-custom-metrics-modal'), {
  ssr: false,
});
const ImportDataPointModal = dynamic(() => import('./import-data-point-modal'), { ssr: false });
const ImportDataPointTableModal = dynamic(() => import('./import-data-point-table-modal'), {
  ssr: false,
});

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
  const { mapID } = useParams();
  const { updateMapByType } = useUpdateMap();

  const user = useRecoilValue(userState);
  const workspace = useRecoilValue(workspaceState);
  const selectedPerson = useRecoilValue(selectedJourneyMapPersona);
  const setUndoActions = useSetRecoilState(undoActionsState);
  const setRedoActions = useSetRecoilState(redoActionsState);
  const { showToast } = useWuShowToast();

  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(initialEndDate);
  const [surveys, setSurveys] = useState<Array<MetricsSurveyItemType>>([]);
  const [questions, setQuestions] = useState<Array<MetricsSurveyQuestionItemType>>([]);
  const [datapointFile, setDatapointFile] = useState<ObjectKeysType[]>([]);
  const [dataPoints, setDataPoints] = useState<Array<DatapointType>>([]);
  const [customMetrics, setCustomMetrics] = useState<Array<CustomMetricsType>>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState<boolean>(false);
  const [isOpenAddDataPointModal, setIsOpenAddDataPointModal] = useState<boolean>(false);
  const [isOpenAddCustomMetricsModal, setIsOpenAddCustomMetricsModal] = useState<boolean>(false);
  const [isOpenImportDataPointModal, setIsOpenImportDataPointModal] = useState<boolean>(false);
  const [isOpenImportDataPointTableModal, setIsOpenImportDataPointTableModal] =
    useState<boolean>(false);
  const [deletedDataPointsIds, setDeletedDataPointsIds] = useState<Array<number>>([]);
  const [deletedCustomMetricsIds, setDeletedCustomMetricsIds] = useState<Array<number>>([]);

  const { data: dataDataPoints, isLoading: isLoadingDataPoint } = useGetDataPointsQuery(
    {
      getDataPointsInput: {
        metricsId: selectedMetrics?.id!,
        type: selectedMetrics?.type!,
        offset: 0,
        limit: 100,
      },
    },
    {
      enabled: selectedMetrics?.source === MetricsSourceEnum.Manual,
    },
  );

  const { data: dataCustomMetricsItems, isLoading: isLoadingCustomMetricsItems } =
    useGetCustomMetricsItemsQuery(
      {
        metricsId: selectedMetrics?.id!,
      },
      {
        enabled: selectedMetrics?.source === MetricsSourceEnum.Custom,
      },
    );

  const { mutate: mutateCreateMetrics, isLoading: isLoadingCreateMetrics } =
    useCreateMetricsMutation({
      onSuccess: response => {
        const data = {
          stepId: selectedStepId,
          ...response.createMetrics,
        };

        updateMapByType(JourneyMapRowTypesEnum.METRICS, ActionsEnum.CREATE, data);
        setRedoActions([]);
        setUndoActions(undoPrev => [
          ...undoPrev,
          {
            id: uuidv4(),
            type: JourneyMapRowTypesEnum.METRICS,
            action: ActionsEnum.DELETE,
            data,
          },
        ]);
        onHandleCloseDrawer();
      },
      onError: (error: any) => {
        showToast({
          message: error?.message,
          variant: 'error',
        });
      },
    });

  const { mutate: mutateUpdateMetrics, isLoading: isLoadingUpdateMetrics } =
    useUpdateMetricsMutation();

  const getSurveys = useCallback(async () => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_QP_API}/cx/feedbacks/${workspace.feedbackId}/surveys`,
      {
        headers: {
          'api-key': user.userAPIKey,
        },
      },
    );
    setSurveys(res.data?.response || []);
  }, [user.userAPIKey, workspace.feedbackId]);

  const getQuestions = useCallback(
    async (id: number) => {
      setIsLoadingQuestions(true);
      const res = await axios.get(`${process.env.NEXT_PUBLIC_QP_API}/surveys/${id}/questions`, {
        headers: {
          'api-key': user.userAPIKey,
        },
      });
      setQuestions(res.data.response);
      setIsLoadingQuestions(false);
    },
    [user.userAPIKey],
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
    NPS: 'net_promoter_score',
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

  const onHandleDeleteDataPont = useCallback((item: { id: string | number }) => {
    if (typeof item?.id === 'number') {
      setDeletedDataPointsIds(prev => [...prev, item.id as number]);
    }
    setDataPoints(prev => prev.filter(r => r.id !== item.id));
  }, []);

  const onHandleDeleteCustomMetrics = useCallback((item: { id: string | number }) => {
    if (typeof item?.id === 'number') {
      setDeletedCustomMetricsIds(prev => [...prev, item.id as number]);
    }
    setCustomMetrics(prev => prev.filter(m => m.id !== item.id));
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
    setRedoActions([]);
    setUndoActions(undoPrev => [
      ...undoPrev,
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
              mapId: +mapID!,
              stepId: selectedStepId,
              personaId: selectedPerson?.id || null,
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
              mapId: +mapID!,
              stepId: selectedStepId,
              personaId: selectedPerson?.id || null,
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
              mapId: +mapID!,
              stepId: selectedStepId,
              personaId: selectedPerson?.id || null,
            },
          });
          break;
        }
      }
    }
  };

  const dataPointOptions = useMemo(() => {
    return METRICS_DATA_POINT_EXEL_OPTIONS({
      onHandleDelete: onHandleDeleteDataPont,
    });
  }, [onHandleDeleteDataPont]);

  const customMetricsOptions = useMemo(() => {
    return CUSTOM_METRICS_OPTIONS({
      onHandleDelete: onHandleDeleteCustomMetrics,
    });
  }, [onHandleDeleteCustomMetrics]);

  const columns: { [key: string]: Array<TableColumnType> } = useMemo(() => {
    return {
      [MetricsTypeEnum.Nps]: METRIC_NPS_DATA_POINT_TABLE_COLUMNS(),
      [MetricsTypeEnum.Csat]: METRIC_CSAT_DATA_POINT_TABLE_COLUMNS(),
      [MetricsTypeEnum.Ces]: METRIC_CES_DATA_POINT_TABLE_COLUMNS(),
    };
  }, []);

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
        goal: selectedMetrics.goal,
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
        <AddDataPointModal
          metricsType={type}
          isOpen={isOpenAddDataPointModal}
          onHandleAddDataPont={onHandleAddDataPont}
          handleClose={onToggleAddDataPointModal}
        />
      )}
      {isOpenAddCustomMetricsModal && (
        <AddCustomMetricsModal
          metricsType={type}
          isOpen={isOpenAddCustomMetricsModal}
          onHandleAddCustomMetrics={onHandleAddCustomMetrics}
          handleClose={onToggleAddCustomMetricsModal}
        />
      )}

      {isOpenImportDataPointModal && (
        <ImportDataPointModal
          metricsType={type}
          isOpen={isOpenImportDataPointModal}
          onHandleSetUploadFile={onHandleSetUploadFile}
          onToggleImportDataPointTableModal={onToggleImportDataPointTableModal}
          handleClose={onToggleImportDataPointModal}
        />
      )}
      {isOpenImportDataPointTableModal && (
        <ImportDataPointTableModal
          metricsType={type}
          isOpen={isOpenImportDataPointTableModal}
          datapointFile={datapointFile}
          onHandleAddDataPont={onHandleAddDataPont}
          handleClose={onToggleImportDataPointTableModal}
        />
      )}
      <div
        className={'create-update-metrics-drawer'}
        data-testid={'create-update-metrics-drawer-test-id'}>
        <ModalHeader title={`${selectedMetrics ? 'Update' : 'Create new'} metric`} />
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
                metricsSourceItems,
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
                    ? metricsTypeItems.slice(0, 2)
                    : metricsTypeItems,
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
                      .filter(q => filterType[type].includes(q.type))
                      .map(q => ({
                        id: q.questionID,
                        name: q.text,
                        value: q.questionID,
                      })),
                    () => {},
                    !survey || isLoadingQuestions,
                  )}

                  {renderDropdownBlock('dateRange', 'Track changes', 'Select', metricsTrackItems)}

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
                              <CalendarIcon />
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
                          <CalendarIcon />
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
                        <CustomButton
                          data-testid={'add-data-point-btn-test-id'}
                          startIcon={false}
                          variant={'outlined'}
                          onClick={
                            source === MetricsSourceEnum.Manual
                              ? onToggleAddDataPointModal
                              : onToggleAddCustomMetricsModal
                          }>
                          Add data point
                        </CustomButton>
                        {source === MetricsSourceEnum.Manual && (
                          <CustomButton
                            data-testid={'import-data-point-btn-test-id'}
                            startIcon={false}
                            onClick={onToggleImportDataPointModal}>
                            Import in bulk
                          </CustomButton>
                        )}
                      </div>
                    </div>

                    <div className="create-update-metrics-drawer--data-points-block--table-block">
                      {(selectedMetrics?.source === MetricsSourceEnum.Manual &&
                        isLoadingDataPoint) ||
                      (selectedMetrics?.source === MetricsSourceEnum.Custom &&
                        isLoadingCustomMetricsItems) ? (
                        <CustomLoader />
                      ) : dataPoints.length > 0 || customMetrics.length > 0 ? (
                        <>
                          {/* Render the table if rows exist */}
                          {dataPoints.length > 0 && (
                            <CustomTable
                              columns={columns[type]}
                              rows={calcIsDateRepeat(dataPoints)}
                              options={dataPointOptions}
                            />
                          )}

                          {/* Render custom metrics if they exist */}
                          {customMetrics.length > 0 && (
                            <CustomTable
                              columns={CUSTOM_METRICS_TABLE_COLUMNS}
                              rows={calcIsDateRepeat(customMetrics)}
                              options={customMetricsOptions}
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
              <CustomButton
                type={'submit'}
                data-testid={'create-update-metrics-submit-btn-test-id'}
                startIcon={false}
                sxStyles={{ width: '6.125rem' }}
                disabled={isLoadingCreateMetrics || isLoadingUpdateMetrics}
                isLoading={isLoadingCreateMetrics || isLoadingUpdateMetrics}>
                {selectedMetrics ? 'Update' : 'Create'}
              </CustomButton>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateUpdateMetricsDrawer;
