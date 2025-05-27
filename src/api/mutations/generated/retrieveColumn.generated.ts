import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type RetrieveColumnMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;

export type RetrieveColumnMutation = {
  __typename?: 'Mutation';
  retrieveColumn: { __typename?: 'MapColumn'; id: number };
};

export const RetrieveColumnDocument = `
    mutation RetrieveColumn($id: Int!) {
  retrieveColumn(id: $id) {
    id
  }
}
    `;

export const useRetrieveColumnMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    RetrieveColumnMutation,
    TError,
    RetrieveColumnMutationVariables,
    TContext
  >,
) => {
  return useMutation<RetrieveColumnMutation, TError, RetrieveColumnMutationVariables, TContext>({
    mutationKey: ['RetrieveColumn'],
    mutationFn: axiosRequest<RetrieveColumnMutation, RetrieveColumnMutationVariables>(
      RetrieveColumnDocument,
    ),
    ...options,
  });
};

useRetrieveColumnMutation.getKey = () => ['RetrieveColumn'];
