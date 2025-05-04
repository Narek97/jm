import * as Types from "../../types";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { axiosRequest } from "../../axios";
export type UpdateDemographicInfoPositionMutationVariables = Types.Exact<{
  updateDemographicInfoPositionInput: Types.UpdateDemographicInfoPositionInput;
}>;

export type UpdateDemographicInfoPositionMutation = {
  __typename?: "Mutation";
  updateDemographicInfoPosition: {
    __typename?: "UpdateDemographicInfoPositionModel";
    success: boolean;
  };
};

export const UpdateDemographicInfoPositionDocument = `
    mutation UpdateDemographicInfoPosition($updateDemographicInfoPositionInput: UpdateDemographicInfoPositionInput!) {
  updateDemographicInfoPosition(
    updateDemographicInfoPositionInput: $updateDemographicInfoPositionInput
  ) {
    success
  }
}
    `;

export const useUpdateDemographicInfoPositionMutation = <
  TError = unknown,
  TContext = unknown,
>(
  options?: UseMutationOptions<
    UpdateDemographicInfoPositionMutation,
    TError,
    UpdateDemographicInfoPositionMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    UpdateDemographicInfoPositionMutation,
    TError,
    UpdateDemographicInfoPositionMutationVariables,
    TContext
  >({
    mutationKey: ["UpdateDemographicInfoPosition"],
    mutationFn: axiosRequest<
      UpdateDemographicInfoPositionMutation,
      UpdateDemographicInfoPositionMutationVariables
    >(UpdateDemographicInfoPositionDocument),
    ...options,
  });
};

useUpdateDemographicInfoPositionMutation.getKey = () => [
  "UpdateDemographicInfoPosition",
];
