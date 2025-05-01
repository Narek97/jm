import * as Types from '../../types';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type GetPersonaSectionsQueryVariables = Types.Exact<{
  getPersonaSectionsInput: Types.GetPersonaSectionsInput;
}>;


export type GetPersonaSectionsQuery = { __typename?: 'Query', getPersonaSections: Array<{ __typename?: 'GetPersonaSectionsModel', id: number, w: number, h: number, x: number, y: number, i: string, key: string, color: string, content?: string | null, isPinned?: boolean | null, isHidden: boolean }> };

export type GetPinPersonaSectionsQueryVariables = Types.Exact<{
  getPersonaSectionsInput: Types.GetPersonaSectionsInput;
}>;


export type GetPinPersonaSectionsQuery = { __typename?: 'Query', getPersonaSections: Array<{ __typename?: 'GetPersonaSectionsModel', id: number, w: number, h: number, x: number, y: number, i: string, key: string, color: string, content?: string | null, isPinned?: boolean | null, isHidden: boolean }> };



export const GetPersonaSectionsDocument = `
    query GetPersonaSections($getPersonaSectionsInput: GetPersonaSectionsInput!) {
  getPersonaSections(getPersonaSectionsInput: $getPersonaSectionsInput) {
    id
    w
    h
    x
    y
    i
    key
    color
    content
    isPinned
    isHidden
  }
}
    `;

export const useGetPersonaSectionsQuery = <
      TData = GetPersonaSectionsQuery,
      TError = unknown
    >(
      variables: GetPersonaSectionsQueryVariables,
      options?: Omit<UseQueryOptions<GetPersonaSectionsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetPersonaSectionsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetPersonaSectionsQuery, TError, TData>(
      {
    queryKey: ['GetPersonaSections', variables],
    queryFn: axiosRequest<GetPersonaSectionsQuery, GetPersonaSectionsQueryVariables>(GetPersonaSectionsDocument).bind(null, variables),
    ...options
  }
    )};

useGetPersonaSectionsQuery.getKey = (variables: GetPersonaSectionsQueryVariables) => ['GetPersonaSections', variables];

export const GetPinPersonaSectionsDocument = `
    query GetPinPersonaSections($getPersonaSectionsInput: GetPersonaSectionsInput!) {
  getPersonaSections(getPersonaSectionsInput: $getPersonaSectionsInput) {
    id
    w
    h
    x
    y
    i
    key
    color
    content
    isPinned
    isHidden
  }
}
    `;

export const useGetPinPersonaSectionsQuery = <
      TData = GetPinPersonaSectionsQuery,
      TError = unknown
    >(
      variables: GetPinPersonaSectionsQueryVariables,
      options?: Omit<UseQueryOptions<GetPinPersonaSectionsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetPinPersonaSectionsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetPinPersonaSectionsQuery, TError, TData>(
      {
    queryKey: ['GetPinPersonaSections', variables],
    queryFn: axiosRequest<GetPinPersonaSectionsQuery, GetPinPersonaSectionsQueryVariables>(GetPinPersonaSectionsDocument).bind(null, variables),
    ...options
  }
    )};

useGetPinPersonaSectionsQuery.getKey = (variables: GetPinPersonaSectionsQueryVariables) => ['GetPinPersonaSections', variables];
