import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type UpdatePersonaStateMutationVariables = Types.Exact<{
  updatePersonaStateInput: Types.UpdatePersonaStateInput;
}>;

export type UpdatePersonaStateMutation = {
  __typename?: 'Mutation';
  updatePersonaState: Types.PersonaStateEnum;
};

export const UpdatePersonaStateDocument = `
    mutation UpdatePersonaState($updatePersonaStateInput: UpdatePersonaStateInput!) {
  updatePersonaState(updatePersonaStateInput: $updatePersonaStateInput)
}
    `;

export const useUpdatePersonaStateMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    UpdatePersonaStateMutation,
    TError,
    UpdatePersonaStateMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    UpdatePersonaStateMutation,
    TError,
    UpdatePersonaStateMutationVariables,
    TContext
  >({
    mutationKey: ['UpdatePersonaState'],
    mutationFn: axiosRequest<UpdatePersonaStateMutation, UpdatePersonaStateMutationVariables>(
      UpdatePersonaStateDocument,
    ),
    ...options,
  });
};

useUpdatePersonaStateMutation.getKey = () => ['UpdatePersonaState'];
