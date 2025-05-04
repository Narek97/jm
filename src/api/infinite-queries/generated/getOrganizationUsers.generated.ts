import * as Types from "../../types";

import {
  useQuery,
  useInfiniteQuery,
  UseQueryOptions,
  UseInfiniteQueryOptions,
  InfiniteData,
} from "@tanstack/react-query";
import { axiosRequest } from "../../axios";
export type GetOrganizationUsersQueryVariables = Types.Exact<{
  paginationInput: Types.QuestionProPaginationInput;
}>;

export type GetOrganizationUsersQuery = {
  __typename?: "Query";
  getOrganizationUsers: {
    __typename?: "GetQuestionProUsersModel";
    count: number;
    users: Array<{
      __typename?: "Member";
      userId: number;
      firstName: string;
      lastName: string;
      isShared?: boolean | null;
      emailAddress: string;
    }>;
  };
};

export const GetOrganizationUsersDocument = `
    query GetOrganizationUsers($paginationInput: QuestionProPaginationInput!) {
  getOrganizationUsers(paginationInput: $paginationInput) {
    users {
      userId
      firstName
      lastName
      isShared
      emailAddress
    }
    count
  }
}
    `;

export const useGetOrganizationUsersQuery = <
  TData = GetOrganizationUsersQuery,
  TError = unknown,
>(
  variables: GetOrganizationUsersQueryVariables,
  options?: Omit<
    UseQueryOptions<GetOrganizationUsersQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseQueryOptions<
      GetOrganizationUsersQuery,
      TError,
      TData
    >["queryKey"];
  },
) => {
  return useQuery<GetOrganizationUsersQuery, TError, TData>({
    queryKey: ["GetOrganizationUsers", variables],
    queryFn: axiosRequest<
      GetOrganizationUsersQuery,
      GetOrganizationUsersQueryVariables
    >(GetOrganizationUsersDocument).bind(null, variables),
    ...options,
  });
};

useGetOrganizationUsersQuery.getKey = (
  variables: GetOrganizationUsersQueryVariables,
) => ["GetOrganizationUsers", variables];

export const useInfiniteGetOrganizationUsersQuery = <
  TData = InfiniteData<GetOrganizationUsersQuery>,
  TError = unknown,
>(
  variables: GetOrganizationUsersQueryVariables,
  options: Omit<
    UseInfiniteQueryOptions<GetOrganizationUsersQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseInfiniteQueryOptions<
      GetOrganizationUsersQuery,
      TError,
      TData
    >["queryKey"];
  },
) => {
  const query = axiosRequest<
    GetOrganizationUsersQuery,
    GetOrganizationUsersQueryVariables
  >(GetOrganizationUsersDocument);
  return useInfiniteQuery<GetOrganizationUsersQuery, TError, TData>(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? [
          "GetOrganizationUsers.infinite",
          variables,
        ],
        queryFn: (metaData) =>
          query({ ...variables, ...(metaData.pageParam ?? {}) }),
        ...restOptions,
      };
    })(),
  );
};

useInfiniteGetOrganizationUsersQuery.getKey = (
  variables: GetOrganizationUsersQueryVariables,
) => ["GetOrganizationUsers.infinite", variables];
