import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type UpdateCommentMutationVariables = Types.Exact<{
  updateCommentInput: Types.UpdateCommentInput;
}>;

export type UpdateCommentMutation = {
  __typename?: 'Mutation';
  updateComment: string;
};

export const UpdateCommentDocument = `
    mutation UpdateComment($updateCommentInput: UpdateCommentInput!) {
  updateComment(updateCommentInput: $updateCommentInput)
}
    `;

export const useUpdateCommentMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    UpdateCommentMutation,
    TError,
    UpdateCommentMutationVariables,
    TContext
  >,
) => {
  return useMutation<UpdateCommentMutation, TError, UpdateCommentMutationVariables, TContext>({
    mutationKey: ['UpdateComment'],
    mutationFn: axiosRequest<UpdateCommentMutation, UpdateCommentMutationVariables>(
      UpdateCommentDocument,
    ),
    ...options,
  });
};

useUpdateCommentMutation.getKey = () => ['UpdateComment'];
