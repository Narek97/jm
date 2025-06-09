import { FC, useEffect, useState } from 'react';

import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import './style.scss';
import ErrorBoundary from '@/Features/ErrorBoundary';
import JourneyCard from '@/Screens/JourniesScreen/components/SortableJourneys/JourneyCard';
import { JourneyViewTypeEnum } from '@/types/enum.ts';

interface SortableJourneyItemProps {
  boardId: number;
  map: JourneyMapCardType;
  options: Array<MenuOptionsType>;
  onNameChange?: OnJourneyMapNameChangeType;
}

const SortableJourneyItem: FC<SortableJourneyItemProps> = ({
  boardId,
  map,
  options,
  onNameChange,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: map.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li ref={setNodeRef} style={style} data-testid="journey-item-test-id">
      <ErrorBoundary>
        <JourneyCard
          key={map.id}
          map={map}
          viewType={JourneyViewTypeEnum.STANDARD}
          boardId={+boardId}
          options={options}
          onNameChange={onNameChange}
          sortableAttributes={attributes}
          sortableListeners={listeners}
        />
      </ErrorBoundary>
    </li>
  );
};

interface SortableJourneysProps {
  boardId: number;
  maps: Array<JourneyMapCardType>;
  options: Array<MenuOptionsType>;
  onNameChange?: OnJourneyMapNameChangeType;
}

const SortableJourneys: FC<SortableJourneysProps> = ({ boardId, maps, options, onNameChange }) => {
  const [sortableMaps, setSortableMaps] = useState(maps);

  useEffect(() => {
    setSortableMaps(maps);
  }, [maps]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setSortableMaps(currentItems => {
        const oldIndex = currentItems.findIndex(item => item.id === active.id); // Fixed bug
        const newIndex = currentItems.findIndex(item => item.id === over.id);
        return arrayMove(currentItems, oldIndex, newIndex);
      });
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={sortableMaps.map(item => item.id)} strategy={rectSortingStrategy}>
        <ul className="journeys-list">
          {sortableMaps.map(map => (
            <SortableJourneyItem
              key={map.id}
              boardId={boardId}
              map={map}
              options={options}
              onNameChange={onNameChange}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
};

export default SortableJourneys;
