import { FC } from 'react';

import { useWuShowToast } from '@npm-questionpro/wick-ui-lib';

import {
  DeletePersonaGroupMutation,
  useDeletePersonaGroupMutation,
} from '@/api/mutations/generated/deletePersonaGroup.generated.ts';
import CustomModal from '@/Components/Shared/CustomModal';
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
        onError: (error: any) => {
          showToast({
            variant: 'error',
            message: error?.message,
          });
        },
      },
    );
  };

  return (
    <CustomModal isOpen={isOpen} handleClose={handleClose} canCloseWithOutsideClick={!isPending}>
      <DeleteModalTemplate
        item={{
          type: 'persona group',
          name: 'Persona Group',
        }}
        handleClose={handleClose}
        handleDelete={handleDeleteBoard}
        isLoading={isPending}
      />
    </CustomModal>
  );
};

export default PersonaGroupDeleteModal;
