import * as Types from '../../types';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type GetUserLastPerformanceLogQueryVariables = Types.Exact<{ [key: string]: never }>;

export type GetUserLastPerformanceLogQuery = {
  __typename?: 'Query';
  getUserLastPerformanceLog: {
    __typename?: 'PerformanceLog';
    id: number;
    payloadSize?: number | null;
    responseTime: number;
    queryCount: number;
    complexity?: number | null;
    path: string;
    method: string;
    sqlRowQueries?: Array<string> | null;
  };
};

export const GetUserLastPerformanceLogDocument = `
    query GetUserLastPerformanceLog {
  getUserLastPerformanceLog {
    id
    payloadSize
    responseTime
    queryCount
    complexity
    path
    method
    sqlRowQueries
  }
}
    `;

export const useGetUserLastPerformanceLogQuery = <
  TData = GetUserLastPerformanceLogQuery,
  TError = unknown,
>(
  variables?: GetUserLastPerformanceLogQueryVariables,
  options?: Omit<UseQueryOptions<GetUserLastPerformanceLogQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<GetUserLastPerformanceLogQuery, TError, TData>['queryKey'];
  },
) => {
  return useQuery<GetUserLastPerformanceLogQuery, TError, TData>({
    queryKey:
      variables === undefined
        ? ['GetUserLastPerformanceLog']
        : ['GetUserLastPerformanceLog', variables],
    queryFn: axiosRequest<GetUserLastPerformanceLogQuery, GetUserLastPerformanceLogQueryVariables>(
      GetUserLastPerformanceLogDocument,
    ).bind(null, variables),
    ...options,
  });
};

useGetUserLastPerformanceLogQuery.getKey = (variables?: GetUserLastPerformanceLogQueryVariables) =>
  variables === undefined
    ? ['GetUserLastPerformanceLog']
    : ['GetUserLastPerformanceLog', variables];
