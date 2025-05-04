import * as Types from "../../types";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { axiosRequest } from "../../axios";
export type AddBoxElementMutationVariables = Types.Exact<{
  addBoxElementInput: Types.AddBoxElementInput;
}>;

export type AddBoxElementMutation = {
  __typename?: "Mutation";
  addBoxElement: {
    __typename?: "BoxElementResponseModel";
    id: number;
    columnId: number;
    rowId: number;
    text?: string | null;
    stepId: number;
    attachmentId?: number | null;
  };
};

export const AddBoxElementDocument = `
    mutation AddBoxElement($addBoxElementInput: AddBoxElementInput!) {
  addBoxElement(addBoxElementInput: $addBoxElementInput) {
    id
    columnId
    rowId
    text
    stepId
    attachmentId
  }
}
    `;

export const useAddBoxElementMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    AddBoxElementMutation,
    TError,
    AddBoxElementMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    AddBoxElementMutation,
    TError,
    AddBoxElementMutationVariables,
    TContext
  >({
    mutationKey: ["AddBoxElement"],
    mutationFn: axiosRequest<
      AddBoxElementMutation,
      AddBoxElementMutationVariables
    >(AddBoxElementDocument),
    ...options,
  });
};

useAddBoxElementMutation.getKey = () => ["AddBoxElement"];
