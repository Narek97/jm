import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type DeleteOutcomeMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;

export type DeleteOutcomeMutation = { __typename?: 'Mutation'; deleteOutcome: number };

export const DeleteOutcomeDocument = `
    mutation DeleteOutcome($id: Int!) {
  deleteOutcome(id: $id)
}
    `;

export const useDeleteOutcomeMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    DeleteOutcomeMutation,
    TError,
    DeleteOutcomeMutationVariables,
    TContext
  >,
) => {
  return useMutation<DeleteOutcomeMutation, TError, DeleteOutcomeMutationVariables, TContext>({
    mutationKey: ['DeleteOutcome'],
    mutationFn: axiosRequest<DeleteOutcomeMutation, DeleteOutcomeMutationVariables>(
      DeleteOutcomeDocument,
    ),
    ...options,
  });
};

useDeleteOutcomeMutation.getKey = () => ['DeleteOutcome'];
