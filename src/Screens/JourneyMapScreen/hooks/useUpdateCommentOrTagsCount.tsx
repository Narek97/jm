import { CommentAndNoteModelsEnum, MapCardTypeEnum } from '@/api/types.ts';
import { BoxType } from '@/Screens/JourneyMapScreen/types.ts';
import { useJourneyMapStore } from '@/store/journeyMap.ts';

export const useUpdateCommentOrTagsCount = () => {
  const { journeyMap, updateJourneyMap } = useJourneyMapStore();

  const updateCommentOrTagsCount = ({
    actionType,
    rowId,
    columnId,
    itemId,
    type,
    key,
    count,
  }: {
    actionType: 'increment' | 'decrement';
    rowId: number;
    columnId: number;
    itemId: number;
    type: MapCardTypeEnum | CommentAndNoteModelsEnum;
    key: 'commentsCount' | 'tagsCount';
    count?: number;
  }) => {
    updateJourneyMap({
      rows: journeyMap.rows.map(r => {
        if (r.id === rowId) {
          return {
            ...r,
            boxes: r?.boxes?.map(block => {
              if (block.columnId === columnId) {
                return {
                  ...block,
                  ...changeMapItemCommentsOrTagsCountByType(
                    key,
                    type,
                    actionType,
                    itemId,
                    block,
                    count || 1,
                  ),
                };
              }
              return block;
            }),
          };
        }
        return r;
      }),
    });
  };

  return { updateCommentOrTagsCount };
};

const changeMapItemCommentsOrTagsCountByType = (
  key: 'commentsCount' | 'tagsCount',
  type: MapCardTypeEnum | CommentAndNoteModelsEnum,
  actionType: 'increment' | 'decrement',
  itemId: number,
  block: BoxType,
  count: number,
) => {
  switch (type) {
    case MapCardTypeEnum.Touchpoint:
    case CommentAndNoteModelsEnum.Touchpoint:
      return {
        touchPoints: block.touchPoints.map(touchpointItem => {
          if (touchpointItem.id === itemId) {
            switch (actionType) {
              case 'increment':
                return {
                  ...touchpointItem,
                  [key]: touchpointItem[key] + count,
                };
              case 'decrement':
                return {
                  ...touchpointItem,
                  [key]: touchpointItem[key] - count,
                };
              default:
                break;
            }
          }
          return touchpointItem;
        }),
      };

    case MapCardTypeEnum.Outcome:
    case CommentAndNoteModelsEnum.Outcome:
      return {
        outcomes: block.outcomes.map(outcomeItem => {
          if (outcomeItem.id === itemId) {
            switch (actionType) {
              case 'increment':
                return {
                  ...outcomeItem,
                  [key]: outcomeItem[key] + count,
                };
              case 'decrement':
                return {
                  ...outcomeItem,
                  [key]: outcomeItem[key] - count,
                };
              default:
                break;
            }
          }
          return outcomeItem;
        }),
      };

    case MapCardTypeEnum.Metrics:
    case CommentAndNoteModelsEnum.Metrics: {
      return {
        metrics: block.metrics.map(metricsItem => {
          if (metricsItem.id === itemId) {
            switch (actionType) {
              case 'increment':
                return {
                  ...metricsItem,
                  [key]: metricsItem[key] + count,
                };
              case 'decrement':
                return {
                  ...metricsItem,
                  [key]: metricsItem[key] - count,
                };
              default:
                break;
            }
          }
          return metricsItem;
        }),
      };
    }

    case MapCardTypeEnum.Link:
    case CommentAndNoteModelsEnum.Links: {
      return {
        links: block.links.map(linkItem => {
          if (linkItem.id === itemId) {
            switch (actionType) {
              case 'increment':
                return {
                  ...linkItem,
                  [key]: linkItem[key] + count,
                };
              case 'decrement':
                return {
                  ...linkItem,
                  [key]: linkItem[key] - count,
                };
              default:
                break;
            }
          }
          return linkItem;
        }),
      };
    }

    case MapCardTypeEnum.BoxElement:
    case CommentAndNoteModelsEnum.BoxElement:
      return {
        boxElements: block.boxElements.map(boxElementItem => {
          if (boxElementItem.id === itemId) {
            switch (actionType) {
              case 'increment':
                return {
                  ...boxElementItem,
                  [key]: (boxElementItem[key] || 0) + count,
                };
              case 'decrement':
                return {
                  ...boxElementItem,
                  [key]: (boxElementItem[key] || 0) - count,
                };
              default:
                break;
            }
          }
          return boxElementItem;
        }),
      };
    case MapCardTypeEnum.BoxTextElement: {
      if (block.boxTextElement?.id === itemId) {
        switch (actionType) {
          case 'increment':
            return {
              ...block,
              boxTextElement: {
                ...block.boxTextElement,
                [key]: (block.boxTextElement[key] ?? 0) + count,
              },
            };
          case 'decrement':
            return {
              ...block,
              boxTextElement: {
                ...block.boxTextElement,
                [key]: (block.boxTextElement[key] ?? 0) - count,
              },
            };
          default:
            return block;
        }
      }
      return block;
    }
  }
};
