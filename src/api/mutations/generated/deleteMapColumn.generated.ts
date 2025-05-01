import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type DeleteMapColumnMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;


export type DeleteMapColumnMutation = { __typename?: 'Mutation', deleteMapColumn: boolean };



export const DeleteMapColumnDocument = `
    mutation DeleteMapColumn($id: Int!) {
  deleteMapColumn(id: $id)
}
    `;

export const useDeleteMapColumnMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeleteMapColumnMutation, TError, DeleteMapColumnMutationVariables, TContext>) => {
    
    return useMutation<DeleteMapColumnMutation, TError, DeleteMapColumnMutationVariables, TContext>(
      {
    mutationKey: ['DeleteMapColumn'],
    mutationFn: axiosRequest<DeleteMapColumnMutation, DeleteMapColumnMutationVariables>(DeleteMapColumnDocument),
    ...options
  }
    )};

useDeleteMapColumnMutation.getKey = () => ['DeleteMapColumn'];
