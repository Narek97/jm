import * as Types from '../../types';

import { useQuery, useInfiniteQuery, UseQueryOptions, UseInfiniteQueryOptions, InfiniteData } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type GetPerformanceLogsQueryVariables = Types.Exact<{
  paginationInput: Types.PaginationInput;
}>;


export type GetPerformanceLogsQuery = { __typename?: 'Query', getPerformanceLogs: { __typename?: 'GetPerformanceLogModel', count?: number | null, performanceLogs: Array<{ __typename?: 'PerformanceLog', id: number, path: string, createdAt: any, responseTime: number, queryCount: number, sqlRowQueries?: Array<string> | null, payloadSize?: number | null }> } };



export const GetPerformanceLogsDocument = `
    query GetPerformanceLogs($paginationInput: PaginationInput!) {
  getPerformanceLogs(paginationInput: $paginationInput) {
    count
    performanceLogs {
      id
      path
      createdAt
      responseTime
      queryCount
      responseTime
      sqlRowQueries
      payloadSize
    }
  }
}
    `;

export const useGetPerformanceLogsQuery = <
      TData = GetPerformanceLogsQuery,
      TError = unknown
    >(
      variables: GetPerformanceLogsQueryVariables,
      options?: Omit<UseQueryOptions<GetPerformanceLogsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetPerformanceLogsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetPerformanceLogsQuery, TError, TData>(
      {
    queryKey: ['GetPerformanceLogs', variables],
    queryFn: axiosRequest<GetPerformanceLogsQuery, GetPerformanceLogsQueryVariables>(GetPerformanceLogsDocument).bind(null, variables),
    ...options
  }
    )};

useGetPerformanceLogsQuery.getKey = (variables: GetPerformanceLogsQueryVariables) => ['GetPerformanceLogs', variables];

export const useInfiniteGetPerformanceLogsQuery = <
      TData = InfiniteData<GetPerformanceLogsQuery>,
      TError = unknown
    >(
      variables: GetPerformanceLogsQueryVariables,
      options: Omit<UseInfiniteQueryOptions<GetPerformanceLogsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseInfiniteQueryOptions<GetPerformanceLogsQuery, TError, TData>['queryKey'] }
    ) => {
    const query = axiosRequest<GetPerformanceLogsQuery, GetPerformanceLogsQueryVariables>(GetPerformanceLogsDocument)
    return useInfiniteQuery<GetPerformanceLogsQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['GetPerformanceLogs.infinite', variables],
      queryFn: (metaData) => query({...variables, ...(metaData.pageParam ?? {})}),
      ...restOptions
    }
  })()
    )};

useInfiniteGetPerformanceLogsQuery.getKey = (variables: GetPerformanceLogsQueryVariables) => ['GetPerformanceLogs.infinite', variables];
