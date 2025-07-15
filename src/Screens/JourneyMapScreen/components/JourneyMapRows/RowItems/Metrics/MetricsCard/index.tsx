import { FC, memo, useCallback, useEffect, useMemo, useState } from 'react';

import './style.scss';

import { DraggableProvidedDragHandleProps } from '@hello-pangea/dnd';
import { Skeleton, Tooltip } from '@mui/material';
import axios from 'axios';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';

import {
  DeleteMetricsMutation,
  useDeleteMetricsMutation,
} from '@/api/mutations/generated/deleteMetrics.generated';
import {
  CommentAndNoteModelsEnum,
  MapCardTypeEnum,
  MetricsDateRangeEnum,
  MetricsSourceEnum,
  MetricsTypeEnum,
} from '@/api/types.ts';
import GoalIcon from '@/assets/public/base/goal.svg';
import GoalArrowIcon from '@/assets/public/base/goalArrow.svg';
import NpsArrowIcon from '@/assets/public/base/npsArrow.svg';
import MetricsIcon from '@/assets/public/mapRow/metrics.svg';
import CustomPieChart from '@/Components/Shared/CustomPieChart';
import CardHeader from '@/Screens/JourneyMapScreen/components/JourneyMapRows/components/CardHeader';
import { JOURNEY_MAP_METRICS_OPTIONS } from '@/Screens/JourneyMapScreen/components/JourneyMapRows/RowItems/Metrics/constants.tsx';
import { MetricsType } from '@/Screens/JourneyMapScreen/components/JourneyMapRows/RowItems/Metrics/types.ts';
import { BoxType } from '@/Screens/JourneyMapScreen/types.ts';
import { useUndoRedoStore } from '@/store/undoRedo.ts';
import { useUserStore } from '@/store/user.ts';
import { ActionsEnum, JourneyMapRowActionEnum, JourneyMapRowTypesEnum } from '@/types/enum';
import { getCurrentAndPreviousWeekDates } from '@/utils/getCurrentAndPreviousWeekDates.ts';

interface IMetricsCard {
  metrics: MetricsType;
  boxItem: BoxType;
  disabled: boolean;
  onHandleToggleCreateMetricsDrawer: (
    columnId?: number,
    stepId?: number,
    metrics?: MetricsType,
  ) => void;
  onHandleUpdateMapByType: (
    type: JourneyMapRowActionEnum | JourneyMapRowTypesEnum,
    action: ActionsEnum,
    data: any,
  ) => void;
  dragHandleProps: DraggableProvidedDragHandleProps | null;
}

