import * as yup from "yup";

import { AiJourneyModelResponse } from "@/api/types.ts";
import { AiModelElementType } from "@/Screens/AdminScreen/components/AiModel/types.ts";
import { MenuOptionsType } from "@/types";

const AI_MODEL_CARD_OPTIONS = ({
  onHandleEdit,
  onHandleDelete,
}: {
  onHandleEdit: (board: AiJourneyModelResponse) => void;
  onHandleDelete: (board: AiJourneyModelResponse) => void;
}): Array<MenuOptionsType> => {
  return [
    {
      icon: <span className={"wm-edit"} />,
      name: "Edit",
      onClick: onHandleEdit,
    },
    {
      icon: <span className={"wm-delete"} />,
      name: "Delete",
      onClick: onHandleDelete,
    },
  ];
};

const CREATE_AI_MODEL_VALIDATION_SCHEMA = yup
  .object()
  .shape({
    name: yup.string().required("Name is required"),
    prompt: yup.string().required("Prompt is required"),
    universal: yup.boolean().default(false),
    orgIds: yup
      .array()
      .of(yup.number().required())
      .when("universal", {
        is: (value: boolean) => !value,
        then: () =>
          yup
            .array()
            .min(1, "Select at least one organization")
            .required("Org ids is required"),
        otherwise: () => yup.array().of(yup.number().required()).default([]),
      })
      .default([]),
  })
  .required();

const AI_MODEL_FORM_ELEMENTS: Array<AiModelElementType> = [
  {
    name: "name",
    title: "Name",
    placeholder: "Type name",
    type: "sting",
    isMultiline: false,
  },
  {
    name: "prompt",
    title: "Prompt",
    placeholder: "Type prompt",
    type: "sting",
    isMultiline: true,
  },
];

export const AI_MODEL_FILE_TYPES = ["JPG", "PNG", "GIF"];

export {
  AI_MODEL_CARD_OPTIONS,
  CREATE_AI_MODEL_VALIDATION_SCHEMA,
  AI_MODEL_FORM_ELEMENTS,
};
