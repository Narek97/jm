import * as Types from "../../types";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { axiosRequest } from "../../axios";
export type UpdateJourneyMapColumnMutationVariables = Types.Exact<{
  updateColumnInput: Types.UpdateColumnInput;
}>;

export type UpdateJourneyMapColumnMutation = {
  __typename?: "Mutation";
  updateJourneyMapColumn: number;
};

export const UpdateJourneyMapColumnDocument = `
    mutation UpdateJourneyMapColumn($updateColumnInput: UpdateColumnInput!) {
  updateJourneyMapColumn(updateColumnInput: $updateColumnInput)
}
    `;

export const useUpdateJourneyMapColumnMutation = <
  TError = unknown,
  TContext = unknown,
>(
  options?: UseMutationOptions<
    UpdateJourneyMapColumnMutation,
    TError,
    UpdateJourneyMapColumnMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    UpdateJourneyMapColumnMutation,
    TError,
    UpdateJourneyMapColumnMutationVariables,
    TContext
  >({
    mutationKey: ["UpdateJourneyMapColumn"],
    mutationFn: axiosRequest<
      UpdateJourneyMapColumnMutation,
      UpdateJourneyMapColumnMutationVariables
    >(UpdateJourneyMapColumnDocument),
    ...options,
  });
};

useUpdateJourneyMapColumnMutation.getKey = () => ["UpdateJourneyMapColumn"];
