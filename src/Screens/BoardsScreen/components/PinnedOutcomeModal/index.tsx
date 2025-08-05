import { FC } from 'react';

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
      <div data-testid={'pinned-outcomes'} className={'p-2 [height:26.875rem]'}>
        <div className={''}>
          {isLoadingPinnedOutcomes ? (
            <>
              <BaseWuLoader />
            </>
          ) : (
            <div
              className={
                '[height:22.875rem] overflow-auto p-4 border-b border-[var(--base-extra-light-gray-2)]'
              }>
              <ul data-testid={'outcomes-section-list'}>
                {pinnedOutcomes?.getBoardOutcomesStat.outcomeStats?.map(outcomeGroupItem => (
                  <li
                    key={outcomeGroupItem?.id}
                    data-testid="outcome-item-test-id"
                    className={`flex items-center justify-between border border-[var(--base-light-gray-color-2)] rounded mb-4 !pt-[0.625rem] !px-3 !pb-3 text-[var(--base-gray-color)] cursor-pointer
 hover:!border-[var(--primary)]
`}>
                    <img
                      className={'w-4 h-auto'}
                      src={outcomeGroupItem?.icon}
                      alt={'outcome_image'}
                    />
                    <div className={'truncate max-w-[12.5rem]\n'}>{outcomeGroupItem?.name}</div>
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
