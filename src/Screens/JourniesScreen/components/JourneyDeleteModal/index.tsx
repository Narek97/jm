import { FC } from 'react';

import {
  MapsBulkDeleteMutation,
  useMapsBulkDeleteMutation,
} from '@/api/mutations/generated/mapsBulkDelete.generated.ts';
import CustomModal from '@/Components/Shared/CustomModal';
import DeleteModalTemplate from '@/Components/Shared/DeleteModalTemplate';
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
