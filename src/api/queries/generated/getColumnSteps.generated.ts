import * as Types from "../../types";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { axiosRequest } from "../../axios";
export type GetColumnStepsQueryVariables = Types.Exact<{
  columnId: Types.Scalars["Int"]["input"];
}>;

export type GetColumnStepsQuery = {
  __typename?: "Query";
  getColumnSteps: Array<{
    __typename?: "ColumnStep";
    id: number;
    columnId: number;
    name: string;
  }>;
};

export const GetColumnStepsDocument = `
    query GetColumnSteps($columnId: Int!) {
  getColumnSteps(columnId: $columnId) {
    id
    columnId
    name
  }
}
    `;

export const useGetColumnStepsQuery = <
  TData = GetColumnStepsQuery,
  TError = unknown,
>(
  variables: GetColumnStepsQueryVariables,
  options?: Omit<
    UseQueryOptions<GetColumnStepsQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseQueryOptions<GetColumnStepsQuery, TError, TData>["queryKey"];
  },
) => {
  return useQuery<GetColumnStepsQuery, TError, TData>({
    queryKey: ["GetColumnSteps", variables],
    queryFn: axiosRequest<GetColumnStepsQuery, GetColumnStepsQueryVariables>(
      GetColumnStepsDocument,
    ).bind(null, variables),
    ...options,
  });
};

useGetColumnStepsQuery.getKey = (variables: GetColumnStepsQueryVariables) => [
  "GetColumnSteps",
  variables,
];
