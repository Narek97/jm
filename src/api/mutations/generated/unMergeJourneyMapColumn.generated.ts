import * as Types from "../../types";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { axiosRequest } from "../../axios";
export type UnMergeJourneyMapColumnMutationVariables = Types.Exact<{
  unmergeColumnInput: Types.UnmergeColumnInput;
}>;

export type UnMergeJourneyMapColumnMutation = {
  __typename?: "Mutation";
  unMergeJourneyMapColumn: {
    __typename?: "UnmergeColumnModel";
    endColumnIsMerged: boolean;
    endStepIsMerged: boolean;
    nextColumnMergedCandidateIds: Array<number>;
    nextColumnUnMergedCandidateIds: Array<number>;
    startColumnIsMerged: boolean;
    startStepIsMerged: boolean;
  };
};

export const UnMergeJourneyMapColumnDocument = `
    mutation UnMergeJourneyMapColumn($unmergeColumnInput: UnmergeColumnInput!) {
  unMergeJourneyMapColumn(unmergeColumnInput: $unmergeColumnInput) {
    endColumnIsMerged
    endStepIsMerged
    nextColumnMergedCandidateIds
    nextColumnUnMergedCandidateIds
    startColumnIsMerged
    startStepIsMerged
  }
}
    `;

export const useUnMergeJourneyMapColumnMutation = <
  TError = unknown,
  TContext = unknown,
>(
  options?: UseMutationOptions<
    UnMergeJourneyMapColumnMutation,
    TError,
    UnMergeJourneyMapColumnMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    UnMergeJourneyMapColumnMutation,
    TError,
    UnMergeJourneyMapColumnMutationVariables,
    TContext
  >({
    mutationKey: ["UnMergeJourneyMapColumn"],
    mutationFn: axiosRequest<
      UnMergeJourneyMapColumnMutation,
      UnMergeJourneyMapColumnMutationVariables
    >(UnMergeJourneyMapColumnDocument),
    ...options,
  });
};

useUnMergeJourneyMapColumnMutation.getKey = () => ["UnMergeJourneyMapColumn"];
