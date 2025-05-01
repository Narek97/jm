import * as Types from '../../types';

import { useQuery, useInfiniteQuery, UseQueryOptions, UseInfiniteQueryOptions, InfiniteData } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type GetJourneysForCopyQueryVariables = Types.Exact<{
  getMapsInput: Types.GetMapsInput;
}>;


export type GetJourneysForCopyQuery = { __typename?: 'Query', getMaps: { __typename?: 'GetMapsModel', count?: number | null, maps: Array<{ __typename?: 'Map', title?: string | null, id: number }> } };



export const GetJourneysForCopyDocument = `
    query GetJourneysForCopy($getMapsInput: GetMapsInput!) {
  getMaps(getMapsInput: $getMapsInput) {
    count
    maps {
      title
      id
    }
  }
}
    `;

export const useGetJourneysForCopyQuery = <
      TData = GetJourneysForCopyQuery,
      TError = unknown
    >(
      variables: GetJourneysForCopyQueryVariables,
      options?: Omit<UseQueryOptions<GetJourneysForCopyQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetJourneysForCopyQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetJourneysForCopyQuery, TError, TData>(
      {
    queryKey: ['GetJourneysForCopy', variables],
    queryFn: axiosRequest<GetJourneysForCopyQuery, GetJourneysForCopyQueryVariables>(GetJourneysForCopyDocument).bind(null, variables),
    ...options
  }
    )};

useGetJourneysForCopyQuery.getKey = (variables: GetJourneysForCopyQueryVariables) => ['GetJourneysForCopy', variables];

export const useInfiniteGetJourneysForCopyQuery = <
      TData = InfiniteData<GetJourneysForCopyQuery>,
      TError = unknown
    >(
      variables: GetJourneysForCopyQueryVariables,
      options: Omit<UseInfiniteQueryOptions<GetJourneysForCopyQuery, TError, TData>, 'queryKey'> & { queryKey?: UseInfiniteQueryOptions<GetJourneysForCopyQuery, TError, TData>['queryKey'] }
    ) => {
    const query = axiosRequest<GetJourneysForCopyQuery, GetJourneysForCopyQueryVariables>(GetJourneysForCopyDocument)
    return useInfiniteQuery<GetJourneysForCopyQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['GetJourneysForCopy.infinite', variables],
      queryFn: (metaData) => query({...variables, ...(metaData.pageParam ?? {})}),
      ...restOptions
    }
  })()
    )};

useInfiniteGetJourneysForCopyQuery.getKey = (variables: GetJourneysForCopyQueryVariables) => ['GetJourneysForCopy.infinite', variables];
