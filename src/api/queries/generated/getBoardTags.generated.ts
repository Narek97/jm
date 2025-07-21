import * as Types from '../../types';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type GetBoardTagsQueryVariables = Types.Exact<{
  getBoardTagsInput: Types.GetBoardTagsInput;
}>;

export type GetBoardTagsQuery = {
  __typename?: 'Query';
  getBoardTags: {
    __typename?: 'GetBoardsTagsModel';
    count?: number | null;
    tags: Array<{
      __typename?: 'GetCardAttachedTagsModel';
      color: string;
      id: number;
      name: string;
    }>;
  };
};

export const GetBoardTagsDocument = `
    query GetBoardTags($getBoardTagsInput: GetBoardTagsInput!) {
  getBoardTags(getBoardTagsInput: $getBoardTagsInput) {
    count
    tags {
      color
      id
      name
    }
  }
}
    `;

export const useGetBoardTagsQuery = <TData = GetBoardTagsQuery, TError = unknown>(
  variables: GetBoardTagsQueryVariables,
  options?: Omit<UseQueryOptions<GetBoardTagsQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<GetBoardTagsQuery, TError, TData>['queryKey'];
  },
) => {
  return useQuery<GetBoardTagsQuery, TError, TData>({
    queryKey: ['GetBoardTags', variables],
    queryFn: axiosRequest<GetBoardTagsQuery, GetBoardTagsQueryVariables>(GetBoardTagsDocument).bind(
      null,
      variables,
    ),
    ...options,
  });
};

useGetBoardTagsQuery.getKey = (variables: GetBoardTagsQueryVariables) => [
  'GetBoardTags',
  variables,
];
