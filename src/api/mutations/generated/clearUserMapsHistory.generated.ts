import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type ClearUserMapsHistoryMutationVariables = Types.Exact<{ [key: string]: never }>;

export type ClearUserMapsHistoryMutation = {
  __typename?: 'Mutation';
  clearUserMapsHistory?: number | null;
};

export const ClearUserMapsHistoryDocument = `
    mutation ClearUserMapsHistory {
  clearUserMapsHistory
}
    `;

export const useClearUserMapsHistoryMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    ClearUserMapsHistoryMutation,
    TError,
    ClearUserMapsHistoryMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    ClearUserMapsHistoryMutation,
    TError,
    ClearUserMapsHistoryMutationVariables,
    TContext
  >({
    mutationKey: ['ClearUserMapsHistory'],
    mutationFn: axiosRequest<ClearUserMapsHistoryMutation, ClearUserMapsHistoryMutationVariables>(
      ClearUserMapsHistoryDocument,
    ),
    ...options,
  });
};

useClearUserMapsHistoryMutation.getKey = () => ['ClearUserMapsHistory'];
