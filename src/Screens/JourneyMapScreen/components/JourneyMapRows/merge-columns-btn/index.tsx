import React, { FC, useState } from 'react';

import './style.scss';

import CustomButton from '@/components/atoms/custom-button/custom-button';
import CustomModal from '@/components/atoms/custom-modal/custom-modal';
import { useUpdateMap } from '@/containers/journey-map-container/hooks/useUpdateMap';
import MergeIcon from '@/public/base-icons/merge.svg';
import { ActionsEnum, JourneyMapRowActionEnum } from '@/utils/ts/enums/global-enums';

import ModalHeader from '../../../../components/molecules/modal-header';

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
  const { stepId, mergeCount, columnId } = previousBoxDetails;
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenConfirmationModal, setIsOpenConfirmationModal] = useState<boolean>(false);
  const { updateMapByType } = useUpdateMap();

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
          <MergeIcon />
        </button>
      </div>
      {isOpenConfirmationModal && (
        <CustomModal
          isOpen={isOpenConfirmationModal}
          modalSize={'sm'}
          handleClose={() => setIsOpenConfirmationModal(false)}
          canCloseWithOutsideClick={true}>
          <ModalHeader title={'Merge cards'} />
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
              <CustomButton
                startIcon={false}
                data-testid={'crop-btn-test-id'}
                sxStyles={{ width: '6.125rem' }}
                onClick={mergeColumns}
                disabled={isLoading}
                isLoading={isLoading}>
                Continue
              </CustomButton>
            </div>
          </div>
        </CustomModal>
      )}
    </>
  );
};

export default MergeColumnsButton;
