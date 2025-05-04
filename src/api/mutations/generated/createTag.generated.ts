import * as Types from "../../types";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { axiosRequest } from "../../axios";
export type CreateTagMutationVariables = Types.Exact<{
  createTagInput: Types.CreateTagInput;
}>;

export type CreateTagMutation = {
  __typename?: "Mutation";
  createTag: { __typename?: "Tags"; id: number; name: string; color: string };
};

export const CreateTagDocument = `
    mutation createTag($createTagInput: CreateTagInput!) {
  createTag(createTagInput: $createTagInput) {
    id
    name
    color
  }
}
    `;

export const useCreateTagMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    CreateTagMutation,
    TError,
    CreateTagMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    CreateTagMutation,
    TError,
    CreateTagMutationVariables,
    TContext
  >({
    mutationKey: ["createTag"],
    mutationFn: axiosRequest<CreateTagMutation, CreateTagMutationVariables>(
      CreateTagDocument,
    ),
    ...options,
  });
};

useCreateTagMutation.getKey = () => ["createTag"];
