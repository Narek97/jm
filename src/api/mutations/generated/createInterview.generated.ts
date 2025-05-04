import * as Types from "../../types";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { axiosRequest } from "../../axios";
export type CreateInterviewMutationVariables = Types.Exact<{
  createInterviewInput: Types.CreateInterviewInput;
}>;

export type CreateInterviewMutation = {
  __typename?: "Mutation";
  createInterview: {
    __typename?: "Interview";
    id: number;
    boardId: number;
    name: string;
    journeyType: string;
    text: string;
    mapId: number;
    createdAt: any;
    updatedAt: any;
    aiJourneyModelId?: number | null;
  };
};

export const CreateInterviewDocument = `
    mutation CreateInterview($createInterviewInput: CreateInterviewInput!) {
  createInterview(createInterviewInput: $createInterviewInput) {
    id
    boardId
    name
    journeyType
    text
    mapId
    createdAt
    updatedAt
    aiJourneyModelId
  }
}
    `;

export const useCreateInterviewMutation = <
  TError = unknown,
  TContext = unknown,
>(
  options?: UseMutationOptions<
    CreateInterviewMutation,
    TError,
    CreateInterviewMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    CreateInterviewMutation,
    TError,
    CreateInterviewMutationVariables,
    TContext
  >({
    mutationKey: ["CreateInterview"],
    mutationFn: axiosRequest<
      CreateInterviewMutation,
      CreateInterviewMutationVariables
    >(CreateInterviewDocument),
    ...options,
  });
};

useCreateInterviewMutation.getKey = () => ["CreateInterview"];
