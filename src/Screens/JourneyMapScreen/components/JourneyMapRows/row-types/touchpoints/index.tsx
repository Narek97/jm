import React, { FC, useCallback, useState } from 'react';

import './style.scss';

import { Draggable, Droppable } from '@hello-pangea/dnd';
import { useRecoilValue } from 'recoil';

import CardFlip from '@/components/molecules/card-flip';
import CustomLoader from '@/components/molecules/custom-loader/custom-loader';
import MapItemBackCard from '@/components/organisms/map-item-back-card';
import ErrorBoundary from '@/components/templates/error-boundary';
import { useUpdateMap } from '@/containers/journey-map-container/hooks/useUpdateMap';
import AddRowBoxElementBtn from '@/containers/journey-map-container/journey-map-rows/add-row-box-element-btn';
import MergeColumnsButton from '@/containers/journey-map-container/journey-map-rows/merge-columns-btn';
import TouchpointCard from '@/containers/journey-map-container/journey-map-rows/row-types/touchpoints/touchpoint-card';
import TouchpointDrawer from '@/containers/journey-map-container/journey-map-rows/row-types/touchpoints/touchpoint-drawer';
import UnMergeColumnsButton from '@/containers/journey-map-container/journey-map-rows/unmerge-columns-btn';
import { journeyMapState } from '@/store/atoms/journeyMap.atom';
import { currentLayerState } from '@/store/atoms/layers.atom';
import { findPreviousBox, getConnectionDetails } from '@/utils/helpers/general';
import {
  ActionsEnum,
  JourneyMapRowActionEnum,
  JourneyMapRowTypesEnum,
} from '@/utils/ts/enums/global-enums';
import { JourneyMapRowType } from '@/utils/ts/types/journey-map/journey-map-types';

interface ITouchpoints {
  width: number;
  row: JourneyMapRowType;
  rowIndex: number;
  disabled: boolean;
}

const Touchpoints: FC<ITouchpoints> = ({ width, row, rowIndex, disabled }) => {
  const { updateMapByType } = useUpdateMap();

  const journeyMap = useRecoilValue(journeyMapState);
  const currentLayer = useRecoilValue(currentLayerState);
  const isLayerModeOn = !currentLayer?.isBase;

  const [isOpenDrawer, setIsOpenDrawer] = useState<boolean>(false);
  const [selectedColumnId, setSelectedColumnId] = useState<number | null>(null);
  const [setSelectedStepId, setSetSelectedStepId] = useState<number | null>(null);

  const onHandleToggleTouchpointDrawer = useCallback((columnId?: number, stepId?: number) => {
    setSelectedColumnId(columnId || null);
    setSetSelectedStepId(stepId || null);
    setIsOpenDrawer(prev => !prev);
  }, []);

  const onHandleUpdateMapByType = useCallback(
    (type: JourneyMapRowActionEnum | JourneyMapRowTypesEnum, action: ActionsEnum, data: any) => {
      updateMapByType(type, action, data);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <div className={'journey-map-touchpoints'}>
      {!disabled && (
        <TouchpointDrawer
          rowItemID={row.id}
          setSelectedStepId={setSelectedStepId}
          selectedColumnId={selectedColumnId}
          isOpenDrawer={isOpenDrawer}
          onHandleToggleTouchpointDrawer={onHandleToggleTouchpointDrawer}
        />
      )}

      {row?.boxes?.map((rowItem, boxIndex) => (
        <React.Fragment
          key={`${JourneyMapRowTypesEnum.TOUCHPOINTS}*${rowIndex}*${String(row.id)}*${boxIndex}`}>
          {!!rowItem.mergeCount && (
            <>
              {rowItem.isLoading ? (
                <div className={'journey-map-row--loading'}>
                  <CustomLoader />
                </div>
              ) : (
                <Droppable
                  droppableId={`${JourneyMapRowTypesEnum.TOUCHPOINTS}*${rowIndex}*${String(
                    row.id,
                  )}*${boxIndex}*${rowItem.step.id}`}
                  key={`${JourneyMapRowTypesEnum.TOUCHPOINTS}*${rowIndex}*${String(
                    row.id,
                  )}*${boxIndex}`}
                  type={JourneyMapRowTypesEnum.TOUCHPOINTS}>
                  {provided => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={'journey-map-touchpoints--column'}
                      data-testid={`touchpoint-column-${boxIndex}-test-id`}
                      style={{
                        width: `${rowItem.mergeCount * width + rowItem.mergeCount - 1}px`,
                        minWidth: `${width}px`,
                      }}>
                      <div className={'journey-map-touchpoints--column--item map-item'}>
                        {rowItem?.touchPoints?.map((touchpoint, touchpointIndex: number) => {
                          return (
                            <Draggable
                              key={
                                touchpoint?.id +
                                '_' +
                                touchpointIndex +
                                '_' +
                                JourneyMapRowTypesEnum.TOUCHPOINTS
                              }
                              draggableId={
                                String(touchpoint?.id) + '_' + JourneyMapRowTypesEnum.TOUCHPOINTS
                              }
                              index={touchpointIndex}
                              isDragDisabled={disabled}>
                              {provided2 => {
                                return (
                                  <div
                                    {...provided2.draggableProps}
                                    id={`touchpoint-item-${touchpoint?.id}`}
                                    className={`journey-map-touchpoints--card  map-item `}
                                    data-testid={'touchpoint-item-test-id'}
                                    ref={provided2.innerRef}>
                                    <CardFlip
                                      cardId={`${rowItem.id}-${touchpoint.id}`}
                                      hasFlippedText={!!touchpoint.flippedText?.length}
                                      frontCard={
                                        <ErrorBoundary>
                                          <TouchpointCard
                                            touchpoint={touchpoint}
                                            rowItem={rowItem}
                                            disabled={disabled}
                                            rowId={row.id}
                                            onHandleUpdateMapByType={onHandleUpdateMapByType}
                                            dragHandleProps={provided2.dragHandleProps!}
                                          />
                                        </ErrorBoundary>
                                      }
                                      backCard={
                                        <MapItemBackCard
                                          className={`journey-map-touchpoints--back-card`}
                                          annotationValue={touchpoint.flippedText}
                                          rowId={row?.id}
                                          stepId={rowItem.step.id}
                                          itemId={touchpoint.id}
                                          itemKey={'touchPoints'}
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
                          className={`${rowItem?.touchPoints.length ? 'unmerge-btn-section-elements-type' : 'box-controls-container--blank-type'}`}>
                          <AddRowBoxElementBtn
                            itemsLength={rowItem?.touchPoints.length}
                            label={row?.label?.toLowerCase() || ''}
                            boxIndex={boxIndex}
                            handleClick={() => {
                              onHandleToggleTouchpointDrawer(rowItem.columnId, rowItem.step.id);
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

export default Touchpoints;
