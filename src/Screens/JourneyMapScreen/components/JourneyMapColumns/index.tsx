import { FC, memo, useRef } from 'react';

import './style.scss';

import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';

import DraggableItem from '@/Screens/JourneyMapScreen/components/JourneyMapColumns/DraggableItem';
import useScrollObserver from '@/Screens/JourneyMapScreen/hooks/useScrollObserver.tsx';
import { JourneyMapColumnType } from '@/Screens/JourneyMapScreen/types.ts';
import { useLayerStore } from '@/store/layers.ts';
import { lightenColor } from '@/utils/lightenColor.ts';
import { scrollNeighbours } from '@/utils/scrollNeighbours.ts';

interface IJourneyMapColumns {
  onColumnDragEnd: (result: any) => void;
  columns: JourneyMapColumnType[];
  mapId: number;
  isGuest: boolean;
}

const JourneyMapColumns: FC<IJourneyMapColumns> = memo(
  ({ onColumnDragEnd, columns, mapId, isGuest }) => {
    const childRef = useRef<any>(null);
    const isScrollable = useScrollObserver();

    const { currentLayer } = useLayerStore();

    const isLayerModeOn = !currentLayer?.isBase;

    const onHandleScroll = () => {
      const stages = document.getElementById('stages');
      const steps = document.getElementById('steps');
      const rows = document.getElementById('rows');
      scrollNeighbours(stages?.scrollLeft || 0, [steps!, rows!]);
    };

    return (
      <div
        id={'stages'}
        className={'journey-map-column'}
        style={{ overflow: 'auto' }}
        onScroll={onHandleScroll}>
        <div className={'journey-map-column--start-column'}>
          {!isLayerModeOn && (
            <div className={'journey-map-column--new-column-button-block'}>
              <button
                aria-label={'plus'}
                className={'journey-map-column--new-column-button-block--button'}
                data-testid="add-column-btn-test-id"
                onClick={() => childRef.current?.createNewColumn()}>
                <span className={'wm-add'} />
              </button>
            </div>
          )}
        </div>

        <DragDropContext onDragEnd={result => onColumnDragEnd(result)}>
          <Droppable droppableId={'stage'} key={'stage'} direction="horizontal">
            {provided => {
              return (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={'journey-map-column--columns'}
                  style={{
                    marginRight: isScrollable ? '1.75rem' : 0,
                  }}
                  data-testid="journey-map-columns-test-id">
                  {columns?.map((column, index) => {
                    if (currentLayer?.isBase || currentLayer?.columnIds?.includes(column.id)) {
                      return (
                        <Draggable
                          key={String(column?.id)}
                          draggableId={String(column?.id)}
                          index={index}
                          isDragDisabled={isGuest}>
                          {provided2 => {
                            return (
                              <div
                                ref={provided2.innerRef}
                                {...provided2.draggableProps}
                                key={column?.id}>
                                <div
                                  id={`column-box-${column?.id}`}
                                  style={{
                                    borderBottom: `1px solid ${column?.bgColor ? lightenColor(column?.bgColor, -4) : 'rgb(224, 228, 245)'}`,
                                    borderRight: `1px solid ${column?.bgColor ? lightenColor(column?.bgColor, -4) : 'rgb(224, 228, 245)'}`,
                                    width: `${column.size * 17.5}rem`,
                                    height: '100%',
                                    backgroundColor: column?.bgColor,
                                  }}>
                                  <DraggableItem
                                    hasMergeItems={column?.isMerged}
                                    canAddNewItem={
                                      index === columns.length - 1 || !column?.isNextColumnMerged
                                    }
                                    ref={index === 0 ? childRef : null}
                                    key={column?.id}
                                    index={index + 1}
                                    column={column}
                                    mapId={mapId}
                                    dragHandleProps={provided2.dragHandleProps}
                                    isDraggable={true}
                                    length={columns.length}
                                    parentType={'columns'}
                                  />
                                </div>
                              </div>
                            );
                          }}
                        </Draggable>
                      );
                    }
                  })}
                </div>
              );
            }}
          </Droppable>
        </DragDropContext>
      </div>
    );
  },
);

export default JourneyMapColumns;
