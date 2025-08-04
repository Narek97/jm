import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type CreateLayerMutationVariables = Types.Exact<{
  createLayerInput: Types.CreateLayerInput;
}>;


export type CreateLayerMutation = { __typename?: 'Mutation', createLayer: { __typename?: 'Layer', id: number } };



export const CreateLayerDocument = `
    mutation CreateLayer($createLayerInput: CreateLayerInput!) {
  createLayer(createLayerInput: $createLayerInput) {
    id
  }
}
    `;

export const useCreateLayerMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateLayerMutation, TError, CreateLayerMutationVariables, TContext>) => {
    
    return useMutation<CreateLayerMutation, TError, CreateLayerMutationVariables, TContext>(
      {
    mutationKey: ['CreateLayer'],
    mutationFn: axiosRequest<CreateLayerMutation, CreateLayerMutationVariables>(CreateLayerDocument),
    ...options
  }
    )};

useCreateLayerMutation.getKey = () => ['CreateLayer'];
