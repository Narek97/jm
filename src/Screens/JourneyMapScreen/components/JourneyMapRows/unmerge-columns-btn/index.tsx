import React, { FC, useState } from 'react';

import './style.scss';

import CustomButton from '@/components/atoms/custom-button/custom-button';
import CustomModal from '@/components/atoms/custom-modal/custom-modal';
import { useUpdateMap } from '@/containers/journey-map-container/hooks/useUpdateMap';
import UnMergeIcon from '@/public/base-icons/unmerge.svg';
import { findStartMergedItem } from '@/utils/helpers/general';
import { ActionsEnum, JourneyMapRowActionEnum } from '@/utils/ts/enums/global-enums';
import { BoxItemType } from '@/utils/ts/types/journey-map/journey-map-types';

import ModalHeader from '../../../../components/molecules/modal-header';

interface IUnMergeColumnsButton {
  boxIndex: number;
  rowId: number;
  rowItem: BoxItemType;
  boxes: BoxItemType[];
}

const UnMergeColumnsButton: FC<IUnMergeColumnsButton> = ({ boxIndex, rowId, rowItem, boxes }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenConfirmationModal, setIsOpenConfirmationModal] = useState<boolean>(false);
  const { updateMapByType } = useUpdateMap();

  const openConfirmationModal = () => {
    setIsOpenConfirmationModal(true);
  };

  const { startBox, index } = findStartMergedItem(boxes, boxIndex) || {};

  const unmergeColumns = () => {
    setIsLoading(true);
    if (startBox && Number.isFinite(index) && index !== undefined) {
      updateMapByType(
        JourneyMapRowActionEnum.MERGE_UNMERGE_COLUMNS,
        ActionsEnum.UNMERGE,
        {
          startStepId: startBox?.step.id,
          endStepId: rowItem.step.id,
          startColumnId: startBox?.columnId,
          endColumnId: rowItem.columnId,
          startBoxId: startBox?.id,
          endBoxId: rowItem.id,
          startBoxMergeCount: index + 1,
          endBoxMergeCount: startBox?.mergeCount - (index + 1),
          rowId,
          connectionStart: {
            isNextColumnMerged: false,
            isMerged: false,
          },
          connectionEnd: {
            isNextColumnMerged: true,
            isMerged: true,
          },
          callback: () => {
            setIsLoading(false);
            setIsOpenConfirmationModal(false);
          },
        },
        null,
        null,
      );
    }
  };

  return (
    <>
      <button className="unmerge-column" onClick={openConfirmationModal}>
        <UnMergeIcon />
      </button>
      {isOpenConfirmationModal && (
        <CustomModal
          isOpen={isOpenConfirmationModal}
          modalSize={'sm'}
          handleClose={() => setIsOpenConfirmationModal(false)}
          canCloseWithOutsideClick={true}>
          <ModalHeader title={'Unmerge cards'} />
          <div className="confirm-unmerge-modal">
            <div className="confirm-unmerge-modal--text">
              When merging the cells, only the items on the left will be preserved, and the rest
              will be deleted. Do you want to continue?
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
                data-testid={'unmerge-column-btn-test-id'}
                sxStyles={{ width: '6.125rem' }}
                onClick={unmergeColumns}
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

export default UnMergeColumnsButton;
