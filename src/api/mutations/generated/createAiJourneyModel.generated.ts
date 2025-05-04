import * as Types from "../../types";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { axiosRequest } from "../../axios";
export type CreateAiJourneyModelMutationVariables = Types.Exact<{
  createAiJourneyInput: Types.CreateAiJourneyInput;
}>;

export type CreateAiJourneyModelMutation = {
  __typename?: "Mutation";
  createAiJourneyModel: {
    __typename?: "AiJourneyModelResponse";
    id: number;
    attachmentUrl?: string | null;
    name?: string | null;
    prompt: string;
    universal: boolean;
    selectedOrgIds: Array<number>;
    transcriptPlace: number;
  };
};

export const CreateAiJourneyModelDocument = `
    mutation CreateAiJourneyModel($createAiJourneyInput: CreateAiJourneyInput!) {
  createAiJourneyModel(createAiJourneyInput: $createAiJourneyInput) {
    id
    attachmentUrl
    name
    prompt
    universal
    selectedOrgIds
    transcriptPlace
  }
}
    `;

export const useCreateAiJourneyModelMutation = <
  TError = unknown,
  TContext = unknown,
>(
  options?: UseMutationOptions<
    CreateAiJourneyModelMutation,
    TError,
    CreateAiJourneyModelMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    CreateAiJourneyModelMutation,
    TError,
    CreateAiJourneyModelMutationVariables,
    TContext
  >({
    mutationKey: ["CreateAiJourneyModel"],
    mutationFn: axiosRequest<
      CreateAiJourneyModelMutation,
      CreateAiJourneyModelMutationVariables
    >(CreateAiJourneyModelDocument),
    ...options,
  });
};

useCreateAiJourneyModelMutation.getKey = () => ["CreateAiJourneyModel"];
