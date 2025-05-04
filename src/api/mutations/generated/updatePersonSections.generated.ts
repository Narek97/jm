import * as Types from "../../types";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { axiosRequest } from "../../axios";
export type UpdatePersonaSectionMutationVariables = Types.Exact<{
  updatePersonaSectionInput: Types.UpdatePersonaSectionInput;
}>;

export type UpdatePersonaSectionMutation = {
  __typename?: "Mutation";
  updatePersonaSection?: number | null;
};

export const UpdatePersonaSectionDocument = `
    mutation UpdatePersonaSection($updatePersonaSectionInput: UpdatePersonaSectionInput!) {
  updatePersonaSection(updatePersonaSectionInput: $updatePersonaSectionInput)
}
    `;

export const useUpdatePersonaSectionMutation = <
  TError = unknown,
  TContext = unknown,
>(
  options?: UseMutationOptions<
    UpdatePersonaSectionMutation,
    TError,
    UpdatePersonaSectionMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    UpdatePersonaSectionMutation,
    TError,
    UpdatePersonaSectionMutationVariables,
    TContext
  >({
    mutationKey: ["UpdatePersonaSection"],
    mutationFn: axiosRequest<
      UpdatePersonaSectionMutation,
      UpdatePersonaSectionMutationVariables
    >(UpdatePersonaSectionDocument),
    ...options,
  });
};

useUpdatePersonaSectionMutation.getKey = () => ["UpdatePersonaSection"];
