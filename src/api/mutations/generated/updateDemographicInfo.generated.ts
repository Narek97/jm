import * as Types from "../../types";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { axiosRequest } from "../../axios";
export type UpdateDemographicInfoMutationVariables = Types.Exact<{
  updateDemographicInfoInput: Types.UpdateDemographicInfoInput;
}>;

export type UpdateDemographicInfoMutation = {
  __typename?: "Mutation";
  updateDemographicInfo: { __typename?: "DemographicInfo"; id: number };
};

export const UpdateDemographicInfoDocument = `
    mutation UpdateDemographicInfo($updateDemographicInfoInput: UpdateDemographicInfoInput!) {
  updateDemographicInfo(updateDemographicInfoInput: $updateDemographicInfoInput) {
    id
  }
}
    `;

export const useUpdateDemographicInfoMutation = <
  TError = unknown,
  TContext = unknown,
>(
  options?: UseMutationOptions<
    UpdateDemographicInfoMutation,
    TError,
    UpdateDemographicInfoMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    UpdateDemographicInfoMutation,
    TError,
    UpdateDemographicInfoMutationVariables,
    TContext
  >({
    mutationKey: ["UpdateDemographicInfo"],
    mutationFn: axiosRequest<
      UpdateDemographicInfoMutation,
      UpdateDemographicInfoMutationVariables
    >(UpdateDemographicInfoDocument),
    ...options,
  });
};

useUpdateDemographicInfoMutation.getKey = () => ["UpdateDemographicInfo"];
