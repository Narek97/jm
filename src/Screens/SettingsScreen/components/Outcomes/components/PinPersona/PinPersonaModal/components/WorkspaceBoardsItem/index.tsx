import { FC, memo } from 'react';

import './style.scss';
import { WuTooltip } from '@npm-questionpro/wick-ui-lib';

import { truncateName } from '@/utils/truncateName';

interface IWorkspaceBoardItem {
  itm: any;
  isSelected: boolean;
  handleSelectBoard: (id: number, isSelected: boolean) => void;
}

const WorkspaceBoardItem: FC<IWorkspaceBoardItem> = memo(
  ({ itm, isSelected, handleSelectBoard }) => {
    return (
      <li
        data-testid={`board-item-test-id-${itm?.id}`}
        className={`board-item ${isSelected ? 'selected-persona' : ''}`}
        onClick={() => handleSelectBoard(itm?.id, !isSelected)}>
        <div>
          <div className={'board-item-text-info'}>
            <WuTooltip content={itm?.name} position="bottom">
              <div className={'persona-text-info--title'}>{truncateName(itm?.name || '', 25)}</div>
            </WuTooltip>
          </div>
        </div>
      </li>
    );
  },
);
export default WorkspaceBoardItem;
