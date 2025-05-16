import { FC } from "react";

import CustomModalFooterButtons from "@/Components/Shared/CustomModalFooterButtons";
import CustomModalHeader from "@/Components/Shared/CustomModalHeader";

interface IDeleteModalTemplate {
  item: { type: string; name: string };
  handleClose: () => void;
  handleDelete: () => void;
  isLoading: boolean;
  text?: string;
}

const DeleteModalTemplate: FC<IDeleteModalTemplate> = ({
  item,
  handleClose,
  handleDelete,
  isLoading,
  text,
}) => {
  return (
    <div className={"delete-modal-template"}>
      <CustomModalHeader title={`Delete ${item.name}`} />
      <div className={"custom-modal-content"}>
        <div className={"delete-modal-template--content"}>
          <p className={"delete-modal-template--title"}>
            {text || `Are you sure you want to delete selected  ${item.type} ?`}
          </p>
        </div>
      </div>
      <CustomModalFooterButtons
        handleFirstButtonClick={handleClose}
        handleSecondButtonClick={handleDelete}
        isLoading={isLoading}
        secondButtonName={"Delete"}
      />
    </div>
  );
};

export default DeleteModalTemplate;
