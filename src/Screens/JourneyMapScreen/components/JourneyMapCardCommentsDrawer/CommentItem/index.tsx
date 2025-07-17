import { FC, useMemo, useState } from 'react';

import './style.scss';

import dayjs from 'dayjs';

import CommentInput from '../CommentInput';
import { CommentType } from '../types';

import CustomLongMenu from '@/Components/Shared/CustomLongMenu';
import { COMMENT_ITEM_OPTIONS } from '@/Screens/JourneyMapScreen/components/JourneyMapCardCommentsDrawer/constants.tsx';
import { useUserStore } from '@/store/user.ts';
import { MenuViewTypeEnum } from '@/types/enum.ts';

interface ICommentItem {
  isFirstLevel: boolean;
  comment: CommentType;
  index: number;
  setLastMessageRef: (ref: HTMLElement | null) => void;
  addComment?: (text: string, id: number) => void;
  updateComment: ({
    text,
    commentId,
    parentId,
  }: {
    text: string;
    commentId: number;
    parentId?: number;
  }) => void;
  deleteComment: (id: number, parentId?: number | null) => void;
}

const CommentItem: FC<ICommentItem> = ({
  comment,
  setLastMessageRef,
  deleteComment,
  index,
  isFirstLevel,
  addComment,
  updateComment,
}) => {
  const { user } = useUserStore();

  const [isShowReplyInput, setIsShowReplyInput] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  const addReply = () => {
    setIsShowReplyInput(true);
  };

  const options = useMemo(() => {
    return COMMENT_ITEM_OPTIONS({
      onHandleDelete: () => deleteComment(comment?.id, null),
      onHandleEdit: () => setIsEditMode(true),
    });
  }, [comment?.id, deleteComment]);

  return (
    <div
      className={'comment-item'}
      data-testid="comment-item-test-id"
      key={comment?.id}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ref={ref => (index === 0 ? setLastMessageRef(ref) : null)}>
      <div className={'comment-item--author'}>
        <div
          className={'comment-item--author-logo'}
          style={{ backgroundColor: comment.owner?.color }}>
          {comment.owner?.firstName || comment.owner?.lastName
            ? comment.owner?.firstName?.slice(0, 1) + comment.owner?.lastName?.slice(0, 1)
            : comment.owner?.emailAddress?.slice(0, 2)}
        </div>
        <div>
          <div>
            {comment?.owner?.firstName} {comment?.owner?.lastName}
          </div>
          <div>{dayjs(comment?.updatedAt)?.fromNow()}</div>
        </div>
      </div>
      <div>
        {isEditMode ? (
          <CommentInput
            value={comment?.text}
            addComment={text => {
              if (updateComment) {
                updateComment({ text, commentId: comment?.id });
              }

              setIsEditMode(false);
            }}
          />
        ) : (
          <div contentEditable={false} dangerouslySetInnerHTML={{ __html: comment?.text }} />
        )}
      </div>

      {!!comment?.replies?.length && (
        <div className={'comment-replies'}>
          {comment?.replies?.map(replyComment => (
            <CommentItem
              key={replyComment?.id}
              isFirstLevel={false}
              updateComment={({ text }) => {
                updateComment({
                  text,
                  commentId: replyComment?.id,
                  parentId: comment?.id,
                });
              }}
              deleteComment={() => {
                deleteComment(replyComment?.id, comment?.id);
              }}
              comment={replyComment as CommentType}
              index={index}
              setLastMessageRef={ref => {
                setLastMessageRef(ref);
              }}
            />
          ))}
        </div>
      )}

      {isShowReplyInput && addComment && (
        <CommentInput addComment={text => addComment(text, comment?.id)} />
      )}

      {isFirstLevel && (
        <button className={'comment-item--reply'} onClick={addReply}>
          Reply
        </button>
      )}

      {user?.userID === comment?.owner?.userId && (
        <CustomLongMenu
          type={MenuViewTypeEnum.VERTICAL}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          item={{ id: 1 }}
          options={options}
          sxStyles={{
            display: 'inline-block',
            background: 'transparent',
          }}
        />
      )}
    </div>
  );
};

export default CommentItem;
