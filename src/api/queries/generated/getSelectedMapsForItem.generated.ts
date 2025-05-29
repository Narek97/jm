import * as Types from '../../types';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type GetSelectedMapsForItemQueryVariables = Types.Exact<{
  getSelectedMapsForItemInput: Types.GetSelectedMapsForItemInput;
}>;

export type GetSelectedMapsForItemQuery = {
  __typename?: 'Query';
  getSelectedMapsForItem: {
    __typename?: 'GetSelectedMapsForItemModel';
    maps: Array<{
      __typename?: 'ItemMapForGetSelectedMapsForItemModel';
      id: number;
      boardId: number;
      title?: string | null;
    }>;
  };
};

export const GetSelectedMapsForItemDocument = `
    query GetSelectedMapsForItem($getSelectedMapsForItemInput: GetSelectedMapsForItemInput!) {
  getSelectedMapsForItem(
    getSelectedMapsForItemInput: $getSelectedMapsForItemInput
  ) {
    maps {
      id
      boardId
      title
    }
  }
}
    `;

export const useGetSelectedMapsForItemQuery = <
  TData = GetSelectedMapsForItemQuery,
  TError = unknown,
>(
  variables: GetSelectedMapsForItemQueryVariables,
  options?: Omit<UseQueryOptions<GetSelectedMapsForItemQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<GetSelectedMapsForItemQuery, TError, TData>['queryKey'];
  },
) => {
  return useQuery<GetSelectedMapsForItemQuery, TError, TData>({
    queryKey: ['GetSelectedMapsForItem', variables],
    queryFn: axiosRequest<GetSelectedMapsForItemQuery, GetSelectedMapsForItemQueryVariables>(
      GetSelectedMapsForItemDocument,
    ).bind(null, variables),
    ...options,
  });
};

useGetSelectedMapsForItemQuery.getKey = (variables: GetSelectedMapsForItemQueryVariables) => [
  'GetSelectedMapsForItem',
  variables,
];
