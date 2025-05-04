import * as Types from "../../types";

import {
  useQuery,
  useInfiniteQuery,
  UseQueryOptions,
  UseInfiniteQueryOptions,
  InfiniteData,
} from "@tanstack/react-query";
import { axiosRequest } from "../../axios";
export type GetWhiteboardsQueryVariables = Types.Exact<{
  getWhiteboardsInput: Types.GetWhiteboardsInput;
}>;

export type GetWhiteboardsQuery = {
  __typename?: "Query";
  getWhiteboards: {
    __typename?: "GetWhiteboardsModel";
    count?: number | null;
    whiteboards: Array<{
      __typename?: "Whiteboard";
      id: number;
      name: string;
      ownerId: number;
      canvasId?: number | null;
      isLocked: boolean;
      sharingPolicy: Types.SharingPolicyEnum;
      type: Types.WhiteboardTypeEnum;
      helpLink?: string | null;
      folderId: number;
    }>;
  };
};

export const GetWhiteboardsDocument = `
    query GetWhiteboards($getWhiteboardsInput: GetWhiteboardsInput!) {
  getWhiteboards(getWhiteboardsInput: $getWhiteboardsInput) {
    count
    whiteboards {
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
}
    `;

export const useGetWhiteboardsQuery = <
  TData = GetWhiteboardsQuery,
  TError = unknown,
>(
  variables: GetWhiteboardsQueryVariables,
  options?: Omit<
    UseQueryOptions<GetWhiteboardsQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseQueryOptions<GetWhiteboardsQuery, TError, TData>["queryKey"];
  },
) => {
  return useQuery<GetWhiteboardsQuery, TError, TData>({
    queryKey: ["GetWhiteboards", variables],
    queryFn: axiosRequest<GetWhiteboardsQuery, GetWhiteboardsQueryVariables>(
      GetWhiteboardsDocument,
    ).bind(null, variables),
    ...options,
  });
};

useGetWhiteboardsQuery.getKey = (variables: GetWhiteboardsQueryVariables) => [
  "GetWhiteboards",
  variables,
];

export const useInfiniteGetWhiteboardsQuery = <
  TData = InfiniteData<GetWhiteboardsQuery>,
  TError = unknown,
>(
  variables: GetWhiteboardsQueryVariables,
  options: Omit<
    UseInfiniteQueryOptions<GetWhiteboardsQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseInfiniteQueryOptions<
      GetWhiteboardsQuery,
      TError,
      TData
    >["queryKey"];
  },
) => {
  const query = axiosRequest<GetWhiteboardsQuery, GetWhiteboardsQueryVariables>(
    GetWhiteboardsDocument,
  );
  return useInfiniteQuery<GetWhiteboardsQuery, TError, TData>(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? ["GetWhiteboards.infinite", variables],
        queryFn: (metaData) =>
          query({ ...variables, ...(metaData.pageParam ?? {}) }),
        ...restOptions,
      };
    })(),
  );
};

useInfiniteGetWhiteboardsQuery.getKey = (
  variables: GetWhiteboardsQueryVariables,
) => ["GetWhiteboards.infinite", variables];
