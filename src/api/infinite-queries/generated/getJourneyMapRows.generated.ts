import * as Types from '../../types';

import { useQuery, useInfiniteQuery, UseQueryOptions, UseInfiniteQueryOptions, InfiniteData } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type GetJourneyMapRowsQueryVariables = Types.Exact<{
  getJourneyMapInput: Types.GetJourneyMapInput;
}>;


export type GetJourneyMapRowsQuery = { __typename?: 'Query', getJourneyMap: { __typename?: 'GetJourneyMapResponse', rowCount: number, rows: Array<{ __typename?: 'JourneyMapRow', id: number, isLocked: boolean, isCollapsed: boolean, isPersonaAverageDisabled: boolean, rowFunction?: Types.MapRowTypeEnum | null, label?: string | null, size: number, outcomeGroup?: { __typename?: 'OutcomeGroupResponse', id: number, icon: string, name: string, pluralName: string } | null, boxes?: Array<{ __typename?: 'BoxWithElements', id?: number | null, columnId: number, average: number, mergeCount: number, boxTextElement?: { __typename?: 'BoxElement', commentsCount: number, rowId: number, id: number, text?: string | null } | null, boxElements: Array<{ __typename?: 'BoxElement', commentsCount: number, rowId: number, id: number, attachmentId?: number | null, text?: string | null, flippedText?: string | null, digsiteUrl?: string | null, bgColor?: string | null, attachment?: { __typename?: 'Attachment', hasResizedVersions?: boolean | null, imgScaleType: Types.ImgScaleTypeEnum } | null, attachmentPosition?: { __typename?: 'Position', width?: number | null, height?: number | null, x?: number | null, y?: number | null } | null, note: { __typename?: 'Note', text: string }, persona?: { __typename?: 'personas', id: number, name: string, type: string, color?: string | null, attachment?: { __typename?: 'Attachment', url: string, key: string } | null } | null }>, touchPoints: Array<{ __typename?: 'TouchPoint', rowId: number, columnId: number, commentsCount: number, id: number, title?: string | null, iconUrl: string, flippedText?: string | null, bgColor?: string | null, persona?: { __typename?: 'personas', id: number, name: string, type: string, color?: string | null, attachment?: { __typename?: 'Attachment', url: string, key: string } | null } | null }>, outcomes: Array<{ __typename?: 'OutcomeResponse', id: number, title: string, description?: string | null, createdAt: any, status: Types.OutcomeStatusEnum, rowId?: number | null, columnId?: number | null, stepId?: number | null, personaId?: number | null, commentsCount: number, flippedText?: string | null, outcomeGroupId: number, icon?: string | null, bgColor?: string | null, persona?: { __typename?: 'personas', id: number, name: string, type: string, color?: string | null, attachment?: { __typename?: 'Attachment', url: string, key: string, croppedArea?: { __typename?: 'Position', width?: number | null, height?: number | null, x?: number | null, y?: number | null } | null } | null } | null }>, metrics: Array<{ __typename?: 'MetricsResponse', rowId: number, columnId: number, id: number, name: string, commentsCount: number, descriptionEnabled: boolean, description?: string | null, type: Types.MetricsTypeEnum, value?: number | null, goal?: number | null, typeData?: any | null, flippedText?: string | null, surveyId?: number | null, questionId?: number | null, source: Types.MetricsSourceEnum, startDate?: any | null, endDate?: any | null, dateRange?: Types.MetricsDateRangeEnum | null, overall: number, nps: number, csat: number, ces: number, x: number, y: number, z: number, persona?: { __typename?: 'personas', id: number, name: string, type: string, color?: string | null, attachment?: { __typename?: 'Attachment', url: string, key: string, croppedArea?: { __typename?: 'Position', width?: number | null, height?: number | null, x?: number | null, y?: number | null } | null } | null } | null }>, links: Array<{ __typename?: 'LinkResponse', id: number, title?: string | null, type: Types.LinkTypeEnum, url?: string | null, icon?: string | null, index: number, commentsCount: number, linkedJourneyMapId?: number | null, linkedMapId?: number | null, flippedText?: string | null, rowId: number, bgColor?: string | null, mapPersonaImages?: Array<{ __typename?: 'PersonaUrlObject', color?: string | null, key?: string | null, url?: string | null }> | null, personaImage?: { __typename?: 'PersonaUrlObject', key?: string | null, url?: string | null, color?: string | null } | null }>, step?: { __typename?: 'ColumnStep', id: number, name: string, index: number, columnId: number, isMerged: boolean, bgColor?: string | null } | null }> | null, rowWithPersonas: Array<{ __typename?: 'RowWithPersonas', isDisabledForThisRow: boolean, type: string, id: number, name: string, color?: string | null, croppedArea?: { __typename?: 'Position', width?: number | null, height?: number | null, x?: number | null, y?: number | null } | null, attachment?: { __typename?: 'Attachment', key: string, url: string, croppedArea?: { __typename?: 'Position', width?: number | null, height?: number | null, x?: number | null, y?: number | null } | null } | null, personaStates: Array<{ __typename?: 'PersonaState', stepId?: number | null, rowId: number, boxId: number, columnId: number, state: Types.PersonaStateEnum }> }> }> } };



