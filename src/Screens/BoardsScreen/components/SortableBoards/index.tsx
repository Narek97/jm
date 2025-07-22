import { FC, useEffect, useState } from 'react';

import './style.scss';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useWuShowToast } from '@npm-questionpro/wick-ui-lib';
import { useQueryClient } from '@tanstack/react-query';

import BoardCard from './BoardCard';
import { BoardType } from '../../types';

import {
  UpdateBoardMutation,
  useUpdateBoardMutation,
} from '@/api/mutations/generated/updateBoard.generated.ts';
import { BOARDS_LIMIT } from '@/Constants/pagination.ts';
import ErrorBoundary from '@/Features/ErrorBoundary';
import { EditableInputType } from '@/types';

interface SortableBoardsProps {
  currentPage: number;
  boards: BoardType[];
  updateBoardName: (data: EditableInputType) => void;
  onToggleBoardDeleteModal: (board?: BoardType) => void;
  onToggleAllPinnedOutcomesModal: (board?: BoardType) => void;
}

interface SortableBoardItemProps {
  board: BoardType;
  updateBoardName: (data: EditableInputType) => void;
  onToggleBoardDeleteModal: (board?: BoardType) => void;
  onToggleAllPinnedOutcomesModal: (board?: BoardType) => void;
}

const SortableBoardItem: FC<SortableBoardItemProps> = ({
  board,
  updateBoardName,
  onToggleBoardDeleteModal,
  onToggleAllPinnedOutcomesModal,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: board.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li ref={setNodeRef} style={style} className="sortable-boards--list">
      <ErrorBoundary>
        <BoardCard
          board={board}
          updateBoardName={updateBoardName}
          onToggleBoardDeleteModal={onToggleBoardDeleteModal}
          onToggleAllPinnedOutcomesModal={onToggleAllPinnedOutcomesModal}
          sortableAttributes={attributes} // Pass sortable attributes
          sortableListeners={listeners} // Pass sortable listeners
        />
      </ErrorBoundary>
    </li>
  );
};

const SortableBoards: FC<SortableBoardsProps> = ({
  currentPage,
  boards,
  updateBoardName,
  onToggleBoardDeleteModal,
  onToggleAllPinnedOutcomesModal,
}) => {
  const [sortableBoards, setSortableBoards] = useState(boards);
  const queryClient = useQueryClient();

  const { showToast } = useWuShowToast();

  const { mutate: mutateUpdateBoard } = useUpdateBoardMutation<Error, UpdateBoardMutation>();

  useEffect(() => {
    setSortableBoards(boards);
  }, [boards]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setSortableBoards(currentItems => {
        const oldIndex = currentItems.findIndex(item => item.id === active.id);
        const newIndex = currentItems.findIndex(item => item.id === over.id);
        const updatedBoards = arrayMove(currentItems, oldIndex, newIndex);

        mutateUpdateBoard(
          {
            updateBoardInput: {
              id: +active.id,
              index: (currentPage - 1) * BOARDS_LIMIT + newIndex + 1,
            },
          },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ['getMyBoards'] }).then();
            },
            onError: error => () => {
              showToast({
                variant: 'error',
                message: error?.message,
              });
            },
          },
        );

        return updatedBoards;
      });
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext
        items={sortableBoards.map(item => item.id)}
        strategy={verticalListSortingStrategy}>
        <ul className="sortable-boards">
          {sortableBoards.map(board => (
            <SortableBoardItem
              key={board.id}
              board={board}
              updateBoardName={updateBoardName}
              onToggleBoardDeleteModal={onToggleBoardDeleteModal}
              onToggleAllPinnedOutcomesModal={onToggleAllPinnedOutcomesModal}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
};

export default SortableBoards;
