import * as Types from '../../types';

import {
  useQuery,
  useInfiniteQuery,
  UseQueryOptions,
  UseInfiniteQueryOptions,
  InfiniteData,
} from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type GetPersonasQueryVariables = Types.Exact<{
  getPersonasInput: Types.GetPersonasInput;
}>;

export type GetPersonasQuery = {
  __typename?: 'Query';
  getPersonas: {
    __typename?: 'GetPersonasModel';
    count?: number | null;
    workspace?: { __typename?: 'PartialWorkspace'; id: number; name: string } | null;
    personaGroup?: { __typename?: 'PartialPersonaGroup'; id: number; name: string } | null;
    personas: Array<{
      __typename?: 'personas';
      id: number;
      name: string;
      color?: string | null;
      type: string;
      journeys: number;
      isSelected: boolean;
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
        url: string;
        key: string;
        hasResizedVersions?: boolean | null;
        croppedArea?: {
          __typename?: 'Position';
          width?: number | null;
          height?: number | null;
          x?: number | null;
          y?: number | null;
        } | null;
      } | null;
    }>;
  };
};

export const GetPersonasDocument = `
    query GetPersonas($getPersonasInput: GetPersonasInput!) {
  getPersonas(getPersonasInput: $getPersonasInput) {
    count
    workspace {
      id
      name
    }
    personaGroup {
      id
      name
    }
    personas {
      id
      name
      color
      type
      journeys
      isSelected
      croppedArea {
        width
        height
        x
        y
      }
      attachment {
        id
        url
        key
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
}
    `;

export const useGetPersonasQuery = <TData = GetPersonasQuery, TError = unknown>(
  variables: GetPersonasQueryVariables,
  options?: Omit<UseQueryOptions<GetPersonasQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<GetPersonasQuery, TError, TData>['queryKey'];
  },
) => {
  return useQuery<GetPersonasQuery, TError, TData>({
    queryKey: ['GetPersonas', variables],
    queryFn: axiosRequest<GetPersonasQuery, GetPersonasQueryVariables>(GetPersonasDocument).bind(
      null,
      variables,
    ),
    ...options,
  });
};

useGetPersonasQuery.getKey = (variables: GetPersonasQueryVariables) => ['GetPersonas', variables];

export const useInfiniteGetPersonasQuery = <
  TData = InfiniteData<GetPersonasQuery>,
  TError = unknown,
>(
  variables: GetPersonasQueryVariables,
  options: Omit<UseInfiniteQueryOptions<GetPersonasQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseInfiniteQueryOptions<GetPersonasQuery, TError, TData>['queryKey'];
  },
) => {
  const query = axiosRequest<GetPersonasQuery, GetPersonasQueryVariables>(GetPersonasDocument);
  return useInfiniteQuery<GetPersonasQuery, TError, TData>(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? ['GetPersonas.infinite', variables],
        queryFn: metaData => query({ ...variables, ...(metaData.pageParam ?? {}) }),
        ...restOptions,
      };
    })(),
  );
};

useInfiniteGetPersonasQuery.getKey = (variables: GetPersonasQueryVariables) => [
  'GetPersonas.infinite',
  variables,
];
