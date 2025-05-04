import * as Types from "../../types";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { axiosRequest } from "../../axios";
export type GetCardAttachedTagsQueryVariables = Types.Exact<{
  cardId: Types.Scalars["Int"]["input"];
}>;

export type GetCardAttachedTagsQuery = {
  __typename?: "Query";
  getCardAttachedTags: Array<{
    __typename?: "GetCardAttachedTagsModel";
    id: number;
    name: string;
    color: string;
  }>;
};

export const GetCardAttachedTagsDocument = `
    query GetCardAttachedTags($cardId: Int!) {
  getCardAttachedTags(cardId: $cardId) {
    id
    name
    color
  }
}
    `;

export const useGetCardAttachedTagsQuery = <
  TData = GetCardAttachedTagsQuery,
  TError = unknown,
>(
  variables: GetCardAttachedTagsQueryVariables,
  options?: Omit<
    UseQueryOptions<GetCardAttachedTagsQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseQueryOptions<
      GetCardAttachedTagsQuery,
      TError,
      TData
    >["queryKey"];
  },
) => {
  return useQuery<GetCardAttachedTagsQuery, TError, TData>({
    queryKey: ["GetCardAttachedTags", variables],
    queryFn: axiosRequest<
      GetCardAttachedTagsQuery,
      GetCardAttachedTagsQueryVariables
    >(GetCardAttachedTagsDocument).bind(null, variables),
    ...options,
  });
};

useGetCardAttachedTagsQuery.getKey = (
  variables: GetCardAttachedTagsQueryVariables,
) => ["GetCardAttachedTags", variables];
