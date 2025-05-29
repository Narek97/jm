import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type RetrieveMetricsDataMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
  previous: Types.Scalars['Boolean']['input'];
}>;

export type RetrieveMetricsDataMutation = {
  __typename?: 'Mutation';
  retrieveMetricsData: {
    __typename?: 'Metrics';
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
      __typename?: 'personas';
      id: number;
      name: string;
      type: string;
      attachment?: { __typename?: 'Attachment'; url: string; key: string } | null;
    } | null;
  };
};

export const RetrieveMetricsDataDocument = `
    mutation RetrieveMetricsData($id: Int!, $previous: Boolean!) {
  retrieveMetricsData(id: $id, previous: $previous) {
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

export const useRetrieveMetricsDataMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    RetrieveMetricsDataMutation,
    TError,
    RetrieveMetricsDataMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    RetrieveMetricsDataMutation,
    TError,
    RetrieveMetricsDataMutationVariables,
    TContext
  >({
    mutationKey: ['RetrieveMetricsData'],
    mutationFn: axiosRequest<RetrieveMetricsDataMutation, RetrieveMetricsDataMutationVariables>(
      RetrieveMetricsDataDocument,
    ),
    ...options,
  });
};

useRetrieveMetricsDataMutation.getKey = () => ['RetrieveMetricsData'];
