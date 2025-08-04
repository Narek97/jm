import * as Types from '../../types';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type GetMapSelectedPersonasQueryVariables = Types.Exact<{
  mapId: Types.Scalars['Int']['input'];
}>;


export type GetMapSelectedPersonasQuery = { __typename?: 'Query', getMapSelectedPersonas: Array<{ __typename?: 'personas', id: number, name: string, type: string, color?: string | null, attachmentId?: number | null, isSelected: boolean, journeys: number, personaGroupId: number, croppedArea?: { __typename?: 'Position', width?: number | null, height?: number | null, x?: number | null, y?: number | null } | null, attachment?: { __typename?: 'Attachment', id: number, key: string, url: string, hasResizedVersions?: boolean | null, croppedArea?: { __typename?: 'Position', width?: number | null, height?: number | null, x?: number | null, y?: number | null } | null } | null }> };



export const GetMapSelectedPersonasDocument = `
    query GetMapSelectedPersonas($mapId: Int!) {
  getMapSelectedPersonas(mapId: $mapId) {
    id
    name
    type
    color
    attachmentId
    isSelected
    journeys
    personaGroupId
    croppedArea {
      width
      height
      x
      y
    }
    attachment {
      id
      key
      url
      hasResizedVersions
      croppedArea {
        width
        height
        x
        y
      }
    }
  }
}
    `;

export const useGetMapSelectedPersonasQuery = <
      TData = GetMapSelectedPersonasQuery,
      TError = unknown
    >(
      variables: GetMapSelectedPersonasQueryVariables,
      options?: Omit<UseQueryOptions<GetMapSelectedPersonasQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetMapSelectedPersonasQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetMapSelectedPersonasQuery, TError, TData>(
      {
    queryKey: ['GetMapSelectedPersonas', variables],
    queryFn: axiosRequest<GetMapSelectedPersonasQuery, GetMapSelectedPersonasQueryVariables>(GetMapSelectedPersonasDocument).bind(null, variables),
    ...options
  }
    )};

useGetMapSelectedPersonasQuery.getKey = (variables: GetMapSelectedPersonasQueryVariables) => ['GetMapSelectedPersonas', variables];
