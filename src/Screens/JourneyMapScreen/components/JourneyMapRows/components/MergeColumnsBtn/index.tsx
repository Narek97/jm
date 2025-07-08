import { FC, useState } from 'react';

import './style.scss';
import { WuButton } from '@npm-questionpro/wick-ui-lib';

import CustomModal from '@/Components/Shared/CustomModal';
import CustomModalHeader from '@/Components/Shared/CustomModalHeader';
import { useUpdateMap } from '@/Screens/JourneyMapScreen/hooks/useUpdateMap';
import { ActionsEnum, JourneyMapRowActionEnum } from '@/types/enum';

interface IMergeColumnsButton {
  rowId: number;
  endStepId: number;
  endColumnId: number;
  endBoxMergeCount: number;
  connectionStart?: any;
  connectionEnd?: any;
  previousBoxDetails: any;
}

const MergeColumnsButton: FC<IMergeColumnsButton> = ({
  rowId,
  endStepId,
  endColumnId,
  endBoxMergeCount,
  connectionStart,
  connectionEnd,
  previousBoxDetails,
}) => {
  const { updateMapByType } = useUpdateMap();

  const { stepId, mergeCount, columnId } = previousBoxDetails;

  const [isLoading, setIsLoading] = useState(false);
  const [isOpenConfirmationModal, setIsOpenConfirmationModal] = useState<boolean>(false);

  const openConfirmationModal = () => {
    setIsOpenConfirmationModal(true);
  };

  const mergeColumns = () => {
    setIsLoading(true);
    updateMapByType(
      JourneyMapRowActionEnum.MERGE_UNMERGE_COLUMNS,
      ActionsEnum.MERGE,
      {
        rowId,
        startStepId: stepId,
        startColumnId: columnId,
        startBoxMergeCount: mergeCount,
        endStepId,
        endColumnId,
        endBoxMergeCount,
        connectionStart,
        connectionEnd,
        callback: () => {
          setIsLoading(false);
          setIsOpenConfirmationModal(false);
        },
      },
      null,
      null,
    );
  };

  return (
    <>
      <div className="merge-column">
        <button className="merge-column-button" onClick={openConfirmationModal}>
          <span className={'wc-merge-1'} />
        </button>
      </div>
      {isOpenConfirmationModal && (
        <CustomModal
          isOpen={isOpenConfirmationModal}
          modalSize={'sm'}
          handleClose={() => setIsOpenConfirmationModal(false)}
          canCloseWithOutsideClick={true}>
          <CustomModalHeader title={'Merge cards'} />
          <div className="confirm-merge-modal">
            <div className="confirm-merge-modal--text">
              The whole text from the cards will be combined into a single text card. Do you want to
              continue?
            </div>
            <div className={'base-modal-footer'}>
              <button
                className={'base-modal-footer--cancel-btn'}
                onClick={() => setIsOpenConfirmationModal(false)}
                disabled={isLoading}>
                Cancel
              </button>
              <WuButton
                data-testid={'crop-btn-test-id'}
                onClick={mergeColumns}
                disabled={isLoading}>
                Continue
              </WuButton>
            </div>
          </div>
        </CustomModal>
      )}
    </>
  );
};

export default MergeColumnsButton;
