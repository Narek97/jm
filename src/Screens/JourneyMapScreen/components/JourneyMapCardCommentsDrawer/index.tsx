import { FC, useCallback, useEffect, useState } from 'react';

import './style.scss';

import dayjs from 'dayjs';
import fromNow from 'dayjs/plugin/relativeTime';

import CommentInput from './CommentInput';
import useKeepScrollPosition from './hooks/useKeepScrollPosition';
import useOnScreen from './hooks/useOnScreen';
import { emitToSocketMap, socketMap } from '../../helpers/socketConnection';

import {
  GetItemCommentsQuery,
  useInfiniteGetItemCommentsQuery,
} from '@/api/infinite-queries/generated/getComments.generated';
import {
  AddCommentMutation,
  useAddCommentMutation,
} from '@/api/mutations/generated/addComment.generated';
import {
  DeleteCommentMutation,
  useDeleteCommentMutation,
} from '@/api/mutations/generated/deleteComment.generated';
import {
  UpdateCommentMutation,
  useUpdateCommentMutation,
} from '@/api/mutations/generated/updateComment.generated.ts';
import { ActionEnum, CommentAndNoteModelsEnum } from '@/api/types.ts';
import EmptyCommentsIcon from '@/assets/public/base/emptyComments.svg';
import BaseWuModalHeader from '@/Components/Shared/BaseWuModalHeader';
import WuBaseLoader from '@/Components/Shared/WuBaseLoader';
import { COMMENTS_LIMIT } from '@/constants/pagination.ts';
import ErrorBoundary from '@/Features/ErrorBoundary';
import CommentItem from '@/Screens/JourneyMapScreen/components/JourneyMapCardCommentsDrawer/CommentItem';
import { commentSocket } from '@/Screens/JourneyMapScreen/components/JourneyMapCardCommentsDrawer/helpers/commentSocket.ts';
import { CommentType } from '@/Screens/JourneyMapScreen/components/JourneyMapCardCommentsDrawer/types.ts';
import { useUpdateCommentOrTagsCount } from '@/Screens/JourneyMapScreen/hooks/useUpdateCommentOrTagsCount.tsx';
import { useNotesAndCommentsDrawerStore } from '@/store/comments.ts';
import { useUserStore } from '@/store/user.ts';
import { CommentEventsEnum } from '@/types/enum';

interface ICommentsDrawer {
  onClose: () => void;
}

dayjs.extend(fromNow);

