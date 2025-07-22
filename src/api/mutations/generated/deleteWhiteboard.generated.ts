import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type DeleteWhiteboardMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;

export type DeleteWhiteboardMutation = { __typename?: 'Mutation'; deleteWhiteboard: boolean };

export const DeleteWhiteboardDocument = `
    mutation DeleteWhiteboard($id: Int!) {
  deleteWhiteboard(id: $id)
}
    `;

export const useDeleteWhiteboardMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    DeleteWhiteboardMutation,
    TError,
    DeleteWhiteboardMutationVariables,
    TContext
  >,
) => {
  return useMutation<DeleteWhiteboardMutation, TError, DeleteWhiteboardMutationVariables, TContext>(
    {
      mutationKey: ['DeleteWhiteboard'],
      mutationFn: axiosRequest<DeleteWhiteboardMutation, DeleteWhiteboardMutationVariables>(
        DeleteWhiteboardDocument,
      ),
      ...options,
    },
  );
};

useDeleteWhiteboardMutation.getKey = () => ['DeleteWhiteboard'];
