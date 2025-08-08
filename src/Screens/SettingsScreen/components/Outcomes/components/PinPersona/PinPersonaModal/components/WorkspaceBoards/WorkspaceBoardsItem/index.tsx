import { FC, memo } from 'react';

import { WuTooltip } from '@npm-questionpro/wick-ui-lib';

import { truncateName } from '@/utils/truncateName.ts';

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
        className={`card-borders mb-4! pt-[0.625rem]! px-[0.75rem]! pb-[0.75rem]! ${isSelected ? 'selected-card-borders' : ''}`}
        onClick={() => handleSelectBoard(itm?.id, !isSelected)}>
        <div>
          <div className={'board-item-text-info'}>
            <WuTooltip className="break-all" content={itm?.name} position="bottom">
              <div className={'persona-text-info--title'}>{truncateName(itm?.name || '', 25)}</div>
            </WuTooltip>
          </div>
        </div>
      </li>
    );
  },
);
export default WorkspaceBoardItem;
