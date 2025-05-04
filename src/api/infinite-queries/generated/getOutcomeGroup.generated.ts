import * as Types from "../../types";

import {
  useQuery,
  useInfiniteQuery,
  UseQueryOptions,
  UseInfiniteQueryOptions,
  InfiniteData,
} from "@tanstack/react-query";
import { axiosRequest } from "../../axios";
export type GetOutcomeGroupQueryVariables = Types.Exact<{
  getOutcomeGroupInput: Types.GetOutcomeGroupInput;
  getOutcomesInput: Types.GetOutcomesInput;
}>;

export type GetOutcomeGroupQuery = {
  __typename?: "Query";
  getOutcomeGroup: {
    __typename?: "OutcomeGroup";
    id: number;
    name: string;
    pluralName: string;
    outcomesCount: number;
    outcomes: Array<{
      __typename?: "Outcome";
      id: number;
      title: string;
      description?: string | null;
      createdAt: any;
      status: Types.OutcomeStatusEnum;
      stepId?: number | null;
      columnId?: number | null;
      personaId?: number | null;
      row?: { __typename?: "MapRow"; label?: string | null } | null;
      column?: { __typename?: "MapColumn"; label?: string | null } | null;
      user?: {
        __typename?: "Member";
        firstName: string;
        lastName: string;
      } | null;
      map?: { __typename?: "Map"; id: number; title?: string | null } | null;
    }>;
  };
};

export const GetOutcomeGroupDocument = `
    query GetOutcomeGroup($getOutcomeGroupInput: GetOutcomeGroupInput!, $getOutcomesInput: GetOutcomesInput!) {
  getOutcomeGroup(getOutcomeGroupInput: $getOutcomeGroupInput) {
    id
    name
    pluralName
    outcomes(getOutcomesInput: $getOutcomesInput) {
      id
      title
      description
      createdAt
      status
      row {
        label
      }
      column {
        label
      }
      stepId
      columnId
      personaId
      user {
        firstName
        lastName
      }
      map {
        id
        title
      }
    }
    outcomesCount(list: OUTCOME_GROUP_LEVEL)
  }
}
    `;

export const useGetOutcomeGroupQuery = <
  TData = GetOutcomeGroupQuery,
  TError = unknown,
>(
  variables: GetOutcomeGroupQueryVariables,
  options?: Omit<
    UseQueryOptions<GetOutcomeGroupQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseQueryOptions<GetOutcomeGroupQuery, TError, TData>["queryKey"];
  },
) => {
  return useQuery<GetOutcomeGroupQuery, TError, TData>({
    queryKey: ["GetOutcomeGroup", variables],
    queryFn: axiosRequest<GetOutcomeGroupQuery, GetOutcomeGroupQueryVariables>(
      GetOutcomeGroupDocument,
    ).bind(null, variables),
    ...options,
  });
};

useGetOutcomeGroupQuery.getKey = (variables: GetOutcomeGroupQueryVariables) => [
  "GetOutcomeGroup",
  variables,
];

export const useInfiniteGetOutcomeGroupQuery = <
  TData = InfiniteData<GetOutcomeGroupQuery>,
  TError = unknown,
>(
  variables: GetOutcomeGroupQueryVariables,
  options: Omit<
    UseInfiniteQueryOptions<GetOutcomeGroupQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseInfiniteQueryOptions<
      GetOutcomeGroupQuery,
      TError,
      TData
    >["queryKey"];
  },
) => {
  const query = axiosRequest<
    GetOutcomeGroupQuery,
    GetOutcomeGroupQueryVariables
  >(GetOutcomeGroupDocument);
  return useInfiniteQuery<GetOutcomeGroupQuery, TError, TData>(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? ["GetOutcomeGroup.infinite", variables],
        queryFn: (metaData) =>
          query({ ...variables, ...(metaData.pageParam ?? {}) }),
        ...restOptions,
      };
    })(),
  );
};

useInfiniteGetOutcomeGroupQuery.getKey = (
  variables: GetOutcomeGroupQueryVariables,
) => ["GetOutcomeGroup.infinite", variables];
