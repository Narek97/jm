import * as Types from "../../types";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { axiosRequest } from "../../axios";
export type CreateJourneyMapMutationVariables = Types.Exact<{
  createJourneyMapInput: Types.CreateJourneyMapInput;
}>;

export type CreateJourneyMapMutation = {
  __typename?: "Mutation";
  createJourneyMap: { __typename?: "JourneyMap"; mapId: number };
};

export const CreateJourneyMapDocument = `
    mutation CreateJourneyMap($createJourneyMapInput: CreateJourneyMapInput!) {
  createJourneyMap(createJourneyMapInput: $createJourneyMapInput) {
    mapId
  }
}
    `;

export const useCreateJourneyMapMutation = <
  TError = unknown,
  TContext = unknown,
>(
  options?: UseMutationOptions<
    CreateJourneyMapMutation,
    TError,
    CreateJourneyMapMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    CreateJourneyMapMutation,
    TError,
    CreateJourneyMapMutationVariables,
    TContext
  >({
    mutationKey: ["CreateJourneyMap"],
    mutationFn: axiosRequest<
      CreateJourneyMapMutation,
      CreateJourneyMapMutationVariables
    >(CreateJourneyMapDocument),
    ...options,
  });
};

useCreateJourneyMapMutation.getKey = () => ["CreateJourneyMap"];
