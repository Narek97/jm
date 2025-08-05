import * as Types from '../../types';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type GetParentMapsByBoardIdQueryVariables = Types.Exact<{
  getParentMapByBoardIdInput: Types.GetParentMapByBoardIdInput;
}>;

export type GetParentMapsByBoardIdQuery = {
  __typename?: 'Query';
  getParentMapsByBoardId: {
    __typename?: 'GetParentMapsByBoardIdModel';
    count?: number | null;
    maps: Array<{
      __typename?: 'Map';
      title?: string | null;
      id: number;
      type: Types.MapTypeEnum;
      createdAt: any;
      updatedAt: any;
      owner: { __typename?: 'Member'; firstName: string; lastName: string; emailAddress: string };
    }>;
  };
};

export const GetParentMapsByBoardIdDocument = `
    query GetParentMapsByBoardId($getParentMapByBoardIdInput: GetParentMapByBoardIdInput!) {
  getParentMapsByBoardId(getParentMapByBoardIdInput: $getParentMapByBoardIdInput) {
    count
    maps {
      title
      id
      type
      createdAt
      updatedAt
      owner {
        firstName
        lastName
        emailAddress
      }
    }
  }
}
    `;

export const useGetParentMapsByBoardIdQuery = <
  TData = GetParentMapsByBoardIdQuery,
  TError = unknown,
>(
  variables: GetParentMapsByBoardIdQueryVariables,
  options?: Omit<UseQueryOptions<GetParentMapsByBoardIdQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<GetParentMapsByBoardIdQuery, TError, TData>['queryKey'];
  },
) => {
  return useQuery<GetParentMapsByBoardIdQuery, TError, TData>({
    queryKey: ['GetParentMapsByBoardId', variables],
    queryFn: axiosRequest<GetParentMapsByBoardIdQuery, GetParentMapsByBoardIdQueryVariables>(
      GetParentMapsByBoardIdDocument,
    ).bind(null, variables),
    ...options,
  });
};

useGetParentMapsByBoardIdQuery.getKey = (variables: GetParentMapsByBoardIdQueryVariables) => [
  'GetParentMapsByBoardId',
  variables,
];
