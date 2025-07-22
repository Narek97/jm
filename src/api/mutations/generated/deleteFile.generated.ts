import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type DeleteAttachmentMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;

export type DeleteAttachmentMutation = { __typename?: 'Mutation'; deleteAttachment: number };

export const DeleteAttachmentDocument = `
    mutation DeleteAttachment($id: Int!) {
  deleteAttachment(id: $id)
}
    `;

export const useDeleteAttachmentMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    DeleteAttachmentMutation,
    TError,
    DeleteAttachmentMutationVariables,
    TContext
  >,
) => {
  return useMutation<DeleteAttachmentMutation, TError, DeleteAttachmentMutationVariables, TContext>(
    {
      mutationKey: ['DeleteAttachment'],
      mutationFn: axiosRequest<DeleteAttachmentMutation, DeleteAttachmentMutationVariables>(
        DeleteAttachmentDocument,
      ),
      ...options,
    },
  );
};

useDeleteAttachmentMutation.getKey = () => ['DeleteAttachment'];
