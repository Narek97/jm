import * as Types from "../../types";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { axiosRequest } from "../../axios";
export type GetPersonaGroupsModelQueryVariables = Types.Exact<{
  getPersonaGroupsInput: Types.GetPersonaGroupsInput;
}>;

export type GetPersonaGroupsModelQuery = {
  __typename?: "Query";
  getPersonaGroups: {
    __typename?: "GetPersonaGroupsModel";
    personaGroups: Array<{
      __typename?: "PersonaGroupModel";
      id: number;
      name: string;
    }>;
  };
};

export const GetPersonaGroupsModelDocument = `
    query GetPersonaGroupsModel($getPersonaGroupsInput: GetPersonaGroupsInput!) {
  getPersonaGroups(getPersonaGroupsInput: $getPersonaGroupsInput) {
    personaGroups {
      id
      name
    }
  }
}
    `;

export const useGetPersonaGroupsModelQuery = <
  TData = GetPersonaGroupsModelQuery,
  TError = unknown,
>(
  variables: GetPersonaGroupsModelQueryVariables,
  options?: Omit<
    UseQueryOptions<GetPersonaGroupsModelQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseQueryOptions<
      GetPersonaGroupsModelQuery,
      TError,
      TData
    >["queryKey"];
  },
) => {
  return useQuery<GetPersonaGroupsModelQuery, TError, TData>({
    queryKey: ["GetPersonaGroupsModel", variables],
    queryFn: axiosRequest<
      GetPersonaGroupsModelQuery,
      GetPersonaGroupsModelQueryVariables
    >(GetPersonaGroupsModelDocument).bind(null, variables),
    ...options,
  });
};

useGetPersonaGroupsModelQuery.getKey = (
  variables: GetPersonaGroupsModelQueryVariables,
) => ["GetPersonaGroupsModel", variables];
