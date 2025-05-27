import { FC } from 'react';

import { useWuShowToast } from '@npm-questionpro/wick-ui-lib';

import { InterviewType } from '../../types';

import {
  DeleteInterviewMutation,
  useDeleteInterviewMutation,
} from '@/api/mutations/generated/deleteInterview.generated.ts';
import CustomModal from '@/Components/Shared/CustomModal';
import DeleteModalTemplate from '@/Components/Shared/DeleteModalTemplate';

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
    <CustomModal
      isOpen={isOpen}
      handleClose={onHandleCloseModal}
      canCloseWithOutsideClick={!isPending}>
      <DeleteModalTemplate
        item={{ type: 'Interview', name: interview?.name || 'Interview' }}
        handleClose={onHandleCloseModal}
        handleDelete={onHandleDeleteWorkspaceItem}
        isLoading={isPending}
      />
    </CustomModal>
  );
};

export default InterviewDeleteModal;
