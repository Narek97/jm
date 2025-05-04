import * as Types from "../../types";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { axiosRequest } from "../../axios";
export type GetMapOutcomeGroupsForRowCreationQueryVariables = Types.Exact<{
  mapId: Types.Scalars["Int"]["input"];
}>;

export type GetMapOutcomeGroupsForRowCreationQuery = {
  __typename?: "Query";
  getMapOutcomeGroupsForRowCreation: Array<{
    __typename?: "OutcomeGroup";
    id: number;
    name: string;
    pluralName: string;
    icon: string;
  }>;
};

export const GetMapOutcomeGroupsForRowCreationDocument = `
    query GetMapOutcomeGroupsForRowCreation($mapId: Int!) {
  getMapOutcomeGroupsForRowCreation(mapId: $mapId) {
    id
    name
    pluralName
    icon
  }
}
    `;

export const useGetMapOutcomeGroupsForRowCreationQuery = <
  TData = GetMapOutcomeGroupsForRowCreationQuery,
  TError = unknown,
>(
  variables: GetMapOutcomeGroupsForRowCreationQueryVariables,
  options?: Omit<
    UseQueryOptions<GetMapOutcomeGroupsForRowCreationQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseQueryOptions<
      GetMapOutcomeGroupsForRowCreationQuery,
      TError,
      TData
    >["queryKey"];
  },
) => {
  return useQuery<GetMapOutcomeGroupsForRowCreationQuery, TError, TData>({
    queryKey: ["GetMapOutcomeGroupsForRowCreation", variables],
    queryFn: axiosRequest<
      GetMapOutcomeGroupsForRowCreationQuery,
      GetMapOutcomeGroupsForRowCreationQueryVariables
    >(GetMapOutcomeGroupsForRowCreationDocument).bind(null, variables),
    ...options,
  });
};

useGetMapOutcomeGroupsForRowCreationQuery.getKey = (
  variables: GetMapOutcomeGroupsForRowCreationQueryVariables,
) => ["GetMapOutcomeGroupsForRowCreation", variables];
