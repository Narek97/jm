import * as Types from "../../types";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { axiosRequest } from "../../axios";
export type CreateJourneyMapColumnMutationVariables = Types.Exact<{
  createColumnInput: Types.CreateColumnInput;
}>;

export type CreateJourneyMapColumnMutation = {
  __typename?: "Mutation";
  createJourneyMapColumn: {
    __typename?: "CreateColumnResponse";
    id: number;
    index: number;
    label?: string | null;
    stepId?: number | null;
  };
};

export const CreateJourneyMapColumnDocument = `
    mutation CreateJourneyMapColumn($createColumnInput: CreateColumnInput!) {
  createJourneyMapColumn(createColumnInput: $createColumnInput) {
    id
    index
    label
    stepId
  }
}
    `;

export const useCreateJourneyMapColumnMutation = <
  TError = unknown,
  TContext = unknown,
>(
  options?: UseMutationOptions<
    CreateJourneyMapColumnMutation,
    TError,
    CreateJourneyMapColumnMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    CreateJourneyMapColumnMutation,
    TError,
    CreateJourneyMapColumnMutationVariables,
    TContext
  >({
    mutationKey: ["CreateJourneyMapColumn"],
    mutationFn: axiosRequest<
      CreateJourneyMapColumnMutation,
      CreateJourneyMapColumnMutationVariables
    >(CreateJourneyMapColumnDocument),
    ...options,
  });
};

useCreateJourneyMapColumnMutation.getKey = () => ["CreateJourneyMapColumn"];
