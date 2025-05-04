import * as Types from "../../types";

import {
  useQuery,
  useInfiniteQuery,
  UseQueryOptions,
  UseInfiniteQueryOptions,
  InfiniteData,
} from "@tanstack/react-query";
import { axiosRequest } from "../../axios";
export type GetMapLogsQueryVariables = Types.Exact<{
  mapId: Types.Scalars["Int"]["input"];
  paginationInput: Types.PaginationInput;
}>;

export type GetMapLogsQuery = {
  __typename?: "Query";
  getMapLogs: {
    __typename?: "GetMapLogsModel";
    count?: number | null;
    mapLogs: Array<{
      __typename?: "MapLog";
      id: number;
      action: Types.ActionTypeEnum;
      subAction?: Types.SubActionTypeEnum | null;
      model: Types.LoggerTypeEnum;
      to?: any | null;
      from?: any | null;
      createdAt: any;
      updatedAt: any;
      member: {
        __typename?: "Member";
        id: number;
        firstName: string;
        lastName: string;
        emailAddress: string;
        color: string;
      };
    }>;
  };
};

export const GetMapLogsDocument = `
    query GetMapLogs($mapId: Int!, $paginationInput: PaginationInput!) {
  getMapLogs(mapId: $mapId, paginationInput: $paginationInput) {
    count
    mapLogs {
      id
      action
      subAction
      model
      to
      from
      createdAt
      updatedAt
      member {
        id
        firstName
        lastName
        emailAddress
        color
      }
    }
  }
}
    `;

export const useGetMapLogsQuery = <TData = GetMapLogsQuery, TError = unknown>(
  variables: GetMapLogsQueryVariables,
  options?: Omit<
    UseQueryOptions<GetMapLogsQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseQueryOptions<GetMapLogsQuery, TError, TData>["queryKey"];
  },
) => {
  return useQuery<GetMapLogsQuery, TError, TData>({
    queryKey: ["GetMapLogs", variables],
    queryFn: axiosRequest<GetMapLogsQuery, GetMapLogsQueryVariables>(
      GetMapLogsDocument,
    ).bind(null, variables),
    ...options,
  });
};

useGetMapLogsQuery.getKey = (variables: GetMapLogsQueryVariables) => [
  "GetMapLogs",
  variables,
];

export const useInfiniteGetMapLogsQuery = <
  TData = InfiniteData<GetMapLogsQuery>,
  TError = unknown,
>(
  variables: GetMapLogsQueryVariables,
  options: Omit<
    UseInfiniteQueryOptions<GetMapLogsQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseInfiniteQueryOptions<
      GetMapLogsQuery,
      TError,
      TData
    >["queryKey"];
  },
) => {
  const query = axiosRequest<GetMapLogsQuery, GetMapLogsQueryVariables>(
    GetMapLogsDocument,
  );
  return useInfiniteQuery<GetMapLogsQuery, TError, TData>(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? ["GetMapLogs.infinite", variables],
        queryFn: (metaData) =>
          query({ ...variables, ...(metaData.pageParam ?? {}) }),
        ...restOptions,
      };
    })(),
  );
};

useInfiniteGetMapLogsQuery.getKey = (variables: GetMapLogsQueryVariables) => [
  "GetMapLogs.infinite",
  variables,
];
