import * as Types from "../../types";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { axiosRequest } from "../../axios";
export type DeletePerformanceMutationVariables = Types.Exact<{
  [key: string]: never;
}>;

export type DeletePerformanceMutation = {
  __typename?: "Mutation";
  deletePerformanceLogs: number;
};

export const DeletePerformanceDocument = `
    mutation DeletePerformance {
  deletePerformanceLogs
}
    `;

export const useDeletePerformanceMutation = <
  TError = unknown,
  TContext = unknown,
>(
  options?: UseMutationOptions<
    DeletePerformanceMutation,
    TError,
    DeletePerformanceMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    DeletePerformanceMutation,
    TError,
    DeletePerformanceMutationVariables,
    TContext
  >({
    mutationKey: ["DeletePerformance"],
    mutationFn: axiosRequest<
      DeletePerformanceMutation,
      DeletePerformanceMutationVariables
    >(DeletePerformanceDocument),
    ...options,
  });
};

useDeletePerformanceMutation.getKey = () => ["DeletePerformance"];
