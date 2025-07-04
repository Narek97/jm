import { FC, MouseEvent, useState } from 'react';

import './style.scss';

import { WuTooltip } from '@npm-questionpro/wick-ui-lib';
import { useSetRecoilState } from 'recoil';

import CommentHoverIcon from '@/public/base-icons/comments-hover.svg';
import CommentIndicatorHoverIcon from '@/public/base-icons/comments-indicator-hover.svg';
import CommentIndicatorIcon from '@/public/base-icons/comments-indicator.svg';
import CommentIcon from '@/public/base-icons/comments.svg';
import { notesAndCommentsDrawerState } from '@/store/atoms/notesAndCommentsDrawer.atom';
import { CommentButtonItemType } from '@/utils/ts/types/global-types';

interface ICommentBtn {
  item: CommentButtonItemType;
  commentsCount: number;
}

const CommentBtn: FC<ICommentBtn> = ({ item, commentsCount }) => {
  const [isHovered, setIsHovered] = useState(false);
  const setIsCommentsAndNotesDrawerOpen = useSetRecoilState(notesAndCommentsDrawerState);

  const onButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsCommentsAndNotesDrawerOpen(prev => ({
      ...prev,
      ...item,
      isOpen: !prev?.isOpen,
    }));
  };

  const defaultIcon = commentsCount ? <CommentIndicatorIcon /> : <CommentIcon />;
  const hoverIcon = commentsCount ? <CommentIndicatorHoverIcon /> : <CommentHoverIcon />;

  return (
    <WuTooltip positionOffset={10} position={'bottom'} content={'Comment'}>
      <button
        data-testid="comment-button-test-id"
        className={'comments-btn'}
        onClick={onButtonClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}>
        {isHovered ? hoverIcon : defaultIcon}
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
