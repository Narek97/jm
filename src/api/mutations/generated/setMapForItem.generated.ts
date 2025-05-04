import * as Types from "../../types";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { axiosRequest } from "../../axios";
export type SetMapForItemMutationVariables = Types.Exact<{
  setMapForItemInput: Types.SetMapForItemInput;
}>;

export type SetMapForItemMutation = {
  __typename?: "Mutation";
  setMapForItem: { __typename?: "SuccessTypeModel"; success: boolean };
};

export const SetMapForItemDocument = `
    mutation SetMapForItem($setMapForItemInput: SetMapForItemInput!) {
  setMapForItem(setMapForItemInput: $setMapForItemInput) {
    success
  }
}
    `;

export const useSetMapForItemMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    SetMapForItemMutation,
    TError,
    SetMapForItemMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    SetMapForItemMutation,
    TError,
    SetMapForItemMutationVariables,
    TContext
  >({
    mutationKey: ["SetMapForItem"],
    mutationFn: axiosRequest<
      SetMapForItemMutation,
      SetMapForItemMutationVariables
    >(SetMapForItemDocument),
    ...options,
  });
};

useSetMapForItemMutation.getKey = () => ["SetMapForItem"];
