import React, { FC, useCallback, useState } from 'react';

import './style.scss';

import { Draggable, Droppable } from '@hello-pangea/dnd';
import Drawer from '@mui/material/Drawer';
import { useRecoilValue } from 'recoil';

import CustomLoader from '@/components/molecules/custom-loader/custom-loader';
import ErrorBoundary from '@/components/templates/error-boundary';
import { useUpdateMap } from '@/containers/journey-map-container/hooks/useUpdateMap';
import AddRowBoxElementBtn from '@/containers/journey-map-container/journey-map-rows/add-row-box-element-btn';
import MergeColumnsButton from '@/containers/journey-map-container/journey-map-rows/merge-columns-btn';
import CreateUpdateMetricsDrawer from '@/containers/journey-map-container/journey-map-rows/row-types/metrics/create-update-metrics-drawer';
import MetricsCard from '@/containers/journey-map-container/journey-map-rows/row-types/metrics/metrics-card';
import UnMergeColumnsButton from '@/containers/journey-map-container/journey-map-rows/unmerge-columns-btn';
import { journeyMapState } from '@/store/atoms/journeyMap.atom';
import { currentLayerState } from '@/store/atoms/layers.atom';
import { findPreviousBox, getConnectionDetails } from '@/utils/helpers/general';
import {
  ActionsEnum,
  JourneyMapRowActionEnum,
  JourneyMapRowTypesEnum,
} from '@/utils/ts/enums/global-enums';
import { JourneyMapRowType, MetricsType } from '@/utils/ts/types/journey-map/journey-map-types';

import CardFlip from '../../../../../components/molecules/card-flip';
import MapItemBackCard from '../../../../../components/organisms/map-item-back-card';

interface IMetrics {
  width: number;
  row: JourneyMapRowType;
  rowIndex: number;
  disabled: boolean;
}

