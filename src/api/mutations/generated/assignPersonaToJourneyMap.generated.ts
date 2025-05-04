import * as Types from "../../types";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { axiosRequest } from "../../axios";
export type ConnectPersonasToMapMutationVariables = Types.Exact<{
  connectPersonasToMapInput: Types.ConnectPersonasToMapInput;
}>;

export type ConnectPersonasToMapMutation = {
  __typename?: "Mutation";
  connectPersonasToMap: number;
};

export const ConnectPersonasToMapDocument = `
    mutation ConnectPersonasToMap($connectPersonasToMapInput: ConnectPersonasToMapInput!) {
  connectPersonasToMap(connectPersonasToMapInput: $connectPersonasToMapInput)
}
    `;

export const useConnectPersonasToMapMutation = <
  TError = unknown,
  TContext = unknown,
>(
  options?: UseMutationOptions<
    ConnectPersonasToMapMutation,
    TError,
    ConnectPersonasToMapMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    ConnectPersonasToMapMutation,
    TError,
    ConnectPersonasToMapMutationVariables,
    TContext
  >({
    mutationKey: ["ConnectPersonasToMap"],
    mutationFn: axiosRequest<
      ConnectPersonasToMapMutation,
      ConnectPersonasToMapMutationVariables
    >(ConnectPersonasToMapDocument),
    ...options,
  });
};

useConnectPersonasToMapMutation.getKey = () => ["ConnectPersonasToMap"];
