import React, { FC, useCallback, useState } from 'react';

import './style.scss';

import { Draggable, Droppable } from '@hello-pangea/dnd';
import { Drawer } from '@mui/material';

import MetricsCard from './MetricsCard';
import AddRowBoxElementBtn from '../../components/AddRowBoxElementBtn';

import CardFlip from '@/Components/Shared/CardFlip';
import CustomLoader from '@/Components/Shared/CustomLoader';
import ErrorBoundary from '@/Features/ErrorBoundary';
import MapRowItemBackCard from '@/Screens/JourneyMapScreen/components/JourneyMapRows/components/MapRowItemBackCard';
import MergeColumnsButton from '@/Screens/JourneyMapScreen/components/JourneyMapRows/components/MergeColumnsBtn';
import UnMergeColumnsButton from '@/Screens/JourneyMapScreen/components/JourneyMapRows/components/UnmergeColumnsBtn';
import CreateUpdateMetricsDrawer from '@/Screens/JourneyMapScreen/components/JourneyMapRows/RowItems/Metrics/CreateUpdateMetricsDrawer';
import { MetricsType } from '@/Screens/JourneyMapScreen/components/JourneyMapRows/RowItems/Metrics/types.ts';
import { findPreviousBox } from '@/Screens/JourneyMapScreen/helpers/findPreviousBox.ts';
import { getConnectionDetails } from '@/Screens/JourneyMapScreen/helpers/getConnectionDetails.ts';
import { useUpdateMap } from '@/Screens/JourneyMapScreen/hooks/useUpdateMap.tsx';
import { BoxType, JourneyMapRowType } from '@/Screens/JourneyMapScreen/types';
import { useJourneyMapStore } from '@/store/journeyMap.ts';
import { useLayerStore } from '@/store/layers.ts';
import { ActionsEnum, JourneyMapRowActionEnum, JourneyMapRowTypesEnum } from '@/types/enum.ts';

interface IMetrics {
  width: number;
  row: JourneyMapRowType;
  rowIndex: number;
  disabled: boolean;
}

const Metrics: FC<IMetrics> = ({ width, row, rowIndex, disabled }) => {
  const { updateMapByType } = useUpdateMap();

  const { journeyMap } = useJourneyMapStore();
  const { currentLayer } = useLayerStore();

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
    [updateMapByType],
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

      {row?.boxes?.map((boxItem: BoxType, boxIndex) => (
        <React.Fragment
          key={`${JourneyMapRowTypesEnum.METRICS}*${rowIndex}*${String(row.id)}*${boxIndex}`}>
          {!!boxItem.mergeCount && (
            <>
              {boxItem.isLoading ? (
                <div className={'journey-map-row--loading'}>
                  <CustomLoader />
                </div>
              ) : (
                <Droppable
                  droppableId={`${JourneyMapRowTypesEnum.METRICS}*${rowIndex}*${String(
                    row.id,
                  )}*${boxIndex}*${boxItem.step?.id}`}
                  key={`${JourneyMapRowTypesEnum.METRICS}*${rowIndex}*${String(row.id)}*${boxIndex}`}
                  type={JourneyMapRowTypesEnum.METRICS}>
                  {provided => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={'journey-map-metrics--column'}
                      data-testid={`metrics-column-${boxIndex}-test-id`}
                      style={{
                        width: `${boxItem.mergeCount * width + boxItem.mergeCount - 1}px`,
                        minWidth: `${width}px`,
                      }}>
                      <div className={'journey-map-metrics--column--item map-item'}>
                        {boxItem.metrics?.map((metrics, metricsIndex: number) => {
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
                                    id={`metrics-item-${metrics?.id}`}
                                    className={'journey-map-metrics--card'}
                                    data-testid={'metrics-item-test-id'}
                                    ref={provided2.innerRef}>
                                    <CardFlip
                                      cardId={`${row.id}-${metrics.id}`}
                                      hasFlippedText={!!metrics.flippedText?.length}
                                      frontCard={
                                        <ErrorBoundary>
                                          <MetricsCard
                                            metrics={metrics}
                                            boxItem={boxItem}
                                            disabled={disabled}
                                            onHandleToggleCreateMetricsDrawer={
                                              onHandleToggleCreateMetricsDrawer
                                            }
                                            onHandleUpdateMapByType={onHandleUpdateMapByType}
                                            dragHandleProps={provided2.dragHandleProps}
                                          />
                                        </ErrorBoundary>
                                      }
                                      backCard={
                                        <MapRowItemBackCard
                                          className={`journey-map-metrics--back-card`}
                                          annotationValue={metrics.flippedText || ''}
                                          rowId={row.id}
                                          stepId={boxItem.step?.id || 0}
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
                          className={`${boxItem.metrics.length ? 'unmerge-btn-section-elements-type' : 'box-controls-container--blank-type'}`}>
                          <AddRowBoxElementBtn
                            itemsLength={boxItem.metrics.length}
                            label={row?.label?.toLowerCase() || ''}
                            boxIndex={boxIndex}
                            handleClick={() => {
                              onHandleToggleCreateMetricsDrawer(boxItem.columnId, boxItem.step?.id);
                            }}
                          />
                          {boxItem.mergeCount > 1 && row.boxes && !isLayerModeOn && (
                            <UnMergeColumnsButton
                              boxIndex={boxItem.mergeCount - 1 + boxIndex}
                              rowId={row?.id}
                              boxItem={row.boxes[boxIndex + boxItem.mergeCount - 1]}
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
                          connectionEnd={getConnectionDetails(boxItem, journeyMap)}
                          rowId={row?.id}
                          previousBoxDetails={findPreviousBox(row.boxes, boxIndex)}
                          endStepId={boxItem.step?.id || 0}
                          endColumnId={boxItem.columnId!}
                          endBoxMergeCount={boxItem.mergeCount}
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
