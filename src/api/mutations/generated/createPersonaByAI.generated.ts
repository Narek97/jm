import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type CreatePersonaByAiMutationVariables = Types.Exact<{
  createPersonaByAiInput: Types.CreatePersonaByAiInput;
}>;


export type CreatePersonaByAiMutation = { __typename?: 'Mutation', createPersonaByAi: number };



export const CreatePersonaByAiDocument = `
    mutation CreatePersonaByAi($createPersonaByAiInput: CreatePersonaByAiInput!) {
  createPersonaByAi(createPersonaByAiInput: $createPersonaByAiInput)
}
    `;

export const useCreatePersonaByAiMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreatePersonaByAiMutation, TError, CreatePersonaByAiMutationVariables, TContext>) => {
    
    return useMutation<CreatePersonaByAiMutation, TError, CreatePersonaByAiMutationVariables, TContext>(
      {
    mutationKey: ['CreatePersonaByAi'],
    mutationFn: axiosRequest<CreatePersonaByAiMutation, CreatePersonaByAiMutationVariables>(CreatePersonaByAiDocument),
    ...options
  }
    )};

useCreatePersonaByAiMutation.getKey = () => ['CreatePersonaByAi'];
