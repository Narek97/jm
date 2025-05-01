import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type CreateDefaultDemographicInfoFieldsMutationVariables = Types.Exact<{
  createDefaultDemographicInfoFieldsInput: Types.CreateDefaultDemographicInfoFieldsInput;
}>;


export type CreateDefaultDemographicInfoFieldsMutation = { __typename?: 'Mutation', createDefaultDemographicInfoFields: Array<{ __typename?: 'DemographicInfo', id: number, key: string, personaId: number, value?: string | null, type: Types.DemographicInfoTypeEnum, isHidden: boolean, isDefault: boolean }> };



export const CreateDefaultDemographicInfoFieldsDocument = `
    mutation CreateDefaultDemographicInfoFields($createDefaultDemographicInfoFieldsInput: CreateDefaultDemographicInfoFieldsInput!) {
  createDefaultDemographicInfoFields(
    createDefaultDemographicInfoFieldsInput: $createDefaultDemographicInfoFieldsInput
  ) {
    id
    key
    personaId
    value
    type
    isHidden
    isDefault
  }
}
    `;

export const useCreateDefaultDemographicInfoFieldsMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateDefaultDemographicInfoFieldsMutation, TError, CreateDefaultDemographicInfoFieldsMutationVariables, TContext>) => {
    
    return useMutation<CreateDefaultDemographicInfoFieldsMutation, TError, CreateDefaultDemographicInfoFieldsMutationVariables, TContext>(
      {
    mutationKey: ['CreateDefaultDemographicInfoFields'],
    mutationFn: axiosRequest<CreateDefaultDemographicInfoFieldsMutation, CreateDefaultDemographicInfoFieldsMutationVariables>(CreateDefaultDemographicInfoFieldsDocument),
    ...options
  }
    )};

useCreateDefaultDemographicInfoFieldsMutation.getKey = () => ['CreateDefaultDemographicInfoFields'];
