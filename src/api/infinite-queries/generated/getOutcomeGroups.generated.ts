import * as Types from "../../types";

import {
  useQuery,
  useInfiniteQuery,
  UseQueryOptions,
  UseInfiniteQueryOptions,
  InfiniteData,
} from "@tanstack/react-query";
import { axiosRequest } from "../../axios";
export type GetOutcomeGroupsQueryVariables = Types.Exact<{
  getOutcomeGroupsInput: Types.GetOutcomeGroupsInput;
}>;

export type GetOutcomeGroupsQuery = {
  __typename?: "Query";
  getOutcomeGroups: {
    __typename?: "GetOutcomeGroupModel";
    count?: number | null;
    outcomeGroups: Array<{
      __typename?: "OutcomeGroup";
      name: string;
      pluralName: string;
      id: number;
      createdAt: any;
      icon: string;
      isDefault: boolean;
      user?: {
        __typename?: "Member";
        firstName: string;
        lastName: string;
      } | null;
    }>;
  };
};

export const GetOutcomeGroupsDocument = `
    query GetOutcomeGroups($getOutcomeGroupsInput: GetOutcomeGroupsInput!) {
  getOutcomeGroups(getOutcomeGroupsInput: $getOutcomeGroupsInput) {
    outcomeGroups {
      name
      pluralName
      id
      createdAt
      icon
      isDefault
      user {
        firstName
        lastName
      }
    }
    count
  }
}
    `;

export const useGetOutcomeGroupsQuery = <
  TData = GetOutcomeGroupsQuery,
  TError = unknown,
>(
  variables: GetOutcomeGroupsQueryVariables,
  options?: Omit<
    UseQueryOptions<GetOutcomeGroupsQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseQueryOptions<
      GetOutcomeGroupsQuery,
      TError,
      TData
    >["queryKey"];
  },
) => {
  return useQuery<GetOutcomeGroupsQuery, TError, TData>({
    queryKey: ["GetOutcomeGroups", variables],
    queryFn: axiosRequest<
      GetOutcomeGroupsQuery,
      GetOutcomeGroupsQueryVariables
    >(GetOutcomeGroupsDocument).bind(null, variables),
    ...options,
  });
};

useGetOutcomeGroupsQuery.getKey = (
  variables: GetOutcomeGroupsQueryVariables,
) => ["GetOutcomeGroups", variables];

export const useInfiniteGetOutcomeGroupsQuery = <
  TData = InfiniteData<GetOutcomeGroupsQuery>,
  TError = unknown,
>(
  variables: GetOutcomeGroupsQueryVariables,
  options: Omit<
    UseInfiniteQueryOptions<GetOutcomeGroupsQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseInfiniteQueryOptions<
      GetOutcomeGroupsQuery,
      TError,
      TData
    >["queryKey"];
  },
) => {
  const query = axiosRequest<
    GetOutcomeGroupsQuery,
    GetOutcomeGroupsQueryVariables
  >(GetOutcomeGroupsDocument);
  return useInfiniteQuery<GetOutcomeGroupsQuery, TError, TData>(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? ["GetOutcomeGroups.infinite", variables],
        queryFn: (metaData) =>
          query({ ...variables, ...(metaData.pageParam ?? {}) }),
        ...restOptions,
      };
    })(),
  );
};

useInfiniteGetOutcomeGroupsQuery.getKey = (
  variables: GetOutcomeGroupsQueryVariables,
) => ["GetOutcomeGroups.infinite", variables];
