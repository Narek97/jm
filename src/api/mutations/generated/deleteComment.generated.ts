import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type DeleteCommentMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;

export type DeleteCommentMutation = { __typename?: 'Mutation'; deleteComment: number };

export const DeleteCommentDocument = `
    mutation DeleteComment($id: Int!) {
  deleteComment(id: $id)
}
    `;

export const useDeleteCommentMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    DeleteCommentMutation,
    TError,
    DeleteCommentMutationVariables,
    TContext
  >,
) => {
  return useMutation<DeleteCommentMutation, TError, DeleteCommentMutationVariables, TContext>({
    mutationKey: ['DeleteComment'],
    mutationFn: axiosRequest<DeleteCommentMutation, DeleteCommentMutationVariables>(
      DeleteCommentDocument,
    ),
    ...options,
  });
};

useDeleteCommentMutation.getKey = () => ['DeleteComment'];
