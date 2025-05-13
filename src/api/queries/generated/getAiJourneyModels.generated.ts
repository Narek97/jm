import * as Types from '../../types';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type GetAiJourneyModelsQueryVariables = Types.Exact<{
  getAiJourneyModelsInput: Types.GetAiJourneyModelsInput;
}>;


export type GetAiJourneyModelsQuery = { __typename?: 'Query', getAiJourneyModels: { __typename?: 'GetAiJourneyModelsResponse', count?: number | null, aiJourneyModels: Array<{ __typename?: 'AiJourneyModelResponse', id: number, attachmentUrl?: string | null, name?: string | null, prompt: string, universal: boolean, selectedOrgIds: Array<number>, transcriptPlace: number }> } };



export const GetAiJourneyModelsDocument = `
    query GetAiJourneyModels($getAiJourneyModelsInput: GetAiJourneyModelsInput!) {
  getAiJourneyModels(getAiJourneyModelsInput: $getAiJourneyModelsInput) {
    count
    aiJourneyModels {
      id
      attachmentUrl
      name
      prompt
      universal
      selectedOrgIds
      transcriptPlace
    }
  }
}
    `;

export const useGetAiJourneyModelsQuery = <
      TData = GetAiJourneyModelsQuery,
      TError = unknown
    >(
      variables: GetAiJourneyModelsQueryVariables,
      options?: Omit<UseQueryOptions<GetAiJourneyModelsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetAiJourneyModelsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetAiJourneyModelsQuery, TError, TData>(
      {
    queryKey: ['GetAiJourneyModels', variables],
    queryFn: axiosRequest<GetAiJourneyModelsQuery, GetAiJourneyModelsQueryVariables>(GetAiJourneyModelsDocument).bind(null, variables),
    ...options
  }
    )};

useGetAiJourneyModelsQuery.getKey = (variables: GetAiJourneyModelsQueryVariables) => ['GetAiJourneyModels', variables];
