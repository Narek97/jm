import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type UpdatePersonaMutationVariables = Types.Exact<{
  updatePersonaInput: Types.UpdatePersonaInput;
}>;

export type UpdatePersonaMutation = { __typename?: 'Mutation'; updatePersona: number };

export const UpdatePersonaDocument = `
    mutation UpdatePersona($updatePersonaInput: UpdatePersonaInput!) {
  updatePersona(updatePersonaInput: $updatePersonaInput)
}
    `;

export const useUpdatePersonaMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    UpdatePersonaMutation,
    TError,
    UpdatePersonaMutationVariables,
    TContext
  >,
) => {
  return useMutation<UpdatePersonaMutation, TError, UpdatePersonaMutationVariables, TContext>({
    mutationKey: ['UpdatePersona'],
    mutationFn: axiosRequest<UpdatePersonaMutation, UpdatePersonaMutationVariables>(
      UpdatePersonaDocument,
    ),
    ...options,
  });
};

useUpdatePersonaMutation.getKey = () => ['UpdatePersona'];
