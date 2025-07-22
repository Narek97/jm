import * as Types from '../../types';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type GetPinnedPersonaItemsQueryVariables = Types.Exact<{
  pinnedPersonaItemsInput: Types.PinInput;
}>;

export type GetPinnedPersonaItemsQuery = {
  __typename?: 'Query';
  getPinnedPersonaItems: {
    __typename?: 'GetPinnedPersonaItemsModel';
    demographicInfos: Array<{
      __typename?: 'DemographicInfo';
      id: number;
      key: string;
      type: Types.DemographicInfoTypeEnum;
      value?: string | null;
      attachment?: {
        __typename?: 'Attachment';
        hasResizedVersions?: boolean | null;
        url: string;
        key: string;
      } | null;
      croppedArea?: {
        __typename?: 'Position';
        width?: number | null;
        height?: number | null;
        x?: number | null;
        y?: number | null;
      } | null;
    }>;
    pinnedSections: Array<{
      __typename?: 'PinnedSection';
      id: number;
      w: number;
      h: number;
      x: number;
      y: number;
      i: string;
      section: {
        __typename?: 'PersonaSection';
        id: number;
        key: string;
        color: string;
        content?: string | null;
      };
    }>;
  };
};

export const GetPinnedPersonaItemsDocument = `
    query GetPinnedPersonaItems($pinnedPersonaItemsInput: PinInput!) {
  getPinnedPersonaItems(pinnedPersonaItemsInput: $pinnedPersonaItemsInput) {
    demographicInfos {
      id
      key
      type
      value
      attachment {
        hasResizedVersions
        url
        key
      }
      croppedArea {
        width
        height
        x
        y
      }
    }
    pinnedSections {
      id
      w
      h
      x
      y
      i
      section {
        id
        key
        color
        content
      }
    }
  }
}
    `;

export const useGetPinnedPersonaItemsQuery = <TData = GetPinnedPersonaItemsQuery, TError = unknown>(
  variables: GetPinnedPersonaItemsQueryVariables,
  options?: Omit<UseQueryOptions<GetPinnedPersonaItemsQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<GetPinnedPersonaItemsQuery, TError, TData>['queryKey'];
  },
) => {
  return useQuery<GetPinnedPersonaItemsQuery, TError, TData>({
    queryKey: ['GetPinnedPersonaItems', variables],
    queryFn: axiosRequest<GetPinnedPersonaItemsQuery, GetPinnedPersonaItemsQueryVariables>(
      GetPinnedPersonaItemsDocument,
    ).bind(null, variables),
    ...options,
  });
};

useGetPinnedPersonaItemsQuery.getKey = (variables: GetPinnedPersonaItemsQueryVariables) => [
  'GetPinnedPersonaItems',
  variables,
];
