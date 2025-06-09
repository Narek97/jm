import { FC, useCallback } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import {
  ConnectPersonasToMapMutation,
  useConnectPersonasToMapMutation,
} from '@/api/mutations/generated/assignPersonaToJourneyMap.generated.ts';
import { useGetMapSelectedPersonasQuery } from '@/api/queries/generated/getMapSelectedPersonas.generated.ts';
import CustomModal from '@/Components/Shared/CustomModal';
import DeleteModalTemplate from '@/Components/Shared/DeleteModalTemplate';

interface IDeleteCxMapTable {
  mapId: number;
  disconnectedId: number;
  isOpen: boolean;
  handleClose: () => void;
  disconnectPersona?: (personaId: number) => void;
}

const DeleteAssignedPersona: FC<IDeleteCxMapTable> = ({
  mapId,
  disconnectedId,
  isOpen,
  handleClose,
  disconnectPersona,
}) => {
  const queryClient = useQueryClient();

  const { mutate: connectOrDisconnectPersonas, isPending: connectPersonasIsLoading } =
    useConnectPersonasToMapMutation<Error, ConnectPersonasToMapMutation>();

  const handleDeleteMapItem = useCallback(() => {
    connectOrDisconnectPersonas(
      {
        connectPersonasToMapInput: {
          mapId,
          disconnectPersonaIds: [disconnectedId],
        },
      },
      {
        onSuccess: async () => {
          if (disconnectPersona) {
            disconnectPersona(disconnectedId);
          }
          handleClose();
          await queryClient.invalidateQueries({
            queryKey: useGetMapSelectedPersonasQuery.getKey({
              mapId,
            }),
          });
          await queryClient.invalidateQueries({
            queryKey: ['GetJourneyMapRows.infinite'],
          });
        },
      },
    );
  }, [
    connectOrDisconnectPersonas,
    disconnectPersona,
    disconnectedId,
    handleClose,
    mapId,
    queryClient,
  ]);

  return (
    <CustomModal
      isOpen={isOpen}
      handleClose={handleClose}
      canCloseWithOutsideClick={!connectPersonasIsLoading}>
      <DeleteModalTemplate
        item={{
          type: 'persona',
          name: 'persona',
        }}
        handleClose={handleClose}
        handleDelete={handleDeleteMapItem}
        isLoading={connectPersonasIsLoading}
      />
    </CustomModal>
  );
};

export default DeleteAssignedPersona;
