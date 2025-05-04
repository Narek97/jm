import * as Types from "../../types";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { axiosRequest } from "../../axios";
export type MergeJourneyMapColumnMutationVariables = Types.Exact<{
  mergeColumnInput: Types.MergeColumnInput;
}>;

export type MergeJourneyMapColumnMutation = {
  __typename?: "Mutation";
  mergeJourneyMapColumn: {
    __typename?: "MergeColumnModel";
    endBoxId: number;
    startBoxId: number;
  };
};

export const MergeJourneyMapColumnDocument = `
    mutation MergeJourneyMapColumn($mergeColumnInput: MergeColumnInput!) {
  mergeJourneyMapColumn(mergeColumnInput: $mergeColumnInput) {
    endBoxId
    startBoxId
  }
}
    `;

export const useMergeJourneyMapColumnMutation = <
  TError = unknown,
  TContext = unknown,
>(
  options?: UseMutationOptions<
    MergeJourneyMapColumnMutation,
    TError,
    MergeJourneyMapColumnMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    MergeJourneyMapColumnMutation,
    TError,
    MergeJourneyMapColumnMutationVariables,
    TContext
  >({
    mutationKey: ["MergeJourneyMapColumn"],
    mutationFn: axiosRequest<
      MergeJourneyMapColumnMutation,
      MergeJourneyMapColumnMutationVariables
    >(MergeJourneyMapColumnDocument),
    ...options,
  });
};

useMergeJourneyMapColumnMutation.getKey = () => ["MergeJourneyMapColumn"];
