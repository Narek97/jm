import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type DeleteOutcomeGroupMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;

export type DeleteOutcomeGroupMutation = { __typename?: 'Mutation'; deleteOutcomeGroup: number };

export const DeleteOutcomeGroupDocument = `
    mutation DeleteOutcomeGroup($id: Int!) {
  deleteOutcomeGroup(id: $id)
}
    `;

export const useDeleteOutcomeGroupMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    DeleteOutcomeGroupMutation,
    TError,
    DeleteOutcomeGroupMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    DeleteOutcomeGroupMutation,
    TError,
    DeleteOutcomeGroupMutationVariables,
    TContext
  >({
    mutationKey: ['DeleteOutcomeGroup'],
    mutationFn: axiosRequest<DeleteOutcomeGroupMutation, DeleteOutcomeGroupMutationVariables>(
      DeleteOutcomeGroupDocument,
    ),
    ...options,
  });
};

useDeleteOutcomeGroupMutation.getKey = () => ['DeleteOutcomeGroup'];
