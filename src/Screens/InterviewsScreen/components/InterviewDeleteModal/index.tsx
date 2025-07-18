import { FC } from 'react';

import { useWuShowToast } from '@npm-questionpro/wick-ui-lib';


import { InterviewType } from '../../types';

import {
  DeleteInterviewMutation,
  useDeleteInterviewMutation,
} from '@/api/mutations/generated/deleteInterview.generated.ts';
import BaseWuModal from '@/Components/Shared/BaseWuModal';
import DeleteModalTemplate from '@/Components/Shared/DeleteModalTemplate';
import { ModalConfirmButton } from '@/Components/Shared/ModalConfirmButton';

interface IInterviewDeleteModal {
  isOpen: boolean;
  interview: InterviewType | null;
  onHandleFilterInterview: (id: number) => void;
  handleClose: (item: null) => void;
}

const InterviewDeleteModal: FC<IInterviewDeleteModal> = ({
  isOpen,
  interview,
  onHandleFilterInterview,
  handleClose,
}) => {
  const { showToast } = useWuShowToast();

  const { mutate: deleteInterviewMutate, isPending } = useDeleteInterviewMutation<
    Error,
    DeleteInterviewMutation
  >({
    onSuccess: () => {
      onHandleFilterInterview(interview?.id as number);
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
    deleteInterviewMutate({
      id: interview?.id as number,
    });
  };

  return (
    <BaseWuModal
      isOpen={isOpen}
      handleClose={onHandleCloseModal}
      canCloseWithOutsideClick={!isPending}
      headerTitle={`Delete ${interview?.name || 'Interview'}`}
      isProcessing={isPending}
      ModalConfirmButton={
        <ModalConfirmButton
          disabled={isPending}
          buttonName={'Delete'}
          onClick={onHandleDeleteWorkspaceItem}
        />
      }>
      <DeleteModalTemplate item={{ type: 'Interview', name: interview?.name || 'Interview' }} />
    </BaseWuModal>
  );
};

export default InterviewDeleteModal;
