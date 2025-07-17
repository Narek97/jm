import { FC, MouseEvent, useState } from 'react';

import './style.scss';

import { WuTooltip } from '@npm-questionpro/wick-ui-lib';

import { CommentButtonItemType } from '@/Screens/JourneyMapScreen/types.ts';
import { useNotesAndCommentsDrawerStore } from '@/store/comments.ts';

interface ICommentBtn {
  item: CommentButtonItemType;
  commentsCount: number;
}

const CommentBtn: FC<ICommentBtn> = ({ item, commentsCount }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { notesAndCommentsDrawer, updateNotesAndCommentsDrawer } = useNotesAndCommentsDrawerStore();

  const onButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    updateNotesAndCommentsDrawer({
      ...item,
      isOpen: !notesAndCommentsDrawer.isOpen,
    });
  };

  return (
    <WuTooltip
      className="wu-tooltip-content"
      positionOffset={10}
      position={'bottom'}
      content={'Comment'}>
      {commentsCount ? (
        <div
          className={'absolute w-[6px] h-[6px] rounded-[50px] bg-[#1B87E6] top-[2px] left-[2px]'}
        />
      ) : null}
      <button
        data-testid="comment-button-test-id"
        className={'comments-btn'}
        onClick={onButtonClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}>
        <span
          className={'wm-comment'}
          style={{
            color: isHovered ? '#1B3380' : '#545E6B',
          }}
        />
        {commentsCount > 0 && (
          <span className={'comments-count'} style={{ display: 'none' }}>
            {commentsCount > 9 ? '9+' : commentsCount}
          </span>
        )}
      </button>
    </WuTooltip>
  );
};

export default CommentBtn;
