import * as Types from '../../types';

import {
  useQuery,
  useInfiniteQuery,
  UseQueryOptions,
  UseInfiniteQueryOptions,
  InfiniteData,
} from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type GetMapPersonasForOutcomeQueryVariables = Types.Exact<{
  getMapPersonasInput: Types.GetMapPersonasInput;
}>;

export type GetMapPersonasForOutcomeQuery = {
  __typename?: 'Query';
  getMapPersonasForOutcome: {
    __typename?: 'GetMapPersonasModel';
    offset: number;
    limit: number;
    count?: number | null;
    personas: Array<{
      __typename?: 'PersonaForOutcomeCreation';
      id: number;
      name: string;
    }>;
  };
};

export const GetMapPersonasForOutcomeDocument = `
    query GetMapPersonasForOutcome($getMapPersonasInput: GetMapPersonasInput!) {
  getMapPersonasForOutcome(getMapPersonasInput: $getMapPersonasInput) {
    offset
    limit
    count
    personas {
      id
      name
    }
  }
}
    `;

export const useGetMapPersonasForOutcomeQuery = <
  TData = GetMapPersonasForOutcomeQuery,
  TError = unknown,
>(
  variables: GetMapPersonasForOutcomeQueryVariables,
  options?: Omit<UseQueryOptions<GetMapPersonasForOutcomeQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<GetMapPersonasForOutcomeQuery, TError, TData>['queryKey'];
  },
) => {
  return useQuery<GetMapPersonasForOutcomeQuery, TError, TData>({
    queryKey: ['GetMapPersonasForOutcome', variables],
    queryFn: axiosRequest<GetMapPersonasForOutcomeQuery, GetMapPersonasForOutcomeQueryVariables>(
      GetMapPersonasForOutcomeDocument,
    ).bind(null, variables),
    ...options,
  });
};

useGetMapPersonasForOutcomeQuery.getKey = (variables: GetMapPersonasForOutcomeQueryVariables) => [
  'GetMapPersonasForOutcome',
  variables,
];

export const useInfiniteGetMapPersonasForOutcomeQuery = <
  TData = InfiniteData<GetMapPersonasForOutcomeQuery>,
  TError = unknown,
>(
  variables: GetMapPersonasForOutcomeQueryVariables,
  options: Omit<
    UseInfiniteQueryOptions<GetMapPersonasForOutcomeQuery, TError, TData>,
    'queryKey'
  > & {
    queryKey?: UseInfiniteQueryOptions<GetMapPersonasForOutcomeQuery, TError, TData>['queryKey'];
  },
) => {
  const query = axiosRequest<GetMapPersonasForOutcomeQuery, GetMapPersonasForOutcomeQueryVariables>(
    GetMapPersonasForOutcomeDocument,
  );
  return useInfiniteQuery<GetMapPersonasForOutcomeQuery, TError, TData>(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? ['GetMapPersonasForOutcome.infinite', variables],
        queryFn: metaData => query({ ...variables, ...(metaData.pageParam ?? {}) }),
        ...restOptions,
      };
    })(),
  );
};

useInfiniteGetMapPersonasForOutcomeQuery.getKey = (
  variables: GetMapPersonasForOutcomeQueryVariables,
) => ['GetMapPersonasForOutcome.infinite', variables];
