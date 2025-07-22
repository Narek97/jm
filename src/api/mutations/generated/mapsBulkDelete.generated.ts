import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type MapsBulkDeleteMutationVariables = Types.Exact<{
  mapsBulkDeleteInput: Types.MapsBulkDeleteInput;
}>;

export type MapsBulkDeleteMutation = { __typename?: 'Mutation'; mapsBulkDelete: Array<number> };

export const MapsBulkDeleteDocument = `
    mutation MapsBulkDelete($mapsBulkDeleteInput: MapsBulkDeleteInput!) {
  mapsBulkDelete(mapsBulkDeleteInput: $mapsBulkDeleteInput)
}
    `;

export const useMapsBulkDeleteMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    MapsBulkDeleteMutation,
    TError,
    MapsBulkDeleteMutationVariables,
    TContext
  >,
) => {
  return useMutation<MapsBulkDeleteMutation, TError, MapsBulkDeleteMutationVariables, TContext>({
    mutationKey: ['MapsBulkDelete'],
    mutationFn: axiosRequest<MapsBulkDeleteMutation, MapsBulkDeleteMutationVariables>(
      MapsBulkDeleteDocument,
    ),
    ...options,
  });
};

useMapsBulkDeleteMutation.getKey = () => ['MapsBulkDelete'];
