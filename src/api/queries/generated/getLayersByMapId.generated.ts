import * as Types from '../../types';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type GetLayersByMapIdQueryVariables = Types.Exact<{
  getLayersInput: Types.GetLayersInput;
}>;


export type GetLayersByMapIdQuery = { __typename?: 'Query', getLayersByMapId: { __typename?: 'GetLayersModel', layers: Array<{ __typename?: 'LayerResponseModel', columnIds?: Array<number> | null, columnSelectedStepIds: any, id: number, name: string, rowIds?: Array<number> | null, tagIds?: Array<number> | null }> } };



export const GetLayersByMapIdDocument = `
    query GetLayersByMapId($getLayersInput: GetLayersInput!) {
  getLayersByMapId(getLayersInput: $getLayersInput) {
    layers {
      columnIds
      columnSelectedStepIds
      id
      name
      rowIds
      tagIds
    }
  }
}
    `;

export const useGetLayersByMapIdQuery = <
      TData = GetLayersByMapIdQuery,
      TError = unknown
    >(
      variables: GetLayersByMapIdQueryVariables,
      options?: Omit<UseQueryOptions<GetLayersByMapIdQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetLayersByMapIdQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetLayersByMapIdQuery, TError, TData>(
      {
    queryKey: ['GetLayersByMapId', variables],
    queryFn: axiosRequest<GetLayersByMapIdQuery, GetLayersByMapIdQueryVariables>(GetLayersByMapIdDocument).bind(null, variables),
    ...options
  }
    )};

useGetLayersByMapIdQuery.getKey = (variables: GetLayersByMapIdQueryVariables) => ['GetLayersByMapId', variables];
