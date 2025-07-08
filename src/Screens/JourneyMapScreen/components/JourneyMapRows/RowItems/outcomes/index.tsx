import React, { FC, useCallback, useState } from 'react';

import './style.scss';

import { Draggable, Droppable } from '@hello-pangea/dnd';
import { useRecoilValue } from 'recoil';

import CustomLoader from '@/components/molecules/custom-loader/custom-loader';
import ErrorBoundary from '@/components/templates/error-boundary';
import { useUpdateMap } from '@/containers/journey-map-container/hooks/useUpdateMap';
import AddRowBoxElementBtn from '@/containers/journey-map-container/journey-map-rows/add-row-box-element-btn';
import MergeColumnsButton from '@/containers/journey-map-container/journey-map-rows/merge-columns-btn';
import OutcomeCard from '@/containers/journey-map-container/journey-map-rows/row-types/outcomes/outcome-card';
import OutcomeDrawer from '@/containers/journey-map-container/journey-map-rows/row-types/outcomes/outcome-drawer';
import UnMergeColumnsButton from '@/containers/journey-map-container/journey-map-rows/unmerge-columns-btn';
import { journeyMapState } from '@/store/atoms/journeyMap.atom';
import { currentLayerState } from '@/store/atoms/layers.atom';
import { findPreviousBox, getConnectionDetails } from '@/utils/helpers/general';
import {
  ActionsEnum,
  JourneyMapRowActionEnum,
  JourneyMapRowTypesEnum,
  OutcomeLevelEnum,
} from '@/utils/ts/enums/global-enums';
import { JourneyMapRowType } from '@/utils/ts/types/journey-map/journey-map-types';
import { MapOutcomeItemType } from '@/utils/ts/types/outcome/outcome-type';

import CardFlip from '../../../../../components/molecules/card-flip';
import MapItemBackCard from '../../../../../components/organisms/map-item-back-card';

interface ITouchpoints {
  width: number;
  row: JourneyMapRowType;
  rowIndex: number;
  disabled: boolean;
}

const Outcomes: FC<ITouchpoints> = ({ width, row, rowIndex, disabled }) => {
  const { updateMapByType } = useUpdateMap();
  const journeyMap = useRecoilValue(journeyMapState);
  const currentLayer = useRecoilValue(currentLayerState);
  const isLayerModeOn = !currentLayer?.isBase;

  const [selectedColumnStepId, setSelectedColumnStepId] = useState<{
    columnId: number;
    stepId: number;
  } | null>(null);
  const [isOpenDrawer, setIsOpenDrawer] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<MapOutcomeItemType | null>(null);

  const onHandleToggleOutcomeDrawer = useCallback((data?: MapOutcomeItemType) => {
    setSelectedItem(data || null);
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
    <div className={'journey-map-outcomes'}>
      {!disabled && (
        <OutcomeDrawer
          workspaceId={journeyMap?.workspaceId || null}
          singularNameType={row?.outcomeGroup?.name || ''}
          isOpenDrawer={isOpenDrawer}
          level={OutcomeLevelEnum.MAP}
          outcomeGroup={row?.outcomeGroup || null}
          selectedColumnStepId={selectedColumnStepId}
          selectedOutcome={selectedItem}
          onHandleToggleOutcomeDrawer={onHandleToggleOutcomeDrawer}
        />
      )}
      {row?.boxes?.map((rowItem, boxIndex) => (
        <React.Fragment
          key={`${JourneyMapRowTypesEnum.OUTCOMES}*${rowIndex}*${String(row.id)}*${boxIndex}`}>
          {!!rowItem.mergeCount && (
            <>
              {rowItem.isLoading ? (
                <div className={'journey-map-row--loading'}>
                  <CustomLoader />
                </div>
              ) : (
                <Droppable
                  droppableId={`${JourneyMapRowTypesEnum.OUTCOMES}*${rowIndex}*${String(
                    row.id,
                  )}*${boxIndex}*${rowItem.step.id}`}
                  key={`${JourneyMapRowTypesEnum.OUTCOMES}*${rowIndex}*${String(row.id)}*${boxIndex}`}
                  type={JourneyMapRowTypesEnum.OUTCOMES}>
                  {provided => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={'journey-map-outcomes--column'}
                      style={{
                        width: `${rowItem.mergeCount * width + rowItem.mergeCount - 1}px`,
                        minWidth: `${width}px`,
                      }}>
                      <div className={'journey-map-outcomes--column--item map-item'}>
                        {rowItem?.outcomes?.map((outcome, outcomeIndex: number) => {
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
                                      cardId={`${rowItem.id}-${outcome.id}`}
                                      hasFlippedText={!!outcome.flippedText?.length}
                                      frontCard={
                                        <ErrorBoundary>
                                          <OutcomeCard
                                            outcome={outcome}
                                            rowItem={rowItem}
                                            workspaceId={journeyMap?.workspaceId || null}
                                            disabled={disabled}
                                            dragHandleProps={provided2.dragHandleProps}
                                            openDrawer={onHandleToggleOutcomeDrawer}
                                            onHandleUpdateMapByType={onHandleUpdateMapByType}
                                          />
                                        </ErrorBoundary>
                                      }
                                      backCard={
                                        <MapItemBackCard
                                          className={`journey-map-outcomes--back-card`}
                                          annotationValue={outcome.flippedText || ''}
                                          rowId={row?.id}
                                          stepId={rowItem.step.id}
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
                          className={`${rowItem?.outcomes.length ? 'unmerge-btn-section-elements-type' : 'box-controls-container--blank-type'}`}>
                          <AddRowBoxElementBtn
                            itemsLength={rowItem?.outcomes.length}
                            label={row?.label?.toLowerCase() || ''}
                            boxIndex={boxIndex}
                            handleClick={() => {
                              onHandleToggleOutcomeDrawer();
                              setSelectedColumnStepId({
                                columnId: rowItem.columnId!,
                                stepId: rowItem.step.id!,
                              });
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

export default Outcomes;
