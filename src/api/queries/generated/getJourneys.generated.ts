import * as Types from '../../types';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type GetJourneysQueryVariables = Types.Exact<{
  getMapsInput: Types.GetMapsInput;
}>;


export type GetJourneysQuery = { __typename?: 'Query', getMaps: { __typename?: 'GetMapsModel', count?: number | null, maps: Array<{ __typename?: 'Map', title?: string | null, id: number, type: Types.MapTypeEnum, boardId: number, createdAt: any, updatedAt: any, owner: { __typename?: 'Member', firstName: string, lastName: string, emailAddress: string }, selectedPersonas: Array<{ __typename?: 'personas', type: string, name: string, color?: string | null, id: number, croppedArea?: { __typename?: 'Position', width?: number | null, height?: number | null, x?: number | null, y?: number | null } | null, attachment?: { __typename?: 'Attachment', url: string, key: string, croppedArea?: { __typename?: 'Position', width?: number | null, height?: number | null, x?: number | null, y?: number | null } | null } | null }>, parentMaps: Array<{ __typename?: 'ParentMap', parentMap: { __typename?: 'Map', id: number, title?: string | null } }>, childMaps: Array<{ __typename?: 'ParentMap', childId: number, id: number }> }> } };



export const GetJourneysDocument = `
    query GetJourneys($getMapsInput: GetMapsInput!) {
  getMaps(getMapsInput: $getMapsInput) {
    count
    maps {
      title
      id
      type
      boardId
      createdAt
      updatedAt
      owner {
        firstName
        lastName
        emailAddress
      }
      selectedPersonas {
        croppedArea {
          width
          height
          x
          y
        }
        attachment {
          url
          key
          croppedArea {
            width
            height
            x
            y
          }
        }
        type
        name
        color
        id
      }
      parentMaps {
        parentMap {
          id
          title
        }
      }
      childMaps {
        childId
        id
      }
    }
  }
}
    `;

export const useGetJourneysQuery = <
      TData = GetJourneysQuery,
      TError = unknown
    >(
      variables: GetJourneysQueryVariables,
      options?: Omit<UseQueryOptions<GetJourneysQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetJourneysQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetJourneysQuery, TError, TData>(
      {
    queryKey: ['GetJourneys', variables],
    queryFn: axiosRequest<GetJourneysQuery, GetJourneysQueryVariables>(GetJourneysDocument).bind(null, variables),
    ...options
  }
    )};

useGetJourneysQuery.getKey = (variables: GetJourneysQueryVariables) => ['GetJourneys', variables];
