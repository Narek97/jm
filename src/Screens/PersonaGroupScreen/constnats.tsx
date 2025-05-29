import { MenuOptionsType } from "@/types";

export const PERSONA_OPTIONS = ({
  onHandleEdit,
  onHandleCopy,
  onHandleDelete,
}: {
  onHandleEdit: () => void;
  onHandleCopy: () => void;
  onHandleDelete: (data) => void;
}): Array<MenuOptionsType> => {
  return [
    {
      icon: <span className={"wm-edit"} />,
      name: "Edit",
      onClick: onHandleEdit,
    },
    {
      icon: <span className={"wm-content-copy"} />,
      name: "Copy",
      onClick: onHandleCopy,
    },
    {
      icon: <span className={"wm-delete"} />,
      name: "Delete",
      onClick: onHandleDelete,
    },
  ];
};
