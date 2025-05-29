import * as Types from '../../types';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type GetPersonaGroupsWithPersonasQueryVariables = Types.Exact<{
  getPersonaGroupsWithPersonasInput: Types.GetPersonaGroupsWithPersonasInput;
}>;

export type GetPersonaGroupsWithPersonasQuery = {
  __typename?: 'Query';
  getPersonaGroupsWithPersonas: {
    __typename?: 'GetPersonaGroupsWithPersonasModel';
    offset: number;
    limit: number;
    count?: number | null;
    personaGroups: Array<{
      __typename?: 'PersonaGroup';
      id: number;
      name: string;
      persona: Array<{
        __typename?: 'personas';
        id: number;
        name: string;
        type: string;
        personaGroupId: number;
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
          name?: string | null;
        } | null;
      }>;
    }>;
  };
};

export const GetPersonaGroupsWithPersonasDocument = `
    query GetPersonaGroupsWithPersonas($getPersonaGroupsWithPersonasInput: GetPersonaGroupsWithPersonasInput!) {
  getPersonaGroupsWithPersonas(
    getPersonaGroupsWithPersonasInput: $getPersonaGroupsWithPersonasInput
  ) {
    offset
    limit
    count
    personaGroups {
      id
      name
      persona {
        id
        name
        type
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
          name
        }
      }
    }
  }
}
    `;

export const useGetPersonaGroupsWithPersonasQuery = <
  TData = GetPersonaGroupsWithPersonasQuery,
  TError = unknown,
>(
  variables: GetPersonaGroupsWithPersonasQueryVariables,
  options?: Omit<UseQueryOptions<GetPersonaGroupsWithPersonasQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<GetPersonaGroupsWithPersonasQuery, TError, TData>['queryKey'];
  },
) => {
  return useQuery<GetPersonaGroupsWithPersonasQuery, TError, TData>({
    queryKey: ['GetPersonaGroupsWithPersonas', variables],
    queryFn: axiosRequest<
      GetPersonaGroupsWithPersonasQuery,
      GetPersonaGroupsWithPersonasQueryVariables
    >(GetPersonaGroupsWithPersonasDocument).bind(null, variables),
    ...options,
  });
};

useGetPersonaGroupsWithPersonasQuery.getKey = (
  variables: GetPersonaGroupsWithPersonasQueryVariables,
) => ['GetPersonaGroupsWithPersonas', variables];
