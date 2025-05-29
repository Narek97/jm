import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type PinDemographicInfoMutationVariables = Types.Exact<{
  pinDemographicInfoInput: Types.PinInput;
}>;

export type PinDemographicInfoMutation = {
  __typename?: 'Mutation';
  pinDemographicInfo: number;
};

export const PinDemographicInfoDocument = `
    mutation PinDemographicInfo($pinDemographicInfoInput: PinInput!) {
  pinDemographicInfo(pinDemographicInfoInput: $pinDemographicInfoInput)
}
    `;

export const usePinDemographicInfoMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    PinDemographicInfoMutation,
    TError,
    PinDemographicInfoMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    PinDemographicInfoMutation,
    TError,
    PinDemographicInfoMutationVariables,
    TContext
  >({
    mutationKey: ['PinDemographicInfo'],
    mutationFn: axiosRequest<PinDemographicInfoMutation, PinDemographicInfoMutationVariables>(
      PinDemographicInfoDocument,
    ),
    ...options,
  });
};

usePinDemographicInfoMutation.getKey = () => ['PinDemographicInfo'];
