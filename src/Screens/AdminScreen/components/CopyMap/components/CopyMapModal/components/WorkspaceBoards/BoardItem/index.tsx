import { FC } from 'react';

import './style.scss';

import { WuTooltip } from '@npm-questionpro/wick-ui-lib';

import { WorkspaceBoardsType } from '../types';

interface IBoardItem {
  board: WorkspaceBoardsType;
  handlePasteMap: (id: number) => void;
  isLoadingCopyMap: boolean;
  isSelected: boolean;
}

const BoardItem: FC<IBoardItem> = ({ board, handlePasteMap, isLoadingCopyMap, isSelected }) => {
  return (
    <li
      data-testid={`board-item-test-id-${board?.id}`}
      className={`board-item ${isLoadingCopyMap ? 'processing' : ''}  ${
        isSelected ? 'selected-item' : ''
      }`}
      onClick={() => handlePasteMap(board?.id)}>
      <div className={'board-item-text-info'}>
        <WuTooltip content={board?.name} showArrow position={'bottom'}>
          <div className={'board-item-text-info--title'}>{board?.name}</div>
        </WuTooltip>
      </div>
    </li>
  );
};
export default BoardItem;
