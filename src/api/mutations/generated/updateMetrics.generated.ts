import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type UpdateMetricsMutationVariables = Types.Exact<{
  updateMetricsInput: Types.UpdateMetricsInput;
  updateDataPointsInput?: Types.InputMaybe<Types.UpdateDataPointsInput>;
  updateCustomMetricsInput?: Types.InputMaybe<Types.UpdateCustomMetricsInput>;
}>;

export type UpdateMetricsMutation = {
  __typename?: 'Mutation';
  updateMetrics: {
    __typename?: 'MetricsResponse';
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
      __typename?: 'personas';
      id: number;
      name: string;
      type: string;
      attachment?: {
        __typename?: 'Attachment';
        url: string;
        key: string;
      } | null;
    } | null;
  };
};

export const UpdateMetricsDocument = `
    mutation UpdateMetrics($updateMetricsInput: UpdateMetricsInput!, $updateDataPointsInput: UpdateDataPointsInput, $updateCustomMetricsInput: UpdateCustomMetricsInput) {
  updateMetrics(
    updateMetricsInput: $updateMetricsInput
    updateDataPointsInput: $updateDataPointsInput
    updateCustomMetricsInput: $updateCustomMetricsInput
  ) {
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

export const useUpdateMetricsMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    UpdateMetricsMutation,
    TError,
    UpdateMetricsMutationVariables,
    TContext
  >,
) => {
  return useMutation<UpdateMetricsMutation, TError, UpdateMetricsMutationVariables, TContext>({
    mutationKey: ['UpdateMetrics'],
    mutationFn: axiosRequest<UpdateMetricsMutation, UpdateMetricsMutationVariables>(
      UpdateMetricsDocument,
    ),
    ...options,
  });
};

useUpdateMetricsMutation.getKey = () => ['UpdateMetrics'];
