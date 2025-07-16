import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import './style.scss';

import {
  useWuShowToast,
  WuButton,
  WuInput,
  WuMenu,
  WuMenuItem,
} from '@npm-questionpro/wick-ui-lib';
import { useParams } from '@tanstack/react-router';

import {
  GetBoardTagsQuery,
  useInfiniteGetBoardTagsQuery,
} from '@/api/infinite-queries/generated/getBoardTags.generated';
import { useAttachTagMutation } from '@/api/mutations/generated/attachTag.generated';
import {
  CreateTagMutation,
  useCreateTagMutation,
} from '@/api/mutations/generated/createTag.generated';
import { useDeleteTagMutation } from '@/api/mutations/generated/deleteTag.generated';
import { useUnAttachTagMutation } from '@/api/mutations/generated/unAttachTag.generated.ts';
import {
  GetCardAttachedTagsQuery,
  useGetCardAttachedTagsQuery,
} from '@/api/queries/generated/getCardAttachedTags.generated.ts';
import { MapCardTypeEnum } from '@/api/types.ts';
import CustomLoader from '@/Components/Shared/CustomLoader';
import EmptyDataInfo from '@/Components/Shared/EmptyDataInfo';
import { BOARD_TAGS_LIMIT } from '@/constants/pagination';
import { debounced400 } from '@/hooks/useDebounce.ts';
import { useSetQueryDataByKey } from '@/hooks/useQueryKey.ts';
import {
  BoardTagType,
  CreateTagType,
} from '@/Screens/JourneyMapScreen/components/JourneyMapHeader/types.ts';
import { useUpdateCommentOrTagsCount } from '@/Screens/JourneyMapScreen/hooks/useUpdateCommentOrTagsCount';
import { useLayerStore } from '@/store/layers.ts';

interface IJourneyMapCardNote {
  cardType: MapCardTypeEnum;
  itemId: number | null;
  attachedTagsCount: number;
  createTagItemAttrs: {
    columnId: number;
    stepId: number;
    rowId: number;
    cardType?: MapCardTypeEnum;
  };
}

