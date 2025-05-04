import * as Types from "../../types";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { axiosRequest } from "../../axios";
export type GetInterviewsByWorkspaceIdQueryVariables = Types.Exact<{
  getInterviewsInput: Types.GetInterviewsInput;
}>;

export type GetInterviewsByWorkspaceIdQuery = {
  __typename?: "Query";
  getInterviewsByWorkspaceId: {
    __typename?: "GetBoardInterviewsModel";
    count?: number | null;
    offset: number;
    limit: number;
    interviews: Array<{
      __typename?: "Interview";
      id: number;
      boardId: number;
      name: string;
      aiJourneyModelId?: number | null;
      text: string;
      mapId: number;
      createdAt: any;
      updatedAt: any;
    }>;
  };
};

export const GetInterviewsByWorkspaceIdDocument = `
    query GetInterviewsByWorkspaceId($getInterviewsInput: GetInterviewsInput!) {
  getInterviewsByWorkspaceId(getInterviewsInput: $getInterviewsInput) {
    count
    offset
    limit
    interviews {
      id
      boardId
      name
      aiJourneyModelId
      text
      mapId
      createdAt
      updatedAt
    }
  }
}
    `;

export const useGetInterviewsByWorkspaceIdQuery = <
  TData = GetInterviewsByWorkspaceIdQuery,
  TError = unknown,
>(
  variables: GetInterviewsByWorkspaceIdQueryVariables,
  options?: Omit<
    UseQueryOptions<GetInterviewsByWorkspaceIdQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseQueryOptions<
      GetInterviewsByWorkspaceIdQuery,
      TError,
      TData
    >["queryKey"];
  },
) => {
  return useQuery<GetInterviewsByWorkspaceIdQuery, TError, TData>({
    queryKey: ["GetInterviewsByWorkspaceId", variables],
    queryFn: axiosRequest<
      GetInterviewsByWorkspaceIdQuery,
      GetInterviewsByWorkspaceIdQueryVariables
    >(GetInterviewsByWorkspaceIdDocument).bind(null, variables),
    ...options,
  });
};

useGetInterviewsByWorkspaceIdQuery.getKey = (
  variables: GetInterviewsByWorkspaceIdQueryVariables,
) => ["GetInterviewsByWorkspaceId", variables];
