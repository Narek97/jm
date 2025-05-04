import * as Types from "../../types";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { axiosRequest } from "../../axios";
export type UpdateTextRowsMutationVariables = Types.Exact<{
  updateTextRowInput: Types.UpdateTextRowInput;
}>;

export type UpdateTextRowsMutation = {
  __typename?: "Mutation";
  updateTextRows: {
    __typename?: "BoxTextElementResponseModel";
    id: number;
    columnId: number;
    text?: string | null;
    rowId: number;
    action: Types.ActionEnum;
    stepId: number;
    previousText?: string | null;
  };
};

export const UpdateTextRowsDocument = `
    mutation UpdateTextRows($updateTextRowInput: UpdateTextRowInput!) {
  updateTextRows(updateTextRowInput: $updateTextRowInput) {
    id
    columnId
    text
    rowId
    action
    stepId
    previousText
  }
}
    `;

export const useUpdateTextRowsMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    UpdateTextRowsMutation,
    TError,
    UpdateTextRowsMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    UpdateTextRowsMutation,
    TError,
    UpdateTextRowsMutationVariables,
    TContext
  >({
    mutationKey: ["UpdateTextRows"],
    mutationFn: axiosRequest<
      UpdateTextRowsMutation,
      UpdateTextRowsMutationVariables
    >(UpdateTextRowsDocument),
    ...options,
  });
};

useUpdateTextRowsMutation.getKey = () => ["UpdateTextRows"];