const Metrics: FC<IMetrics> = ({ width, row, rowIndex, disabled }) => {
  const { updateMapByType } = useUpdateMap();

  const journeyMap = useRecoilValue(journeyMapState);
  const currentLayer = useRecoilValue(currentLayerState);
  const isLayerModeOn = !currentLayer?.isBase;

  const [isOpenCreateMetricsDrawer, setIsOpenCreateMetricsDrawer] = useState<boolean>(false);
  const [selectedColumnId, setSelectedColumnId] = useState<number | null>(null);
  const [selectedStepId, setSelectedStepId] = useState<number | null>(null);
  const [selectedMetrics, setSelectedMetrics] = useState<MetricsType | null>(null);

  const onHandleToggleCreateMetricsDrawer = useCallback(
    (columnId?: number, stepId?: number, metrics?: MetricsType) => {
      setSelectedColumnId(columnId || null);
      setSelectedMetrics(metrics || null);
      setSelectedStepId(stepId || null);
      setIsOpenCreateMetricsDrawer(prev => !prev);
    },
    [],
  );

  const onHandleUpdateMapByType = useCallback(
    (type: JourneyMapRowActionEnum | JourneyMapRowTypesEnum, action: ActionsEnum, data: any) => {
      updateMapByType(type, action, data);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <div className={'journey-map-metrics'} data-testid={`metrics-row-${row.id}-test-id`}>
      <Drawer
        anchor={'left'}
        open={isOpenCreateMetricsDrawer}
        onClose={() => onHandleToggleCreateMetricsDrawer()}>
        <CreateUpdateMetricsDrawer
          rowItemID={row.id}
          selectedColumnId={selectedColumnId!}
          selectedStepId={selectedStepId!}
          selectedMetrics={selectedMetrics}
          onHandleCloseDrawer={onHandleToggleCreateMetricsDrawer}
        />
      </Drawer>

      {row?.boxes?.map((rowItem, boxIndex) => (
        <React.Fragment
          key={`${JourneyMapRowTypesEnum.METRICS}*${rowIndex}*${String(row.id)}*${boxIndex}`}>
          {!!rowItem.mergeCount && (
            <>
              {rowItem.isLoading ? (
                <div className={'journey-map-row--loading'}>
                  <CustomLoader />
                </div>
              ) : (
                <Droppable
                  droppableId={`${JourneyMapRowTypesEnum.METRICS}*${rowIndex}*${String(
                    row.id,
                  )}*${boxIndex}*${rowItem.step.id}`}
                  key={`${JourneyMapRowTypesEnum.METRICS}*${rowIndex}*${String(row.id)}*${boxIndex}`}
                  type={JourneyMapRowTypesEnum.METRICS}>
                  {provided => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={'journey-map-metrics--column'}
                      data-testid={`metrics-column-${boxIndex}-test-id`}
                      style={{
                        width: `${rowItem.mergeCount * width + rowItem.mergeCount - 1}px`,
                        minWidth: `${width}px`,
                      }}>
                      <div className={'journey-map-metrics--column--item map-item'}>
                        {rowItem?.metrics?.map((metrics, metricsIndex: number) => {
                          return (
                            <Draggable
                              key={
                                metrics?.id +
                                '_' +
                                metricsIndex +
                                '_' +
                                JourneyMapRowTypesEnum.METRICS
                              }
                              draggableId={
                                String(metrics?.id) + '_' + JourneyMapRowTypesEnum.METRICS
                              }
                              index={metricsIndex}
                              isDragDisabled={disabled}>
                              {provided2 => {
                                return (
                                  <div
                                    {...provided2.draggableProps}
                                    className={'journey-map-metrics--card'}
                                    ref={provided2.innerRef}>
                                    <CardFlip
                                      cardId={`${row.id}-${metrics.id}`}
                                      hasFlippedText={!!metrics.flippedText?.length}
                                      frontCard={
                                        <ErrorBoundary>
                                          <MetricsCard
                                            metrics={metrics}
                                            rowItem={rowItem}
                                            disabled={disabled}
                                            dragHandleProps={provided2.dragHandleProps!}
                                            onHandleToggleCreateMetricsDrawer={
                                              onHandleToggleCreateMetricsDrawer
                                            }
                                            onHandleUpdateMapByType={onHandleUpdateMapByType}
                                          />
                                        </ErrorBoundary>
                                      }
                                      backCard={
                                        <MapItemBackCard
                                          className={`journey-map-metrics--back-card`}
                                          annotationValue={metrics.flippedText}
                                          rowId={row.id}
                                          stepId={rowItem.step.id}
                                          itemId={metrics.id}
                                          itemKey={'metrics'}
                                        />
                                      }
                                    />
                                  </div>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                        <div
                          className={`${rowItem?.metrics.length ? 'unmerge-btn-section-elements-type' : 'box-controls-container--blank-type'}`}>
                          <AddRowBoxElementBtn
                            itemsLength={rowItem?.metrics.length}
                            label={row?.label?.toLowerCase() || ''}
                            boxIndex={boxIndex}
                            handleClick={() => {
                              onHandleToggleCreateMetricsDrawer(rowItem.columnId, rowItem.step.id);
                            }}
                          />
                          {rowItem.mergeCount > 1 && row.boxes && !isLayerModeOn && (
                            <UnMergeColumnsButton
                              boxIndex={rowItem.mergeCount - 1 + boxIndex}
                              rowId={row?.id}
                              rowItem={row.boxes[boxIndex + rowItem.mergeCount - 1]}
                              boxes={row?.boxes}
                            />
                          )}
                        </div>
                      </div>
                      {boxIndex > 0 && row?.boxes && !isLayerModeOn && (
                        <MergeColumnsButton
                          connectionStart={getConnectionDetails(
                            row.boxes[boxIndex - 1],
                            journeyMap,
                          )}
                          connectionEnd={getConnectionDetails(rowItem, journeyMap)}
                          rowId={row?.id}
                          previousBoxDetails={findPreviousBox(row.boxes, boxIndex)}
                          endStepId={rowItem?.step?.id!}
                          endColumnId={rowItem?.columnId!}
                          endBoxMergeCount={rowItem.mergeCount}
                        />
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              )}
            </>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Metrics;
