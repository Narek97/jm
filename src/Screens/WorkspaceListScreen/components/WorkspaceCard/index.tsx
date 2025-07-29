import { FC } from 'react';

import { useNavigate } from '@tanstack/react-router';
import dayjs from 'dayjs';
import fromNow from 'dayjs/plugin/relativeTime';

import WorkspaceAnalytics from '../../../../Features/WorkspaceAnalytics';

import { WorkspaceType } from '@/Screens/WorkspaceListScreen/types.ts';
import { WorkspaceAnalyticsEnumType } from '@/types/enum.ts';

dayjs.extend(fromNow);

interface IWorkspaceItem {
  workspace: WorkspaceType;
}

const WorkspaceCard: FC<IWorkspaceItem> = ({ workspace }) => {
  const navigate = useNavigate();

  const onHandleNavigateToBoards = () => {
    navigate({ to: `/workspace/${workspace.id}/boards` }).then();
  };

  return (
    <>
      <li
        className={
          'card-borders flex justify-between gap-5 max-w-[74.375rem] min-h-[5.5rem] pt-3.5! pr-[2.9375rem]! pb-4! pl-[1.125rem]!'
        }
        onClick={onHandleNavigateToBoards}
        data-testid="workspace-card-test-id">
        <div className={'flex flex-col justify-between min-h-[3.375rem]'}>
          <p className={'text-[1.5rem] text-[var(--primary)]'}>{workspace.name}</p>
          <p className={'text-[0.75rem]'}>{dayjs(workspace.createdAt)?.format('MMMM D, YYYY')}</p>
          {workspace.description && (
            <div className={'workspace-card--info--description'}>
              <span className={'wm-comment'} />
              <p>{workspace.description}</p>
            </div>
          )}
        </div>
        <WorkspaceAnalytics
          showType={WorkspaceAnalyticsEnumType.BIG}
          data={{
            journeyMapCount: workspace.journeyMapCount || 0,
            personasCount: workspace.personasCount || 0,
          }}
        />
      </li>
    </>
  );
};

export default WorkspaceCard;
