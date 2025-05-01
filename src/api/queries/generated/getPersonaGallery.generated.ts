import * as Types from '../../types';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type GetPersonaGalleryQueryVariables = Types.Exact<{
  getPersonaGalleryInput: Types.GetPersonaGalleryInput;
}>;


export type GetPersonaGalleryQuery = { __typename?: 'Query', getPersonaGallery: { __typename?: 'GetPersonaGalleryModel', count: number, attachments: Array<{ __typename?: 'Attachment', id: number, url: string, key: string, name?: string | null, hasResizedVersions?: boolean | null, croppedArea?: { __typename?: 'Position', width?: number | null, height?: number | null, x?: number | null, y?: number | null } | null }> } };



export const GetPersonaGalleryDocument = `
    query GetPersonaGallery($getPersonaGalleryInput: GetPersonaGalleryInput!) {
  getPersonaGallery(getPersonaGalleryInput: $getPersonaGalleryInput) {
    count
    attachments {
      id
      url
      key
      name
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

export const useGetPersonaGalleryQuery = <
      TData = GetPersonaGalleryQuery,
      TError = unknown
    >(
      variables: GetPersonaGalleryQueryVariables,
      options?: Omit<UseQueryOptions<GetPersonaGalleryQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetPersonaGalleryQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetPersonaGalleryQuery, TError, TData>(
      {
    queryKey: ['GetPersonaGallery', variables],
    queryFn: axiosRequest<GetPersonaGalleryQuery, GetPersonaGalleryQueryVariables>(GetPersonaGalleryDocument).bind(null, variables),
    ...options
  }
    )};

useGetPersonaGalleryQuery.getKey = (variables: GetPersonaGalleryQueryVariables) => ['GetPersonaGallery', variables];
