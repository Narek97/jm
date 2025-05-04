import * as Types from "../../types";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { axiosRequest } from "../../axios";
export type CreateParentMapMutationVariables = Types.Exact<{
  createParentMapInput: Types.CreateParentMapInput;
}>;

export type CreateParentMapMutation = {
  __typename?: "Mutation";
  createParentMap: { __typename?: "ParentMap"; id: number };
};

export const CreateParentMapDocument = `
    mutation CreateParentMap($createParentMapInput: CreateParentMapInput!) {
  createParentMap(createParentMapInput: $createParentMapInput) {
    id
  }
}
    `;

export const useCreateParentMapMutation = <
  TError = unknown,
  TContext = unknown,
>(
  options?: UseMutationOptions<
    CreateParentMapMutation,
    TError,
    CreateParentMapMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    CreateParentMapMutation,
    TError,
    CreateParentMapMutationVariables,
    TContext
  >({
    mutationKey: ["CreateParentMap"],
    mutationFn: axiosRequest<
      CreateParentMapMutation,
      CreateParentMapMutationVariables
    >(CreateParentMapDocument),
    ...options,
  });
};

useCreateParentMapMutation.getKey = () => ["CreateParentMap"];
