import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type DeleteBoardMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;

export type DeleteBoardMutation = {
  __typename?: 'Mutation';
  deleteBoard: number;
};

export const DeleteBoardDocument = `
    mutation DeleteBoard($id: Int!) {
  deleteBoard(id: $id)
}
    `;

export const useDeleteBoardMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<DeleteBoardMutation, TError, DeleteBoardMutationVariables, TContext>,
) => {
  return useMutation<DeleteBoardMutation, TError, DeleteBoardMutationVariables, TContext>({
    mutationKey: ['DeleteBoard'],
    mutationFn: axiosRequest<DeleteBoardMutation, DeleteBoardMutationVariables>(
      DeleteBoardDocument,
    ),
    ...options,
  });
};

useDeleteBoardMutation.getKey = () => ['DeleteBoard'];
