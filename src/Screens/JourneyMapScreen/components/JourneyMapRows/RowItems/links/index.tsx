import React, { FC, useCallback, useState } from 'react';

import './style.scss';

import { Draggable, Droppable } from '@hello-pangea/dnd';
import { useParams } from '@tanstack/react-router';

import CreateUpdateLinkModal from './CreateUpdateLinkModal';
import LinkItem from './LinkItem';
import { LinkType } from './types';
import AddRowBoxElementBtn from '../../components/AddRowBoxElementBtn';
import UnMergeColumnsButton from '../../components/UnmergeColumnsBtn';

import CardFlip from '@/Components/Shared/CardFlip';
import CustomLoader from '@/Components/Shared/CustomLoader';
import ErrorBoundary from '@/Features/ErrorBoundary';
import MapRowItemBackCard from '@/Screens/JourneyMapScreen/components/JourneyMapRows/components/MapRowItemBackCard';
import MergeColumnsButton from '@/Screens/JourneyMapScreen/components/JourneyMapRows/components/MergeColumnsBtn';
import { findPreviousBox } from '@/Screens/JourneyMapScreen/helpers/findPreviousBox.ts';
import { getConnectionDetails } from '@/Screens/JourneyMapScreen/helpers/getConnectionDetails.ts';
import { useUpdateMap } from '@/Screens/JourneyMapScreen/hooks/useUpdateMap.tsx';
import { BoxType, JourneyMapRowType } from '@/Screens/JourneyMapScreen/types.ts';
import { useJourneyMapStore } from '@/store/journeyMap.ts';
import { useLayerStore } from '@/store/layers.ts';
import { ActionsEnum, JourneyMapRowActionEnum, JourneyMapRowTypesEnum } from '@/types/enum';

interface ILinks {
  width: number;
  row: JourneyMapRowType;
  rowIndex: number;
  disabled: boolean;
}

const Links: FC<ILinks> = ({ width, row, rowIndex, disabled }) => {
  const { boardId } = useParams({
    from: '/_authenticated/_secondary-sidebar-layout/board/$boardId/journey-map/$mapId/',
  });

  const { updateMapByType } = useUpdateMap();

  const { journeyMap } = useJourneyMapStore();
  const { currentLayer } = useLayerStore();

  const isLayerModeOn = !currentLayer?.isBase;

  const [isOpenCreateUpdateLinkModal, setIsOpenCreateUpdateLinkModal] = useState<boolean>(false);
  const [selectedStepId, setSelectedStepId] = useState<number | null>(null);
  const [selectedLink, setSelectedLink] = useState<LinkType | null>(null);

  const onHandleToggleCreateUpdateModal = useCallback((stepId?: number, link?: LinkType) => {
    setSelectedStepId(stepId || null);
    setSelectedLink(link || null);
    setIsOpenCreateUpdateLinkModal(prev => !prev);
  }, []);

  const onHandleUpdateMapByType = useCallback(
    (type: JourneyMapRowActionEnum | JourneyMapRowTypesEnum, action: ActionsEnum, data: any) => {
      updateMapByType(type, action, data);
    },
    [updateMapByType],
  );

  return (
    <div className={'journey-map-links'} data-testid={`links-row-${row.id}-test-id`}>
      {isOpenCreateUpdateLinkModal && (
        <CreateUpdateLinkModal
          selectedRowId={row.id}
          selectedStepId={selectedStepId!}
          boardId={+boardId}
          link={selectedLink}
          isOpen={isOpenCreateUpdateLinkModal}
          handleClose={onHandleToggleCreateUpdateModal}
        />
      )}
      {row?.boxes?.map((boxItem: BoxType, boxIndex) => (
        <React.Fragment
          key={`${JourneyMapRowTypesEnum.LINKS}*${rowIndex}*${String(row.id)}*${boxIndex}`}>
          {!!boxItem.mergeCount &&
            (currentLayer?.isBase || currentLayer?.columnIds?.includes(boxItem.columnId!)) && (
              <>
                {boxItem.isLoading ? (
                  <div className={'journey-map-row--loading'}>
                    <CustomLoader />
                  </div>
                ) : (
                  <Droppable
                    droppableId={`${JourneyMapRowTypesEnum.LINKS}*${rowIndex}*${String(
                      row.id,
                    )}*${boxIndex}*${boxItem.step?.id}`}
                    key={`${JourneyMapRowTypesEnum.LINKS}*${rowIndex}*${String(row.id)}*${boxIndex}`}
                    type={JourneyMapRowTypesEnum.LINKS}>
                    {provided => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={'journey-map-links--column'}
                        data-testid={`links-column-${boxIndex}-test-id`}
                        style={{
                          width: `${boxItem.mergeCount * width + boxItem.mergeCount - 1}px`,
                          minWidth: `${width}px`,
                        }}>
                        <div className={'journey-map-links--column--item map-item'}>
                          {boxItem.links?.map((link, linkIndex: number) => {
                            return (
                              <Draggable
                                key={
                                  link?.id + '_' + linkIndex + '_' + JourneyMapRowTypesEnum.LINKS
                                }
                                draggableId={String(link?.id) + '_' + JourneyMapRowTypesEnum.LINKS}
                                index={linkIndex}>
                                {provided2 => {
                                  return (
                                    <div
                                      {...provided2.draggableProps}
                                      className={'journey-map-links--card'}
                                      ref={provided2.innerRef}>
                                      <CardFlip
                                        cardId={`${boxItem.id}-${link.id}`}
                                        hasFlippedText={!!link.flippedText?.length}
                                        frontCard={
                                          <ErrorBoundary>
                                            <LinkItem
                                              link={link}
                                              boardId={+boardId}
                                              boxItem={boxItem}
                                              disabled={disabled}
                                              dragHandleProps={provided2.dragHandleProps!}
                                              onHandleToggleCreateUpdateModal={
                                                onHandleToggleCreateUpdateModal
                                              }
                                              onHandleUpdateMapByType={onHandleUpdateMapByType}
                                            />
                                          </ErrorBoundary>
                                        }
                                        backCard={
                                          <MapRowItemBackCard
                                            className={`journey-map-links--back-card`}
                                            annotationValue={link.flippedText || ''}
                                            rowId={row.id}
                                            stepId={boxItem.step?.id || 0}
                                            itemId={link.id}
                                            itemKey={'links'}
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
                            className={`${boxItem.links.length ? 'unmerge-btn-section-elements-type' : 'box-controls-container--blank-type'}`}>
                            <AddRowBoxElementBtn
                              itemsLength={boxItem.links.length}
                              label={row?.label?.toLowerCase() || ''}
                              boxIndex={boxIndex}
                              handleClick={() => {
                                onHandleToggleCreateUpdateModal(boxItem.step?.id);
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

export default Links;
