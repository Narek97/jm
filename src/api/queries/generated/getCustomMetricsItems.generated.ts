import * as Types from '../../types';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type GetCustomMetricsItemsQueryVariables = Types.Exact<{
  metricsId: Types.Scalars['Int']['input'];
}>;

export type GetCustomMetricsItemsQuery = {
  __typename?: 'Query';
  getCustomMetricsItems: Array<{
    __typename?: 'CustomMetrics';
    id: number;
    date: any;
    value: number;
  }>;
};

export const GetCustomMetricsItemsDocument = `
    query GetCustomMetricsItems($metricsId: Int!) {
  getCustomMetricsItems(metricsId: $metricsId) {
    id
    date
    value
  }
}
    `;

export const useGetCustomMetricsItemsQuery = <TData = GetCustomMetricsItemsQuery, TError = unknown>(
  variables: GetCustomMetricsItemsQueryVariables,
  options?: Omit<UseQueryOptions<GetCustomMetricsItemsQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<GetCustomMetricsItemsQuery, TError, TData>['queryKey'];
  },
) => {
  return useQuery<GetCustomMetricsItemsQuery, TError, TData>({
    queryKey: ['GetCustomMetricsItems', variables],
    queryFn: axiosRequest<GetCustomMetricsItemsQuery, GetCustomMetricsItemsQueryVariables>(
      GetCustomMetricsItemsDocument,
    ).bind(null, variables),
    ...options,
  });
};

useGetCustomMetricsItemsQuery.getKey = (variables: GetCustomMetricsItemsQueryVariables) => [
  'GetCustomMetricsItems',
  variables,
];
