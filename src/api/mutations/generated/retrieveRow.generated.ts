import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type RetrieveRowMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;


export type RetrieveRowMutation = { __typename?: 'Mutation', retrieveRow: { __typename?: 'MapRow', id: number } };



export const RetrieveRowDocument = `
    mutation RetrieveRow($id: Int!) {
  retrieveRow(id: $id) {
    id
  }
}
    `;

export const useRetrieveRowMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<RetrieveRowMutation, TError, RetrieveRowMutationVariables, TContext>) => {
    
    return useMutation<RetrieveRowMutation, TError, RetrieveRowMutationVariables, TContext>(
      {
    mutationKey: ['RetrieveRow'],
    mutationFn: axiosRequest<RetrieveRowMutation, RetrieveRowMutationVariables>(RetrieveRowDocument),
    ...options
  }
    )};

useRetrieveRowMutation.getKey = () => ['RetrieveRow'];
