import { FC } from 'react';

import { useWuShowToast } from '@npm-questionpro/wick-ui-lib';
import { useQueryClient } from '@tanstack/react-query';

import { useDeleteErrorLogsMutation } from '@/api/mutations/generated/deleteErrorLogs.generated';
import { DeleteErrorLogsMutation } from '@/api/mutations/generated/deleteErrorLogs.generated.ts';
import BaseWuModal from '@/Components/Shared/BaseWuModal';
import DeleteModalTemplate from '@/Components/Shared/DeleteModalTemplate';
import { ModalConfirmButton } from '@/Components/Shared/ModalConfirmButton';

interface IErrorLogDeleteModal {
  isOpen: boolean;
  handleClose: (item: null) => void;
}

const ErrorLogDeleteModal: FC<IErrorLogDeleteModal> = ({ isOpen, handleClose }) => {
  const queryClient = useQueryClient();
  const { showToast } = useWuShowToast();

  const { mutate: mutateDeleteErrorLogs, isPending: isLoadingDeleteErrorLogs } =
    useDeleteErrorLogsMutation<Error, DeleteErrorLogsMutation>();

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
      isOpen={isOpen}
      handleClose={onHandleCloseModal}
      canCloseWithOutsideClick={!isLoadingDeleteErrorLogs}
      headerTitle={'Delete error logs'}
      isProcessing={isLoadingDeleteErrorLogs}
      ModalConfirmButton={
        <ModalConfirmButton
          disabled={isLoadingDeleteErrorLogs}
          buttonName={'Delete'}
          onClick={onHandleDeleteWorkspaceItem}
        />
      }>
      <DeleteModalTemplate
        item={{
          type: 'Error logs',
          name: 'error logs',
        }}
        text={'Are you sure you want to delete all error logs'}
      />
    </BaseWuModal>
  );
};

export default ErrorLogDeleteModal;
