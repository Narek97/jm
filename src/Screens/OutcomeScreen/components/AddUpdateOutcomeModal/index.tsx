import { FC, memo } from 'react';

import { Outcome } from '@/api/types.ts';
import CustomModal from '@/Components/Shared/CustomModal';
import CustomModalHeader from '@/Components/Shared/CustomModalHeader';
import AddUpdateOutcomeForm from '@/Screens/OutcomeScreen/components/AddUpdateOutcomeModal/AddUpdateOutcomeForm';
import { OutcomeLevelEnum } from '@/types/enum';

interface IAddUpdateOutcomeItem {
  isOpen: boolean;
  workspaceId: number;
  outcomeGroupId: number;
  singularName: string;
  selectedOutcome: Outcome | null;
  create: (data: Outcome) => void;
  update: (data: Outcome) => void;
  handleClose: () => void;
}

const AddUpdateOutcomeItemModal: FC<IAddUpdateOutcomeItem> = memo(
  ({
    isOpen,
    workspaceId,
    outcomeGroupId,
    singularName,
    selectedOutcome,
    create,
    update,
    handleClose,
  }) => {
    return (
      <CustomModal
        isOpen={isOpen}
        modalSize={'md'}
        handleClose={handleClose}
        canCloseWithOutsideClick={true}>
        <CustomModalHeader
          title={
            <div className={'add-update-outcome-modal-header'}>
              {selectedOutcome ? 'Update' : 'New'} {singularName}
            </div>
          }
        />
        <AddUpdateOutcomeForm
          workspaceId={workspaceId!}
          outcomeGroupId={outcomeGroupId}
          defaultMapId={selectedOutcome?.map?.id || null}
          level={OutcomeLevelEnum.WORKSPACE}
          selectedOutcome={selectedOutcome}
          create={create}
          update={update}
          handleClose={handleClose}
        />
      </CustomModal>
    );
  },
);
export default AddUpdateOutcomeItemModal;
