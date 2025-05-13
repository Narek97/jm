import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type CreateMapLinkMutationVariables = Types.Exact<{
  addLinkInput: Types.AddLinkInput;
}>;


export type CreateMapLinkMutation = { __typename?: 'Mutation', addLink: { __typename?: 'LinkResponse', id: number, title?: string | null, type: Types.LinkTypeEnum, url?: string | null, icon?: string | null, index: number, commentsCount: number, linkedJourneyMapId?: number | null, linkedMapId?: number | null, flippedText?: string | null, rowId: number, mapPersonaImages?: Array<{ __typename?: 'PersonaUrlObject', color?: string | null, key?: string | null, url?: string | null }> | null, personaImage?: { __typename?: 'PersonaUrlObject', key?: string | null, url?: string | null } | null } };



export const CreateMapLinkDocument = `
    mutation CreateMapLink($addLinkInput: AddLinkInput!) {
  addLink(addLinkInput: $addLinkInput) {
    id
    title
    type
    url
    icon
    index
    commentsCount
    linkedJourneyMapId
    linkedMapId
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

export const useCreateMapLinkMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateMapLinkMutation, TError, CreateMapLinkMutationVariables, TContext>) => {
    
    return useMutation<CreateMapLinkMutation, TError, CreateMapLinkMutationVariables, TContext>(
      {
    mutationKey: ['CreateMapLink'],
    mutationFn: axiosRequest<CreateMapLinkMutation, CreateMapLinkMutationVariables>(CreateMapLinkDocument),
    ...options
  }
    )};

useCreateMapLinkMutation.getKey = () => ['CreateMapLink'];
