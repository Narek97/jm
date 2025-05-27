import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type DeleteMapRowMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;

export type DeleteMapRowMutation = {
  __typename?: 'Mutation';
  deleteMapRow: boolean;
};

export const DeleteMapRowDocument = `
    mutation DeleteMapRow($id: Int!) {
  deleteMapRow(id: $id)
}
    `;

export const useDeleteMapRowMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    DeleteMapRowMutation,
    TError,
    DeleteMapRowMutationVariables,
    TContext
  >,
) => {
  return useMutation<DeleteMapRowMutation, TError, DeleteMapRowMutationVariables, TContext>({
    mutationKey: ['DeleteMapRow'],
    mutationFn: axiosRequest<DeleteMapRowMutation, DeleteMapRowMutationVariables>(
      DeleteMapRowDocument,
    ),
    ...options,
  });
};

useDeleteMapRowMutation.getKey = () => ['DeleteMapRow'];
