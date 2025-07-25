import React, { FC, useCallback, useState } from 'react';

import './style.scss';

import { Draggable, Droppable } from '@hello-pangea/dnd';
import { useParams } from '@tanstack/react-router';

import OutcomeCard from './OutcomeCard';
import MergeColumnsButton from '../../components/MergeColumnsBtn';
import UnMergeColumnsButton from '../../components/UnmergeColumnsBtn';

import BaseWuLoader from '@/Components/Shared/BaseWuLoader';
import CardFlip from '@/Components/Shared/CardFlip';
import ErrorBoundary from '@/Features/ErrorBoundary';
import AddRowBoxElementBtn from '@/Screens/JourneyMapScreen/components/JourneyMapRows/components/AddRowBoxElementBtn';
import MapRowItemBackCard from '@/Screens/JourneyMapScreen/components/JourneyMapRows/components/MapRowItemBackCard';
import OutcomeDrawer from '@/Screens/JourneyMapScreen/components/JourneyMapRows/RowItems/Outcomes/CreateUpdateOutcomeDrawer';
import { OutcomeType } from '@/Screens/JourneyMapScreen/components/JourneyMapRows/RowItems/Outcomes/types.ts';
import { findPreviousBox } from '@/Screens/JourneyMapScreen/helpers/findPreviousBox.ts';
import { getConnectionDetails } from '@/Screens/JourneyMapScreen/helpers/getConnectionDetails';
import { useUpdateMap } from '@/Screens/JourneyMapScreen/hooks/useUpdateMap';
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

const Outcomes: FC<ITouchpoints> = ({ width, row, rowIndex, disabled }) => {
  const { mapId } = useParams({
    from: '/_authenticated/_secondary-sidebar-layout/board/$boardId/journey-map/$mapId/',
  });

  const { updateMapByType } = useUpdateMap();

  const { journeyMap } = useJourneyMapStore();
  const { currentLayer } = useLayerStore();

  const isLayerModeOn = !currentLayer?.isBase;

  const [selectedColumnStepId, setSelectedColumnStepId] = useState<{
    columnId: number;
    stepId: number;
  } | null>(null);
  const [isOpenDrawer, setIsOpenDrawer] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<OutcomeType | null>(null);

  const onHandleToggleOutcomeDrawer = useCallback((data?: OutcomeType) => {
    setSelectedItem(data || null);
    setIsOpenDrawer(prev => !prev);
  }, []);

  const onHandleUpdateMapByType = useCallback(
    (type: JourneyMapRowActionEnum | JourneyMapRowTypesEnum, action: ActionsEnum, data: any) => {
      updateMapByType(type, action, data);
    },
    [updateMapByType],
  );

  return (
    <div className={'journey-map-outcomes'}>
      {!disabled && (
        <OutcomeDrawer
          workspaceId={journeyMap?.workspaceId || null}
          mapId={+mapId}
          singularNameType={row?.outcomeGroup?.name || ''}
          isOpenDrawer={isOpenDrawer}
          outcomeGroup={row.outcomeGroup}
          selectedColumnStepId={selectedColumnStepId}
          selectedOutcome={selectedItem}
          onHandleToggleOutcomeDrawer={onHandleToggleOutcomeDrawer}
        />
      )}
      {row?.boxes?.map((boxItem: BoxType, boxIndex) => (
        <React.Fragment
          key={`${JourneyMapRowTypesEnum.OUTCOMES}*${rowIndex}*${String(row.id)}*${boxIndex}`}>
          {!!boxItem.mergeCount && (
            <>
              {boxItem.isLoading ? (
                <div className={'journey-map-row--loading'}>
                  <BaseWuLoader />
                </div>
              ) : (
                <Droppable
                  droppableId={`${JourneyMapRowTypesEnum.OUTCOMES}*${rowIndex}*${String(
                    row.id,
                  )}*${boxIndex}*${boxItem.step?.id}`}
                  key={`${JourneyMapRowTypesEnum.OUTCOMES}*${rowIndex}*${String(row.id)}*${boxIndex}`}
                  type={JourneyMapRowTypesEnum.OUTCOMES}>
                  {provided => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={'journey-map-outcomes--column'}
                      style={{
                        width: `${boxItem.mergeCount * width + boxItem.mergeCount - 1}px`,
                        minWidth: `${width}px`,
                      }}>
                      <div className={'journey-map-outcomes--column--item map-item'}>
                        {boxItem.outcomes?.map((outcome, outcomeIndex: number) => {
                          return (
                            <Draggable
                              key={
                                outcome?.id +
                                '_' +
                                outcomeIndex +
                                '_' +
                                JourneyMapRowTypesEnum.OUTCOMES
                              }
                              draggableId={
                                String(outcome?.id) + '_' + JourneyMapRowTypesEnum.OUTCOMES
                              }
                              index={outcomeIndex}
                              isDragDisabled={disabled}>
                              {provided2 => {
                                return (
                                  <div
                                    {...provided2.draggableProps}
                                    className={'journey-map-outcomes--card'}
                                    data-testid={'outcome-item-test-id'}
                                    ref={provided2.innerRef}>
                                    <CardFlip
                                      cardId={`${boxItem.id}-${outcome.id}`}
                                      hasFlippedText={!!outcome.flippedText?.length}
                                      frontCard={
                                        <ErrorBoundary>
                                          <OutcomeCard
                                            outcome={outcome}
                                            boxItem={boxItem}
                                            workspaceId={journeyMap?.workspaceId || null}
                                            mapId={+mapId}
                                            disabled={disabled}
                                            openDrawer={onHandleToggleOutcomeDrawer}
                                            onHandleUpdateMapByType={onHandleUpdateMapByType}
                                            dragHandleProps={provided2.dragHandleProps}
                                          />
                                        </ErrorBoundary>
                                      }
                                      backCard={
                                        <MapRowItemBackCard
                                          className={`journey-map-outcomes--back-card`}
                                          annotationValue={outcome.flippedText || ''}
                                          rowId={row?.id}
                                          stepId={boxItem.step?.id || 0}
                                          itemId={outcome.id}
                                          itemKey={'outcomes'}
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
                          className={`${boxItem.outcomes.length ? 'unmerge-btn-section-elements-type' : 'box-controls-container--blank-type'}`}>
                          <AddRowBoxElementBtn
                            itemsLength={boxItem.outcomes.length}
                            label={row?.label?.toLowerCase() || ''}
                            boxIndex={boxIndex}
                            handleClick={() => {
                              onHandleToggleOutcomeDrawer();
                              setSelectedColumnStepId({
                                columnId: boxItem.columnId,
                                stepId: boxItem.step?.id || 0,
                              });
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

export default Outcomes;
