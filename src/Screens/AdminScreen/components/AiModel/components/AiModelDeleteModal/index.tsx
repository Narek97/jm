import { FC } from "react";

import {
  DeleteAiJourneyModelMutation,
  useDeleteAiJourneyModelMutation,
} from "@/api/mutations/generated/deleteAiJourneyModel.generated.ts";
import { AiJourneyModelResponse } from "@/api/types.ts";
import CustomModal from "@/Components/Shared/CustomModal";
import DeleteModalTemplate from "@/Components/Shared/DeleteModalTemplate";

interface IAiModelDeleteModal {
  isOpen: boolean;
  aiModel: AiJourneyModelResponse;
  onHandleFilterAiModel: (id: number) => void;
  handleClose: (item: null) => void;
}

const AiModelDeleteModal: FC<IAiModelDeleteModal> = ({
  isOpen,
  aiModel,
  onHandleFilterAiModel,
  handleClose,
}) => {
  const { mutate: deleteAiModelMutate, isPending } =
    useDeleteAiJourneyModelMutation<DeleteAiJourneyModelMutation, Error>({
      onSuccess: () => {
        onHandleFilterAiModel(aiModel.id);
        onHandleCloseModal();
      },
    });

  const onHandleCloseModal = () => {
    handleClose(null);
  };

  const onHandleDeleteWorkspaceItem = () => {
    deleteAiModelMutate({
      id: aiModel.id,
    });
  };

  return (
    <CustomModal
      isOpen={isOpen}
      handleClose={onHandleCloseModal}
      canCloseWithOutsideClick={!isPending}
    >
      <DeleteModalTemplate
        item={{ type: "Ai Model", name: aiModel?.name || "Ai Model" }}
        handleClose={onHandleCloseModal}
        handleDelete={onHandleDeleteWorkspaceItem}
        isLoading={isPending}
      />
    </CustomModal>
  );
};

export default AiModelDeleteModal;
