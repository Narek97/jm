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
import CreateUpdateLinkModal from '@/containers/journey-map-container/journey-map-rows/row-types/links/create-update-link-modal';
import LinkItem from '@/containers/journey-map-container/journey-map-rows/row-types/links/link-item';
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
import { LinkType } from '@/utils/ts/types/link/link-type';

interface ILinks {
  width: number;
  row: JourneyMapRowType;
  rowIndex: number;
  disabled: boolean;
}

const Links: FC<ILinks> = ({ width, row, rowIndex, disabled }) => {
  const { updateMapByType } = useUpdateMap();

  const journeyMap = useRecoilValue(journeyMapState);
  const currentLayer = useRecoilValue(currentLayerState);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <div className={'journey-map-links'} data-testid={`links-row-${row.id}-test-id`}>
      {isOpenCreateUpdateLinkModal && (
        <CreateUpdateLinkModal
          selectedRowId={row.id}
          selectedStepId={selectedStepId!}
          link={selectedLink}
          isOpen={isOpenCreateUpdateLinkModal}
          handleClose={onHandleToggleCreateUpdateModal}
        />
      )}
      {row?.boxes?.map((rowItem, boxIndex) => (
        <React.Fragment
          key={`${JourneyMapRowTypesEnum.LINKS}*${rowIndex}*${String(row.id)}*${boxIndex}`}>
          {!!rowItem.mergeCount &&
            (currentLayer?.isBase || currentLayer?.columnIds?.includes(rowItem.columnId!)) && (
              <>
                {rowItem.isLoading ? (
                  <div className={'journey-map-row--loading'}>
                    <CustomLoader />
                  </div>
                ) : (
                  <Droppable
                    droppableId={`${JourneyMapRowTypesEnum.LINKS}*${rowIndex}*${String(
                      row.id,
                    )}*${boxIndex}*${rowItem.step.id}`}
                    key={`${JourneyMapRowTypesEnum.LINKS}*${rowIndex}*${String(row.id)}*${boxIndex}`}
                    type={JourneyMapRowTypesEnum.LINKS}>
                    {provided => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={'journey-map-links--column'}
                        data-testid={`links-column-${boxIndex}-test-id`}
                        style={{
                          width: `${rowItem.mergeCount * width + rowItem.mergeCount - 1}px`,
                          minWidth: `${width}px`,
                        }}>
                        <div className={'journey-map-links--column--item map-item'}>
                          {rowItem?.links?.map((link, linkIndex: number) => {
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
                                        cardId={`${rowItem.id}-${link.id}`}
                                        hasFlippedText={!!link.flippedText?.length}
                                        frontCard={
                                          <ErrorBoundary>
                                            <LinkItem
                                              link={link}
                                              rowItem={rowItem}
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
                                          <MapItemBackCard
                                            className={`journey-map-links--back-card`}
                                            annotationValue={link.flippedText}
                                            rowId={row.id}
                                            stepId={rowItem.step.id}
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
                            className={`${rowItem?.links.length ? 'unmerge-btn-section-elements-type' : 'box-controls-container--blank-type'}`}>
                            <AddRowBoxElementBtn
                              itemsLength={rowItem?.links.length}
                              label={row?.label?.toLowerCase() || ''}
                              boxIndex={boxIndex}
                              handleClick={() => {
                                onHandleToggleCreateUpdateModal(rowItem.step.id);
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

export default Links;
