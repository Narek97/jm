import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type DeleteWhiteboardItemsMutationVariables = Types.Exact<{
  deleteItemsInput: Types.DeleteItemsInput;
}>;

export type DeleteWhiteboardItemsMutation = { __typename?: 'Mutation'; deleteItems: Array<string> };

export const DeleteWhiteboardItemsDocument = `
    mutation DeleteWhiteboardItems($deleteItemsInput: DeleteItemsInput!) {
  deleteItems(deleteItemsInput: $deleteItemsInput)
}
    `;

export const useDeleteWhiteboardItemsMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    DeleteWhiteboardItemsMutation,
    TError,
    DeleteWhiteboardItemsMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    DeleteWhiteboardItemsMutation,
    TError,
    DeleteWhiteboardItemsMutationVariables,
    TContext
  >({
    mutationKey: ['DeleteWhiteboardItems'],
    mutationFn: axiosRequest<DeleteWhiteboardItemsMutation, DeleteWhiteboardItemsMutationVariables>(
      DeleteWhiteboardItemsDocument,
    ),
    ...options,
  });
};

useDeleteWhiteboardItemsMutation.getKey = () => ['DeleteWhiteboardItems'];
