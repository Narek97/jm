import * as Types from '../../types';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type GetBoardsForItemQueryVariables = Types.Exact<{
  getBoardsForItemInput: Types.GetBoardsForItemInput;
}>;

export type GetBoardsForItemQuery = {
  __typename?: 'Query';
  getBoardsForItem: {
    __typename?: 'GetBoardsForItemModel';
    boards: Array<{
      __typename?: 'ItemBoardForGetBoardsForItemModel';
      id: number;
      name: string;
      maps: Array<{
        __typename?: 'ItemMapForGetBoardsForItemModel';
        id: number;
        title?: string | null;
        selected: boolean;
      }>;
    }>;
  };
};

export const GetBoardsForItemDocument = `
    query GetBoardsForItem($getBoardsForItemInput: GetBoardsForItemInput!) {
  getBoardsForItem(getBoardsForItemInput: $getBoardsForItemInput) {
    boards {
      id
      name
      maps {
        id
        title
        selected
      }
    }
  }
}
    `;

export const useGetBoardsForItemQuery = <TData = GetBoardsForItemQuery, TError = unknown>(
  variables: GetBoardsForItemQueryVariables,
  options?: Omit<UseQueryOptions<GetBoardsForItemQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<GetBoardsForItemQuery, TError, TData>['queryKey'];
  },
) => {
  return useQuery<GetBoardsForItemQuery, TError, TData>({
    queryKey: ['GetBoardsForItem', variables],
    queryFn: axiosRequest<GetBoardsForItemQuery, GetBoardsForItemQueryVariables>(
      GetBoardsForItemDocument,
    ).bind(null, variables),
    ...options,
  });
};

useGetBoardsForItemQuery.getKey = (variables: GetBoardsForItemQueryVariables) => [
  'GetBoardsForItem',
  variables,
];
