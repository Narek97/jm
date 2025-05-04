import * as Types from "../../types";

import {
  useQuery,
  useInfiniteQuery,
  UseQueryOptions,
  UseInfiniteQueryOptions,
  InfiniteData,
} from "@tanstack/react-query";
import { axiosRequest } from "../../axios";
export type GetMapsQueryVariables = Types.Exact<{
  getMapsInput: Types.GetMapsInput;
}>;

export type GetMapsQuery = {
  __typename?: "Query";
  getMaps: {
    __typename?: "GetMapsModel";
    count?: number | null;
    maps: Array<{
      __typename?: "Map";
      title?: string | null;
      id: number;
      type: string;
      boardId: number;
      createdAt: any;
      updatedAt: any;
      selectedPersonas: Array<{
        __typename?: "personas";
        type: string;
        name: string;
        color?: string | null;
        id: number;
        attachment?: {
          __typename?: "Attachment";
          url: string;
          key: string;
          croppedArea?: {
            __typename?: "Position";
            width?: number | null;
            height?: number | null;
            x?: number | null;
            y?: number | null;
          } | null;
        } | null;
      }>;
    }>;
  };
};

export const GetMapsDocument = `
    query GetMaps($getMapsInput: GetMapsInput!) {
  getMaps(getMapsInput: $getMapsInput) {
    count
    maps {
      title
      id
      type
      boardId
      createdAt
      updatedAt
      selectedPersonas {
        attachment {
          url
          key
          croppedArea {
            width
            height
            x
            y
          }
        }
        type
        name
        color
        id
      }
    }
  }
}
    `;

export const useGetMapsQuery = <TData = GetMapsQuery, TError = unknown>(
  variables: GetMapsQueryVariables,
  options?: Omit<UseQueryOptions<GetMapsQuery, TError, TData>, "queryKey"> & {
    queryKey?: UseQueryOptions<GetMapsQuery, TError, TData>["queryKey"];
  },
) => {
  return useQuery<GetMapsQuery, TError, TData>({
    queryKey: ["GetMaps", variables],
    queryFn: axiosRequest<GetMapsQuery, GetMapsQueryVariables>(
      GetMapsDocument,
    ).bind(null, variables),
    ...options,
  });
};

useGetMapsQuery.getKey = (variables: GetMapsQueryVariables) => [
  "GetMaps",
  variables,
];

export const useInfiniteGetMapsQuery = <
  TData = InfiniteData<GetMapsQuery>,
  TError = unknown,
>(
  variables: GetMapsQueryVariables,
  options: Omit<
    UseInfiniteQueryOptions<GetMapsQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseInfiniteQueryOptions<GetMapsQuery, TError, TData>["queryKey"];
  },
) => {
  const query = axiosRequest<GetMapsQuery, GetMapsQueryVariables>(
    GetMapsDocument,
  );
  return useInfiniteQuery<GetMapsQuery, TError, TData>(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? ["GetMaps.infinite", variables],
        queryFn: (metaData) =>
          query({ ...variables, ...(metaData.pageParam ?? {}) }),
        ...restOptions,
      };
    })(),
  );
};

useInfiniteGetMapsQuery.getKey = (variables: GetMapsQueryVariables) => [
  "GetMaps.infinite",
  variables,
];
