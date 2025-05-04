import * as Types from "../../types";

import {
  useQuery,
  useInfiniteQuery,
  UseQueryOptions,
  UseInfiniteQueryOptions,
  InfiniteData,
} from "@tanstack/react-query";
import { axiosRequest } from "../../axios";
export type GetItemCommentsQueryVariables = Types.Exact<{
  getItemCommentsInput: Types.GetItemCommentsInput;
}>;

export type GetItemCommentsQuery = {
  __typename?: "Query";
  getItemComments: {
    __typename?: "GetItemCommentsModel";
    limit: number;
    offset: number;
    count?: number | null;
    comments: Array<{
      __typename?: "Comment";
      text: string;
      itemId: number;
      id: number;
      updatedAt: any;
      owner: {
        __typename?: "Member";
        id: number;
        userId: number;
        color: string;
        emailAddress: string;
        firstName: string;
        lastName: string;
      };
      replies: Array<{
        __typename?: "Comment";
        text: string;
        itemId: number;
        id: number;
        updatedAt: any;
        owner: {
          __typename?: "Member";
          id: number;
          userId: number;
          color: string;
          emailAddress: string;
          firstName: string;
          lastName: string;
        };
      }>;
    }>;
  };
};

export const GetItemCommentsDocument = `
    query GetItemComments($getItemCommentsInput: GetItemCommentsInput!) {
  getItemComments(getItemCommentsInput: $getItemCommentsInput) {
    limit
    offset
    count
    comments {
      text
      owner {
        id
        userId
        color
        emailAddress
        firstName
        lastName
      }
      replies {
        text
        owner {
          id
          userId
          color
          emailAddress
          firstName
          lastName
        }
        itemId
        id
        updatedAt
      }
      itemId
      id
      updatedAt
    }
  }
}
    `;

export const useGetItemCommentsQuery = <
  TData = GetItemCommentsQuery,
  TError = unknown,
>(
  variables: GetItemCommentsQueryVariables,
  options?: Omit<
    UseQueryOptions<GetItemCommentsQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseQueryOptions<GetItemCommentsQuery, TError, TData>["queryKey"];
  },
) => {
  return useQuery<GetItemCommentsQuery, TError, TData>({
    queryKey: ["GetItemComments", variables],
    queryFn: axiosRequest<GetItemCommentsQuery, GetItemCommentsQueryVariables>(
      GetItemCommentsDocument,
    ).bind(null, variables),
    ...options,
  });
};

useGetItemCommentsQuery.getKey = (variables: GetItemCommentsQueryVariables) => [
  "GetItemComments",
  variables,
];

export const useInfiniteGetItemCommentsQuery = <
  TData = InfiniteData<GetItemCommentsQuery>,
  TError = unknown,
>(
  variables: GetItemCommentsQueryVariables,
  options: Omit<
    UseInfiniteQueryOptions<GetItemCommentsQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseInfiniteQueryOptions<
      GetItemCommentsQuery,
      TError,
      TData
    >["queryKey"];
  },
) => {
  const query = axiosRequest<
    GetItemCommentsQuery,
    GetItemCommentsQueryVariables
  >(GetItemCommentsDocument);
  return useInfiniteQuery<GetItemCommentsQuery, TError, TData>(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? ["GetItemComments.infinite", variables],
        queryFn: (metaData) =>
          query({ ...variables, ...(metaData.pageParam ?? {}) }),
        ...restOptions,
      };
    })(),
  );
};

useInfiniteGetItemCommentsQuery.getKey = (
  variables: GetItemCommentsQueryVariables,
) => ["GetItemComments.infinite", variables];
