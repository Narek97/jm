import * as Types from '../../types';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type GetMapByVersionIdQueryVariables = Types.Exact<{
  getMapByVersionIdInput: Types.GetMapByVersionIdInput;
}>;

export type GetMapByVersionIdQuery = {
  __typename?: 'Query';
  getMapByVersionId: {
    __typename?: 'GetMapByVersionIdModel';
    title: string;
    columnCount: number;
    rowCount: number;
    personas: Array<{
      __typename?: 'personas';
      id: number;
      name: string;
      type: string;
      color?: string | null;
      attachmentId?: number | null;
      personaGroupId: number;
      attachment?: {
        __typename?: 'Attachment';
        key: string;
        url: string;
        hasResizedVersions?: boolean | null;
        croppedArea?: {
          __typename?: 'Position';
          width?: number | null;
          height?: number | null;
          x?: number | null;
          y?: number | null;
        } | null;
      } | null;
    }>;
    columns: Array<{
      __typename?: 'MapColumn';
      id: number;
      bgColor: string;
      label?: string | null;
      size: number;
      isMerged: boolean;
      isNextColumnMerged: boolean;
    }>;
    rows: Array<{
      __typename?: 'JourneyMapVersionRow';
      id: number;
      isLocked: boolean;
      isCollapsed: boolean;
      isPersonaAverageDisabled: boolean;
      rowFunction?: Types.MapRowTypeEnum | null;
      label?: string | null;
      size: number;
      boxes?: Array<{
        __typename?: 'MetricsVersion';
        id?: number | null;
        columnId: number;
        average: number;
        mergeCount: number;
        boxTextElement?: {
          __typename?: 'BoxElement';
          commentsCount: number;
          rowId: number;
          id: number;
          text?: string | null;
        } | null;
        boxElements: Array<{
          __typename?: 'BoxElement';
          commentsCount: number;
          rowId: number;
          id: number;
          attachmentId?: number | null;
          text?: string | null;
          flippedText?: string | null;
          digsiteUrl?: string | null;
          bgColor?: string | null;
          attachment?: {
            __typename?: 'Attachment';
            hasResizedVersions?: boolean | null;
            imgScaleType: Types.ImgScaleTypeEnum;
          } | null;
          attachmentPosition?: {
            __typename?: 'Position';
            width?: number | null;
            height?: number | null;
            x?: number | null;
            y?: number | null;
          } | null;
          persona?: {
            __typename?: 'personas';
            id: number;
            name: string;
            type: string;
            color?: string | null;
            attachment?: {
              __typename?: 'Attachment';
              url: string;
              key: string;
            } | null;
          } | null;
        }>;
        touchPoints: Array<{
          __typename?: 'TouchPoint';
          rowId: number;
          columnId: number;
          commentsCount: number;
          id: number;
          title?: string | null;
          iconUrl: string;
          flippedText?: string | null;
          bgColor?: string | null;
          persona?: {
            __typename?: 'personas';
            id: number;
            name: string;
            type: string;
            color?: string | null;
            attachment?: {
              __typename?: 'Attachment';
              url: string;
              key: string;
            } | null;
          } | null;
        }>;
        outcomes: Array<{
          __typename?: 'OutcomeResponse';
          id: number;
          title: string;
          description?: string | null;
          createdAt: any;
          status: Types.OutcomeStatusEnum;
          rowId?: number | null;
          columnId?: number | null;
          stepId?: number | null;
          personaId?: number | null;
          commentsCount: number;
          flippedText?: string | null;
          outcomeGroupId: number;
          icon?: string | null;
          bgColor?: string | null;
          persona?: {
            __typename?: 'personas';
            id: number;
            name: string;
            type: string;
            color?: string | null;
            attachment?: {
              __typename?: 'Attachment';
              url: string;
              key: string;
              croppedArea?: {
                __typename?: 'Position';
                width?: number | null;
                height?: number | null;
                x?: number | null;
                y?: number | null;
              } | null;
            } | null;
          } | null;
        }>;
        metrics?: Array<{
          __typename?: 'MetricsVersionResponse';
          id: number;
          rowId: number;
          columnId: number;
          name: string;
          commentsCount: number;
          descriptionEnabled: boolean;
          description?: string | null;
          type: Types.MetricsTypeEnum;
          value?: number | null;
          goal?: number | null;
          typeData?: any | null;
          flippedText?: string | null;
          surveyId?: number | null;
          questionId?: number | null;
          source: Types.MetricsSourceEnum;
          startDate: string;
          endDate: string;
          dateRange?: Types.MetricsDateRangeEnum | null;
          overall: number;
          nps: number;
          csat: number;
          ces: number;
          x: number;
          y: number;
          z: number;
          persona?: {
            __typename?: 'personas';
            id: number;
            name: string;
            type: string;
            color?: string | null;
            attachment?: {
              __typename?: 'Attachment';
              url: string;
              key: string;
              croppedArea?: {
                __typename?: 'Position';
                width?: number | null;
                height?: number | null;
                x?: number | null;
                y?: number | null;
              } | null;
            } | null;
          } | null;
        }> | null;
        links: Array<{
          __typename?: 'LinkResponse';
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
          bgColor?: string | null;
          mapPersonaImages?: Array<{
            __typename?: 'PersonaUrlObject';
            color?: string | null;
            key?: string | null;
            url?: string | null;
          }> | null;
          personaImage?: {
            __typename?: 'PersonaUrlObject';
            key?: string | null;
            url?: string | null;
            color?: string | null;
          } | null;
        }>;
        step?: {
          __typename?: 'ColumnStep';
          id: number;
          name: string;
          index: number;
          columnId: number;
          isMerged: boolean;
          bgColor?: string | null;
        } | null;
      }> | null;
      rowWithPersonas: Array<{
        __typename?: 'RowWithPersonas';
        isDisabledForThisRow: boolean;
        type: string;
        id: number;
        name: string;
        color?: string | null;
        attachment?: {
          __typename?: 'Attachment';
          key: string;
          url: string;
          croppedArea?: {
            __typename?: 'Position';
            width?: number | null;
            height?: number | null;
            x?: number | null;
            y?: number | null;
          } | null;
        } | null;
        personaStates: Array<{
          __typename?: 'PersonaState';
          stepId?: number | null;
          rowId: number;
          boxId: number;
          columnId: number;
          state: Types.PersonaStateEnum;
        }>;
      }>;
    }>;
  };
};

