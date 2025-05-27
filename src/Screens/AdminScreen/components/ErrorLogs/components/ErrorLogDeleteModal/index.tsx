import { FC } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { useDeleteErrorLogsMutation } from '@/api/mutations/generated/deleteErrorLogs.generated';
import { DeleteErrorLogsMutation } from '@/api/mutations/generated/deleteErrorLogs.generated.ts';
import CustomModal from '@/Components/Shared/CustomModal';
import DeleteModalTemplate from '@/Components/Shared/DeleteModalTemplate';

interface IErrorLogDeleteModal {
  isOpen: boolean;
  handleClose: (item: null) => void;
}

const ErrorLogDeleteModal: FC<IErrorLogDeleteModal> = ({ isOpen, handleClose }) => {
  const queryClient = useQueryClient();

  const { mutate: mutateDeleteErrorLogs, isPending: isLoadingDeleteErrorLogs } =
    useDeleteErrorLogsMutation<DeleteErrorLogsMutation, Error>();

  const onHandleCloseModal = () => {
    handleClose(null);
  };

  const onHandleDeleteWorkspaceItem = () => {
    mutateDeleteErrorLogs(
      {},
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['GetErrorLogs'] }).then();
          onHandleCloseModal();
        },
      },
    );
  };

  return (
    <CustomModal
      isOpen={isOpen}
      handleClose={onHandleCloseModal}
      canCloseWithOutsideClick={!isLoadingDeleteErrorLogs}>
      <DeleteModalTemplate
        item={{
          type: 'Error logs',
          name: 'error logs',
        }}
        handleClose={onHandleCloseModal}
        handleDelete={onHandleDeleteWorkspaceItem}
        isLoading={isLoadingDeleteErrorLogs}
        text={'Are you sure you want to delete all error logs'}
      />
    </CustomModal>
  );
};

export default ErrorLogDeleteModal;
