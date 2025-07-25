import { FC } from 'react';

import './style.scss';
import {
  GetBoardOutcomesStatQuery,
  useGetBoardOutcomesStatQuery,
} from '@/api/queries/generated/getBoardOutcomesStat.generated';
import BaseWuLoader from '@/Components/Shared/BaseWuLoader';
import BaseWuModal from '@/Components/Shared/BaseWuModal';

interface IBoardPinnedOutcomesModal {
  isOpen: boolean;
  boardId: number | null;
  handleClose: () => void;
}

const BoardPinnedOutcomesModal: FC<IBoardPinnedOutcomesModal> = ({
  boardId,
  isOpen,
  handleClose,
}) => {
  const { isLoading: isLoadingPinnedOutcomes, data: pinnedOutcomes } = useGetBoardOutcomesStatQuery<
    GetBoardOutcomesStatQuery,
    Error
  >(
    {
      boardId: boardId!,
    },
    {
      enabled: !!boardId,
    },
  );

  return (
    <BaseWuModal
      headerTitle={'Pinned outcomes'}
      isOpen={isOpen}
      handleClose={handleClose}
      canCloseWithOutsideClick={!isLoadingPinnedOutcomes}>
      <div data-testid={'pinned-outcomes'} className={'outcomes-section'}>
        <div className={'outcomes-section--content'}>
          {isLoadingPinnedOutcomes ? (
            <>
              <BaseWuLoader />
            </>
          ) : (
            <div className={'outcomes-section--content-outcomes'}>
              <ul data-testid={'outcomes-section-list'}>
                {pinnedOutcomes?.getBoardOutcomesStat.outcomeStats?.map(outcomeGroupItem => (
                  <li
                    key={outcomeGroupItem?.id}
                    data-testid="outcome-item-test-id"
                    className={`outcomes-section--content-outcomes-item`}>
                    <img
                      className={`outcomes-section--content-outcomes-item--icon`}
                      src={outcomeGroupItem?.icon}
                      alt={'outcome_image'}
                      style={{
                        width: '1rem',
                        height: 'auto',
                      }}
                    />
                    <div className={'outcomes-section--content-outcomes-item--name'}>
                      {outcomeGroupItem?.name}
                    </div>
                    <div>{outcomeGroupItem?.count}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </BaseWuModal>
  );
};

export default BoardPinnedOutcomesModal;
