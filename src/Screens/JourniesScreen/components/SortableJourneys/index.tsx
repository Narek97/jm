import { FC, useEffect, useState } from 'react';

import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useWuShowToast } from '@npm-questionpro/wick-ui-lib';
import { useQueryClient } from '@tanstack/react-query';

import {
  UpdateJourneyMapMutation,
  useUpdateJourneyMapMutation,
} from '@/api/mutations/generated/updateJourneyMap.generated';
import { JOURNIES_LIMIT } from '@/Constants/pagination.ts';
import ErrorBoundary from '@/Features/ErrorBoundary';
import JourneyCard from '@/Screens/JourniesScreen/components/SortableJourneys/JourneyCard';
import { JourneyMapNameChangeType, JourneyType } from '@/Screens/JourniesScreen/types.ts';
import { MenuOptionsType } from '@/types';
import { JourneyViewTypeEnum } from '@/types/enum.ts';

interface SortableJourneyItemProps {
  boardId: number;
  map: JourneyType;
  options: Array<MenuOptionsType<JourneyType>>;
  onNameChange: (data: JourneyMapNameChangeType) => void;
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
  currentPage: number;
  maps: Array<JourneyType>;
  options: Array<MenuOptionsType<JourneyType>>;
  onNameChange: (data: JourneyMapNameChangeType) => void;
}

const SortableJourneys: FC<SortableJourneysProps> = ({
  boardId,
  currentPage,
  maps,
  options,
  onNameChange,
}) => {
  const { mutate: mutateUpdateJourneyMap } = useUpdateJourneyMapMutation<
    Error,
    UpdateJourneyMapMutation
  >();
  const [sortableMaps, setSortableMaps] = useState(maps);

  const queryClient = useQueryClient();

  const { showToast } = useWuShowToast();

  useEffect(() => {
    setSortableMaps(maps);
  }, [maps]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setSortableMaps(currentItems => {
        const oldIndex = currentItems.findIndex(item => item.id === active.id); // Fixed bug
        const newIndex = currentItems.findIndex(item => item.id === over.id);
        const updatedMaps = arrayMove(currentItems, oldIndex, newIndex);

        mutateUpdateJourneyMap(
          {
            updateJourneyMapInput: {
              mapId: +active.id,
              index: (currentPage - 1) * JOURNIES_LIMIT + newIndex,
            },
          },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ['GetJourneys'] }).then();
            },
            onError: error => () => {
              showToast({
                variant: 'error',
                message: error?.message,
              });
            },
          },
        );

        return updatedMaps;
      });
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={sortableMaps.map(item => item.id)} strategy={rectSortingStrategy}>
        <ul
          className="grid gap-4 h-[calc(100dvh-15rem)] overflow-y-auto overflow-x-hidden grid-cols-[repeat(1,100%)]
          sm:grid-cols-[repeat(2,calc(50%-0.5rem))] md:grid-cols-[repeat(2,calc(50%-0.5rem))]
          lg:grid-cols-[repeat(3,calc(33.3%-0.65rem))] xl:grid-cols-[repeat(4,calc(24%+0.125rem))]">
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
