import { FC } from 'react';

import './style.scss';
import {
  GetBoardOutcomesStatQuery,
  useGetBoardOutcomesStatQuery,
} from '@/api/queries/generated/getBoardOutcomesStat.generated';
import CustomLoader from '@/Components/Shared/CustomLoader';
import CustomModal from '@/Components/Shared/CustomModal';
import CustomModalHeader from '@/Components/Shared/CustomModalHeader';

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
    <CustomModal
      isOpen={isOpen}
      handleClose={handleClose}
      canCloseWithOutsideClick={!isLoadingPinnedOutcomes}>
      <CustomModalHeader title={'Pinned outcomes'} />
      <div data-testid={'pinned-outcomes'} className={'outcomes-section'}>
        <div className={'outcomes-section--content'}>
          {isLoadingPinnedOutcomes ? (
            <>
              <CustomLoader />
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
    </CustomModal>
  );
};

export default BoardPinnedOutcomesModal;
