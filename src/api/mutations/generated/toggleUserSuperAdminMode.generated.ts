import * as Types from "../../types";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { axiosRequest } from "../../axios";
export type ToggleUserSuperAdminModeMutationVariables = Types.Exact<{
  superAdminInput: Types.SuperAdminInput;
}>;

export type ToggleUserSuperAdminModeMutation = {
  __typename?: "Mutation";
  toggleUserSuperAdminMode: { __typename?: "Member"; id: number };
};

export const ToggleUserSuperAdminModeDocument = `
    mutation ToggleUserSuperAdminMode($superAdminInput: SuperAdminInput!) {
  toggleUserSuperAdminMode(superAdminInput: $superAdminInput) {
    id
  }
}
    `;

export const useToggleUserSuperAdminModeMutation = <
  TError = unknown,
  TContext = unknown,
>(
  options?: UseMutationOptions<
    ToggleUserSuperAdminModeMutation,
    TError,
    ToggleUserSuperAdminModeMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    ToggleUserSuperAdminModeMutation,
    TError,
    ToggleUserSuperAdminModeMutationVariables,
    TContext
  >({
    mutationKey: ["ToggleUserSuperAdminMode"],
    mutationFn: axiosRequest<
      ToggleUserSuperAdminModeMutation,
      ToggleUserSuperAdminModeMutationVariables
    >(ToggleUserSuperAdminModeDocument),
    ...options,
  });
};

useToggleUserSuperAdminModeMutation.getKey = () => ["ToggleUserSuperAdminMode"];
