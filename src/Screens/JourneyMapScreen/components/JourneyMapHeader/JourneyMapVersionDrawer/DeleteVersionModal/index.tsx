import { FC } from 'react';

import { useWuShowToast } from '@npm-questionpro/wick-ui-lib';

import { GetMapVersionsQuery } from '@/api/infinite-queries/generated/getMapVersions.generated.ts';
import {
  DeleteMapVersionMutation,
  useDeleteMapVersionMutation,
} from '@/api/mutations/generated/deleteMapVersion.generated.ts';
import BaseWuModal from '@/Components/Shared/BaseWuModal';
import DeleteModalTemplate from '@/Components/Shared/DeleteModalTemplate';
import { ModalConfirmButton } from '@/Components/Shared/ModalConfirmButton';
import { useSetQueryDataByKey } from '@/hooks/useQueryKey';

interface IDeleteVersionModal {
  isOpen: boolean;
  versionId: number;
  handleClose: (item: null) => void;
}

const DeleteVersionModal: FC<IDeleteVersionModal> = ({ isOpen, versionId, handleClose }) => {
  const { showToast } = useWuShowToast();

  const { mutate, isPending } = useDeleteMapVersionMutation<Error, DeleteMapVersionMutation>();
  const setVersionsQueryData = useSetQueryDataByKey('GetMapVersions.infinite');

  const onHandleCloseModal = () => {
    handleClose(null);
  };

  const onHandleDeleteWorkspaceItem = () => {
    mutate(
      {
        id: versionId,
      },
      {
        onSuccess: () => {
          setVersionsQueryData((oldData: any) => {
            const updatedPages = (oldData.pages as Array<GetMapVersionsQuery>).map(page => {
              return {
                ...page,
                getMapVersions: {
                  ...page.getMapVersions,
                  mapVersions: page.getMapVersions.mapVersions.filter(version => {
                    return version.id !== versionId;
                  }),
                },
              };
            });

            return {
              ...oldData,
              pages: updatedPages,
            };
          });
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
      canCloseWithOutsideClick={!isPending}
      headerTitle={'Delete Version'}
      isProcessing={isPending}
      ModalConfirmButton={
        <ModalConfirmButton
          disabled={isPending}
          buttonName={'Delete'}
          onClick={onHandleDeleteWorkspaceItem}
        />
      }>
      <DeleteModalTemplate
        item={{ type: 'version', name: 'Version' }}
        text={'Are you sure you want to delete version'}
      />
    </BaseWuModal>
  );
};

export default DeleteVersionModal;
