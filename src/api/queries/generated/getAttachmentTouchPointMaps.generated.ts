import * as Types from '../../types';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type GetAttachmentTouchPointMapsQueryVariables = Types.Exact<{
  getAttachmentTouchPointMapsInput: Types.GetAttachmentTouchPointMapsInput;
}>;

export type GetAttachmentTouchPointMapsQuery = {
  __typename?: 'Query';
  getAttachmentTouchPointMaps: {
    __typename?: 'Attachment';
    id: number;
    name?: string | null;
    touchpoints: Array<{
      __typename?: 'TouchPoint';
      id: number;
      title?: string | null;
      map: {
        __typename?: 'Map';
        id: number;
        boardId: number;
        title?: string | null;
      };
    }>;
  };
};

export const GetAttachmentTouchPointMapsDocument = `
    query GetAttachmentTouchPointMaps($getAttachmentTouchPointMapsInput: GetAttachmentTouchPointMapsInput!) {
  getAttachmentTouchPointMaps(
    getAttachmentTouchPointMapsInput: $getAttachmentTouchPointMapsInput
  ) {
    id
    name
    touchpoints {
      id
      title
      map {
        id
        boardId
        title
      }
    }
  }
}
    `;

export const useGetAttachmentTouchPointMapsQuery = <
  TData = GetAttachmentTouchPointMapsQuery,
  TError = unknown,
>(
  variables: GetAttachmentTouchPointMapsQueryVariables,
  options?: Omit<UseQueryOptions<GetAttachmentTouchPointMapsQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<GetAttachmentTouchPointMapsQuery, TError, TData>['queryKey'];
  },
) => {
  return useQuery<GetAttachmentTouchPointMapsQuery, TError, TData>({
    queryKey: ['GetAttachmentTouchPointMaps', variables],
    queryFn: axiosRequest<
      GetAttachmentTouchPointMapsQuery,
      GetAttachmentTouchPointMapsQueryVariables
    >(GetAttachmentTouchPointMapsDocument).bind(null, variables),
    ...options,
  });
};

useGetAttachmentTouchPointMapsQuery.getKey = (
  variables: GetAttachmentTouchPointMapsQueryVariables,
) => ['GetAttachmentTouchPointMaps', variables];