const JourneyMapTagsPopoverContent: FC<IJourneyMapCardNote> = ({
  cardType,
  itemId,
  attachedTagsCount,
  createTagItemAttrs,
}) => {
  const { boardId, mapId } = useParams({
    from: '/_authenticated/_secondary-sidebar-layout/board/$boardId/journey-map/$mapId/',
  });

  // todo bug, attach not working

  const { updateCommentOrTagsCount } = useUpdateCommentOrTagsCount();
  const { showToast } = useWuShowToast();

  const setBoardTags = useSetQueryDataByKey('GetBoardTags.infinite');
  const setCardAttachedTags = useSetQueryDataByKey('GetCardAttachedTags', {
    key: ['cardId', 'cardType'],
    value: [+itemId!, cardType],
    input: 'getAttachedTagsInput',
  });

  const { currentLayer } = useLayerStore();

  const isLayerModeOn = !currentLayer?.isBase;

  const childRef = useRef<HTMLUListElement>(null);
  const [search, setSearch] = useState<string>('');
  const [tagName, setTagName] = useState<string>('');

  const { mutate: createTag } = useCreateTagMutation<Error, CreateTagMutation>({
    onSuccess: response => {
      handleAttachTag(response.createTag, itemId || null, true);
    },
    onError: error => {
      showToast({
        variant: 'error',
        message: error?.message,
      });
    },
  });
  const { mutate: deleteTag } = useDeleteTagMutation<Error>({
    onError: error => {
      showToast({
        variant: 'error',
        message: error?.message,
      });
    },
  });
  const { mutate: attachTag } = useAttachTagMutation<Error>({
    onError: error => {
      showToast({
        variant: 'error',
        message: error?.message,
      });
    },
  });
  const { mutate: unAttachTag } = useUnAttachTagMutation<Error>({
    onError: error => {
      showToast({
        variant: 'error',
        message: error?.message,
      });
    },
  });

  const {
    isLoading: isLoadingBoardTags,
    fetchNextPage: fetchNextPageBoardTags,
    hasNextPage: hasNextPageBoardTags,
    data: dataGetBoards,
    isFetchingNextPage: isFetchingNextPageBoardTags,
  } = useInfiniteGetBoardTagsQuery<{ pages: Array<GetBoardTagsQuery> }, Error>(
    {
      getBoardTagsInput: {
        boardId: +boardId!,
        search,
        limit: BOARD_TAGS_LIMIT,
        offset: 0,
      },
    },
    {
      getNextPageParam: function (
        lastPage: GetBoardTagsQuery,
        allPages: GetBoardTagsQuery[],
      ): unknown {
        if (!lastPage.getBoardTags.tags || !lastPage.getBoardTags.tags.length) {
          return undefined;
        }
        return {
          boardId: +boardId!,
          search,
          limit: BOARD_TAGS_LIMIT,
          offset: allPages.length * BOARD_TAGS_LIMIT,
        };
      },
      initialPageParam: 0,
    },
  );

  const { data: attachedTagsData, isLoading: isLoadingAttachedTagsData } =
    useGetCardAttachedTagsQuery<GetCardAttachedTagsQuery, Error>(
      {
        getAttachedTagsInput: {
          cardId: +itemId!,
          cardType,
        },
      },
      {
        enabled: !!itemId,
      },
    );

  const boardTagsData: Array<BoardTagType> = useMemo(() => {
    if (dataGetBoards?.pages && dataGetBoards?.pages[0] !== undefined) {
      return dataGetBoards.pages.reduce<Array<BoardTagType>>(
        (acc, curr) => [...acc, ...(curr.getBoardTags.tags || [])],
        [],
      );
    }
    return [];
  }, [dataGetBoards]);

  const availableTagsForAttach = useMemo(
    () =>
      boardTagsData?.filter(tagItem => {
        return (
          !attachedTagsData?.getCardAttachedTags.some(t => t.id === tagItem?.id) &&
          !tagItem?.isAttached
        );
      }),
    [attachedTagsData?.getCardAttachedTags, boardTagsData],
  );

  const handleUnattachTag = useCallback(
    (tagId: number, cardId: number) => {
      const attachedTag = attachedTagsData?.getCardAttachedTags?.find(itm => itm.id === tagId);
      if (!attachedTag) return;

      setBoardTags((oldData: { pages: GetBoardTagsQuery[] }) => {
        const updatedPages = oldData.pages.map(page => {
          const existingTag = page.getBoardTags.tags?.find(tag => tag.id === attachedTag.id);
          let updatedTags;

          if (existingTag) {
            updatedTags = page.getBoardTags.tags.map(tag =>
              tag.id === attachedTag.id ? { ...tag, isAttached: false } : tag,
            );
          } else {
            updatedTags = [
              { ...attachedTag, isAttached: false },
              ...(page.getBoardTags.tags || []),
            ];
          }

          return {
            ...page,
            getBoardTags: {
              ...page.getBoardTags,
              tags: updatedTags,
            },
          };
        });
        return {
          ...oldData,
          pages: updatedPages,
        };
      });

      unAttachTag(
        {
          unAttachTagInput: {
            cardId,
            tagId,
            cardType,
          },
        },
        {
          onSuccess: () => {
            setCardAttachedTags((prev: GetCardAttachedTagsQuery) => ({
              getCardAttachedTags: prev?.getCardAttachedTags?.filter(itm => itm.id !== tagId) || [],
            }));
            updateCommentOrTagsCount({
              key: 'tagsCount',
              type: createTagItemAttrs.cardType || cardType,
              actionType: 'decrement',
              itemId: cardId,
              rowId: createTagItemAttrs.rowId,
              columnId: createTagItemAttrs.columnId,
            });
          },
        },
      );
    },
    [
      attachedTagsData?.getCardAttachedTags,
      cardType,
      createTagItemAttrs.cardType,
      createTagItemAttrs.columnId,
      createTagItemAttrs.rowId,
      setBoardTags,
      setCardAttachedTags,
      unAttachTag,
      updateCommentOrTagsCount,
    ],
  );

  const handleAttachTag = (
    tag: CreateTagType | BoardTagType,
    cardId: number | null,
    isNew?: boolean,
  ) => {
    if (!cardId) {
      return;
    }

    attachTag(
      {
        attachTagInput: {
          cardId,
          tagId: tag?.id,
          cardType,
        },
      },
      {
        onSuccess: () => {
          setCardAttachedTags((prev: GetCardAttachedTagsQuery) => ({
            getCardAttachedTags: [...(prev?.getCardAttachedTags || []), tag],
          }));
          if (isNew) {
            setSearch('');
            setBoardTags((oldData: { pages: GetBoardTagsQuery[] }) => {
              const updatedPages = oldData.pages.map(page => ({
                ...page,
                getBoardTags: {
                  ...page.getBoardTags,
                  tags: [{ ...tag, isAttached: true }, ...(page.getBoardTags.tags || [])],
                },
              }));
              return {
                ...oldData,
                pages: updatedPages,
              };
            });
          }
          updateCommentOrTagsCount({
            key: 'tagsCount',
            type: createTagItemAttrs.cardType || cardType,
            actionType: 'increment',
            itemId: cardId,
            rowId: createTagItemAttrs.rowId,
            columnId: createTagItemAttrs.columnId,
          });
        },
      },
    );
  };

  const handleCreateTag = () => {
    createTag({
      createTagInput: {
        name: tagName,
        boardId: +boardId!,
        color: '#e6e6e6',
        mapId: +mapId,
      },
    });
    setTagName('');
  };

  const onHandleDeleteItem = useCallback(
    (id: number) => {
      deleteTag(
        { id },
        {
          onSuccess: () => {
            setBoardTags((oldData: { pages: GetBoardTagsQuery[] }) => {
              const updatedPages = oldData.pages.map(page => ({
                ...page,
                getBoardTags: {
                  ...page.getBoardTags,
                  tags: page.getBoardTags.tags.filter(item => item?.id !== id),
                },
              }));
              return {
                ...oldData,
                pages: updatedPages,
              };
            });
          },
        },
      );
    },
    [deleteTag, setBoardTags],
  );

  const onHandleFetch = useCallback(
    (e: React.UIEvent<HTMLElement>, childOffsetHeight: number) => {
      const target = e.currentTarget as HTMLDivElement | null;
      if (
        target &&
        childOffsetHeight &&
        target.offsetHeight + target.scrollTop + 100 >= childOffsetHeight &&
        !isFetchingNextPageBoardTags &&
        !isLoadingBoardTags &&
        hasNextPageBoardTags
      ) {
        fetchNextPageBoardTags().then();
      }
    },
    [fetchNextPageBoardTags, hasNextPageBoardTags, isFetchingNextPageBoardTags, isLoadingBoardTags],
  );

  useEffect(() => {
    if (
      attachedTagsCount &&
      attachedTagsData &&
      attachedTagsData?.getCardAttachedTags.length !== attachedTagsCount
    ) {
      updateCommentOrTagsCount({
        key: 'tagsCount',
        type: createTagItemAttrs.cardType || cardType,
        actionType: 'decrement',
        itemId: itemId!,
        rowId: createTagItemAttrs.rowId,
        columnId: createTagItemAttrs.columnId,
        count: attachedTagsData?.getCardAttachedTags.length,
      });
    }
    // eslint-disable-next-line
  }, [attachedTagsData?.getCardAttachedTags.length]);

  return (
    <>
      <div className={'tags-menu-section'} onClick={e => e.stopPropagation()}>
        {!!attachedTagsData?.getCardAttachedTags?.length && (
          <ul className={'board-tags-section-list--attached-tags'}>
            {attachedTagsData?.getCardAttachedTags?.map(tag => (
              <li key={tag?.id} className={'board-tags-section-list--attached-tags-item'}>
                {tag?.name}
                {!isLayerModeOn && (
                  <WuButton
                    onClick={e => {
                      e.stopPropagation();
                      if (isLayerModeOn && itemId) {
                        handleUnattachTag(tag?.id, itemId);
                      }
                    }}
                    className={'delete-attached-tag'}
                    Icon={<span className="wm-close" />}
                    variant="iconOnly"
                  />
                )}
              </li>
            ))}
          </ul>
        )}
        <WuInput
          data-testid={'tag-name-input'}
          label="Tag Name"
          placeholder="Type tag name"
          variant="outlined"
          min={2}
          value={tagName}
          maxLength={50}
          readOnly={isLayerModeOn}
          disabled={!itemId}
          onKeyDown={event => {
            if (
              event.key === 'Enter' &&
              !boardTagsData.some(tag => tag.name === tagName) &&
              !isLayerModeOn
            ) {
              event.preventDefault();
              handleCreateTag();
              (event.target as HTMLElement).blur();
            }
          }}
          iconPosition="right"
          onChange={e => {
            setTagName(e.target.value);
            debounced400(() => {
              setSearch(e.target.value);
            });
          }}
        />
      </div>
      <div onClick={e => e.stopPropagation()}>
        {isLoadingBoardTags || isLoadingAttachedTagsData ? (
          <div className={'board-tags-section'}>
            <CustomLoader />
          </div>
        ) : (
          <div className={'board-tags-section'}>
            {availableTagsForAttach?.length ? (
              <div
                className={'board-tags-section'}
                onScroll={e => {
                  onHandleFetch(e, childRef.current?.offsetHeight || 0);
                }}>
                <ul className={'board-tags-section-list'} ref={childRef}>
                  {availableTagsForAttach?.map(tag => (
                    <li
                      onClick={() =>
                        isLayerModeOn
                          ? showToast({
                              message: 'Tagging a card function is available only on a base layer',
                              variant: 'info',
                            })
                          : handleAttachTag(tag, itemId || null)
                      }
                      key={tag.id}
                      className={'board-tags-section-list--item'}>
                      <div className={'board-tags-section-list--item-name'}>{tag?.name}</div>
                      <div className={'board-tags-section-list--item-option'}>
                        {!isLayerModeOn && (
                          <WuMenu Trigger={<span className={'wm-more-vert'} />}>
                            <WuMenuItem>
                              <button
                                data-testId={'delete-tag-input'}
                                onClick={e => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  onHandleDeleteItem(tag?.id);
                                }}
                                style={{ all: 'unset', width: '100%' }}>
                                Delete
                              </button>
                            </WuMenuItem>
                          </WuMenu>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <EmptyDataInfo message={'Press enter to create a tag'} />
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default JourneyMapTagsPopoverContent;
