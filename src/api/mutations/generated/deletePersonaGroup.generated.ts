import * as Types from "../../types";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { axiosRequest } from "../../axios";
export type DeletePersonaGroupMutationVariables = Types.Exact<{
  id: Types.Scalars["Int"]["input"];
}>;

export type DeletePersonaGroupMutation = {
  __typename?: "Mutation";
  deletePersonaGroup: number;
};

export const DeletePersonaGroupDocument = `
    mutation DeletePersonaGroup($id: Int!) {
  deletePersonaGroup(id: $id)
}
    `;

export const useDeletePersonaGroupMutation = <
  TError = unknown,
  TContext = unknown,
>(
  options?: UseMutationOptions<
    DeletePersonaGroupMutation,
    TError,
    DeletePersonaGroupMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    DeletePersonaGroupMutation,
    TError,
    DeletePersonaGroupMutationVariables,
    TContext
  >({
    mutationKey: ["DeletePersonaGroup"],
    mutationFn: axiosRequest<
      DeletePersonaGroupMutation,
      DeletePersonaGroupMutationVariables
    >(DeletePersonaGroupDocument),
    ...options,
  });
};

useDeletePersonaGroupMutation.getKey = () => ["DeletePersonaGroup"];
