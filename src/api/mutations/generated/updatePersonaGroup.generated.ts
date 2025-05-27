import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type UpdatePersonaGroupMutationVariables = Types.Exact<{
  updatePersonaGroupInput: Types.UpdatePersonaGroupInput;
}>;

export type UpdatePersonaGroupMutation = {
  __typename?: 'Mutation';
  updatePersonaGroup: { __typename?: 'PersonaGroup'; id: number; name: string };
};

export const UpdatePersonaGroupDocument = `
    mutation UpdatePersonaGroup($updatePersonaGroupInput: UpdatePersonaGroupInput!) {
  updatePersonaGroup(updatePersonaGroupInput: $updatePersonaGroupInput) {
    id
    name
  }
}
    `;

export const useUpdatePersonaGroupMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    UpdatePersonaGroupMutation,
    TError,
    UpdatePersonaGroupMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    UpdatePersonaGroupMutation,
    TError,
    UpdatePersonaGroupMutationVariables,
    TContext
  >({
    mutationKey: ['UpdatePersonaGroup'],
    mutationFn: axiosRequest<UpdatePersonaGroupMutation, UpdatePersonaGroupMutationVariables>(
      UpdatePersonaGroupDocument,
    ),
    ...options,
  });
};

useUpdatePersonaGroupMutation.getKey = () => ['UpdatePersonaGroup'];
