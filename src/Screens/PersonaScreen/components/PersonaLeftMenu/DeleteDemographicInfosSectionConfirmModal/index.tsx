import { FC, useCallback } from 'react';

import { useWuShowToast } from '@npm-questionpro/wick-ui-lib';

import {
  DeleteAllDemographicInfoFieldsMutation,
  useDeleteAllDemographicInfoFieldsMutation,
} from '@/api/mutations/generated/deleteAllDemographicInfoFields.generated.ts';
import CustomModal from '@/Components/Shared/CustomModal';
import DeleteModalTemplate from '@/Components/Shared/DeleteModalTemplate';

interface IDeleteCxMapTable {
  personaId: number;
  isOpen: boolean;
  handleClose: () => void;
  onSuccess: () => void;
}

const DeleteDemographicInfosSectionConfirmModal: FC<IDeleteCxMapTable> = ({
  personaId,
  isOpen,
  handleClose,
  onSuccess,
}) => {
  const { showToast } = useWuShowToast();

  const { mutate: deleteFields, isPending: connectPersonasIsLoading } =
    useDeleteAllDemographicInfoFieldsMutation<Error, DeleteAllDemographicInfoFieldsMutation>();

  const handleDeleteMapItem = useCallback(() => {
    deleteFields(
      {
        personaId,
      },
      {
        onSuccess: async () => {
          onSuccess();
        },
        onError: error => {
          showToast({
            variant: 'error',
            message: error?.message,
          });
        },
      },
    );
  }, [deleteFields, onSuccess, personaId, showToast]);

  return (
    <CustomModal
      isOpen={isOpen}
      handleClose={handleClose}
      canCloseWithOutsideClick={!connectPersonasIsLoading}>
      <DeleteModalTemplate
        item={{
          type: 'demographic info section',
          name: 'demographic info section',
        }}
        text={'Are you sure you want to delete demographic info section?'}
        handleClose={handleClose}
        handleDelete={handleDeleteMapItem}
        isLoading={connectPersonasIsLoading}
      />
    </CustomModal>
  );
};

export default DeleteDemographicInfosSectionConfirmModal;
