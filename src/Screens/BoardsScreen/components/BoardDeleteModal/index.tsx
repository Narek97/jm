import { FC } from 'react';

import { useWuShowToast } from '@npm-questionpro/wick-ui-lib';

import {
  DeleteBoardMutation,
  useDeleteBoardMutation,
} from '@/api/mutations/generated/deleteBoard.generated.ts';
import BaseWuModal from '@/Components/Shared/BaseWuModal';
import DeleteModalTemplate from '@/Components/Shared/DeleteModalTemplate';
import { ModalConfirmButton } from '@/Components/Shared/ModalConfirmButton';

interface IBoardDeleteModal {
  isOpen: boolean;
  boardID: number | null;
  handleClose: () => void;
  onHandleFilterBoard: (id: number) => void;
}

const BoardDeleteModal: FC<IBoardDeleteModal> = ({
  boardID,
  isOpen,
  handleClose,
  onHandleFilterBoard,
}) => {
  const { showToast } = useWuShowToast();

  const { mutate, isPending } = useDeleteBoardMutation<Error, DeleteBoardMutation>({
    onError: error => {
      showToast({
        variant: 'error',
        message: error?.message,
      });
    },
  });

  const handleDeleteBoard = () => {
    mutate(
      {
        id: boardID!,
      },
      {
        onSuccess: () => {
          onHandleFilterBoard(boardID!);
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
      headerTitle={'Delete board'}
      isOpen={isOpen}
      handleClose={handleClose}
      canCloseWithOutsideClick={!isPending}
      isProcessing={isPending}
      ModalConfirmButton={
        <ModalConfirmButton
          disabled={isPending}
          buttonName={'Delete'}
          onClick={handleDeleteBoard}
        />
      }>
      <DeleteModalTemplate
        item={{
          type: 'board',
          name: 'board',
        }}
      />
    </BaseWuModal>
  );
};

export default BoardDeleteModal;
