import * as Types from "../../types";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { axiosRequest } from "../../axios";
export type UpdateItemsMutationVariables = Types.Exact<{
  updateItemsInput: Types.UpdateItemsInput;
}>;

export type UpdateItemsMutation = {
  __typename?: "Mutation";
  updateItems: Array<{ __typename: "WhiteboardDataItem" }>;
};

export const UpdateItemsDocument = `
    mutation updateItems($updateItemsInput: UpdateItemsInput!) {
  updateItems(updateItemsInput: $updateItemsInput) {
    __typename
  }
}
    `;

export const useUpdateItemsMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    UpdateItemsMutation,
    TError,
    UpdateItemsMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    UpdateItemsMutation,
    TError,
    UpdateItemsMutationVariables,
    TContext
  >({
    mutationKey: ["updateItems"],
    mutationFn: axiosRequest<UpdateItemsMutation, UpdateItemsMutationVariables>(
      UpdateItemsDocument,
    ),
    ...options,
  });
};

useUpdateItemsMutation.getKey = () => ["updateItems"];
