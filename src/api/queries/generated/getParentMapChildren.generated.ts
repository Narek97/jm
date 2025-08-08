import * as Types from '../../types';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type GetParentMapChildrenQueryVariables = Types.Exact<{
  parentMapId: Types.Scalars['Int']['input'];
}>;

export type GetParentMapChildrenQuery = {
  __typename?: 'Query';
  getParentMapChildren: Array<{ __typename?: 'Map'; id: number; title?: string | null }>;
};

export const GetParentMapChildrenDocument = `
    query GetParentMapChildren($parentMapId: Int!) {
  getParentMapChildren(parentMapId: $parentMapId) {
    id
    title
  }
}
    `;

export const useGetParentMapChildrenQuery = <TData = GetParentMapChildrenQuery, TError = unknown>(
  variables: GetParentMapChildrenQueryVariables,
  options?: Omit<UseQueryOptions<GetParentMapChildrenQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<GetParentMapChildrenQuery, TError, TData>['queryKey'];
  },
) => {
  return useQuery<GetParentMapChildrenQuery, TError, TData>({
    queryKey: ['GetParentMapChildren', variables],
    queryFn: axiosRequest<GetParentMapChildrenQuery, GetParentMapChildrenQueryVariables>(
      GetParentMapChildrenDocument,
    ).bind(null, variables),
    ...options,
  });
};

useGetParentMapChildrenQuery.getKey = (variables: GetParentMapChildrenQueryVariables) => [
  'GetParentMapChildren',
  variables,
];
