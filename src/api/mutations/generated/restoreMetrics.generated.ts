import * as Types from "../../types";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { axiosRequest } from "../../axios";
export type RestoreMetricsMutationVariables = Types.Exact<{
  id: Types.Scalars["Int"]["input"];
}>;

export type RestoreMetricsMutation = {
  __typename?: "Mutation";
  restoreMetrics: {
    __typename?: "Metrics";
    rowId: number;
    columnId: number;
    id: number;
    name: string;
    commentsCount: number;
    descriptionEnabled: boolean;
    description?: string | null;
    type: Types.MetricsTypeEnum;
    value?: number | null;
    goal?: number | null;
    flippedText?: string | null;
    surveyId?: number | null;
    questionId?: number | null;
    source: Types.MetricsSourceEnum;
    startDate?: any | null;
    endDate?: any | null;
    dateRange?: Types.MetricsDateRangeEnum | null;
    overall: number;
    nps: number;
    csat: number;
    ces: number;
    x: number;
    y: number;
    z: number;
    persona?: {
      __typename?: "personas";
      id: number;
      name: string;
      type: string;
      attachment?: {
        __typename?: "Attachment";
        url: string;
        key: string;
      } | null;
    } | null;
  };
};

export const RestoreMetricsDocument = `
    mutation RestoreMetrics($id: Int!) {
  restoreMetrics(id: $id) {
    rowId
    columnId
    id
    name
    commentsCount
    descriptionEnabled
    description
    type
    value
    goal
    flippedText
    surveyId
    questionId
    source
    startDate
    endDate
    dateRange
    overall
    nps
    csat
    ces
    x
    y
    z
    persona {
      id
      name
      type
      attachment {
        url
        key
      }
    }
  }
}
    `;

export const useRestoreMetricsMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    RestoreMetricsMutation,
    TError,
    RestoreMetricsMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    RestoreMetricsMutation,
    TError,
    RestoreMetricsMutationVariables,
    TContext
  >({
    mutationKey: ["RestoreMetrics"],
    mutationFn: axiosRequest<
      RestoreMetricsMutation,
      RestoreMetricsMutationVariables
    >(RestoreMetricsDocument),
    ...options,
  });
};

useRestoreMetricsMutation.getKey = () => ["RestoreMetrics"];
