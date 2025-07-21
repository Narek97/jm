import * as Types from '../../types';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type GetDataPointsQueryVariables = Types.Exact<{
  getDataPointsInput: Types.GetDataPointsInput;
}>;

export type GetDataPointsQuery = {
  __typename?: 'Query';
  getDataPoints: {
    __typename?: 'GetDataPointsResponse';
    offset: number;
    limit: number;
    count?: number | null;
    dataPoints: Array<
      | {
          __typename?: 'CESPoint';
          id: number;
          date: any;
          neutral: number;
          difficult: number;
          easy: number;
        }
      | {
          __typename?: 'CSATPoint';
          id: number;
          date: any;
          dissatisfied: number;
          satisfied: number;
          neutral: number;
        }
      | {
          __typename?: 'NPSPoint';
          id: number;
          date: any;
          passive: number;
          promoter: number;
          detractor: number;
        }
    >;
  };
};

export const GetDataPointsDocument = `
    query GetDataPoints($getDataPointsInput: GetDataPointsInput!) {
  getDataPoints(getDataPointsInput: $getDataPointsInput) {
    offset
    limit
    count
    dataPoints {
      ... on NPSPoint {
        id
        date
        passive
        promoter
        detractor
      }
      ... on CESPoint {
        id
        date
        neutral
        difficult
        easy
      }
      ... on CSATPoint {
        id
        date
        dissatisfied
        satisfied
        neutral
      }
    }
  }
}
    `;

export const useGetDataPointsQuery = <TData = GetDataPointsQuery, TError = unknown>(
  variables: GetDataPointsQueryVariables,
  options?: Omit<UseQueryOptions<GetDataPointsQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<GetDataPointsQuery, TError, TData>['queryKey'];
  },
) => {
  return useQuery<GetDataPointsQuery, TError, TData>({
    queryKey: ['GetDataPoints', variables],
    queryFn: axiosRequest<GetDataPointsQuery, GetDataPointsQueryVariables>(
      GetDataPointsDocument,
    ).bind(null, variables),
    ...options,
  });
};

useGetDataPointsQuery.getKey = (variables: GetDataPointsQueryVariables) => [
  'GetDataPoints',
  variables,
];
