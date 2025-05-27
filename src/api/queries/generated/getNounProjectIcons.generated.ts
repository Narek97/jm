import * as Types from '../../types';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type GetNounProjectIconsQueryVariables = Types.Exact<{
  category: Types.Scalars['String']['input'];
  limit: Types.Scalars['Int']['input'];
}>;

export type GetNounProjectIconsQuery = {
  __typename?: 'Query';
  getNounProjectIcons?: any | null;
};

export const GetNounProjectIconsDocument = `
    query GetNounProjectIcons($category: String!, $limit: Int!) {
  getNounProjectIcons(category: $category, limit: $limit)
}
    `;

export const useGetNounProjectIconsQuery = <TData = GetNounProjectIconsQuery, TError = unknown>(
  variables: GetNounProjectIconsQueryVariables,
  options?: Omit<UseQueryOptions<GetNounProjectIconsQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<GetNounProjectIconsQuery, TError, TData>['queryKey'];
  },
) => {
  return useQuery<GetNounProjectIconsQuery, TError, TData>({
    queryKey: ['GetNounProjectIcons', variables],
    queryFn: axiosRequest<GetNounProjectIconsQuery, GetNounProjectIconsQueryVariables>(
      GetNounProjectIconsDocument,
    ).bind(null, variables),
    ...options,
  });
};

useGetNounProjectIconsQuery.getKey = (variables: GetNounProjectIconsQueryVariables) => [
  'GetNounProjectIcons',
  variables,
];
