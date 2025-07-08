import React, { FC, useCallback } from 'react';

import './style.scss';

import { Draggable, Droppable } from '@hello-pangea/dnd';
import { useRecoilValue } from 'recoil';

import CardFlip from '@/components/molecules/card-flip';
import CustomLoader from '@/components/molecules/custom-loader/custom-loader';
import MapItemBackCard from '@/components/organisms/map-item-back-card';
import { useCrudMapBoxElement } from '@/containers/journey-map-container/hooks/useCRUDMapBoxElement';
import AddRowBoxElementBtn from '@/containers/journey-map-container/journey-map-rows/add-row-box-element-btn';
import MergeColumnsButton from '@/containers/journey-map-container/journey-map-rows/merge-columns-btn';
import CardInput from '@/containers/journey-map-container/journey-map-rows/row-types/row-text-fields/draggable-cards/card-Input';
import UnMergeColumnsButton from '@/containers/journey-map-container/journey-map-rows/unmerge-columns-btn';
import { useAddBoxElementMutation } from '@/gql/mutations/generated/addBoxElement.generated';
import { useRemoveBoxElementMutation } from '@/gql/mutations/generated/removeBoxElement.generated';
import { journeyMapState, selectedJourneyMapPersona } from '@/store/atoms/journeyMap.atom';
import { currentLayerState } from '@/store/atoms/layers.atom';
import { findPreviousBox, getConnectionDetails } from '@/utils/helpers/general';
import { ActionsEnum } from '@/utils/ts/enums/global-enums';
import {
  JourneyMapDraggableTextFields,
  JourneyMapRowType,
} from '@/utils/ts/types/journey-map/journey-map-types';

interface IDraggableCards {
  row: JourneyMapRowType;
  rowIndex: number;
  type: JourneyMapDraggableTextFields;
  width: number;
  headerColor: string;
  bodyColor: string;
  disabled: boolean;
}

const DraggableCards: FC<IDraggableCards> = ({
  row,
  rowIndex,
  type,
  width,
  headerColor,
  bodyColor,
  disabled,
}) => {
  const currentLayer = useRecoilValue(currentLayerState);
  const isLayerModeOn = !currentLayer?.isBase;

  const journeyMap = useRecoilValue(journeyMapState);

  const { crudBoxElement } = useCrudMapBoxElement();
  const selectedPerson = useRecoilValue(selectedJourneyMapPersona);

  const { mutate: addBoxElement } = useAddBoxElementMutation({
    onSuccess: response => {
      crudBoxElement(response?.addBoxElement, ActionsEnum.CREATE);
    },
  });

  const { mutate: removeBoxElement, isLoading: isLoadingRemoveBoxElement } =
    useRemoveBoxElementMutation({
      onSuccess: response => {
        crudBoxElement(response?.removeBoxElement, ActionsEnum.DELETE);
      },
    });

  const onHandleAddBoxElement = (columnId: number, stepId: number) => {
    addBoxElement({
      addBoxElementInput: {
        rowId: row?.id,
        stepId,
        columnId: columnId || 1,
        personaId: selectedPerson?.id || null,
        text: '',
      },
    });
  };

  const onHandleDeleteBoxElement = useCallback(
    ({ itemId }: { itemId: number }) => {
      removeBoxElement({
        removeBoxElementInput: {
          boxElementId: itemId!,
        },
      });
    },
    [removeBoxElement],
  );

  return (
    <>
      {row?.boxes?.map((rowItem, boxIndex) => (
        <React.Fragment key={`${type}*${rowIndex}*${String(row?.id)}*${boxIndex}`}>
          {!!rowItem.mergeCount && (
            <div className={'cons-pros-interaction'}>
              {rowItem.isLoading ? (
                <div className={'journey-map-row--loading'}>
                  <CustomLoader />
                </div>
              ) : (
                <Droppable
                  droppableId={`${type}*${rowIndex}*${String(row?.id)}*${boxIndex}*${
                    rowItem.step.id
                  }*${rowItem.step.id}`}
                  type={type}
                  key={`${type}*${rowIndex}*${String(row?.id)}*${boxIndex}`}>
                  {provided => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={'cons-pros-interaction--column'}
                      style={{
                        width: `${rowItem.mergeCount * width + rowItem.mergeCount - 1}px`,
                        minWidth: `${width}px`,
                      }}>
                      <div className={'cons-pros-interaction--column--item map-item'}>
                        {rowItem.boxElements.map((item, index: number) => {
                          return (
                            <Draggable
                              key={item?.id + '_' + index}
                              draggableId={String(item?.id)}
                              index={index}
                              isDragDisabled={disabled}>
                              {provided2 => {
                                return (
                                  <div
                                    {...provided2.draggableProps}
                                    className={`cons-pros-interaction--card`}
                                    ref={provided2.innerRef}>
                                    <CardFlip
                                      cardId={`${row.id}-${item.id}`}
                                      hasFlippedText={!!item.flippedText?.length}
                                      frontCard={
                                        <>
                                          <CardInput
                                            item={item}
                                            type={type}
                                            headerColor={headerColor}
                                            bodyColor={bodyColor}
                                            rowId={row.id}
                                            stepId={rowItem.step.id}
                                            columnId={rowItem.columnId!}
                                            disabled={disabled || !!item?.isDisabled}
                                            isLoading={isLoadingRemoveBoxElement}
                                            onHandleDeleteBoxElement={onHandleDeleteBoxElement}
                                            dragHandleProps={provided2.dragHandleProps}
                                          />
                                        </>
                                      }
                                      backCard={
                                        <MapItemBackCard
                                          className={`cons-pros-interaction--back-card`}
                                          annotationValue={item.flippedText}
                                          rowId={row?.id}
                                          stepId={rowItem.step.id}
                                          itemId={item.id}
                                          itemKey={'boxElements'}
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
                          className={`${rowItem?.boxElements.length ? 'unmerge-btn-section-elements-type' : 'box-controls-container--blank-type'}`}>
                          <AddRowBoxElementBtn
                            itemsLength={rowItem?.boxElements.length}
                            label={row?.label?.toLowerCase() || ''}
                            boxIndex={boxIndex}
                            handleClick={() => {
                              onHandleAddBoxElement(rowItem?.columnId as number, rowItem.step.id);
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
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              )}

              {boxIndex > 0 && row?.boxes && !isLayerModeOn && (
                <>
                  <MergeColumnsButton
                    connectionStart={getConnectionDetails(row.boxes[boxIndex - 1], journeyMap)}
                    connectionEnd={getConnectionDetails(rowItem, journeyMap)}
                    rowId={row?.id}
                    previousBoxDetails={findPreviousBox(row.boxes, boxIndex)}
                    endStepId={rowItem?.step?.id!}
                    endColumnId={rowItem?.columnId!}
                    endBoxMergeCount={rowItem.mergeCount}
                  />
                </>
              )}
            </div>
          )}
        </React.Fragment>
      ))}
    </>
  );
};

export default DraggableCards;
