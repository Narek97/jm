import { FC } from 'react';

import { useSortable } from '@dnd-kit/sortable';
import { useNavigate } from '@tanstack/react-router';
import dayjs from 'dayjs';
import fromNow from 'dayjs/plugin/relativeTime';

import DragHandle from '@/Components/Shared/DragHandle';
import EditableTitle from '@/Components/Shared/EditableTitle';
import WorkspaceAnalytics from '@/Features/WorkspaceAnalytics';
import useCardLayout from '@/Hooks/useWindowResize';
import { BoardType } from '@/Screens/BoardsScreen/types';
import JourneyCard from '@/Screens/JourniesScreen/components/SortableJourneys/JourneyCard';
import { JourneyType } from '@/Screens/JourniesScreen/types.ts';
import { EditableInputType } from '@/types';
import { JourneyViewTypeEnum } from '@/types/enum.ts';

dayjs.extend(fromNow);

interface IBoardCard {
  board: BoardType;
  updateBoardName: (data: EditableInputType) => void;
  onToggleBoardDeleteModal: (board: BoardType) => void;
  onToggleAllPinnedOutcomesModal: (board: BoardType) => void;
  sortableAttributes?: ReturnType<typeof useSortable>['attributes'];
  sortableListeners?: ReturnType<typeof useSortable>['listeners'];
}

const BoardCard: FC<IBoardCard> = ({
  board,
  onToggleBoardDeleteModal,
  updateBoardName,
  onToggleAllPinnedOutcomesModal,
  sortableAttributes,
  sortableListeners,
}) => {
  const navigate = useNavigate();
  const { maxCardNumber } = useCardLayout();

  const onNavigateWhiteboardPage = () => {
    navigate({
      to: `/board/${board.id}/journies`, // Fixed template literal syntax
    }).then();
  };

  return (
    <div
      className="relative bg-white w-[calc(100%-0.5rem)] h-[10.625rem] !pt-4 !pr-[2.5rem] !pb-4 !pl-[1.5rem]
         border border-[#e5e7eb] border-l-[0.375rem] rounded text-[#545e6b] cursor-pointer
         flex items-start justify-center gap-4 overflow-hidden hover:!border-[var(--primary)] hover:border-l-[0.375rem] group"
      data-testid={`board-card-${board?.id}`}
      onClick={onNavigateWhiteboardPage}>
      <DragHandle {...sortableAttributes} {...sortableListeners} />
      <div className="w-[17.625rem]">
        <EditableTitle
          item={board}
          onHandleUpdate={updateBoardName}
          onHandleDelete={onToggleBoardDeleteModal}
          maxLength={100}
        />
        <div className="!mt-[1.375rem] flex justify-start gap-2">
          <WorkspaceAnalytics
            className="!gap-4"
            showType="horizontal-type"
            fontSize="small-font-size"
            data={{
              journeyMapCount: board?.journeyMapCount || 0,
              personasCount: board?.personasCount || 0,
            }}
            pinnedOutcomeGroupCount={board.pinnedOutcomeGroupCount}
            outcomeGroups={board.outcomeGroupWithOutcomeCounts}
            viewAll={() => onToggleAllPinnedOutcomesModal(board)}
          />
        </div>
      </div>
      <ul className="w-[calc(100%-18.375rem)] h-full flex justify-start items-center gap-4">
        {board?.journeyMapCount > 0 ? (
          <>
            <div className="flex items-center gap-4">
              {board?.maps
                ?.slice(0, maxCardNumber)
                ?.map(mapItem => (
                  <JourneyCard
                    key={mapItem?.id}
                    viewType={JourneyViewTypeEnum.BOARD}
                    map={mapItem as JourneyType}
                    boardId={board.id}
                    options={[]}
                  />
                ))}
            </div>
            {board?.journeyMapCount > maxCardNumber && (
              <li className="min-w-[8.5rem] h-[8.5rem] border border-[#d8d8d8] hover:!border-[var(--primary)] rounded text-[var(--primary)] font-medium flex items-center justify-center">
                and {board?.journeyMapCount - maxCardNumber} more
              </li>
            )}
          </>
        ) : (
          <div className="flex items-center h-full text-[0.75rem] text-[#878f99]">
            No journey maps yet
          </div>
        )}
      </ul>
    </div>
  );
};

export default BoardCard;
