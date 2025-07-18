import { FC, useState } from 'react';

import './style.scss';
import { WuButton } from '@npm-questionpro/wick-ui-lib';

import BaseWuModal from '@/Components/Shared/BaseWuModal';
import { findStartMergedItem } from '@/Screens/JourneyMapScreen/helpers/findStartMergedItem.ts';
import { useUpdateMap } from '@/Screens/JourneyMapScreen/hooks/useUpdateMap.tsx';
import { BoxType } from '@/Screens/JourneyMapScreen/types.ts';
import { JourneyMapRowActionEnum } from '@/types/enum';
import { ActionsEnum } from '@/types/enum.ts';

interface IUnMergeColumnsButton {
  boxIndex: number;
  rowId: number;
  boxItem: BoxType;
  boxes: BoxType[];
}

const UnMergeColumnsButton: FC<IUnMergeColumnsButton> = ({ boxIndex, rowId, boxItem, boxes }) => {
  const { updateMapByType } = useUpdateMap();

  const [isLoading, setIsLoading] = useState(false);
  const [isOpenConfirmationModal, setIsOpenConfirmationModal] = useState<boolean>(false);

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
          startStepId: startBox.step?.id,
          endStepId: boxItem.step?.id,
          startColumnId: startBox?.columnId,
          endColumnId: boxItem.columnId,
          startBoxId: startBox?.id,
          endBoxId: boxItem.id,
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
        <span className={'wc-unmerge-1'} />
      </button>
      {isOpenConfirmationModal && (
        <BaseWuModal
          headerTitle={'Unmerge cards'}
          isOpen={isOpenConfirmationModal}
          modalSize={'sm'}
          handleClose={() => setIsOpenConfirmationModal(false)}
          canCloseWithOutsideClick={true}
          ModalConfirmButton={
            <WuButton
              data-testid={'unmerge-column-btn-test-id'}
              onClick={unmergeColumns}
              disabled={isLoading}>
              Continue
            </WuButton>
          }>
          <div className="confirm-unmerge-modal">
            <div className="confirm-unmerge-modal--text">
              When merging the cells, only the items on the left will be preserved, and the rest
              will be deleted. Do you want to continue?
            </div>
          </div>
        </BaseWuModal>
      )}
    </>
  );
};

export default UnMergeColumnsButton;
