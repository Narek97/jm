import { FC } from 'react';

import {
  MapsBulkDeleteMutation,
  useMapsBulkDeleteMutation,
} from '@/api/mutations/generated/mapsBulkDelete.generated.ts';
import CustomModal from '@/Components/Shared/CustomModal';
import DeleteModalTemplate from '@/Components/Shared/DeleteModalTemplate';
import { queryClient } from '@/providers/constants';

interface IDeleteCxMapTable {
  ids: Array<number>;
  isOpen: boolean;
  handleClose: () => void;
  onHandleFilterJourney: (ids: Array<number>) => void;
}

const JourneyDeleteModal: FC<IDeleteCxMapTable> = ({
  ids,
  isOpen,
  handleClose,
  onHandleFilterJourney,
}) => {
  const { mutate, isPending: isLoadingDeleteWorkspaceItem } = useMapsBulkDeleteMutation<
    Error,
    MapsBulkDeleteMutation
  >({
    onSuccess: async () => {
      onHandleFilterJourney(ids);
      await queryClient.invalidateQueries({
        queryKey: ['GetBoardOutcomesStat'],
      });
      handleClose();
    },
    onError: () => {
      handleClose();
    },
  });

  const handleDeleteMapItem = () => {
    mutate({
      mapsBulkDeleteInput: {
        ids,
      },
    });
  };

  const title = `Journey${ids.length > 1 ? 's' : ''}`;

  return (
    <CustomModal
      isOpen={isOpen}
      handleClose={handleClose}
      canCloseWithOutsideClick={!isLoadingDeleteWorkspaceItem}>
      <DeleteModalTemplate
        item={{
          type: title,
          name: title,
        }}
        handleClose={handleClose}
        handleDelete={handleDeleteMapItem}
        isLoading={isLoadingDeleteWorkspaceItem}
      />
    </CustomModal>
  );
};

export default JourneyDeleteModal;
