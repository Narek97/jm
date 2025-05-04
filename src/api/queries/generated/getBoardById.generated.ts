import * as Types from "../../types";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { axiosRequest } from "../../axios";
export type GetBoardByIdQueryVariables = Types.Exact<{
  id: Types.Scalars["Int"]["input"];
}>;

export type GetBoardByIdQuery = {
  __typename?: "Query";
  getBoardById: {
    __typename?: "Board";
    id: number;
    name: string;
    description?: string | null;
    defaultMapId?: number | null;
    createdAt: any;
    workspace: {
      __typename?: "Workspace";
      id: number;
      feedbackId: number;
      name: string;
      journeyMapCount: number;
      personasCount: number;
    };
  };
};

export const GetBoardByIdDocument = `
    query GetBoardById($id: Int!) {
  getBoardById(id: $id) {
    id
    name
    description
    defaultMapId
    createdAt
    workspace {
      id
      feedbackId
      name
      journeyMapCount
      personasCount
    }
  }
}
    `;

export const useGetBoardByIdQuery = <
  TData = GetBoardByIdQuery,
  TError = unknown,
>(
  variables: GetBoardByIdQueryVariables,
  options?: Omit<
    UseQueryOptions<GetBoardByIdQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseQueryOptions<GetBoardByIdQuery, TError, TData>["queryKey"];
  },
) => {
  return useQuery<GetBoardByIdQuery, TError, TData>({
    queryKey: ["GetBoardById", variables],
    queryFn: axiosRequest<GetBoardByIdQuery, GetBoardByIdQueryVariables>(
      GetBoardByIdDocument,
    ).bind(null, variables),
    ...options,
  });
};

useGetBoardByIdQuery.getKey = (variables: GetBoardByIdQueryVariables) => [
  "GetBoardById",
  variables,
];
