import { FC } from 'react';

import { GetBoardOutcomesStatQuery } from '@/api/queries/generated/getBoardOutcomesStat.generated.ts';
import { WORKSPACE_ANALYTICS_ITEMS } from '@/Features/WorkspaceAnalytics/constants.tsx';

interface IWorkspaceAnalytics {
  showType?: string;
  fontSize?: string;
  data?: {
    journeyMapCount: number;
    personasCount: number;
  };
  outcomeGroups?: GetBoardOutcomesStatQuery['getBoardOutcomesStat']['outcomeStats'];
  pinnedOutcomeGroupCount?: number;
  viewAll?: () => void;
  className?: string;
}

const WorkspaceAnalytics: FC<IWorkspaceAnalytics> = ({
  data,
  outcomeGroups,
  showType,
  viewAll,
  pinnedOutcomeGroupCount,
  className,
}) => {
  const onHandleClick = () => {};

  return (
    <ul
      className={`flex flex-wrap gap-12 text-[var(--text)] text-xs items-center ${className || ''}`}
      data-testid="workspace--analytics-test-id">
      {data &&
        WORKSPACE_ANALYTICS_ITEMS(onHandleClick)?.map(item => (
          <li
            className={`flex items-center justify-between flex-col cursor-pointer h-fit gap-[0.875rem] ${showType === 'horizontal-type' ? '!min-w-[1.5rem] !flex-row-reverse !gap-1' : ''}`}
            key={item?.name}
            onClick={item.onClick}>
            <p
              className={`mt-2 text-lg font-medium leading-none ${showType === 'horizontal-type' ? '!mt-0 !text-sm' : ''} `}>
              {data[item.key] || 0}
            </p>
            <div className={'flex items-center justify-center gap-1'}>
              <div className={'flex items-center justify-center w-3 h-3 gap-1 text-xs\n'}>
                {item.icon}
              </div>
              {showType !== 'horizontal-type' && (
                <span className={'mx-1 truncate max-w-[8.75rem]'}>{item?.name}</span>
              )}
            </div>
          </li>
        ))}
      {outcomeGroups?.map(outcomeItem => (
        <li
          className={`flex items-center justify-between flex-col cursor-pointer h-fit gap-[0.875rem] ${showType === 'horizontal-type' ? '!min-w-[1.5rem] !flex-row-reverse !gap-1' : ''}`}
          key={outcomeItem?.id}>
          <p
            className={`mt-2 text-lg font-medium leading-none ${showType === 'horizontal-type' ? '!mt-0 !text-sm' : ''}`}>
            {outcomeItem.count || 0}
          </p>
          <div className={'flex items-center justify-center gap-1'}>
            <div className={'flex items-center justify-center w-3 h-3 gap-1 text-xs'}>
              <img
                className={'w-3 h-3'}
                src={outcomeItem?.icon}
                alt={outcomeItem?.name || 'logo'}
              />
            </div>
            {showType !== 'horizontal-type' && (
              <span className={'mx-1 truncate max-w-[8.75rem]'}>{outcomeItem?.name}</span>
            )}
          </div>
        </li>
      ))}
      {viewAll &&
        typeof pinnedOutcomeGroupCount === 'number' &&
        pinnedOutcomeGroupCount > 3 &&
        outcomeGroups && (
          <li
            className={`text-[var(--primary)] cursor-pointer flex items-center justify-center gap-1 text-lg hover:text-[var(--primary)]
            ${showType === 'horizontal-type' ? '!text-sm' : ''}`}
            onClick={e => {
              e.stopPropagation();
              viewAll();
            }}>
            <span>+</span>
            <span>{pinnedOutcomeGroupCount - outcomeGroups.length!}</span>
          </li>
        )}
    </ul>
  );
};

export default WorkspaceAnalytics;
