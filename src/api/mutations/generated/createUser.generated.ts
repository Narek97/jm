import * as Types from "../../types";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { axiosRequest } from "../../axios";
export type CreateUserMutationVariables = Types.Exact<{
  createUserInput: Types.CreateUserInput;
}>;

export type CreateUserMutation = {
  __typename?: "Mutation";
  createUser: {
    __typename?: "Member";
    id: number;
    userId: number;
    createdAt: any;
    updatedAt: any;
  };
};

export const CreateUserDocument = `
    mutation createUser($createUserInput: CreateUserInput!) {
  createUser(createUserInput: $createUserInput) {
    id
    userId
    createdAt
    updatedAt
  }
}
    `;

export const useCreateUserMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    CreateUserMutation,
    TError,
    CreateUserMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    CreateUserMutation,
    TError,
    CreateUserMutationVariables,
    TContext
  >({
    mutationKey: ["createUser"],
    mutationFn: axiosRequest<CreateUserMutation, CreateUserMutationVariables>(
      CreateUserDocument,
    ),
    ...options,
  });
};

useCreateUserMutation.getKey = () => ["createUser"];
