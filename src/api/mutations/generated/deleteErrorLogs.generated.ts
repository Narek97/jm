import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type DeleteErrorLogsMutationVariables = Types.Exact<{ [key: string]: never }>;

export type DeleteErrorLogsMutation = { __typename?: 'Mutation'; deleteErrorLogs: number };

export const DeleteErrorLogsDocument = `
    mutation DeleteErrorLogs {
  deleteErrorLogs
}
    `;

export const useDeleteErrorLogsMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    DeleteErrorLogsMutation,
    TError,
    DeleteErrorLogsMutationVariables,
    TContext
  >,
) => {
  return useMutation<DeleteErrorLogsMutation, TError, DeleteErrorLogsMutationVariables, TContext>({
    mutationKey: ['DeleteErrorLogs'],
    mutationFn: axiosRequest<DeleteErrorLogsMutation, DeleteErrorLogsMutationVariables>(
      DeleteErrorLogsDocument,
    ),
    ...options,
  });
};

useDeleteErrorLogsMutation.getKey = () => ['DeleteErrorLogs'];
