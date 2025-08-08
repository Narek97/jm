import { FC, useCallback, useMemo } from 'react';

import WorkspaceItem from './WorkspaceItem';

import { useGetWorkspacesForPastQuery } from '@/api/queries/generated/getWorkspacesForPaste.generated';
import { GetWorkspacesForPastQuery } from '@/api/queries/generated/getWorkspacesForPaste.generated.ts';
import BaseWuLoader from '@/Components/Shared/BaseWuLoader';
import EmptyDataInfo from '@/Components/Shared/EmptyDataInfo';
import { querySlateTime } from '@/Constants';
import ErrorBoundary from '@/Features/ErrorBoundary';
import { useCopyMapStore } from '@/Store/copyMap.ts';
import { CopyMapLevelEnum, CopyMapLevelTemplateEnum } from '@/types/enum.ts';

interface IOrgWorkspace {
  orgId: number;
  level: CopyMapLevelEnum;
}

const OrgWorkspace: FC<IOrgWorkspace> = ({ orgId, level }) => {
  const { setCopyMapState } = useCopyMapStore();

  const {
    data: dataWorkspaces,
    isLoading: isLoadingWorkspaces,
    error: errorWorkspaces,
  } = useGetWorkspacesForPastQuery<GetWorkspacesForPastQuery, Error>(
    {
      orgId: orgId!,
    },
    {
      enabled: !!orgId,
      staleTime: querySlateTime,
    },
  );
  const workspaceItemCLick = useCallback(
    (itm: { id: number }) => {
      setCopyMapState({
        template: CopyMapLevelTemplateEnum.BOARDS,
        workspaceId: itm?.id,
      });
    },
    [setCopyMapState],
  );

  const workspaces = useMemo(
    () => dataWorkspaces?.getWorkspaces || [],
    [dataWorkspaces?.getWorkspaces],
  );

  return (
    <>
      {errorWorkspaces ? (
        <div className={'h-[23.3rem]'}>
          <div className={'pb-[3.75rem] px-5 !pt-[1rem] pb-15 !text-[color:var(--error)]'}>
            {errorWorkspaces?.message}
          </div>
        </div>
      ) : (
        <>
          {level === CopyMapLevelEnum.ORG && (
            <div
              data-testid="go-back-org"
              onClick={() => {
                setCopyMapState({
                  template: CopyMapLevelTemplateEnum.ORGS,
                  orgId: null,
                  workspaceId: null,
                });
              }}
              className={
                'w-40 !my-[0.625rem] mb-4 ml-1 flex items-center justify-center gap-2 text-[var(--BASE_GRAY_COLOR)] hover:cursor-pointer hover:!text-[var(--primary)] group'
              }>
              <span className={'wm-arrow-back'} />
              <div>Go to Orgs</div>
            </div>
          )}
          <div data-testid="workspaces-list-id" className={'p-2 h-[26rem]'}>
            {isLoadingWorkspaces && !workspaces?.length ? (
              <BaseWuLoader />
            ) : (
              <>
                {workspaces?.length ? (
                  <ul className={'h-full p-4 overflow-x-auto'}>
                    {workspaces?.map(workspace => (
                      <ErrorBoundary key={workspace.id}>
                        <WorkspaceItem workspace={workspace} handleClick={workspaceItemCLick} />
                      </ErrorBoundary>
                    ))}
                  </ul>
                ) : (
                  <EmptyDataInfo message={'There are no workspaces yet'} />
                )}
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default OrgWorkspace;
