import * as Types from "../../types";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { axiosRequest } from "../../axios";
export type DeletePersonaSectionMutationVariables = Types.Exact<{
  id: Types.Scalars["Int"]["input"];
}>;

export type DeletePersonaSectionMutation = {
  __typename?: "Mutation";
  deletePersonaSection: number;
};

export const DeletePersonaSectionDocument = `
    mutation DeletePersonaSection($id: Int!) {
  deletePersonaSection(id: $id)
}
    `;

export const useDeletePersonaSectionMutation = <
  TError = unknown,
  TContext = unknown,
>(
  options?: UseMutationOptions<
    DeletePersonaSectionMutation,
    TError,
    DeletePersonaSectionMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    DeletePersonaSectionMutation,
    TError,
    DeletePersonaSectionMutationVariables,
    TContext
  >({
    mutationKey: ["DeletePersonaSection"],
    mutationFn: axiosRequest<
      DeletePersonaSectionMutation,
      DeletePersonaSectionMutationVariables
    >(DeletePersonaSectionDocument),
    ...options,
  });
};

useDeletePersonaSectionMutation.getKey = () => ["DeletePersonaSection"];