export const GetJourneyMapRowsDocument = `
    query GetJourneyMapRows($getJourneyMapInput: GetJourneyMapInput!) {
  getJourneyMap(getJourneyMapInput: $getJourneyMapInput) {
    rowCount
    rows {
      id
      isLocked
      isCollapsed
      isPersonaAverageDisabled
      outcomeGroup {
        id
        icon
        name
        pluralName
      }
      boxes {
        id
        columnId
        average
        mergeCount
        boxTextElement {
          commentsCount
          rowId
          id
          text
        }
        boxElements {
          attachment {
            hasResizedVersions
            imgScaleType
          }
          attachmentPosition {
            width
            height
            x
            y
          }
          note {
            text
          }
          commentsCount
          rowId
          id
          attachmentId
          text
          flippedText
          digsiteUrl
          rowId
          bgColor
          persona {
            id
            name
            type
            color
            attachment {
              url
              key
            }
          }
        }
        touchPoints {
          rowId
          columnId
          commentsCount
          id
          title
          iconUrl
          flippedText
          bgColor
          persona {
            id
            name
            type
            color
            attachment {
              url
              key
            }
          }
        }
        outcomes {
          id
          title
          description
          createdAt
          status
          rowId
          columnId
          stepId
          personaId
          commentsCount
          flippedText
          outcomeGroupId
          icon
          bgColor
          persona {
            id
            name
            type
            color
            attachment {
              url
              key
              croppedArea {
                width
                height
                x
                y
              }
            }
          }
        }
        metrics {
          rowId
          columnId
          id
          name
          commentsCount
          descriptionEnabled
          description
          type
          value
          goal
          typeData
          flippedText
          surveyId
          questionId
          source
          startDate
          endDate
          dateRange
          overall
          nps
          csat
          ces
          x
          y
          z
          persona {
            id
            name
            type
            color
            attachment {
              url
              key
              croppedArea {
                width
                height
                x
                y
              }
            }
          }
        }
        links {
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
          bgColor
          mapPersonaImages {
            color
            key
            url
          }
          personaImage {
            key
            url
            color
          }
        }
        step {
          id
          name
          index
          columnId
          isMerged
          bgColor
        }
      }
      rowWithPersonas {
        isDisabledForThisRow
        type
        id
        name
        color
        croppedArea {
          width
          height
          x
          y
        }
        attachment {
          key
          url
          croppedArea {
            width
            height
            x
            y
          }
        }
        personaStates {
          stepId
          rowId
          boxId
          columnId
          state
        }
      }
      rowFunction
      label
      size
    }
  }
}
    `;

export const useGetJourneyMapRowsQuery = <
      TData = GetJourneyMapRowsQuery,
      TError = unknown
    >(
      variables: GetJourneyMapRowsQueryVariables,
      options?: Omit<UseQueryOptions<GetJourneyMapRowsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetJourneyMapRowsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetJourneyMapRowsQuery, TError, TData>(
      {
    queryKey: ['GetJourneyMapRows', variables],
    queryFn: axiosRequest<GetJourneyMapRowsQuery, GetJourneyMapRowsQueryVariables>(GetJourneyMapRowsDocument).bind(null, variables),
    ...options
  }
    )};

useGetJourneyMapRowsQuery.getKey = (variables: GetJourneyMapRowsQueryVariables) => ['GetJourneyMapRows', variables];

export const useInfiniteGetJourneyMapRowsQuery = <
      TData = InfiniteData<GetJourneyMapRowsQuery>,
      TError = unknown
    >(
      variables: GetJourneyMapRowsQueryVariables,
      options: Omit<UseInfiniteQueryOptions<GetJourneyMapRowsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseInfiniteQueryOptions<GetJourneyMapRowsQuery, TError, TData>['queryKey'] }
    ) => {
    const query = axiosRequest<GetJourneyMapRowsQuery, GetJourneyMapRowsQueryVariables>(GetJourneyMapRowsDocument)
    return useInfiniteQuery<GetJourneyMapRowsQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['GetJourneyMapRows.infinite', variables],
      queryFn: (metaData) => query({...variables, ...(metaData.pageParam ?? {})}),
      ...restOptions
    }
  })()
    )};

useInfiniteGetJourneyMapRowsQuery.getKey = (variables: GetJourneyMapRowsQueryVariables) => ['GetJourneyMapRows.infinite', variables];
