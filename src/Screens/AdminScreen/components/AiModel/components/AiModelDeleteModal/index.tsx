import { FC } from 'react';

import { useWuShowToast } from '@npm-questionpro/wick-ui-lib';

import { AiModelType } from '../../types';

import {
  DeleteAiJourneyModelMutation,
  useDeleteAiJourneyModelMutation,
} from '@/api/mutations/generated/deleteAiJourneyModel.generated.ts';
import BaseWuModal from '@/Components/Shared/BaseWuModal';
import DeleteModalTemplate from '@/Components/Shared/DeleteModalTemplate';
import { ModalConfirmButton } from '@/Components/Shared/ModalConfirmButton';

interface IAiModelDeleteModal {
  isOpen: boolean;
  aiModel: AiModelType;
  onHandleFilterAiModel: (id: number) => void;
  handleClose: (item: null) => void;
}

const AiModelDeleteModal: FC<IAiModelDeleteModal> = ({
  isOpen,
  aiModel,
  onHandleFilterAiModel,
  handleClose,
}) => {
  const { showToast } = useWuShowToast();

  const { mutate: deleteAiModelMutate, isPending } = useDeleteAiJourneyModelMutation<
    Error,
    DeleteAiJourneyModelMutation
  >({
    onSuccess: () => {
      onHandleFilterAiModel(aiModel.id);
      onHandleCloseModal();
    },
    onError: error => {
      showToast({
        variant: 'error',
        message: error?.message,
      });
    },
  });

  const onHandleCloseModal = () => {
    handleClose(null);
  };

  const onHandleDeleteWorkspaceItem = () => {
    deleteAiModelMutate({
      id: aiModel.id,
    });
  };

  return (
    <BaseWuModal
      isOpen={isOpen}
      handleClose={onHandleCloseModal}
      canCloseWithOutsideClick={!isPending}
      headerTitle={`Delete ${aiModel?.name || 'Ai Model'}`}
      isProcessing={isPending}
      ModalConfirmButton={
        <ModalConfirmButton
          disabled={isPending}
          buttonName={'Delete'}
          onClick={onHandleDeleteWorkspaceItem}
        />
      }>
      <DeleteModalTemplate item={{ type: 'Ai Model', name: aiModel?.name || 'Ai Model' }} />
    </BaseWuModal>
  );
};

export default AiModelDeleteModal;
