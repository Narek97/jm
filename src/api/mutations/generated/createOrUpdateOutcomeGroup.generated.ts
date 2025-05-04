import * as Types from "../../types";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { axiosRequest } from "../../axios";
export type CreateOrUpdateOutcomeGroupMutationVariables = Types.Exact<{
  createOrUpdateOutcomeGroupInput: Types.CreateOrUpdateOutcomeGroupInput;
}>;

export type CreateOrUpdateOutcomeGroupMutation = {
  __typename?: "Mutation";
  createOrUpdateOutcomeGroup: {
    __typename?: "OutcomeGroup";
    id: number;
    name: string;
    pluralName: string;
    createdAt: any;
    icon: string;
    user?: {
      __typename?: "Member";
      firstName: string;
      lastName: string;
    } | null;
  };
};

export const CreateOrUpdateOutcomeGroupDocument = `
    mutation CreateOrUpdateOutcomeGroup($createOrUpdateOutcomeGroupInput: CreateOrUpdateOutcomeGroupInput!) {
  createOrUpdateOutcomeGroup(
    createOrUpdateOutcomeGroupInput: $createOrUpdateOutcomeGroupInput
  ) {
    id
    name
    pluralName
    createdAt
    icon
    user {
      firstName
      lastName
    }
  }
}
    `;

export const useCreateOrUpdateOutcomeGroupMutation = <
  TError = unknown,
  TContext = unknown,
>(
  options?: UseMutationOptions<
    CreateOrUpdateOutcomeGroupMutation,
    TError,
    CreateOrUpdateOutcomeGroupMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    CreateOrUpdateOutcomeGroupMutation,
    TError,
    CreateOrUpdateOutcomeGroupMutationVariables,
    TContext
  >({
    mutationKey: ["CreateOrUpdateOutcomeGroup"],
    mutationFn: axiosRequest<
      CreateOrUpdateOutcomeGroupMutation,
      CreateOrUpdateOutcomeGroupMutationVariables
    >(CreateOrUpdateOutcomeGroupDocument),
    ...options,
  });
};

useCreateOrUpdateOutcomeGroupMutation.getKey = () => [
  "CreateOrUpdateOutcomeGroup",
];
