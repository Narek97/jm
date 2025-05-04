import * as Types from "../../types";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { axiosRequest } from "../../axios";
export type UpdateWhiteboardMutationVariables = Types.Exact<{
  updateWhiteboardInput: Types.UpdateWhiteboardInput;
}>;

export type UpdateWhiteboardMutation = {
  __typename?: "Mutation";
  updateWhiteboard: {
    __typename?: "Whiteboard";
    id: number;
    canvasId?: number | null;
    isLocked: boolean;
    helpLink?: string | null;
    name: string;
    folderId: number;
  };
};

export const UpdateWhiteboardDocument = `
    mutation UpdateWhiteboard($updateWhiteboardInput: UpdateWhiteboardInput!) {
  updateWhiteboard(updateWhiteboardInput: $updateWhiteboardInput) {
    id
    canvasId
    isLocked
    helpLink
    name
    folderId
  }
}
    `;

export const useUpdateWhiteboardMutation = <
  TError = unknown,
  TContext = unknown,
>(
  options?: UseMutationOptions<
    UpdateWhiteboardMutation,
    TError,
    UpdateWhiteboardMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    UpdateWhiteboardMutation,
    TError,
    UpdateWhiteboardMutationVariables,
    TContext
  >({
    mutationKey: ["UpdateWhiteboard"],
    mutationFn: axiosRequest<
      UpdateWhiteboardMutation,
      UpdateWhiteboardMutationVariables
    >(UpdateWhiteboardDocument),
    ...options,
  });
};

useUpdateWhiteboardMutation.getKey = () => ["UpdateWhiteboard"];
