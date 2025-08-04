import * as Types from '../../types';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type GetItemNoteQueryVariables = Types.Exact<{
  getItemNoteInput: Types.GetItemNoteInput;
}>;


export type GetItemNoteQuery = { __typename?: 'Query', getItemNote: { __typename?: 'Note', text: string, id: number, updatedAt: any, itemId: number, owner: { __typename?: 'Member', color: string, emailAddress: string, firstName: string, lastName: string } } };



export const GetItemNoteDocument = `
    query GetItemNote($getItemNoteInput: GetItemNoteInput!) {
  getItemNote(getItemNoteInput: $getItemNoteInput) {
    text
    owner {
      color
      emailAddress
      firstName
      lastName
    }
    id
    updatedAt
    itemId
  }
}
    `;

export const useGetItemNoteQuery = <
      TData = GetItemNoteQuery,
      TError = unknown
    >(
      variables: GetItemNoteQueryVariables,
      options?: Omit<UseQueryOptions<GetItemNoteQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetItemNoteQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetItemNoteQuery, TError, TData>(
      {
    queryKey: ['GetItemNote', variables],
    queryFn: axiosRequest<GetItemNoteQuery, GetItemNoteQueryVariables>(GetItemNoteDocument).bind(null, variables),
    ...options
  }
    )};

useGetItemNoteQuery.getKey = (variables: GetItemNoteQueryVariables) => ['GetItemNote', variables];
