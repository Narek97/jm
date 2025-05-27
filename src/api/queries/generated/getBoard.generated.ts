import * as Types from '../../types';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type GetWhiteboardQueryVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;

export type GetWhiteboardQuery = {
  __typename?: 'Query';
  getWhiteboard: {
    __typename?: 'GetWhiteboardModel';
    id: number;
    name: string;
    ownerId: number;
    canvasId?: number | null;
    isLocked: boolean;
    sharingPolicy: Types.SharingPolicyEnum;
    type: Types.WhiteboardTypeEnum;
    helpLink?: string | null;
    folderId: number;
  };
};

export const GetWhiteboardDocument = `
    query GetWhiteboard($id: Int!) {
  getWhiteboard(id: $id) {
    id
    name
    ownerId
    canvasId
    isLocked
    sharingPolicy
    type
    helpLink
    folderId
  }
}
    `;

export const useGetWhiteboardQuery = <TData = GetWhiteboardQuery, TError = unknown>(
  variables: GetWhiteboardQueryVariables,
  options?: Omit<UseQueryOptions<GetWhiteboardQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<GetWhiteboardQuery, TError, TData>['queryKey'];
  },
) => {
  return useQuery<GetWhiteboardQuery, TError, TData>({
    queryKey: ['GetWhiteboard', variables],
    queryFn: axiosRequest<GetWhiteboardQuery, GetWhiteboardQueryVariables>(
      GetWhiteboardDocument,
    ).bind(null, variables),
    ...options,
  });
};

useGetWhiteboardQuery.getKey = (variables: GetWhiteboardQueryVariables) => [
  'GetWhiteboard',
  variables,
];
