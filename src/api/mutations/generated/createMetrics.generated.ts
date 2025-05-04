import * as Types from "../../types";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { axiosRequest } from "../../axios";
export type CreateMetricsMutationVariables = Types.Exact<{
  createMetricsInput: Types.CreateMetricsInput;
  createDataPointsInput?: Types.InputMaybe<Types.CreateDataPointsInput>;
  createCustomMetricsInput?: Types.InputMaybe<Types.CreateCustomMetricsInput>;
}>;

export type CreateMetricsMutation = {
  __typename?: "Mutation";
  createMetrics: {
    __typename?: "MetricsResponse";
    id: number;
    rowId: number;
    columnId: number;
    name: string;
    commentsCount: number;
    descriptionEnabled: boolean;
    description?: string | null;
    type: Types.MetricsTypeEnum;
    value?: number | null;
    goal?: number | null;
    typeData?: any | null;
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

export const CreateMetricsDocument = `
    mutation CreateMetrics($createMetricsInput: CreateMetricsInput!, $createDataPointsInput: CreateDataPointsInput, $createCustomMetricsInput: CreateCustomMetricsInput) {
  createMetrics(
    createMetricsInput: $createMetricsInput
    createDataPointsInput: $createDataPointsInput
    createCustomMetricsInput: $createCustomMetricsInput
  ) {
    id
    id
    rowId
    columnId
    name
    commentsCount
    descriptionEnabled
    description
    type
    value
    goal
    typeData
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

export const useCreateMetricsMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    CreateMetricsMutation,
    TError,
    CreateMetricsMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    CreateMetricsMutation,
    TError,
    CreateMetricsMutationVariables,
    TContext
  >({
    mutationKey: ["CreateMetrics"],
    mutationFn: axiosRequest<
      CreateMetricsMutation,
      CreateMetricsMutationVariables
    >(CreateMetricsDocument),
    ...options,
  });
};

useCreateMetricsMutation.getKey = () => ["CreateMetrics"];
