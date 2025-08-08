import { FC } from 'react';

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
      className={`selectable-item  ${isLoadingCopyMap ? 'processing' : ''}  ${
        isSelected ? 'border-[var(--primary)]!' : ''
      }`}
      onClick={() => handlePasteMap(board?.id)}>
      <div className={'w-full ml-2 truncate max-w-[90%]'}>
        <WuTooltip content={board?.name} showArrow position={'bottom'}>
          <div className={'text-[var(--primary)] font-medium text-base truncate max-w-full'}>{board?.name}</div>
        </WuTooltip>
      </div>
    </li>
  );
};
export default BoardItem;
