import * as Types from "../../types";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { axiosRequest } from "../../axios";
export type UpdateBoxElementMutationVariables = Types.Exact<{
  updateBoxDataInput: Types.UpdateBoxDataInput;
}>;

export type UpdateBoxElementMutation = {
  __typename?: "Mutation";
  updateBoxElement: {
    __typename?: "BoxElementResponseModel";
    id: number;
    columnId: number;
    stepId: number;
    rowId: number;
    text?: string | null;
    index: number;
    previousText?: string | null;
    attachmentId?: number | null;
    bgColor?: string | null;
    previousBgColor?: string | null;
  };
};

export const UpdateBoxElementDocument = `
    mutation UpdateBoxElement($updateBoxDataInput: UpdateBoxDataInput!) {
  updateBoxElement(updateBoxDataInput: $updateBoxDataInput) {
    id
    columnId
    stepId
    rowId
    text
    index
    previousText
    attachmentId
    bgColor
    previousBgColor
  }
}
    `;

export const useUpdateBoxElementMutation = <
  TError = unknown,
  TContext = unknown,
>(
  options?: UseMutationOptions<
    UpdateBoxElementMutation,
    TError,
    UpdateBoxElementMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    UpdateBoxElementMutation,
    TError,
    UpdateBoxElementMutationVariables,
    TContext
  >({
    mutationKey: ["UpdateBoxElement"],
    mutationFn: axiosRequest<
      UpdateBoxElementMutation,
      UpdateBoxElementMutationVariables
    >(UpdateBoxElementDocument),
    ...options,
  });
};

useUpdateBoxElementMutation.getKey = () => ["UpdateBoxElement"];
