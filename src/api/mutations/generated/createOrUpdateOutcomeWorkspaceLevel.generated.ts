import * as Types from "../../types";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { axiosRequest } from "../../axios";
export type CreateUpdateOutcomeWorkspaceLevelMutationVariables = Types.Exact<{
  createOrUpdateWorkspaceOutcomeInput: Types.CreateOrUpdateWorkspaceOutcomeInput;
}>;

export type CreateUpdateOutcomeWorkspaceLevelMutation = {
  __typename?: "Mutation";
  createUpdateOutcomeWorkspaceLevel: {
    __typename?: "Outcome";
    id: number;
    title: string;
  };
};

export const CreateUpdateOutcomeWorkspaceLevelDocument = `
    mutation CreateUpdateOutcomeWorkspaceLevel($createOrUpdateWorkspaceOutcomeInput: CreateOrUpdateWorkspaceOutcomeInput!) {
  createUpdateOutcomeWorkspaceLevel(
    createOrUpdateWorkspaceOutcomeInput: $createOrUpdateWorkspaceOutcomeInput
  ) {
    id
    title
  }
}
    `;

export const useCreateUpdateOutcomeWorkspaceLevelMutation = <
  TError = unknown,
  TContext = unknown,
>(
  options?: UseMutationOptions<
    CreateUpdateOutcomeWorkspaceLevelMutation,
    TError,
    CreateUpdateOutcomeWorkspaceLevelMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    CreateUpdateOutcomeWorkspaceLevelMutation,
    TError,
    CreateUpdateOutcomeWorkspaceLevelMutationVariables,
    TContext
  >({
    mutationKey: ["CreateUpdateOutcomeWorkspaceLevel"],
    mutationFn: axiosRequest<
      CreateUpdateOutcomeWorkspaceLevelMutation,
      CreateUpdateOutcomeWorkspaceLevelMutationVariables
    >(CreateUpdateOutcomeWorkspaceLevelDocument),
    ...options,
  });
};

useCreateUpdateOutcomeWorkspaceLevelMutation.getKey = () => [
  "CreateUpdateOutcomeWorkspaceLevel",
];
