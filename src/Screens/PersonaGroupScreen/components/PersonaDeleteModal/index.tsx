import { FC } from "react";

import {
  DeletePersonaMutation,
  useDeletePersonaMutation,
} from "@/api/mutations/generated/deletePersona.generated.ts";
import CustomModal from "@/Components/Shared/CustomModal";
import DeleteModalTemplate from "@/Components/Shared/DeleteModalTemplate";

interface IPersonaDeleteModal {
  isOpen: boolean;
  personaId: number | null;
  handleClose: () => void;
  onHandleFilterPersona: (id: number) => void;
}

const PersonaDeleteModal: FC<IPersonaDeleteModal> = ({
  personaId,
  isOpen,
  handleClose,
  onHandleFilterPersona,
}) => {
  const { mutate, isPending } = useDeletePersonaMutation<
    Error,
    DeletePersonaMutation
  >();

  const handleDeletePersona = () => {
    mutate(
      {
        id: personaId!,
      },
      {
        onSuccess: () => {
          onHandleFilterPersona(personaId!);
          handleClose();
        },
        onError: () => {
          handleClose();
        },
      },
    );
  };

  return (
    <CustomModal
      isOpen={isOpen}
      handleClose={handleClose}
      canCloseWithOutsideClick={!isPending}
    >
      <DeleteModalTemplate
        item={{
          type: "persona",
          name: "Persona",
        }}
        handleClose={handleClose}
        handleDelete={handleDeletePersona}
        isLoading={isPending}
      />
    </CustomModal>
  );
};

export default PersonaDeleteModal;
