import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type CreatePersonaSectionMutationVariables = Types.Exact<{
  createPersonaSectionInput: Types.CreatePersonaSectionInput;
}>;


export type CreatePersonaSectionMutation = { __typename?: 'Mutation', createPersonaSection: { __typename?: 'PersonaSection', id: number } };



export const CreatePersonaSectionDocument = `
    mutation CreatePersonaSection($createPersonaSectionInput: CreatePersonaSectionInput!) {
  createPersonaSection(createPersonaSectionInput: $createPersonaSectionInput) {
    id
  }
}
    `;

export const useCreatePersonaSectionMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreatePersonaSectionMutation, TError, CreatePersonaSectionMutationVariables, TContext>) => {
    
    return useMutation<CreatePersonaSectionMutation, TError, CreatePersonaSectionMutationVariables, TContext>(
      {
    mutationKey: ['CreatePersonaSection'],
    mutationFn: axiosRequest<CreatePersonaSectionMutation, CreatePersonaSectionMutationVariables>(CreatePersonaSectionDocument),
    ...options
  }
    )};

useCreatePersonaSectionMutation.getKey = () => ['CreatePersonaSection'];
