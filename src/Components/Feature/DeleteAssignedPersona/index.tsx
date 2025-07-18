import { FC, useCallback } from 'react';

import { useWuShowToast } from '@npm-questionpro/wick-ui-lib';
import { useQueryClient } from '@tanstack/react-query';

import { ModalConfirmButton } from '../../Shared/ModalConfirmButton';

import {
  ConnectPersonasToMapMutation,
  useConnectPersonasToMapMutation,
} from '@/api/mutations/generated/assignPersonaToJourneyMap.generated.ts';
import { useGetMapSelectedPersonasQuery } from '@/api/queries/generated/getMapSelectedPersonas.generated.ts';
import BaseWuModal from '@/Components/Shared/BaseWuModal';
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
  const { showToast } = useWuShowToast();

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
          await Promise.all([
            queryClient.invalidateQueries({
              queryKey: useGetMapSelectedPersonasQuery.getKey({ mapId }),
            }),
            queryClient.invalidateQueries({
              queryKey: ['GetJourneyMapRows.infinite'],
            }),
          ]);
          handleClose();
        },
        onError: error => {
          showToast({
            variant: 'error',
            message: error?.message,
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
    showToast,
  ]);

  return (
    <BaseWuModal
      isOpen={isOpen}
      handleClose={handleClose}
      canCloseWithOutsideClick={!connectPersonasIsLoading}
      headerTitle={'Delete persona'}
      isProcessing={connectPersonasIsLoading}
      ModalConfirmButton={
        <ModalConfirmButton
          disabled={connectPersonasIsLoading}
          buttonName={'Delete'}
          onClick={handleDeleteMapItem}
        />
      }>
      <DeleteModalTemplate
        item={{
          type: 'persona',
          name: 'persona',
        }}
      />
    </BaseWuModal>
  );
};

export default DeleteAssignedPersona;
