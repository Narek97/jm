import React, { FC, useCallback, useState } from 'react';

import './style.scss';

import { Draggable, Droppable } from '@hello-pangea/dnd';
import { useParams } from '@tanstack/react-router';

import TouchpointCard from './TouchpointCard';

import BaseWuLoader from '@/Components/Shared/BaseWuLoader';
import CardFlip from '@/Components/Shared/CardFlip';
import ErrorBoundary from '@/Features/ErrorBoundary';
import AddRowBoxElementBtn from '@/Screens/JourneyMapScreen/components/JourneyMapRows/components/AddRowBoxElementBtn';
import MapRowItemBackCard from '@/Screens/JourneyMapScreen/components/JourneyMapRows/components/MapRowItemBackCard';
import MergeColumnsButton from '@/Screens/JourneyMapScreen/components/JourneyMapRows/components/MergeColumnsBtn';
import UnMergeColumnsButton from '@/Screens/JourneyMapScreen/components/JourneyMapRows/components/UnmergeColumnsBtn';
import TouchpointDrawer from '@/Screens/JourneyMapScreen/components/JourneyMapRows/RowItems/Touchpoints/TouchpointDrawer';
import { findPreviousBox } from '@/Screens/JourneyMapScreen/helpers/findPreviousBox.ts';
import { getConnectionDetails } from '@/Screens/JourneyMapScreen/helpers/getConnectionDetails.ts';
import { useUpdateMap } from '@/Screens/JourneyMapScreen/hooks/useUpdateMap.tsx';
import { BoxType, JourneyMapRowType } from '@/Screens/JourneyMapScreen/types.ts';
import { useJourneyMapStore } from '@/Store/journeyMap.ts';
import { useLayerStore } from '@/Store/layers.ts';
import { ActionsEnum, JourneyMapRowActionEnum, JourneyMapRowTypesEnum } from '@/types/enum.ts';

interface ITouchpoints {
  width: number;
  row: JourneyMapRowType;
  rowIndex: number;
  disabled: boolean;
}

const Touchpoints: FC<ITouchpoints> = ({ width, row, rowIndex, disabled }) => {
  const { mapId } = useParams({
    from: '/_authenticated/_secondary-sidebar-layout/board/$boardId/journey-map/$mapId/',
  });
  const { updateMapByType } = useUpdateMap();

  const { journeyMap } = useJourneyMapStore();
  const { currentLayer } = useLayerStore();

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
    [updateMapByType],
  );

  return (
    <div className={'journey-map-touchpoints'}>
      <TouchpointDrawer
        rowItemID={row.id}
        mapId={+mapId}
        setSelectedStepId={setSelectedStepId}
        selectedColumnId={selectedColumnId}
        isOpenDrawer={isOpenDrawer}
        onHandleToggleTouchpointDrawer={onHandleToggleTouchpointDrawer}
      />

      {row?.boxes?.map((boxItem: BoxType, boxIndex) => (
        <React.Fragment
          key={`${JourneyMapRowTypesEnum.TOUCHPOINTS}*${rowIndex}*${String(row.id)}*${boxIndex}`}>
          {!!boxItem.mergeCount && (
            <>
              {boxItem.isLoading ? (
                <div className={'journey-map-row--loading'}>
                  <BaseWuLoader />
                </div>
              ) : (
                <Droppable
                  droppableId={`${JourneyMapRowTypesEnum.TOUCHPOINTS}*${rowIndex}*${String(
                    row.id,
                  )}*${boxIndex}*${boxItem.step?.id}`}
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
                        width: `${boxItem.mergeCount * width + boxItem.mergeCount - 1}px`,
                        minWidth: `${width}px`,
                      }}>
                      <div className={'journey-map-touchpoints--column--item map-item'}>
                        {boxItem?.touchPoints?.map((touchpoint, touchpointIndex: number) => {
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
                                      cardId={`${boxItem.id}-${touchpoint.id}`}
                                      hasFlippedText={!!touchpoint.flippedText?.length}
                                      frontCard={
                                        <ErrorBoundary>
                                          <TouchpointCard
                                            touchpoint={touchpoint}
                                            boxItem={boxItem}
                                            disabled={disabled}
                                            rowId={row.id}
                                            mapId={+mapId}
                                            onHandleUpdateMapByType={onHandleUpdateMapByType}
                                            dragHandleProps={provided2.dragHandleProps!}
                                          />
                                        </ErrorBoundary>
                                      }
                                      backCard={
                                        <MapRowItemBackCard
                                          className={`journey-map-touchpoints--back-card`}
                                          annotationValue={touchpoint.flippedText || ''}
                                          rowId={row?.id}
                                          stepId={boxItem.step?.id || 0}
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
                          className={`${boxItem?.touchPoints.length ? 'unmerge-btn-section-elements-type' : 'box-controls-container--blank-type'}`}>
                          <AddRowBoxElementBtn
                            itemsLength={boxItem?.touchPoints.length}
                            label={row?.label?.toLowerCase() || ''}
                            boxIndex={boxIndex}
                            handleClick={() => {
                              onHandleToggleTouchpointDrawer(boxItem.columnId, boxItem.step?.id);
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
                          endColumnId={boxItem.columnId}
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

export default Touchpoints;
