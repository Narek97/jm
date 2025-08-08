import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type AddItemsIntoWhiteboardMutationVariables = Types.Exact<{
  createItemsInput: Types.CreateItemsInput;
}>;

export type AddItemsIntoWhiteboardMutation = {
  __typename?: 'Mutation';
  addItemsIntoWhiteboard: Array<{ __typename?: 'WhiteboardDataItem'; id: number; data: any }>;
};

export const AddItemsIntoWhiteboardDocument = `
    mutation AddItemsIntoWhiteboard($createItemsInput: CreateItemsInput!) {
  addItemsIntoWhiteboard(createItemsInput: $createItemsInput) {
    id
    data
  }
}
    `;

export const useAddItemsIntoWhiteboardMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    AddItemsIntoWhiteboardMutation,
    TError,
    AddItemsIntoWhiteboardMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    AddItemsIntoWhiteboardMutation,
    TError,
    AddItemsIntoWhiteboardMutationVariables,
    TContext
  >({
    mutationKey: ['AddItemsIntoWhiteboard'],
    mutationFn: axiosRequest<
      AddItemsIntoWhiteboardMutation,
      AddItemsIntoWhiteboardMutationVariables
    >(AddItemsIntoWhiteboardDocument),
    ...options,
  });
};

useAddItemsIntoWhiteboardMutation.getKey = () => ['AddItemsIntoWhiteboard'];
