import { FC } from 'react';

import {
  DeletePerformanceMutation,
  useDeletePerformanceMutation,
} from '@/api/mutations/generated/deletePerformancheLogs.generated.ts';
import BaseWuModal from '@/Components/Shared/BaseWuModal';
import DeleteModalTemplate from '@/Components/Shared/DeleteModalTemplate';
import { ModalConfirmButton } from '@/Components/Shared/ModalConfirmButton';
import { useSetQueryDataByKey } from '@/hooks/useQueryKey.ts';

interface IPerformanceLogsDeleteModal {
  isOpen: boolean;
  handleClose: (item: null) => void;
}

const PerformanceLogsDeleteModal: FC<IPerformanceLogsDeleteModal> = ({ isOpen, handleClose }) => {
  const setPerformanceLogsData = useSetQueryDataByKey('GetPerformanceLogs');

  const { mutate: mutateDeletePerformanceLogs, isPending: isPendingDeletePerformanceLogs } =
    useDeletePerformanceMutation<DeletePerformanceMutation, Error>();

  const onHandleCloseModal = () => {
    handleClose(null);
  };

  const onHandleDeleteWorkspaceItem = () => {
    mutateDeletePerformanceLogs(
      {},
      {
        onSuccess: () => {
          setPerformanceLogsData({
            getPerformanceLogs: {
              count: 0,
              errorLogs: [],
            },
          });
          onHandleCloseModal();
        },
      },
    );
  };

  return (
    <BaseWuModal
      isOpen={isOpen}
      handleClose={onHandleCloseModal}
      canCloseWithOutsideClick={!isPendingDeletePerformanceLogs}
      headerTitle={'Delete performance logs'}
      isProcessing={isPendingDeletePerformanceLogs}
      ModalConfirmButton={
        <ModalConfirmButton
          disabled={isPendingDeletePerformanceLogs}
          buttonName={'Delete'}
          onClick={onHandleDeleteWorkspaceItem}
        />
      }>
      <DeleteModalTemplate
        item={{ type: 'Performance logs', name: 'performance logs' }}
        text={'Are you sure you want to delete all performance logs'}
      />
    </BaseWuModal>
  );
};

export default PerformanceLogsDeleteModal;
