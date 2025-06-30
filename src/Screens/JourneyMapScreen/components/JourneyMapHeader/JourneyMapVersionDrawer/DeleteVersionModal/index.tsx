import { FC } from 'react';

import { useWuShowToast } from '@npm-questionpro/wick-ui-lib';

import { GetMapVersionsQuery } from '@/api/infinite-queries/generated/getMapVersions.generated.ts';
import {
  DeleteMapVersionMutation,
  useDeleteMapVersionMutation,
} from '@/api/mutations/generated/deleteMapVersion.generated.ts';
import CustomModal from '@/Components/Shared/CustomModal';
import DeleteModalTemplate from '@/Components/Shared/DeleteModalTemplate';
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
    <CustomModal
      isOpen={isOpen}
      handleClose={onHandleCloseModal}
      canCloseWithOutsideClick={!isPending}>
      <DeleteModalTemplate
        item={{ type: 'version', name: 'Version' }}
        handleClose={onHandleCloseModal}
        handleDelete={onHandleDeleteWorkspaceItem}
        isLoading={isPending}
        text={'Are you sure you want to delete version'}
      />
    </CustomModal>
  );
};

export default DeleteVersionModal;
