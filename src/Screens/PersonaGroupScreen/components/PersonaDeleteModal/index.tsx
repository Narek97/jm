import { FC } from 'react';

import { useWuShowToast } from '@npm-questionpro/wick-ui-lib';

import {
  DeletePersonaMutation,
  useDeletePersonaMutation,
} from '@/api/mutations/generated/deletePersona.generated.ts';
import BaseWuModal from '@/Components/Shared/BaseWuModal';
import DeleteModalTemplate from '@/Components/Shared/DeleteModalTemplate';
import { ModalConfirmButton } from '@/Components/Shared/ModalConfirmButton';

interface IPersonaDeleteModal {
  isOpen: boolean;
  personaId: number | null;
  handleClose: () => void;
  onHandleFilterPersona: (id: number) => void;
}

const PersonaDeleteModal: FC<IPersonaDeleteModal> = ({
  personaId,
  isOpen,
  handleClose,
  onHandleFilterPersona,
}) => {
  const { showToast } = useWuShowToast();

  const { mutate, isPending } = useDeletePersonaMutation<Error, DeletePersonaMutation>();

  const handleDeletePersona = () => {
    mutate(
      {
        id: personaId!,
      },
      {
        onSuccess: () => {
          onHandleFilterPersona(personaId!);
          handleClose();
        },
        onError: error => {
          showToast({
            variant: 'error',
            message: error?.message,
          });
          handleClose();
        },
      },
    );
  };

  return (
    <BaseWuModal
      headerTitle={'Delete Persona'}
      isOpen={isOpen}
      handleClose={handleClose}
      canCloseWithOutsideClick={!isPending}
      isProcessing={isPending}
      ModalConfirmButton={
        <ModalConfirmButton
          disabled={isPending}
          buttonName={'Delete'}
          onClick={handleDeletePersona}
        />
      }>
      <DeleteModalTemplate
        item={{
          type: 'persona',
          name: 'Persona',
        }}
      />
    </BaseWuModal>
  );
};

export default PersonaDeleteModal;
