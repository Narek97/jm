import { FC } from 'react';

import { useWuShowToast } from '@npm-questionpro/wick-ui-lib';

import {
  DeleteBoardMutation,
  useDeleteBoardMutation,
} from '@/api/mutations/generated/deleteBoard.generated.ts';
import CustomModal from '@/Components/Shared/CustomModal';
import DeleteModalTemplate from '@/Components/Shared/DeleteModalTemplate';

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
    <CustomModal isOpen={isOpen} handleClose={handleClose} canCloseWithOutsideClick={!isPending}>
      <DeleteModalTemplate
        item={{
          type: 'Board',
          name: 'board',
        }}
        handleClose={handleClose}
        handleDelete={handleDeleteBoard}
        isLoading={isPending}
      />
    </CustomModal>
  );
};

export default BoardDeleteModal;
