import { FC } from 'react';

import {
  MapsBulkDeleteMutation,
  useMapsBulkDeleteMutation,
} from '@/api/mutations/generated/mapsBulkDelete.generated.ts';
import BaseWuModal from '@/Components/Shared/BaseWuModal';
import DeleteModalTemplate from '@/Components/Shared/DeleteModalTemplate';
import { ModalConfirmButton } from '@/Components/Shared/ModalConfirmButton';
import { useSetQueryDataByKey } from '@/hooks/useQueryKey.ts';
import { queryClient } from '@/providers/constants';
import { JourneyChildType, JourneyType } from '@/Screens/JourniesScreen/types.ts';

interface IDeleteCxMapTable {
  ids: Array<number>;
  isOpen: boolean;
  isHasPagination: boolean;
  onHandleFilterJourney: () => void;
  handleClose: () => void;
}

const JourneyDeleteModal: FC<IDeleteCxMapTable> = ({
  ids,
  isOpen,
  isHasPagination,
  onHandleFilterJourney,
  handleClose,
}) => {
  const setJourneys = useSetQueryDataByKey('GetJourneys');
  const { mutate, isPending: isLoadingDeleteWorkspaceItem } = useMapsBulkDeleteMutation<
    Error,
    MapsBulkDeleteMutation
  >({
    onSuccess: async () => {
      if (isHasPagination) {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['GetBoardOutcomesStat'] }),
          queryClient.invalidateQueries({ queryKey: ['GetJourneys'] }),
          queryClient.invalidateQueries({ queryKey: ['GetParentMapChildren'] }),
        ]);
      } else {
        setJourneys((oldData: any) => {
          return {
            getMaps: {
              count: oldData.getMaps.count - 1,
              maps: oldData.getMaps.maps
                .filter((journey: JourneyType) => !ids.includes(journey.id))
                .map((journey: JourneyType) => ({
                  ...journey,
                  childMaps:
                    journey.childMaps?.filter((child: JourneyChildType) => {
                      return !ids.includes(child?.childId);
                    }) || [],
                })),
            },
          };
        });
      }
      await queryClient.invalidateQueries({ queryKey: ['GetParentMapChildren'] });
      onHandleFilterJourney();
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
    <BaseWuModal
      headerTitle={`Delete ${title}`}
      isOpen={isOpen}
      handleClose={handleClose}
      canCloseWithOutsideClick={!isLoadingDeleteWorkspaceItem}
      isProcessing={isLoadingDeleteWorkspaceItem}
      ModalConfirmButton={
        <ModalConfirmButton
          disabled={isLoadingDeleteWorkspaceItem}
          buttonName={'Delete'}
          onClick={handleDeleteMapItem}
        />
      }>
      <DeleteModalTemplate
        item={{
          type: title,
          name: title,
        }}
      />
    </BaseWuModal>
  );
};

export default JourneyDeleteModal;
