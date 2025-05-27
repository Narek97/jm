import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type DeleteMetricsMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;

export type DeleteMetricsMutation = {
  __typename?: 'Mutation';
  deleteMetrics: {
    __typename?: 'RemoveMetricsResponseModel';
    rowId: number;
    columnId: number;
  };
};

export const DeleteMetricsDocument = `
    mutation DeleteMetrics($id: Int!) {
  deleteMetrics(id: $id) {
    rowId
    columnId
  }
}
    `;

export const useDeleteMetricsMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    DeleteMetricsMutation,
    TError,
    DeleteMetricsMutationVariables,
    TContext
  >,
) => {
  return useMutation<DeleteMetricsMutation, TError, DeleteMetricsMutationVariables, TContext>({
    mutationKey: ['DeleteMetrics'],
    mutationFn: axiosRequest<DeleteMetricsMutation, DeleteMetricsMutationVariables>(
      DeleteMetricsDocument,
    ),
    ...options,
  });
};

useDeleteMetricsMutation.getKey = () => ['DeleteMetrics'];
