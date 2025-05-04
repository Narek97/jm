import * as Types from "../../types";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { axiosRequest } from "../../axios";
export type UpdateMapLinkMutationVariables = Types.Exact<{
  editLinkInput: Types.EditLinkInput;
}>;

export type UpdateMapLinkMutation = {
  __typename?: "Mutation";
  editLink: {
    __typename?: "LinkResponse";
    id: number;
    title?: string | null;
    type: Types.LinkTypeEnum;
    url?: string | null;
    icon?: string | null;
    index: number;
    commentsCount: number;
    linkedJourneyMapId?: number | null;
    flippedText?: string | null;
    rowId: number;
    mapPersonaImages?: Array<{
      __typename?: "PersonaUrlObject";
      color?: string | null;
      key?: string | null;
      url?: string | null;
    }> | null;
    personaImage?: {
      __typename?: "PersonaUrlObject";
      key?: string | null;
      url?: string | null;
    } | null;
  };
};

export const UpdateMapLinkDocument = `
    mutation UpdateMapLink($editLinkInput: EditLinkInput!) {
  editLink(editLinkInput: $editLinkInput) {
    id
    title
    type
    url
    icon
    index
    commentsCount
    linkedJourneyMapId
    flippedText
    rowId
    mapPersonaImages {
      color
      key
      url
    }
    personaImage {
      key
      url
    }
  }
}
    `;

export const useUpdateMapLinkMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    UpdateMapLinkMutation,
    TError,
    UpdateMapLinkMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    UpdateMapLinkMutation,
    TError,
    UpdateMapLinkMutationVariables,
    TContext
  >({
    mutationKey: ["UpdateMapLink"],
    mutationFn: axiosRequest<
      UpdateMapLinkMutation,
      UpdateMapLinkMutationVariables
    >(UpdateMapLinkDocument),
    ...options,
  });
};

useUpdateMapLinkMutation.getKey = () => ["UpdateMapLink"];
