import * as Types from "../../types";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { axiosRequest } from "../../axios";
export type GetJourneyMapQueryVariables = Types.Exact<{
  getJourneyMapInput: Types.GetJourneyMapInput;
}>;

export type GetJourneyMapQuery = {
  __typename?: "Query";
  getJourneyMap: {
    __typename?: "GetJourneyMapResponse";
    map: {
      __typename?: "Map";
      title?: string | null;
      boardId: number;
      rowCount: number;
      columnCount: number;
    };
    columns: Array<{
      __typename?: "MapColumn";
      id: number;
      bgColor: string;
      label?: string | null;
      size: number;
      isMerged: boolean;
      isNextColumnMerged: boolean;
    }>;
  };
};

export const GetJourneyMapDocument = `
    query GetJourneyMap($getJourneyMapInput: GetJourneyMapInput!) {
  getJourneyMap(getJourneyMapInput: $getJourneyMapInput) {
    map {
      title
      boardId
      rowCount
      columnCount
    }
    columns {
      id
      bgColor
      label
      size
      isMerged
      isNextColumnMerged
    }
  }
}
    `;

export const useGetJourneyMapQuery = <
  TData = GetJourneyMapQuery,
  TError = unknown,
>(
  variables: GetJourneyMapQueryVariables,
  options?: Omit<
    UseQueryOptions<GetJourneyMapQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseQueryOptions<GetJourneyMapQuery, TError, TData>["queryKey"];
  },
) => {
  return useQuery<GetJourneyMapQuery, TError, TData>({
    queryKey: ["GetJourneyMap", variables],
    queryFn: axiosRequest<GetJourneyMapQuery, GetJourneyMapQueryVariables>(
      GetJourneyMapDocument,
    ).bind(null, variables),
    ...options,
  });
};

useGetJourneyMapQuery.getKey = (variables: GetJourneyMapQueryVariables) => [
  "GetJourneyMap",
  variables,
];
