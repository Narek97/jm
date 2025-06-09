import * as Types from '../../types';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type BoardDataItemFragment = { __typename?: 'WhiteboardDataItem', id: number, zIndex?: number | null, parentId?: number | null, ownerId: number, file?: string | null, dummy: boolean, selected: boolean, selectedUserId?: number | null, data: any, selectedUser?: { __typename?: 'SelectedUser', isSelected: boolean, user: { __typename?: 'Member', userId: number, emailAddress: string } } | null };

export type GetWhiteboardDataItemsQueryVariables = Types.Exact<{
  getWhiteboardDataItemsInput: Types.GetWhiteboardDataItemsInput;
}>;


export type GetWhiteboardDataItemsQuery = { __typename?: 'Query', getWhiteboardDataItems: { __typename?: 'GetWhiteboardDataItemsModel', RECT: Array<{ __typename?: 'WhiteboardDataItem', id: number, zIndex?: number | null, parentId?: number | null, ownerId: number, file?: string | null, dummy: boolean, selected: boolean, selectedUserId?: number | null, data: any, selectedUser?: { __typename?: 'SelectedUser', isSelected: boolean, user: { __typename?: 'Member', userId: number, emailAddress: string } } | null }>, TRIANGLE: Array<{ __typename?: 'WhiteboardDataItem', id: number, zIndex?: number | null, parentId?: number | null, ownerId: number, file?: string | null, dummy: boolean, selected: boolean, selectedUserId?: number | null, data: any, selectedUser?: { __typename?: 'SelectedUser', isSelected: boolean, user: { __typename?: 'Member', userId: number, emailAddress: string } } | null }>, ELLIPSE: Array<{ __typename?: 'WhiteboardDataItem', id: number, zIndex?: number | null, parentId?: number | null, ownerId: number, file?: string | null, dummy: boolean, selected: boolean, selectedUserId?: number | null, data: any, selectedUser?: { __typename?: 'SelectedUser', isSelected: boolean, user: { __typename?: 'Member', userId: number, emailAddress: string } } | null }>, STAR: Array<{ __typename?: 'WhiteboardDataItem', id: number, zIndex?: number | null, parentId?: number | null, ownerId: number, file?: string | null, dummy: boolean, selected: boolean, selectedUserId?: number | null, data: any, selectedUser?: { __typename?: 'SelectedUser', isSelected: boolean, user: { __typename?: 'Member', userId: number, emailAddress: string } } | null }>, ROUND_RECT: Array<{ __typename?: 'WhiteboardDataItem', id: number, zIndex?: number | null, parentId?: number | null, ownerId: number, file?: string | null, dummy: boolean, selected: boolean, selectedUserId?: number | null, data: any, selectedUser?: { __typename?: 'SelectedUser', isSelected: boolean, user: { __typename?: 'Member', userId: number, emailAddress: string } } | null }>, GROUP: Array<{ __typename?: 'WhiteboardDataItem', id: number, zIndex?: number | null, parentId?: number | null, ownerId: number, file?: string | null, dummy: boolean, selected: boolean, selectedUserId?: number | null, data: any, selectedUser?: { __typename?: 'SelectedUser', isSelected: boolean, user: { __typename?: 'Member', userId: number, emailAddress: string } } | null }>, LINE: Array<{ __typename?: 'WhiteboardDataItem', id: number, zIndex?: number | null, parentId?: number | null, ownerId: number, file?: string | null, dummy: boolean, selected: boolean, selectedUserId?: number | null, data: any, selectedUser?: { __typename?: 'SelectedUser', isSelected: boolean, user: { __typename?: 'Member', userId: number, emailAddress: string } } | null }>, ICON: Array<{ __typename?: 'WhiteboardDataItem', id: number, zIndex?: number | null, parentId?: number | null, ownerId: number, file?: string | null, dummy: boolean, selected: boolean, selectedUserId?: number | null, data: any, selectedUser?: { __typename?: 'SelectedUser', isSelected: boolean, user: { __typename?: 'Member', userId: number, emailAddress: string } } | null }>, SMART: Array<{ __typename?: 'WhiteboardDataItem', id: number, zIndex?: number | null, parentId?: number | null, ownerId: number, file?: string | null, dummy: boolean, selected: boolean, selectedUserId?: number | null, data: any, selectedUser?: { __typename?: 'SelectedUser', isSelected: boolean, user: { __typename?: 'Member', userId: number, emailAddress: string } } | null }>, IMAGE: Array<{ __typename?: 'WhiteboardDataItem', uuid: string, id: number, zIndex?: number | null, parentId?: number | null, ownerId: number, file?: string | null, dummy: boolean, selected: boolean, selectedUserId?: number | null, data: any, selectedUser?: { __typename?: 'SelectedUser', isSelected: boolean, user: { __typename?: 'Member', userId: number, emailAddress: string } } | null }>, TEXT: Array<{ __typename?: 'WhiteboardDataItem', id: number, zIndex?: number | null, parentId?: number | null, ownerId: number, file?: string | null, dummy: boolean, selected: boolean, selectedUserId?: number | null, data: any, selectedUser?: { __typename?: 'SelectedUser', isSelected: boolean, user: { __typename?: 'Member', userId: number, emailAddress: string } } | null }>, LINK: Array<{ __typename?: 'WhiteboardDataItem', id: number, zIndex?: number | null, parentId?: number | null, ownerId: number, file?: string | null, dummy: boolean, selected: boolean, selectedUserId?: number | null, data: any, selectedUser?: { __typename?: 'SelectedUser', isSelected: boolean, user: { __typename?: 'Member', userId: number, emailAddress: string } } | null }>, DRAW: Array<{ __typename?: 'WhiteboardDataItem', id: number, zIndex?: number | null, parentId?: number | null, ownerId: number, file?: string | null, dummy: boolean, selected: boolean, selectedUserId?: number | null, data: any, selectedUser?: { __typename?: 'SelectedUser', isSelected: boolean, user: { __typename?: 'Member', userId: number, emailAddress: string } } | null }>, NOTE: Array<{ __typename?: 'WhiteboardDataItem', id: number, zIndex?: number | null, parentId?: number | null, ownerId: number, file?: string | null, dummy: boolean, selected: boolean, selectedUserId?: number | null, data: any, selectedUser?: { __typename?: 'SelectedUser', isSelected: boolean, user: { __typename?: 'Member', userId: number, emailAddress: string } } | null }>, DB: Array<{ __typename?: 'WhiteboardDataItem', id: number, zIndex?: number | null, parentId?: number | null, ownerId: number, file?: string | null, dummy: boolean, selected: boolean, selectedUserId?: number | null, data: any, selectedUser?: { __typename?: 'SelectedUser', isSelected: boolean, user: { __typename?: 'Member', userId: number, emailAddress: string } } | null }>, TOP_LEFT_CIRCLE: Array<{ __typename?: 'WhiteboardDataItem', id: number, zIndex?: number | null, parentId?: number | null, ownerId: number, file?: string | null, dummy: boolean, selected: boolean, selectedUserId?: number | null, data: any, selectedUser?: { __typename?: 'SelectedUser', isSelected: boolean, user: { __typename?: 'Member', userId: number, emailAddress: string } } | null }>, TOP_RIGHT_CIRCLE: Array<{ __typename?: 'WhiteboardDataItem', id: number, zIndex?: number | null, parentId?: number | null, ownerId: number, file?: string | null, dummy: boolean, selected: boolean, selectedUserId?: number | null, data: any, selectedUser?: { __typename?: 'SelectedUser', isSelected: boolean, user: { __typename?: 'Member', userId: number, emailAddress: string } } | null }>, BOTTOM_LEFT_CIRCLE: Array<{ __typename?: 'WhiteboardDataItem', id: number, zIndex?: number | null, parentId?: number | null, ownerId: number, file?: string | null, dummy: boolean, selected: boolean, selectedUserId?: number | null, data: any, selectedUser?: { __typename?: 'SelectedUser', isSelected: boolean, user: { __typename?: 'Member', userId: number, emailAddress: string } } | null }>, BOTTOM_RIGHT_CIRCLE: Array<{ __typename?: 'WhiteboardDataItem', id: number, zIndex?: number | null, parentId?: number | null, ownerId: number, file?: string | null, dummy: boolean, selected: boolean, selectedUserId?: number | null, data: any, selectedUser?: { __typename?: 'SelectedUser', isSelected: boolean, user: { __typename?: 'Member', userId: number, emailAddress: string } } | null }>, POINTER: Array<{ __typename?: 'WhiteboardDataItem', id: number, zIndex?: number | null, parentId?: number | null, ownerId: number, file?: string | null, dummy: boolean, selected: boolean, selectedUserId?: number | null, data: any, selectedUser?: { __typename?: 'SelectedUser', isSelected: boolean, user: { __typename?: 'Member', userId: number, emailAddress: string } } | null }>, CIRCLE: Array<{ __typename?: 'WhiteboardDataItem', id: number, zIndex?: number | null, parentId?: number | null, ownerId: number, file?: string | null, dummy: boolean, selected: boolean, selectedUserId?: number | null, data: any, selectedUser?: { __typename?: 'SelectedUser', isSelected: boolean, user: { __typename?: 'Member', userId: number, emailAddress: string } } | null }>, TOP_ELLIPSE: Array<{ __typename?: 'WhiteboardDataItem', id: number, zIndex?: number | null, parentId?: number | null, ownerId: number, file?: string | null, dummy: boolean, selected: boolean, selectedUserId?: number | null, data: any, selectedUser?: { __typename?: 'SelectedUser', isSelected: boolean, user: { __typename?: 'Member', userId: number, emailAddress: string } } | null }>, BOTTOM_ELLIPSE: Array<{ __typename?: 'WhiteboardDataItem', id: number, zIndex?: number | null, parentId?: number | null, ownerId: number, file?: string | null, dummy: boolean, selected: boolean, selectedUserId?: number | null, data: any, selectedUser?: { __typename?: 'SelectedUser', isSelected: boolean, user: { __typename?: 'Member', userId: number, emailAddress: string } } | null }> } };


