import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type CreatePersonaGroupMutationVariables = Types.Exact<{
  createPersonaGroupInput: Types.CreatePersonaGroupInput;
}>;

export type CreatePersonaGroupMutation = {
  __typename?: 'Mutation';
  createPersonaGroup: { __typename?: 'PersonaGroup'; id: number; name: string };
};

export const CreatePersonaGroupDocument = `
    mutation CreatePersonaGroup($createPersonaGroupInput: CreatePersonaGroupInput!) {
  createPersonaGroup(createPersonaGroupInput: $createPersonaGroupInput) {
    id
    name
  }
}
    `;

export const useCreatePersonaGroupMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    CreatePersonaGroupMutation,
    TError,
    CreatePersonaGroupMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    CreatePersonaGroupMutation,
    TError,
    CreatePersonaGroupMutationVariables,
    TContext
  >({
    mutationKey: ['CreatePersonaGroup'],
    mutationFn: axiosRequest<CreatePersonaGroupMutation, CreatePersonaGroupMutationVariables>(
      CreatePersonaGroupDocument,
    ),
    ...options,
  });
};

useCreatePersonaGroupMutation.getKey = () => ['CreatePersonaGroup'];
