import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type DeleteMapVersionMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;

export type DeleteMapVersionMutation = {
  __typename?: 'Mutation';
  deleteMapVersion: boolean;
};

export const DeleteMapVersionDocument = `
    mutation DeleteMapVersion($id: Int!) {
  deleteMapVersion(id: $id)
}
    `;

export const useDeleteMapVersionMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    DeleteMapVersionMutation,
    TError,
    DeleteMapVersionMutationVariables,
    TContext
  >,
) => {
  return useMutation<DeleteMapVersionMutation, TError, DeleteMapVersionMutationVariables, TContext>(
    {
      mutationKey: ['DeleteMapVersion'],
      mutationFn: axiosRequest<DeleteMapVersionMutation, DeleteMapVersionMutationVariables>(
        DeleteMapVersionDocument,
      ),
      ...options,
    },
  );
};

useDeleteMapVersionMutation.getKey = () => ['DeleteMapVersion'];
