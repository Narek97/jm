import { FC } from "react";

import {
  DeletePerformanceMutation,
  useDeletePerformanceMutation,
} from "@/api/mutations/generated/deletePerformancheLogs.generated.ts";
import CustomModal from "@/Components/Shared/CustomModal";
import DeleteModalTemplate from "@/Components/Shared/DeleteModalTemplate";
import { useSetQueryDataByKey } from "@/hooks/useQueryKey.ts";

interface IPerformanceLogsDeleteModal {
  isOpen: boolean;
  handleClose: (item: null) => void;
}

const PerformanceLogsDeleteModal: FC<IPerformanceLogsDeleteModal> = ({
  isOpen,
  handleClose,
}) => {
  const setPerformanceLogsData = useSetQueryDataByKey("GetPerformanceLogs");

  const {
    mutate: mutateDeletePerformanceLogs,
    isPending: isPendingDeletePerformanceLogs,
  } = useDeletePerformanceMutation<DeletePerformanceMutation, Error>();

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
    <CustomModal
      isOpen={isOpen}
      handleClose={onHandleCloseModal}
      canCloseWithOutsideClick={!isPendingDeletePerformanceLogs}
    >
      <DeleteModalTemplate
        item={{ type: "Performance logs", name: "performance logs" }}
        handleClose={onHandleCloseModal}
        handleDelete={onHandleDeleteWorkspaceItem}
        isLoading={isPendingDeletePerformanceLogs}
        text={"Are you sure you want to delete all performance logs"}
      />
    </CustomModal>
  );
};

export default PerformanceLogsDeleteModal;