const MetricsCard: FC<IMetricsCard> = memo(
  ({
    metrics,
    disabled,
    boxItem,
    onHandleToggleCreateMetricsDrawer,
    onHandleUpdateMapByType,
    dragHandleProps,
  }) => {
    const { user } = useUserStore();
    const { undoActions, updateUndoActions, updateRedoActions } = useUndoRedoStore();

    const [isOpenNote, setIsOpenNote] = useState<boolean>(false);
    const [answers, setAnswers] = useState<
      Array<{ count: number; percentage: number; title: string }>
    >([]);
    const [pastAnswers, setPastAnswers] = useState<
      Array<{ count: number; percentage: number; title: string }>
    >([]);
    const [isAnswersLoading, setIsAnswersLoading] = useState<boolean>(false);
    const [isPastAnswersLoading, setIsPastAnswersLoading] = useState<boolean>(false);
    const [isActiveMode, setIsActiveMode] = useState<boolean>(false);

    // const noteData = useRecoilValue(
    //   noteStateFamily({ type: CommentAndNoteModelsEnum.Metrics, id: metrics.id }),
    // );
    // const hasNote = noteData ? noteData?.text.length : metrics.note?.text.length;
    const hasNote = false;
    const getMetricsValue = () => {
      if (metrics.source === MetricsSourceEnum.Custom) {
        return metrics.value || 0;
      }
      switch (metrics.type) {
        case MetricsTypeEnum.Nps: {
          return metrics?.nps || answers[0]?.percentage - answers[2]?.percentage || 0;
        }
        case MetricsTypeEnum.Csat: {
          return metrics?.csat || answers[0]?.percentage || 0;
        }
        case MetricsTypeEnum.Ces: {
          return metrics?.ces || 0;
        }
        default: {
          return 0;
        }
      }
    };

    const getPastMetricsValue = () => {
      switch (metrics.type) {
        case MetricsTypeEnum.Nps: {
          return pastAnswers[0]?.percentage - pastAnswers[2]?.percentage || 0;
        }
        case MetricsTypeEnum.Csat: {
          return pastAnswers[0]?.percentage || 0;
        }
        default: {
          return 0;
        }
      }
    };

    const scaleValue = (
      value: number,
      inputMin: number,
      inputMax: number,
      outputMin: number,
      outputMax: number,
    ): number => {
      return ((value - inputMin) / (inputMax - inputMin)) * (outputMax - outputMin) + outputMin;
    };

    const metricsValue = getMetricsValue();
    const pastMetricsValue = getPastMetricsValue();
    const scaledValue = scaleValue(metricsValue, -100, 100, 0, 100); // Precompute the scaled value

    const metricsAverage =
      metrics.source === MetricsSourceEnum.Survey
        ? metricsValue - pastMetricsValue
        : metrics.overall;

    const { mutate: removeBoxMetrics, isPending: isLoadingCreateMetrics } =
      useDeleteMetricsMutation<Error, DeleteMetricsMutation>({
        onSuccess: () => {
          const data = {
            ...metrics,
            stepId: boxItem.step?.id || 0,
          };

          onHandleUpdateMapByType(JourneyMapRowTypesEnum.METRICS, ActionsEnum.DELETE, data);
          updateRedoActions([]);
          updateUndoActions([
            ...undoActions,
            {
              id: uuidv4(),
              type: JourneyMapRowTypesEnum.METRICS,
              action: ActionsEnum.CREATE,
              data,
            },
          ]);
        },
      });

    const getMetricsAnalytics = useCallback(
      async (startDate: string | null = null, endDate: string | null = null) => {
        setIsAnswersLoading(true);
        const res = await axios.post(
          `${import.meta.env.VITE_QP_API}}/surveys/${metrics.surveyId}/questions/${metrics.questionId}/analytics`,
          {
            startDate,
            endDate,
          },
          {
            headers: {
              'api-key': user?.userAPIKey,
            },
          },
        );
        return res.data.response;
      },
      [metrics.questionId, metrics.surveyId, user?.userAPIKey],
    );

    const calcMetricsStartAndEndDate = useCallback(
      (type: MetricsDateRangeEnum) => {
        const { current, previous } = getCurrentAndPreviousWeekDates();
        switch (type) {
          case MetricsDateRangeEnum.Daily: {
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);
            return {
              startDate: dayjs(today)?.format('YYYY-MM-DD'),
              endDate: dayjs(today)?.format('YYYY-MM-DD'),
              prevStartDate: dayjs(yesterday)?.format('YYYY-MM-DD'),
              prevEndDate: dayjs(yesterday)?.format('YYYY-MM-DD'),
            };
          }
          case MetricsDateRangeEnum.Weekly: {
            return {
              startDate: dayjs(current.start)?.format('YYYY-MM-DD'),
              endDate: dayjs(current.end)?.format('YYYY-MM-DD'),
              prevStartDate: dayjs(previous.start)?.format('YYYY-MM-DD'),
              prevEndDate: dayjs(previous.end)?.format('YYYY-MM-DD'),
            };
          }
          case MetricsDateRangeEnum.Monthly: {
            return {
              startDate: dayjs(current.startMonth)?.format('YYYY-MM-DD'),
              endDate: dayjs(current.endMonth)?.format('YYYY-MM-DD'),
              prevStartDate: dayjs(previous.startMonth)?.format('YYYY-MM-DD'),
              prevEndDate: dayjs(previous.endMonth)?.format('YYYY-MM-DD'),
            };
          }
          case MetricsDateRangeEnum.Yearly: {
            return {
              startDate: dayjs(current.startYear)?.format('YYYY-MM-DD'),
              endDate: dayjs(current.endYear)?.format('YYYY-MM-DD'),
              prevStartDate: dayjs(previous.startYear)?.format('YYYY-MM-DD'),
              prevEndDate: dayjs(previous.endYear)?.format('YYYY-MM-DD'),
            };
          }
          case MetricsDateRangeEnum.Custom: {
            return {
              startDate: metrics.startDate ? dayjs(metrics.startDate)?.format('YYYY-MM-DD') : null,
              endDate: metrics.endDate ? dayjs(metrics.endDate)?.format('YYYY-MM-DD') : null,
              prevStartDate: metrics.startDate
                ? dayjs(metrics.startDate)?.format('YYYY-MM-DD')
                : null,
              prevEndDate: metrics.endDate ? dayjs(metrics.endDate)?.format('YYYY-MM-DD') : null,
            };
          }
          default: {
            return {
              startDate: null,
              endDate: null,
              prevStartDate: null,
              prevEndDate: null,
            };
          }
        }
      },
      [metrics.endDate, metrics.startDate],
    );

    const getCurrentDateRange = (range: MetricsDateRangeEnum | null) => {
      switch (range) {
        case MetricsDateRangeEnum.Daily: {
          const today = new Date();
          const yesterday = new Date(today);
          return dayjs(yesterday.setDate(today.getDate() - 1)).format('MMM D');
        }
        case MetricsDateRangeEnum.Weekly: {
          const now: Date = new Date();
          const startOfYear: Date = new Date(now.getFullYear(), 0, 0);
          const diff: number = now.getTime() - startOfYear.getTime();
          const oneWeek: number = 1000 * 60 * 60 * 24 * 7;
          return `Week ${Math.floor(diff / oneWeek)}`;
        }
        case MetricsDateRangeEnum.Monthly: {
          return dayjs().subtract(1, 'month').format('MMM');
        }
        case MetricsDateRangeEnum.Yearly: {
          return dayjs().subtract(1, 'year').year();
        }
      }
    };

    const getMetricsChartWidth = (index: number): number => {
      if (metrics.source === MetricsSourceEnum.Manual) {
        if (index === 2) {
          return metrics.z;
        }
        if (index === 1) {
          return metrics.y;
        }
        if (index === 0) {
          return metrics.x;
        }
        return 0;
      } else {
        return answers[index]?.percentage || 0;
      }
    };

    const calculateOutput = (x: number) => {
      if (metrics.type === MetricsTypeEnum.Nps) {
        return ((x + 100) / 200) * 180;
      }
      return 1.8 * x;
    };

    const onHandleEditMetricsItem = useCallback(() => {
      onHandleToggleCreateMetricsDrawer(boxItem.columnId, boxItem.step?.id, metrics);
    }, [metrics, onHandleToggleCreateMetricsDrawer, boxItem.columnId, boxItem.step?.id]);

    const onHandleDeleteMetricsItem = useCallback(() => {
      removeBoxMetrics({
        id: metrics.id,
      });
    }, [metrics, removeBoxMetrics]);

    const onHandleToggleNote = useCallback(() => {
      setIsOpenNote(prev => !prev);
    }, []);

    const options = useMemo(() => {
      return JOURNEY_MAP_METRICS_OPTIONS({
        onHandleEdit: onHandleEditMetricsItem,
        onHandleDelete: onHandleDeleteMetricsItem,
      });
    }, [onHandleDeleteMetricsItem, onHandleEditMetricsItem]);

    const commentRelatedData = {
      title: boxItem.boxTextElement?.text || '',
      itemId: metrics.id,
      rowId: metrics.rowId,
      columnId: boxItem.columnId,
      stepId: boxItem.step?.id || 0,
      type: CommentAndNoteModelsEnum.Metrics,
    };

    useEffect(() => {
      if (metrics.source === MetricsSourceEnum.Survey) {
        const { startDate, endDate, prevStartDate, prevEndDate } = calcMetricsStartAndEndDate(
          metrics.dateRange || MetricsDateRangeEnum.Daily,
        );

        getMetricsAnalytics(startDate, endDate)
          .then(response => {
            setAnswers(response.questions?.at(0).answers || []);
          })
          .finally(() => {
            setIsAnswersLoading(false);
          });
        getMetricsAnalytics(prevStartDate, prevEndDate)
          .then(response => {
            setPastAnswers(response.questions?.at(0).answers || []);
          })
          .finally(() => {
            setIsPastAnswersLoading(false);
          });
      }
    }, [calcMetricsStartAndEndDate, getMetricsAnalytics, metrics.dateRange, metrics.source]);

    return (
      <div
        className={`metrics-item  ${isActiveMode ? 'active-map-card' : ''}`}
        data-testid={'metrics-card-test-id'}>
        <div className={`${isLoadingCreateMetrics ? 'metrics-item--loading' : ''}`} />

        <CardHeader
          cardType={MapCardTypeEnum.Metrics}
          icon={<img className={'w-1/2'} src={MetricsIcon} alt="Metrics" />}
          changeActiveMode={isActive => {
            setIsActiveMode(isActive);
          }}
          isShowPerson={!!metrics.persona}
          persona={{
            name: metrics.persona?.name || '',
            url: metrics.persona?.attachment?.url || '',
            key: metrics.persona?.attachment?.key || '',
            color: metrics.persona?.color || '#B052A7',
            croppedArea: metrics.persona?.attachment?.croppedArea || null,
          }}
          isShowNote={isOpenNote}
          note={{
            id: metrics.id,
            type: CommentAndNoteModelsEnum.Metrics,
            rowId: metrics.rowId,
            stepId: boxItem.step?.id || 0,
            onHandleOpenNote: onHandleToggleNote,
            onClickAway: onHandleToggleNote,
            hasValue: Boolean(hasNote),
          }}
          comment={{
            count: metrics?.commentsCount,
            item: commentRelatedData,
          }}
          attachedTagsCount={metrics?.tagsCount || 0}
          createTagItemAttrs={{
            columnId: boxItem.columnId,
            stepId: boxItem.step?.id || 0,
            rowId: metrics.rowId,
          }}
          menu={{
            item: commentRelatedData,
            options,
            disabled,
          }}
          dragHandleProps={dragHandleProps}
        />

        <div className={'metrics-item--content'}>
          <div className={'metrics-item--title-description-block'}>
            <p className={'metrics-item--title'}>
              <span data-testid={'metrics-card-name'}>{metrics.name}</span>
            </p>

            {metrics.description && metrics.descriptionEnabled && (
              <Tooltip title={metrics.description} placement="right" arrow data-testid="tooltip">
                <div className={'metrics-item--description'}>
                  <span className={'wm-info'} />
                </div>
              </Tooltip>
            )}
          </div>

          <div className={'metrics-item--score-block'}>
            <div className={'metrics-item--goal-date-block'}>
              <div className={'metrics-item--goal-block'}>
                <img src={GoalIcon} alt="GoalIcon" />
                <p>Goal:</p>
                <span data-testid={'metrics-card-goal'}>{metrics.goal}</span>
              </div>
              <div className={'metrics-item--average-block'}>
                {isAnswersLoading && isPastAnswersLoading ? (
                  <Skeleton width={40} />
                ) : (
                  <>
                    <span className={'wm-calendar-month'} />

                    <span className={'metrics-item--nps-date-range'}>
                      {getCurrentDateRange(metrics.dateRange || MetricsDateRangeEnum.Daily)}:
                    </span>
                    <span
                      className={`${
                        metricsAverage >= 0
                          ? 'metrics-item--nps-positive'
                          : 'metrics-item--nps-negative'
                      }`}>
                      <span
                        className={'wm-arrow-drop-down'}
                        style={{
                          color: metricsAverage >= 0 ? '#545E6B' : '#e53251',
                        }}
                      />
                    </span>
                    <span
                      className={`${
                        metricsAverage >= 0
                          ? 'metrics-item--nps-positive-value'
                          : 'metrics-item--nps-negative-value'
                      }`}>
                      {metricsAverage ? metricsAverage.toFixed(2) : metricsAverage}
                    </span>
                  </>
                )}
              </div>
            </div>

            <>
              {isAnswersLoading ? (
                <div className={'metrics-item--chart-block'}>
                  <Skeleton height={'80%'} />
                </div>
              ) : (
                <>
                  <div className={'metrics-item--chart-block'}>
                    <CustomPieChart
                      data={
                        metricsValue
                          ? metrics.source === MetricsSourceEnum.Custom
                            ? [
                                { title: '', value: scaledValue, color: '#1987e6' },
                                { title: '', value: 100 - scaledValue, color: '#d8d8d8' },
                              ]
                            : [
                                { title: '', value: getMetricsChartWidth(2), color: '#FF7681' },
                                { title: '', value: getMetricsChartWidth(1), color: '#FFCB47' },
                                { title: '', value: getMetricsChartWidth(0), color: '#1BA758' },
                              ]
                          : [
                              { title: '', value: 33, color: '#FF7681' },
                              { title: '', value: 33, color: '#FFCB47' },
                              { title: '', value: 33, color: '#1BA758' },
                            ]
                      }
                      lengthAngle={180}
                      startAngle={180}
                      lineWidth={20}
                    />
                    <div className={'metrics-item--chart-block--score-range-1'}>
                      {metrics.type === MetricsTypeEnum.Nps ? <span>-100</span> : <span>0</span>}
                    </div>
                    <div className={'metrics-item--chart-block--score-range-2'}>
                      <span>100</span>
                    </div>
                    <div className={'metrics-item--chart-block--score-number'}>
                      <div className={'metrics-item--chart-block--score-number--block'}>
                        <span className={'metrics-item--chart-block--score-number-title'}>
                          {metricsValue ? metricsValue.toFixed(2) : metricsValue}
                        </span>
                      </div>
                      <div className={'metrics-item--chart-block--score-number--block'}>
                        <span data-testid={'metrics-card-type'}>{metrics.type}</span>
                      </div>
                    </div>
                    <>
                      <img
                        src={NpsArrowIcon}
                        alt="NpsArrowIcon"
                        className={'metrics-item--chart-block--goal-arrow'}
                        style={{
                          transform: `rotate(${calculateOutput(metrics.goal || 0)}deg)`,
                        }}
                      />
                    </>
                    <>
                      <img
                        src={GoalArrowIcon}
                        alt="GoalArrowIcon"
                        className={'metrics-item--chart-block--goal-arrow'}
                        style={{
                          transform: `rotate(${calculateOutput(metrics.goal || 0)}deg)`,
                        }}
                      />
                    </>
                  </div>
                </>
              )}
            </>
          </div>
        </div>
      </div>
    );
  },
);

export default MetricsCard;
