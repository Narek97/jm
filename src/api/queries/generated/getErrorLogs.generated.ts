import * as Types from "../../types";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { axiosRequest } from "../../axios";
export type GetErrorLogsQueryVariables = Types.Exact<{
  paginationInput: Types.PaginationInput;
}>;

export type GetErrorLogsQuery = {
  __typename?: "Query";
  getErrorLogs: {
    __typename?: "GetErrorLogModel";
    count?: number | null;
    errorLogs: Array<{
      __typename?: "ErrorLog";
      createdAt: any;
      updatedAt: any;
      id: number;
      status: number;
      message: string;
      type: string;
      path: string;
    }>;
  };
};

export const GetErrorLogsDocument = `
    query GetErrorLogs($paginationInput: PaginationInput!) {
  getErrorLogs(paginationInput: $paginationInput) {
    count
    errorLogs {
      createdAt
      updatedAt
      id
      status
      message
      type
      path
    }
  }
}
    `;

export const useGetErrorLogsQuery = <
  TData = GetErrorLogsQuery,
  TError = unknown,
>(
  variables: GetErrorLogsQueryVariables,
  options?: Omit<
    UseQueryOptions<GetErrorLogsQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseQueryOptions<GetErrorLogsQuery, TError, TData>["queryKey"];
  },
) => {
  return useQuery<GetErrorLogsQuery, TError, TData>({
    queryKey: ["GetErrorLogs", variables],
    queryFn: axiosRequest<GetErrorLogsQuery, GetErrorLogsQueryVariables>(
      GetErrorLogsDocument,
    ).bind(null, variables),
    ...options,
  });
};

useGetErrorLogsQuery.getKey = (variables: GetErrorLogsQueryVariables) => [
  "GetErrorLogs",
  variables,
];
