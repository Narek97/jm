import * as Types from "../../types";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { axiosRequest } from "../../axios";
export type GetAllPinnedBoardsQueryVariables = Types.Exact<{
  outcomeGroupId: Types.Scalars["Int"]["input"];
}>;

export type GetAllPinnedBoardsQuery = {
  __typename?: "Query";
  getAllPinnedBoards: Array<number>;
};

export const GetAllPinnedBoardsDocument = `
    query GetAllPinnedBoards($outcomeGroupId: Int!) {
  getAllPinnedBoards(outcomeGroupId: $outcomeGroupId)
}
    `;

export const useGetAllPinnedBoardsQuery = <
  TData = GetAllPinnedBoardsQuery,
  TError = unknown,
>(
  variables: GetAllPinnedBoardsQueryVariables,
  options?: Omit<
    UseQueryOptions<GetAllPinnedBoardsQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseQueryOptions<
      GetAllPinnedBoardsQuery,
      TError,
      TData
    >["queryKey"];
  },
) => {
  return useQuery<GetAllPinnedBoardsQuery, TError, TData>({
    queryKey: ["GetAllPinnedBoards", variables],
    queryFn: axiosRequest<
      GetAllPinnedBoardsQuery,
      GetAllPinnedBoardsQueryVariables
    >(GetAllPinnedBoardsDocument).bind(null, variables),
    ...options,
  });
};

useGetAllPinnedBoardsQuery.getKey = (
  variables: GetAllPinnedBoardsQueryVariables,
) => ["GetAllPinnedBoards", variables];
