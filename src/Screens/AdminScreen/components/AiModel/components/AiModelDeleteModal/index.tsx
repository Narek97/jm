import { FC } from 'react';

import { useWuShowToast } from '@npm-questionpro/wick-ui-lib';

import { AiModelType } from '../../types';

import {
  DeleteAiJourneyModelMutation,
  useDeleteAiJourneyModelMutation,
} from '@/api/mutations/generated/deleteAiJourneyModel.generated.ts';
import CustomModal from '@/Components/Shared/CustomModal';
import DeleteModalTemplate from '@/Components/Shared/DeleteModalTemplate';

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
    <CustomModal
      isOpen={isOpen}
      handleClose={onHandleCloseModal}
      canCloseWithOutsideClick={!isPending}>
      <DeleteModalTemplate
        item={{ type: 'Ai Model', name: aiModel?.name || 'Ai Model' }}
        handleClose={onHandleCloseModal}
        handleDelete={onHandleDeleteWorkspaceItem}
        isLoading={isPending}
      />
    </CustomModal>
  );
};

export default AiModelDeleteModal;
