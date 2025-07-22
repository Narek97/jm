import React, { FC, useCallback } from 'react';

import './style.scss';

import { Draggable, Droppable } from '@hello-pangea/dnd';
import { useWuShowToast } from '@npm-questionpro/wick-ui-lib';

import CardInput from './CardInput';

import { useAddBoxElementMutation } from '@/api/mutations/generated/addBoxElement.generated.ts';
import {
  RemoveBoxElementMutation,
  useRemoveBoxElementMutation,
} from '@/api/mutations/generated/removeBoxElement.generated';
import CardFlip from '@/Components/Shared/CardFlip';
import WuBaseLoader from '@/Components/Shared/WuBaseLoader';
import AddRowBoxElementBtn from '@/Screens/JourneyMapScreen/components/JourneyMapRows/components/AddRowBoxElementBtn';
import MapRowItemBackCard from '@/Screens/JourneyMapScreen/components/JourneyMapRows/components/MapRowItemBackCard';
import MergeColumnsButton from '@/Screens/JourneyMapScreen/components/JourneyMapRows/components/MergeColumnsBtn';
import UnMergeColumnsButton from '@/Screens/JourneyMapScreen/components/JourneyMapRows/components/UnmergeColumnsBtn';
import { findPreviousBox } from '@/Screens/JourneyMapScreen/helpers/findPreviousBox.ts';
import { getConnectionDetails } from '@/Screens/JourneyMapScreen/helpers/getConnectionDetails';
import { useCrudMapBoxElement } from '@/Screens/JourneyMapScreen/hooks/useCRUDMapBoxElement.tsx';
import {
  BoxElementType,
  BoxType,
  JourneyMapDraggableTextFields,
  JourneyMapRowType,
} from '@/Screens/JourneyMapScreen/types.ts';
import { useJourneyMapStore } from '@/store/journeyMap.ts';
import { useLayerStore } from '@/store/layers.ts';
import { ActionsEnum } from '@/types/enum.ts';

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
  const { crudBoxElement } = useCrudMapBoxElement();
  const { showToast } = useWuShowToast();

  const { journeyMap, selectedJourneyMapPersona } = useJourneyMapStore();
  const { currentLayer } = useLayerStore();

  const isLayerModeOn = !currentLayer?.isBase;

  const { mutate: addBoxElement } = useAddBoxElementMutation({
    onSuccess: response => {
      crudBoxElement(response?.addBoxElement, ActionsEnum.CREATE);
    },
  });

  const { mutate: removeBoxElement, isPending: isLoadingRemoveBoxElement } =
    useRemoveBoxElementMutation<Error, RemoveBoxElementMutation>({
      onSuccess: response => {
        crudBoxElement(response?.removeBoxElement, ActionsEnum.DELETE);
      },
      onError: error => {
        showToast({
          variant: 'error',
          message: error?.message,
        });
      },
    });

  const onHandleAddBoxElement = (columnId: number, stepId: number) => {
    addBoxElement({
      addBoxElementInput: {
        rowId: row?.id,
        stepId,
        columnId: columnId || 1,
        personaId: selectedJourneyMapPersona?.id || null,
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
      {row?.boxes?.map((boxItem: BoxType, boxIndex) => (
        <React.Fragment key={`${type}*${rowIndex}*${String(row?.id)}*${boxIndex}`}>
          {!!boxItem.mergeCount && (
            <div className={'cons-pros-interaction'}>
              {boxItem.isLoading ? (
                <div className={'journey-map-row--loading'}>
                  <WuBaseLoader />
                </div>
              ) : (
                <Droppable
                  droppableId={`${type}*${rowIndex}*${String(row?.id)}*${boxIndex}*${
                    boxItem.step?.id
                  }*${boxItem.step?.id}`}
                  type={type}
                  key={`${type}*${rowIndex}*${String(row?.id)}*${boxIndex}`}>
                  {provided => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={'cons-pros-interaction--column'}
                      style={{
                        width: `${boxItem.mergeCount * width + boxItem.mergeCount - 1}px`,
                        minWidth: `${width}px`,
                      }}>
                      <div className={'cons-pros-interaction--column--item map-item'}>
                        {boxItem.boxElements.map((item: BoxElementType, index: number) => {
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
                                            stepId={boxItem.step?.id || 0}
                                            columnId={boxItem.columnId!}
                                            disabled={disabled}
                                            isLoading={isLoadingRemoveBoxElement}
                                            onHandleDeleteBoxElement={onHandleDeleteBoxElement}
                                            dragHandleProps={provided2.dragHandleProps}
                                          />
                                        </>
                                      }
                                      backCard={
                                        <MapRowItemBackCard
                                          className={`cons-pros-interaction--back-card`}
                                          annotationValue={item.flippedText || ''}
                                          rowId={row?.id}
                                          stepId={boxItem.step?.id || 0}
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
                          className={`${boxItem?.boxElements.length ? 'unmerge-btn-section-elements-type' : 'box-controls-container--blank-type'}`}>
                          <AddRowBoxElementBtn
                            itemsLength={boxItem?.boxElements.length}
                            label={row?.label?.toLowerCase() || ''}
                            boxIndex={boxIndex}
                            handleClick={() => {
                              onHandleAddBoxElement(
                                boxItem?.columnId as number,
                                boxItem.step?.id || 0,
                              );
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
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              )}

              {boxIndex > 0 && row?.boxes && !isLayerModeOn && (
                <>
                  <MergeColumnsButton
                    connectionStart={getConnectionDetails(row.boxes[boxIndex - 1], journeyMap)}
                    connectionEnd={getConnectionDetails(boxItem, journeyMap)}
                    rowId={row?.id}
                    previousBoxDetails={findPreviousBox(row.boxes, boxIndex)}
                    endStepId={boxItem.step?.id || 0}
                    endColumnId={boxItem.columnId}
                    endBoxMergeCount={boxItem.mergeCount}
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
