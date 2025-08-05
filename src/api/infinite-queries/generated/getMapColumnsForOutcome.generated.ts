import * as Types from '../../types';

import {
  useQuery,
  useInfiniteQuery,
  UseQueryOptions,
  UseInfiniteQueryOptions,
  InfiniteData,
} from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type GetMapColumnsForOutcomeQueryVariables = Types.Exact<{
  getMapColumnsForOutcomeInput: Types.GetMapRowColumnsForOutcomeInput;
}>;

export type GetMapColumnsForOutcomeQuery = {
  __typename?: 'Query';
  getMapColumnsForOutcome: {
    __typename?: 'GetMapColumnsOutcomeModel';
    count?: number | null;
    columns: Array<{ __typename?: 'MapColumnForOutcome'; id: number; label?: string | null }>;
  };
};

export const GetMapColumnsForOutcomeDocument = `
    query GetMapColumnsForOutcome($getMapColumnsForOutcomeInput: GetMapRowColumnsForOutcomeInput!) {
  getMapColumnsForOutcome(
    getMapColumnsForOutcomeInput: $getMapColumnsForOutcomeInput
  ) {
    count
    columns {
      id
      label
    }
  }
}
    `;

export const useGetMapColumnsForOutcomeQuery = <
  TData = GetMapColumnsForOutcomeQuery,
  TError = unknown,
>(
  variables: GetMapColumnsForOutcomeQueryVariables,
  options?: Omit<UseQueryOptions<GetMapColumnsForOutcomeQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<GetMapColumnsForOutcomeQuery, TError, TData>['queryKey'];
  },
) => {
  return useQuery<GetMapColumnsForOutcomeQuery, TError, TData>({
    queryKey: ['GetMapColumnsForOutcome', variables],
    queryFn: axiosRequest<GetMapColumnsForOutcomeQuery, GetMapColumnsForOutcomeQueryVariables>(
      GetMapColumnsForOutcomeDocument,
    ).bind(null, variables),
    ...options,
  });
};

useGetMapColumnsForOutcomeQuery.getKey = (variables: GetMapColumnsForOutcomeQueryVariables) => [
  'GetMapColumnsForOutcome',
  variables,
];

export const useInfiniteGetMapColumnsForOutcomeQuery = <
  TData = InfiniteData<GetMapColumnsForOutcomeQuery>,
  TError = unknown,
>(
  variables: GetMapColumnsForOutcomeQueryVariables,
  options: Omit<
    UseInfiniteQueryOptions<GetMapColumnsForOutcomeQuery, TError, TData>,
    'queryKey'
  > & {
    queryKey?: UseInfiniteQueryOptions<GetMapColumnsForOutcomeQuery, TError, TData>['queryKey'];
  },
) => {
  const query = axiosRequest<GetMapColumnsForOutcomeQuery, GetMapColumnsForOutcomeQueryVariables>(
    GetMapColumnsForOutcomeDocument,
  );
  return useInfiniteQuery<GetMapColumnsForOutcomeQuery, TError, TData>(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? ['GetMapColumnsForOutcome.infinite', variables],
        queryFn: metaData => query({ ...variables, ...(metaData.pageParam ?? {}) }),
        ...restOptions,
      };
    })(),
  );
};

useInfiniteGetMapColumnsForOutcomeQuery.getKey = (
  variables: GetMapColumnsForOutcomeQueryVariables,
) => ['GetMapColumnsForOutcome.infinite', variables];