export const GetMapByVersionIdDocument = `
    query GetMapByVersionId($getMapByVersionIdInput: GetMapByVersionIdInput!) {
  getMapByVersionId(getMapByVersionIdInput: $getMapByVersionIdInput) {
    title
    personas {
      id
      name
      type
      color
      attachmentId
      personaGroupId
      attachment {
        key
        url
        hasResizedVersions
        croppedArea {
          width
          height
          x
          y
        }
      }
    }
    columns {
      id
      bgColor
      label
      size
      isMerged
      isNextColumnMerged
    }
    rows {
      id
      isLocked
      isCollapsed
      isPersonaAverageDisabled
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
          id
          rowId
          columnId
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
    columnCount
    rowCount
  }
}
    `;

export const useGetMapByVersionIdQuery = <TData = GetMapByVersionIdQuery, TError = unknown>(
  variables: GetMapByVersionIdQueryVariables,
  options?: Omit<UseQueryOptions<GetMapByVersionIdQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<GetMapByVersionIdQuery, TError, TData>['queryKey'];
  },
) => {
  return useQuery<GetMapByVersionIdQuery, TError, TData>({
    queryKey: ['GetMapByVersionId', variables],
    queryFn: axiosRequest<GetMapByVersionIdQuery, GetMapByVersionIdQueryVariables>(
      GetMapByVersionIdDocument,
    ).bind(null, variables),
    ...options,
  });
};

useGetMapByVersionIdQuery.getKey = (variables: GetMapByVersionIdQueryVariables) => [
  'GetMapByVersionId',
  variables,
];
