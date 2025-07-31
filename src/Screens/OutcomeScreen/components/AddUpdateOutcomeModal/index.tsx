import { FC, memo, useRef, useState } from 'react';

import { WuButton } from '@npm-questionpro/wick-ui-lib';

import BaseWuModal from '@/Components/Shared/BaseWuModal';
import AddUpdateOutcomeForm from '@/Screens/OutcomeScreen/components/AddUpdateOutcomeModal/AddUpdateOutcomeForm';
import { OutcomeGroupOutcomeType } from '@/Screens/OutcomeScreen/types.ts';
import { OutcomeLevelEnum } from '@/types/enum';

interface IAddUpdateOutcomeItem {
  isOpen: boolean;
  workspaceId: number;
  outcomeGroupId: number;
  singularName: string;
  selectedOutcome: OutcomeGroupOutcomeType | null;
  create: (data: OutcomeGroupOutcomeType) => void;
  update: (data: OutcomeGroupOutcomeType) => void;
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
    const [isLoadingCrateUpdate, setIsLoadingCrateUpdate] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const handleConfirmClick = () => {
      if (formRef.current) {
        formRef.current.requestSubmit();
      }
    };
    return (
      <BaseWuModal
        headerTitle={`${selectedOutcome ? 'Update' : 'New'} ${singularName}`}
        isOpen={isOpen}
        modalSize={'md'}
        handleClose={handleClose}
        canCloseWithOutsideClick={true}
        isProcessing={isLoadingCrateUpdate}
        ModalConfirmButton={
          <WuButton
            type="button"
            data-testid="save-outcome-test-id"
            disabled={isLoadingCrateUpdate}
            onClick={handleConfirmClick}>
            Save
          </WuButton>
        }>
        <AddUpdateOutcomeForm
          workspaceId={workspaceId!}
          outcomeGroupId={outcomeGroupId}
          defaultMapId={selectedOutcome?.map?.id || null}
          level={OutcomeLevelEnum.WORKSPACE}
          selectedOutcome={selectedOutcome}
          create={create}
          update={update}
          handleChangeIsLoading={() => {
            setIsLoadingCrateUpdate(prev => !prev);
          }}
          formRef={formRef}
        />
      </BaseWuModal>
    );
  },
);
export default AddUpdateOutcomeItemModal;
