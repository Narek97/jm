import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type CreateJourneyMapRowMutationVariables = Types.Exact<{
  createRowInput: Types.CreateRowInput;
}>;

export type CreateJourneyMapRowMutation = {
  __typename?: 'Mutation';
  createJourneyMapRow: {
    __typename?: 'CreateRowResponseModel';
    boxesWithElements: Array<{
      __typename?: 'BoxWithElements';
      id?: number | null;
      columnId: number;
      average: number;
      mergeCount: number;
      boxTextElement?: { __typename?: 'BoxElement'; id: number } | null;
      boxElements: Array<{ __typename?: 'BoxElement'; id: number }>;
      touchPoints: Array<{ __typename?: 'TouchPoint'; id: number }>;
      outcomes: Array<{ __typename?: 'OutcomeResponse'; id: number }>;
      metrics: Array<{ __typename?: 'MetricsResponse'; id: number }>;
      links: Array<{ __typename?: 'LinkResponse'; id: number }>;
      step?: {
        __typename?: 'ColumnStep';
        id: number;
        name: string;
        index: number;
        columnId: number;
      } | null;
    }>;
    row: {
      __typename?: 'MapRow';
      id: number;
      index: number;
      isPersonaAverageDisabled: boolean;
      label?: string | null;
      mapId: number;
      rowFunction?: Types.MapRowTypeEnum | null;
      size: number;
      outcomeGroup?: {
        __typename?: 'OutcomeGroup';
        id: number;
        icon: string;
        name: string;
        pluralName: string;
      } | null;
    };
  };
};

export const CreateJourneyMapRowDocument = `
    mutation CreateJourneyMapRow($createRowInput: CreateRowInput!) {
  createJourneyMapRow(createRowInput: $createRowInput) {
    boxesWithElements {
      id
      columnId
      average
      mergeCount
      boxTextElement {
        id
      }
      boxElements {
        id
      }
      touchPoints {
        id
      }
      outcomes {
        id
      }
      metrics {
        id
      }
      links {
        id
      }
      mergeCount
      step {
        id
        name
        index
        columnId
      }
    }
    row {
      id
      index
      isPersonaAverageDisabled
      label
      mapId
      rowFunction
      size
      outcomeGroup {
        id
        icon
        name
        pluralName
      }
    }
  }
}
    `;

export const useCreateJourneyMapRowMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    CreateJourneyMapRowMutation,
    TError,
    CreateJourneyMapRowMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    CreateJourneyMapRowMutation,
    TError,
    CreateJourneyMapRowMutationVariables,
    TContext
  >({
    mutationKey: ['CreateJourneyMapRow'],
    mutationFn: axiosRequest<CreateJourneyMapRowMutation, CreateJourneyMapRowMutationVariables>(
      CreateJourneyMapRowDocument,
    ),
    ...options,
  });
};

useCreateJourneyMapRowMutation.getKey = () => ['CreateJourneyMapRow'];
