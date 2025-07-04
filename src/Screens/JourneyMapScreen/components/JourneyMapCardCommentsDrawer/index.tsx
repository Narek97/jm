import { FC, useCallback, useEffect, useState } from 'react';

import './style.scss';

import dayjs from 'dayjs';
import fromNow from 'dayjs/plugin/relativeTime';

import useKeepScrollPosition from './hooks/useKeepScrollPosition';
import useOnScreen from './hooks/useOnScreen';

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
import { CommentAndNoteModelsEnum } from '@/api/types.ts';
import CustomLoader from '@/Components/Shared/CustomLoader';
import CustomModalHeader from '@/Components/Shared/CustomModalHeader';
import { COMMENTS_LIMIT } from '@/constants/pagination.ts';
import { useUpdateCommentOrTagsCount } from '@/Screens/JourneyMapScreen/hooks/useUpdateCommentOrTagsCount.tsx';
import { useNotesAndCommentsDrawerStore } from '@/store/comments.ts';
import { useUserStore } from '@/store/user.ts';

interface ICommentsDrawer {
  onClose: () => void;
}

dayjs.extend(fromNow);

// todo
const CommentsDrawer: FC<ICommentsDrawer> = ({ onClose }) => {
  const { updateCommentOrTagsCount } = useUpdateCommentOrTagsCount();
  const { notesAndCommentsDrawer } = useNotesAndCommentsDrawerStore();

  const { user } = useUserStore();

  const [lastMessageRef, setLastMessageRef] = useState<HTMLElement | null>(null);
  // const [comments, setComments] = useState<Array<CommentType>>([]);

  const isIntersecting = useOnScreen({ current: lastMessageRef });
  const { containerRef } = useKeepScrollPosition([comments]);

  const { mutate: addComment } = useAddCommentMutation<Error, AddCommentMutation>();
  const { mutate: deleteCommentItem } = useDeleteCommentMutation<Error, DeleteCommentMutation>();
  const { mutate: updateCommentItem } = useUpdateCommentMutation<Error, UpdateCommentMutation>();
  const {
    data: dataQuery,
    isLoading: commentsIsLoading,
    isFetching,
    fetchNextPage: organizationPersonasFetchNextPage,
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

  // onSuccess: response => {
  //   const data =
  //     response?.pages[response?.pages?.length - 1]?.getItemComments?.comments ||
  //     ([] as CommentType[]);
  //   setComments(prev => {
  //     return [...data, ...prev];
  //   });
  // },

  const updateStateAfterDelete = (id: number, parentId?: number | null) => {
    setComments(prev => {
      // if (parentId) {
      //   const copyCommentsList = deepcopy(prev);
      //   copyCommentsList?.forEach(comment => {
      //     if (comment?.id === parentId) {
      //       comment.replies = comment?.replies?.filter(itm => itm?.id !== id);
      //     }
      //   });
      //   return copyCommentsList;
      // } else {
      //   return prev?.filter(comment => comment?.id !== id);
      // }
    });
  };
  const deleteComment = (id: number, parentId?: number | null) => {
    deleteCommentItem(
      { id },
      {
        onSuccess: () => {
          // emitToSocketMap(CommentEventsEnum.ITEM_COMMENT_EVENT, {
          //   action: ActionEnum.Delete,
          //   itemId: commentsDrawer?.itemId,
          //   rowId: commentsDrawer?.rowId,
          //   columnId: commentsDrawer?.columnId,
          //   type: commentsDrawer.type,
          //   parentId,
          //   comment: { id },
          // });
          // updateCommentOrTagsCount({
          //   key: 'commentsCount',
          //   type: commentsDrawer.type!,
          //   actionType: 'decrement',
          //   itemId: commentsDrawer?.itemId!,
          //   rowId: commentsDrawer.rowId!,
          //   columnId: commentsDrawer.columnId!,
          // });
          // updateStateAfterDelete(id, parentId);
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
          // emitToSocketMap(CommentEventsEnum.ITEM_COMMENT_EVENT, {
          //   action: ActionEnum.Update,
          //   itemId: commentsDrawer?.itemId,
          //   type: commentsDrawer.type!,
          //   parentId,
          //   comment: { id: commentId, text },
          // });
          // if (hasText) {
          //   setComments(prev => {
          //     const copyCommentsList = deepcopy(prev);
          //     if (hasText) {
          //       if (parentId) {
          //         copyCommentsList?.forEach(comment => {
          //           if (comment?.id === parentId) {
          //             comment?.replies?.forEach(itm => {
          //               if (itm?.id === commentId) {
          //                 itm.text = text;
          //               }
          //             });
          //           }
          //         });
          //         return copyCommentsList;
          //       } else {
          //         copyCommentsList?.forEach(comment => {
          //           if (comment?.id === commentId) {
          //             comment.text = text;
          //           }
          //         });
          //       }
          //     }
          //
          //     return copyCommentsList;
          //   });
          // } else {
          //   updateStateAfterDelete(commentId, parentId);
          // }
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
          const newComment = {
            itemId: notesAndCommentsDrawer.itemId!,
            id: data?.addComment.id,
            type: notesAndCommentsDrawer.type!,
            owner: {
              userId: user?.userID,
              color: data?.addComment.owner.color,
              emailAddress: data?.addComment.owner.emailAddress,
              firstName: data?.addComment.owner.firstName,
              lastName: data?.addComment.owner.lastName,
            },
            updatedAt: data?.addComment.updatedAt,
            text,
            replies: data?.addComment.replies || [],
          };

          // emitToSocketMap(CommentEventsEnum.ITEM_COMMENT_EVENT, {
          //   action: ActionEnum.Add,
          //   commentId: commentId,
          //   comment: newComment,
          //   itemId: commentsDrawer?.itemId,
          //   type: commentsDrawer.type!,
          // });
          //
          // setComments(prev => {
          //   if (commentId) {
          //     prev = prev?.map(comment => {
          //       if (comment?.id === commentId) {
          //         return {
          //           ...comment,
          //           replies: [...(comment?.replies || []), newComment],
          //         };
          //       }
          //       return comment;
          //     });
          //     return prev;
          //   } else {
          //     return [...prev, newComment];
          //   }
          // });
        },
      },
    );
  };

  // useEffect(() => {
  //   return () => {
  //     setComments([]);
  //   };
  // }, [commentsDrawer.isOpen, setComments]);
  //
  // useEffect(() => {
  //   emitToSocketMap(CommentEventsEnum.JOIN_ITEM_COMMENT_EVENT, {
  //     itemId: commentsDrawer?.itemId,
  //     type: commentsDrawer.type!,
  //   });
  //   return () => {
  //     emitToSocketMap(CommentEventsEnum.LEAVE_ITEM_COMMENT_EVENT, {
  //       itemId: commentsDrawer?.itemId,
  //       type: commentsDrawer.type!,
  //     });
  //   };
  // }, [commentsDrawer?.itemId, commentsDrawer.type]);

  const changeCommentsData = useCallback((socketData: unknown) => {
    // setComments(prev => {
    //   const commentsCopy: CommentType[] = deepcopy(prev);
    //   return commentSocket(socketData, commentsCopy);
    // });
  }, []);

  // useEffect(() => {
  //   socketMap?.on(CommentEventsEnum.ITEM_COMMENT_EVENT, (socketData: unknown) => {
  //     changeCommentsData(socketData);
  //   });
  // }, [changeCommentsData]);

  const getTotalCommentsLength = (data: GetItemCommentsQuery[]) => {
    return data.reduce((totalLength, entry) => {
      if (entry.getItemComments && entry.getItemComments.comments) {
        return totalLength + entry.getItemComments.comments.length;
      }
      return totalLength;
    }, 0);
  };

  const handleCloseDrawer = () => {
    onClose();
  };

  // useEffect(() => {
  //   const count = getTotalCommentsLength(dataQuery?.pages || []);
  //   if (
  //     isIntersecting &&
  //     !isFetching &&
  //     !commentsIsLoading &&
  //     dataQuery?.pages[0] &&
  //     dataQuery?.pages[0]?.getItemComments?.count &&
  //     count < dataQuery?.pages[0]?.getItemComments?.count
  //   ) {
  //     organizationPersonasFetchNextPage().then();
  //   }
  // }, [
  //   commentsIsLoading,
  //   dataQuery?.pages,
  //   isFetching,
  //   isIntersecting,
  //   organizationPersonasFetchNextPage,
  // ]);

  return (
    <div className={'comments-drawer'} data-testid="comments-drawer">
      <CustomModalHeader title={'Comments'} />
      <button onClick={handleCloseDrawer} aria-label={'close drawer'} className={'close-drawer'}>
        <span className={'wm-close'} />
      </button>
      <div className={'comments-drawer--content'}>
        <div className={'comments-drawer--title'}>Comments</div>
        <div className="comments-drawer--comments-block" ref={containerRef}>
          {commentsIsLoading ? (
            <div>
              <CustomLoader />
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
              <EmptyStateIcon />
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
