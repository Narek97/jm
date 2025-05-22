import * as Types from '../../types';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type GetMapDetailsQueryVariables = Types.Exact<{
  mapId: Types.Scalars['Int']['input'];
}>;


export type GetMapDetailsQuery = { __typename?: 'Query', getMapDetails: { __typename?: 'GetMapDetailsModel', isChildMap: boolean, isParentMap: boolean, parentMap: { __typename?: 'CustomMap', id: number, title?: string | null } } };



export const GetMapDetailsDocument = `
    query GetMapDetails($mapId: Int!) {
  getMapDetails(mapId: $mapId) {
    isChildMap
    isParentMap
    parentMap {
      id
      title
    }
  }
}
    `;

export const useGetMapDetailsQuery = <
      TData = GetMapDetailsQuery,
      TError = unknown
    >(
      variables: GetMapDetailsQueryVariables,
      options?: Omit<UseQueryOptions<GetMapDetailsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetMapDetailsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetMapDetailsQuery, TError, TData>(
      {
    queryKey: ['GetMapDetails', variables],
    queryFn: axiosRequest<GetMapDetailsQuery, GetMapDetailsQueryVariables>(GetMapDetailsDocument).bind(null, variables),
    ...options
  }
    )};

useGetMapDetailsQuery.getKey = (variables: GetMapDetailsQueryVariables) => ['GetMapDetails', variables];
