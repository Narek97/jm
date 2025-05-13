import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type DeleteLayerMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;


export type DeleteLayerMutation = { __typename?: 'Mutation', deleteLayer: number };



export const DeleteLayerDocument = `
    mutation DeleteLayer($id: Int!) {
  deleteLayer(id: $id)
}
    `;

export const useDeleteLayerMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeleteLayerMutation, TError, DeleteLayerMutationVariables, TContext>) => {
    
    return useMutation<DeleteLayerMutation, TError, DeleteLayerMutationVariables, TContext>(
      {
    mutationKey: ['DeleteLayer'],
    mutationFn: axiosRequest<DeleteLayerMutation, DeleteLayerMutationVariables>(DeleteLayerDocument),
    ...options
  }
    )};

useDeleteLayerMutation.getKey = () => ['DeleteLayer'];
