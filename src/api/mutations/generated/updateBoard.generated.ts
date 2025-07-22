import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type UpdateBoardMutationVariables = Types.Exact<{
  updateBoardInput: Types.UpdateBoardInput;
}>;

export type UpdateBoardMutation = {
  __typename?: 'Mutation';
  updateBoard: { __typename?: 'Board'; id: number; name: string; defaultMapId?: number | null };
};

export const UpdateBoardDocument = `
    mutation UpdateBoard($updateBoardInput: UpdateBoardInput!) {
  updateBoard(updateBoardInput: $updateBoardInput) {
    id
    name
    defaultMapId
  }
}
    `;

export const useUpdateBoardMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<UpdateBoardMutation, TError, UpdateBoardMutationVariables, TContext>,
) => {
  return useMutation<UpdateBoardMutation, TError, UpdateBoardMutationVariables, TContext>({
    mutationKey: ['UpdateBoard'],
    mutationFn: axiosRequest<UpdateBoardMutation, UpdateBoardMutationVariables>(
      UpdateBoardDocument,
    ),
    ...options,
  });
};

useUpdateBoardMutation.getKey = () => ['UpdateBoard'];
