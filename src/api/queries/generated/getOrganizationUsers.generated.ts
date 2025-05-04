import * as Types from "../../types";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
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
      id: number;
      userId: number;
      lastName: string;
      firstName: string;
      emailAddress: string;
      updatedAt: any;
      createdAt: any;
    }>;
  };
};

export const GetOrganizationUsersDocument = `
    query GetOrganizationUsers($paginationInput: QuestionProPaginationInput!) {
  getOrganizationUsers(paginationInput: $paginationInput) {
    users {
      id
      userId
      lastName
      firstName
      emailAddress
      updatedAt
      createdAt
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
