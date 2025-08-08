import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type DeleteMapLinkMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;

export type DeleteMapLinkMutation = { __typename?: 'Mutation'; deleteLink: number };

export const DeleteMapLinkDocument = `
    mutation DeleteMapLink($id: Int!) {
  deleteLink(id: $id)
}
    `;

export const useDeleteMapLinkMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    DeleteMapLinkMutation,
    TError,
    DeleteMapLinkMutationVariables,
    TContext
  >,
) => {
  return useMutation<DeleteMapLinkMutation, TError, DeleteMapLinkMutationVariables, TContext>({
    mutationKey: ['DeleteMapLink'],
    mutationFn: axiosRequest<DeleteMapLinkMutation, DeleteMapLinkMutationVariables>(
      DeleteMapLinkDocument,
    ),
    ...options,
  });
};

useDeleteMapLinkMutation.getKey = () => ['DeleteMapLink'];