export const BoardDataItemFragmentDoc = `
    fragment boardDataItem on WhiteboardDataItem {
  id
  zIndex
  parentId
  ownerId
  file
  dummy
  selected
  selectedUserId
  selectedUser {
    user {
      userId
      emailAddress
    }
    isSelected
  }
  data
}
    `;
export const GetWhiteboardDataItemsDocument = `
    query GetWhiteboardDataItems($getWhiteboardDataItemsInput: GetWhiteboardDataItemsInput!) {
  getWhiteboardDataItems(
    getWhiteboardDataItemsInput: $getWhiteboardDataItemsInput
  ) {
    RECT {
      ...boardDataItem
    }
    TRIANGLE {
      ...boardDataItem
    }
    ELLIPSE {
      ...boardDataItem
    }
    STAR {
      ...boardDataItem
    }
    ROUND_RECT {
      ...boardDataItem
    }
    GROUP {
      ...boardDataItem
    }
    LINE {
      ...boardDataItem
    }
    ICON {
      ...boardDataItem
    }
    SMART {
      ...boardDataItem
    }
    IMAGE {
      ...boardDataItem
      uuid
    }
    TEXT {
      ...boardDataItem
    }
    LINK {
      ...boardDataItem
    }
    DRAW {
      ...boardDataItem
    }
    NOTE {
      ...boardDataItem
    }
    LINE {
      ...boardDataItem
    }
    DB {
      ...boardDataItem
    }
    TOP_LEFT_CIRCLE {
      ...boardDataItem
    }
    TOP_RIGHT_CIRCLE {
      ...boardDataItem
    }
    BOTTOM_LEFT_CIRCLE {
      ...boardDataItem
    }
    BOTTOM_RIGHT_CIRCLE {
      ...boardDataItem
    }
    POINTER {
      ...boardDataItem
    }
    CIRCLE {
      ...boardDataItem
    }
    TOP_ELLIPSE {
      ...boardDataItem
    }
    BOTTOM_ELLIPSE {
      ...boardDataItem
    }
  }
}
    ${BoardDataItemFragmentDoc}`;

export const useGetWhiteboardDataItemsQuery = <
      TData = GetWhiteboardDataItemsQuery,
      TError = unknown
    >(
      variables: GetWhiteboardDataItemsQueryVariables,
      options?: Omit<UseQueryOptions<GetWhiteboardDataItemsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetWhiteboardDataItemsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetWhiteboardDataItemsQuery, TError, TData>(
      {
    queryKey: ['GetWhiteboardDataItems', variables],
    queryFn: axiosRequest<GetWhiteboardDataItemsQuery, GetWhiteboardDataItemsQueryVariables>(GetWhiteboardDataItemsDocument).bind(null, variables),
    ...options
  }
    )};

useGetWhiteboardDataItemsQuery.getKey = (variables: GetWhiteboardDataItemsQueryVariables) => ['GetWhiteboardDataItems', variables];
