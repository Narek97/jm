import { FC } from 'react';

import { useWuShowToast } from '@npm-questionpro/wick-ui-lib';

import { ModalConfirmButton } from '../../../../Components/Shared/ModalConfirmButton';

import {
  DeletePersonaGroupMutation,
  useDeletePersonaGroupMutation,
} from '@/api/mutations/generated/deletePersonaGroup.generated.ts';
import BaseWuModal from '@/Components/Shared/BaseWuModal';
import DeleteModalTemplate from '@/Components/Shared/DeleteModalTemplate';

interface IGroupDeleteModal {
  isOpen: boolean;
  groupId: number;
  handleDelete: (groupId: number) => void;
  handleClose: () => void;
}

const PersonaGroupDeleteModal: FC<IGroupDeleteModal> = ({
  groupId,
  isOpen,
  handleDelete,
  handleClose,
}) => {
  const { mutate, isPending } = useDeletePersonaGroupMutation<Error, DeletePersonaGroupMutation>();
  const { showToast } = useWuShowToast();

  const handleDeleteBoard = () => {
    mutate(
      {
        id: groupId,
      },
      {
        onSuccess: () => {
          handleDelete(groupId);
          handleClose();
        },
        onError: error => {
          showToast({
            variant: 'error',
            message: error?.message,
          });
        },
      },
    );
  };

  return (
    <BaseWuModal
      headerTitle={`Delete Persona Group}`}
      isOpen={isOpen}
      handleClose={handleClose}
      canCloseWithOutsideClick={!isPending}
      isProcessing={isPending}
      ModalConfirmButton={
        <ModalConfirmButton disabled={isPending} buttonName={'Delete'} onClick={handleDeleteBoard} />
      }>
      <DeleteModalTemplate
        item={{
          type: 'persona group',
          name: 'Persona Group',
        }}
      />
    </BaseWuModal>
  );
};

export default PersonaGroupDeleteModal;
