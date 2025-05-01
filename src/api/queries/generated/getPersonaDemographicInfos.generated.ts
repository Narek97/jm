import * as Types from '../../types';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type GetPersonaDemographicInfosQueryVariables = Types.Exact<{
  getPersonaDemographicInfosInput: Types.GetPersonaDemographicInfosInput;
}>;


export type GetPersonaDemographicInfosQuery = { __typename?: 'Query', getPersonaDemographicInfos: { __typename?: 'GetDemographicInfosModel', demographicInfoFields: Array<{ __typename?: 'GetPersonaDemographicInfoModel', id: number, key: string, personaId: number, value?: string | null, type: Types.DemographicInfoTypeEnum, isPinned?: boolean | null, isHidden: boolean, isDefault: boolean }>, personaFieldSections: Array<{ __typename?: 'GetPersonaDemographicInfoModel', id: number, key: string, personaId: number, value?: string | null, type: Types.DemographicInfoTypeEnum, height?: number | null, isPinned?: boolean | null, isHidden: boolean, isDefault: boolean, attachment?: { __typename?: 'Attachment', url: string, key: string, croppedArea?: { __typename?: 'Position', width?: number | null, height?: number | null, x?: number | null, y?: number | null } | null } | null }> } };



export const GetPersonaDemographicInfosDocument = `
    query GetPersonaDemographicInfos($getPersonaDemographicInfosInput: GetPersonaDemographicInfosInput!) {
  getPersonaDemographicInfos(
    getPersonaDemographicInfosInput: $getPersonaDemographicInfosInput
  ) {
    demographicInfoFields {
      id
      key
      personaId
      value
      type
      isPinned
      isHidden
      isDefault
    }
    personaFieldSections {
      id
      key
      personaId
      value
      type
      height
      isPinned
      isHidden
      isDefault
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
    }
  }
}
    `;

export const useGetPersonaDemographicInfosQuery = <
      TData = GetPersonaDemographicInfosQuery,
      TError = unknown
    >(
      variables: GetPersonaDemographicInfosQueryVariables,
      options?: Omit<UseQueryOptions<GetPersonaDemographicInfosQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetPersonaDemographicInfosQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetPersonaDemographicInfosQuery, TError, TData>(
      {
    queryKey: ['GetPersonaDemographicInfos', variables],
    queryFn: axiosRequest<GetPersonaDemographicInfosQuery, GetPersonaDemographicInfosQueryVariables>(GetPersonaDemographicInfosDocument).bind(null, variables),
    ...options
  }
    )};

useGetPersonaDemographicInfosQuery.getKey = (variables: GetPersonaDemographicInfosQueryVariables) => ['GetPersonaDemographicInfos', variables];
