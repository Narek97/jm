import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type CreateDemographicInfoMutationVariables = Types.Exact<{
  createDemographicInfoInput: Types.CreateDemographicInfoInput;
}>;

export type CreateDemographicInfoMutation = {
  __typename?: 'Mutation';
  createDemographicInfo: {
    __typename?: 'DemographicInfo';
    id: number;
    key: string;
    value?: string | null;
    personaId: number;
    type: Types.DemographicInfoTypeEnum;
    isHidden: boolean;
  };
};

export const CreateDemographicInfoDocument = `
    mutation CreateDemographicInfo($createDemographicInfoInput: CreateDemographicInfoInput!) {
  createDemographicInfo(createDemographicInfoInput: $createDemographicInfoInput) {
    id
    key
    value
    personaId
    type
    isHidden
  }
}
    `;

export const useCreateDemographicInfoMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    CreateDemographicInfoMutation,
    TError,
    CreateDemographicInfoMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    CreateDemographicInfoMutation,
    TError,
    CreateDemographicInfoMutationVariables,
    TContext
  >({
    mutationKey: ['CreateDemographicInfo'],
    mutationFn: axiosRequest<CreateDemographicInfoMutation, CreateDemographicInfoMutationVariables>(
      CreateDemographicInfoDocument,
    ),
    ...options,
  });
};

useCreateDemographicInfoMutation.getKey = () => ['CreateDemographicInfo'];
