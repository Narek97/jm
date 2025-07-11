import { FC } from 'react';

import './style.scss';
import { useSortable } from '@dnd-kit/sortable';
import { useNavigate } from '@tanstack/react-router';
import dayjs from 'dayjs';
import fromNow from 'dayjs/plugin/relativeTime';

import DragHandle from '@/Components/Shared/DragHandle';
import EditableTitle from '@/Components/Shared/EditableTitle';
import WorkspaceAnalytics from '@/Features/WorkspaceAnalytics';
import useCardLayout from '@/hooks/useWindowResize';
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
      className="board-card"
      data-testid={`board-card-${board?.id}`}
      onClick={onNavigateWhiteboardPage}>
      <DragHandle {...sortableAttributes} {...sortableListeners} />
      <div className="board-card--left">
        <EditableTitle
          item={board}
          onHandleUpdate={updateBoardName}
          onHandleDelete={onToggleBoardDeleteModal}
          maxLength={100}
        />
        <div className="board-card--analytics">
          <WorkspaceAnalytics
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
      <ul className="board-card--right">
        {board?.journeyMapCount > 0 ? (
          <>
            <div className="board-card--right-journies">
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
              <li className="board-card--right-more-block">
                and {board?.journeyMapCount - maxCardNumber} more
              </li>
            )}
          </>
        ) : (
          <div className="no-maps-info">No journey maps yet</div>
        )}
      </ul>
    </div>
  );
};

export default BoardCard;
