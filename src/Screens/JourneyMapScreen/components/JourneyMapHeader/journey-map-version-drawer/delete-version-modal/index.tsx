import { FC } from 'react';

import { useSetRecoilState } from 'recoil';

import CustomModal from '@/components/atoms/custom-modal/custom-modal';
import DeleteModalTemplate from '@/components/templates/delete-modal-template';
import { GetMapVersionsQuery } from '@/gql/infinite-queries/generated/getMapVersions.generated';
import {
  DeleteMapVersionMutation,
  useDeleteMapVersionMutation,
} from '@/gql/mutations/generated/deleteMapVersion.generated';
import { useSetQueryDataByKey } from '@/hooks/useQueryKey';
import { snackbarState } from '@/store/atoms/snackbar.atom';

interface IDeleteVersionModal {
  isOpen: boolean;
  versionId: number;
  handleClose: (item: null) => void;
}

const DeleteVersionModal: FC<IDeleteVersionModal> = ({ isOpen, versionId, handleClose }) => {
  const { mutate, isLoading } = useDeleteMapVersionMutation<Error, DeleteMapVersionMutation>();

  const setVersionsQueryData = useSetQueryDataByKey('GetMapVersions.infinite');

  const setSnackbar = useSetRecoilState(snackbarState);

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
          setSnackbar(prev => ({
            ...prev,
            open: true,
            type: 'error',
            message: error.message,
          }));
        },
      },
    );
  };

  return (
    <CustomModal
      isOpen={isOpen}
      handleClose={onHandleCloseModal}
      canCloseWithOutsideClick={!isLoading}>
      <DeleteModalTemplate
        item={{ type: 'version', name: 'Version' }}
        handleClose={onHandleCloseModal}
        handleDelete={onHandleDeleteWorkspaceItem}
        isLoading={isLoading}
        text={'Are you sure you want to delete version'}
      />
    </CustomModal>
  );
};

export default DeleteVersionModal;