const CommentsDrawer: FC<ICommentsDrawer> = ({ onClose }) => {
  const { updateCommentOrTagsCount } = useUpdateCommentOrTagsCount();
  const { notesAndCommentsDrawer } = useNotesAndCommentsDrawerStore();

  const { user } = useUserStore();

  const [lastMessageRef, setLastMessageRef] = useState<HTMLElement | null>(null);
  const [comments, setComments] = useState<Array<CommentType>>([]);

  const isIntersecting = useOnScreen({ current: lastMessageRef });
  const { containerRef } = useKeepScrollPosition([comments]);

  const { mutate: addComment } = useAddCommentMutation<Error, AddCommentMutation>();
  const { mutate: deleteCommentItem } = useDeleteCommentMutation<Error, DeleteCommentMutation>();
  const { mutate: updateCommentItem } = useUpdateCommentMutation<Error, UpdateCommentMutation>();
  const {
    data: dataComments,
    isLoading: isLoadingComments,
    hasNextPage: hasNextPageComments,
    fetchNextPage: fetchNextPageComments,
  } = useInfiniteGetItemCommentsQuery<{ pages: Array<GetItemCommentsQuery> }, Error>(
    {
      getItemCommentsInput: {
        limit: COMMENTS_LIMIT,
        offset: 0,
        itemType: notesAndCommentsDrawer.type || CommentAndNoteModelsEnum.BoxElement,
        itemId: notesAndCommentsDrawer.itemId,
        rowId: notesAndCommentsDrawer?.rowId,
        stepId: notesAndCommentsDrawer?.stepId,
      },
    },
    {
      getNextPageParam(lastPage: GetItemCommentsQuery, allPages: Array<GetItemCommentsQuery>) {
        if (!lastPage.getItemComments.comments || !lastPage.getItemComments.comments.length) {
          return undefined;
        }

        return {
          getItemCommentsInput: {
            limit: COMMENTS_LIMIT,
            offset: allPages.length * COMMENTS_LIMIT,
            itemType: notesAndCommentsDrawer.type || CommentAndNoteModelsEnum.BoxElement,
            itemId: notesAndCommentsDrawer.itemId,
            rowId: notesAndCommentsDrawer?.rowId,
            stepId: notesAndCommentsDrawer?.stepId,
          },
        };
      },
      initialPageParam: 0,
      enabled: !!notesAndCommentsDrawer.itemId,
    },
  );

  const updateStateAfterDelete = (id: number, parentId?: number | null) => {
    setComments(prev => {
      if (parentId) {
        return prev.map(comment => {
          if (comment.id === parentId) {
            comment.replies = comment?.replies?.filter(itm => itm?.id !== id);
          }
          return comment;
        });
      } else {
        return prev?.filter(comment => comment?.id !== id);
      }
    });
  };

  const deleteComment = (id: number, parentId?: number | null) => {
    deleteCommentItem(
      { id },
      {
        onSuccess: () => {
          emitToSocketMap(CommentEventsEnum.COMMENT_ITEM_EVENT, {
            action: ActionEnum.Delete,
            itemId: notesAndCommentsDrawer.itemId,
            rowId: notesAndCommentsDrawer.rowId,
            columnId: notesAndCommentsDrawer.columnId,
            type: notesAndCommentsDrawer.type,
            parentId,
            comment: { id },
          });
          updateCommentOrTagsCount({
            key: 'commentsCount',
            actionType: 'decrement',
            type: notesAndCommentsDrawer.type!,
            itemId: notesAndCommentsDrawer.itemId!,
            rowId: notesAndCommentsDrawer.rowId!,
            columnId: notesAndCommentsDrawer.columnId!,
          });
          updateStateAfterDelete(id, parentId);
        },
      },
    );
  };

  const scrollToBottom = () => {
    const sectionContainer: HTMLElement | null = containerRef?.current;
    if (sectionContainer) {
      (sectionContainer as HTMLElement).scrollTo({
        top: (sectionContainer as HTMLElement).scrollHeight,
      });
    }
  };

  const updateComment = ({
    text,
    commentId,
    parentId,
  }: {
    text: string;
    commentId: number;
    parentId?: number;
  }) => {
    const regex = /(<([^>]+)>)/gi;
    const hasText = !!text.replace(regex, '').length;
    updateCommentItem(
      {
        updateCommentInput: {
          id: commentId,
          text: hasText ? text : '',
        },
      },
      {
        onSuccess: () => {
          emitToSocketMap(CommentEventsEnum.COMMENT_ITEM_EVENT, {
            action: ActionEnum.Update,
            itemId: notesAndCommentsDrawer.itemId,
            type: notesAndCommentsDrawer.type,
            parentId,
            comment: { id: commentId, text },
          });
          if (hasText) {
            setComments(prev => {
              if (hasText) {
                if (parentId) {
                  return prev.map(comment => {
                    if (comment.id === parentId) {
                      comment.replies?.forEach(itm => {
                        if (itm.id === commentId) {
                          itm.text = text;
                        }
                      });
                    }
                    return comment;
                  });
                } else {
                  return prev.map(comment => {
                    if (comment.id === commentId) {
                      comment.text = text;
                    }
                    return comment;
                  });
                }
              }
              return prev;
            });
          } else {
            updateStateAfterDelete(commentId, parentId);
          }
        },
      },
    );
  };

  const addCommentItem = (text: string, commentId?: number) => {
    let requestData = {
      rowId: notesAndCommentsDrawer.rowId,
      stepId: notesAndCommentsDrawer.stepId,
      itemId: notesAndCommentsDrawer.itemId,
      itemType: notesAndCommentsDrawer.type!,
      text,
    };
    if (commentId) {
      requestData = {
        ...requestData,
      };
    }
    addComment(
      {
        addCommentInput: requestData,
      },
      {
        onSuccess: data => {
          updateCommentOrTagsCount({
            key: 'commentsCount',
            type: notesAndCommentsDrawer.type || CommentAndNoteModelsEnum.BoxElement,
            actionType: 'increment',
            itemId: notesAndCommentsDrawer.itemId!,
            rowId: notesAndCommentsDrawer.rowId!,
            columnId: notesAndCommentsDrawer.columnId!,
          });
          const newComment: CommentType = {
            itemId: notesAndCommentsDrawer.itemId!,
            id: data?.addComment.id,
            owner: {
              id: user!.userID,
              userId: user!.userID,
              color: data?.addComment.owner.color,
              emailAddress: data?.addComment.owner.emailAddress,
              firstName: data?.addComment.owner.firstName,
              lastName: data?.addComment.owner.lastName,
            },
            updatedAt: data?.addComment.updatedAt,
            text,
            replies: data?.addComment.replies || [],
          };

          emitToSocketMap(CommentEventsEnum.COMMENT_ITEM_EVENT, {
            action: ActionEnum.Add,
            commentId: commentId,
            comment: newComment,
            itemId: notesAndCommentsDrawer.itemId,
            type: notesAndCommentsDrawer.type,
          });

          setComments(prev => {
            if (commentId) {
              return prev.map(comment => {
                if (comment?.id === commentId) {
                  return {
                    ...comment,
                    replies: [...(comment?.replies || []), newComment],
                  };
                }
                return comment;
              });
            } else {
              return [...prev, newComment];
            }
          });
        },
      },
    );
  };

  const changeCommentsData = useCallback((socketData: unknown) => {
    setComments(prev => {
      return commentSocket(socketData, prev);
    });
  }, []);

  const handleCloseDrawer = () => {
    setComments([]);
    onClose();
  };

  useEffect(() => {
    if (isIntersecting && !isLoadingComments && hasNextPageComments) {
      fetchNextPageComments().then();
    }
  }, [fetchNextPageComments, hasNextPageComments, isIntersecting, isLoadingComments]);

  useEffect(() => {
    if (dataComments) {
      const comments = dataComments.pages.reduce((acc: Array<CommentType>, curr) => {
        if (curr.getItemComments.comments) {
          return [...acc, ...curr.getItemComments.comments];
        }
        return acc;
      }, []);

      setComments(comments);
    }
  }, [dataComments]);

  useEffect(() => {
    socketMap?.on(CommentEventsEnum.COMMENT_ITEM_EVENT, (socketData: unknown) => {
      changeCommentsData(socketData);
    });
  }, [changeCommentsData]);

  useEffect(() => {
    emitToSocketMap(CommentEventsEnum.JOIN_ITEM_COMMENT_EVENT, {
      itemId: notesAndCommentsDrawer.itemId,
      type: notesAndCommentsDrawer.type,
    });
    return () => {
      emitToSocketMap(CommentEventsEnum.LEAVE_ITEM_COMMENT_EVENT, {
        itemId: notesAndCommentsDrawer.itemId,
        type: notesAndCommentsDrawer.type,
      });
    };
  }, [notesAndCommentsDrawer.itemId, notesAndCommentsDrawer.type]);

  return (
    <div className={'comments-drawer'} data-testid="comments-drawer">
      <BaseWuModalHeader title={'Comments'} />
      <button onClick={handleCloseDrawer} aria-label={'close drawer'} className={'close-drawer'}>
        <span className={'wm-close'} />
      </button>
      <div className={'comments-drawer--content'}>
        <div className={'comments-drawer--title'}>Comments</div>
        <div className="comments-drawer--comments-block" ref={containerRef}>
          {isLoadingComments ? (
            <div>
              <WuBaseLoader />
            </div>
          ) : comments?.length ? (
            comments?.map((commentItem, index) => (
              <ErrorBoundary key={commentItem?.id}>
                <CommentItem
                  key={commentItem?.id}
                  isFirstLevel={true}
                  comment={commentItem}
                  index={index}
                  deleteComment={deleteComment}
                  updateComment={updateComment}
                  setLastMessageRef={ref => {
                    setLastMessageRef(ref);
                  }}
                  addComment={addCommentItem}
                />
              </ErrorBoundary>
            ))
          ) : (
            <div className={'comments-drawer--empty-state'}>
              <img src={EmptyCommentsIcon} alt="Empty Comments Icon" />
              <div className={'comments-drawer--empty-state--title'}>
                There are no comments yet.
              </div>
              <div>
                Start a new conversation by entering your comments and let others comment them.
              </div>
            </div>
          )}
        </div>
        <div className={'comments-drawer--input-block'}>
          <CommentInput focus={scrollToBottom} addComment={addCommentItem} />
        </div>
      </div>
    </div>
  );
};

export default CommentsDrawer;
