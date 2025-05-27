import * as Types from '../../types';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type GetPersonaByIdQueryVariables = Types.Exact<{
  getPersonaByIdInput: Types.GetPersonaByIdInput;
}>;

export type GetPersonaByIdQuery = {
  __typename?: 'Query';
  getPersonaById: {
    __typename?: 'personas';
    id: number;
    name: string;
    type: string;
    color?: string | null;
    journeys: number;
    workspaceId: number;
    workspaceName: string;
    personaGroupId: number;
    personaGroupName: string;
    croppedArea?: {
      __typename?: 'Position';
      width?: number | null;
      height?: number | null;
      x?: number | null;
      y?: number | null;
    } | null;
    attachment?: {
      __typename?: 'Attachment';
      id: number;
      key: string;
      url: string;
      hasResizedVersions?: boolean | null;
      croppedArea?: {
        __typename?: 'Position';
        width?: number | null;
        height?: number | null;
        x?: number | null;
        y?: number | null;
      } | null;
    } | null;
  };
};

export const GetPersonaByIdDocument = `
    query GetPersonaById($getPersonaByIdInput: GetPersonaByIdInput!) {
  getPersonaById(getPersonaByIdInput: $getPersonaByIdInput) {
    id
    name
    type
    color
    journeys
    workspaceId
    workspaceName
    personaGroupId
    personaGroupName
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

export const useGetPersonaByIdQuery = <TData = GetPersonaByIdQuery, TError = unknown>(
  variables: GetPersonaByIdQueryVariables,
  options?: Omit<UseQueryOptions<GetPersonaByIdQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<GetPersonaByIdQuery, TError, TData>['queryKey'];
  },
) => {
  return useQuery<GetPersonaByIdQuery, TError, TData>({
    queryKey: ['GetPersonaById', variables],
    queryFn: axiosRequest<GetPersonaByIdQuery, GetPersonaByIdQueryVariables>(
      GetPersonaByIdDocument,
    ).bind(null, variables),
    ...options,
  });
};

useGetPersonaByIdQuery.getKey = (variables: GetPersonaByIdQueryVariables) => [
  'GetPersonaById',
  variables,
];
