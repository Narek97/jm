import { FC } from 'react';

import './style.scss';
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
}

const WorkspaceAnalytics: FC<IWorkspaceAnalytics> = ({
  data,
  outcomeGroups,
  fontSize,
  showType,
  viewAll,
  pinnedOutcomeGroupCount,
}) => {
  const onHandleClick = () => {};

  return (
    <ul className={'workspace--analytics'} data-testid="workspace--analytics-test-id">
      {data &&
        WORKSPACE_ANALYTICS_ITEMS(onHandleClick)?.map(item => (
          <li
            className={`workspace--analytics--item ${showType || ''}`}
            key={item?.name}
            onClick={item.onClick}>
            <p className={`workspace--analytics--item--count  ${fontSize || ''} `}>
              {data[item.key] || 0}
            </p>
            <div className={'workspace--analytics--item-description-section'}>
              <div className={'workspace--analytics--item--icon'}>{item.icon}</div>
              {showType !== 'horizontal-type' && (
                <span className={'workspace--analytics--item--name'}>{item?.name}</span>
              )}
            </div>
          </li>
        ))}
      {outcomeGroups?.map(outcomeItem => (
        <li className={`workspace--analytics--item ${showType || ''}`} key={outcomeItem?.id}>
          <p className={`workspace--analytics--item--count  ${fontSize || ''} `}>
            {outcomeItem.count || 0}
          </p>
          <div className={'workspace--analytics--item-description-section'}>
            <div className={'workspace--analytics--item--icon'}>
              <img
                src={outcomeItem?.icon}
                alt={outcomeItem?.name || 'logo'}
                style={{
                  width: '0.75rem',
                  height: '0.75rem',
                }}
              />
            </div>
            {showType !== 'horizontal-type' && (
              <span className={'workspace--analytics--item--name'}>{outcomeItem?.name}</span>
            )}
          </div>
        </li>
      ))}
      {viewAll &&
        typeof pinnedOutcomeGroupCount === 'number' &&
        pinnedOutcomeGroupCount > 3 &&
        outcomeGroups && (
          <li
            className={`view-all${fontSize ? ' ' + fontSize : ''}`}
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
