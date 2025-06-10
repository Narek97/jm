import { FC, useCallback, useMemo } from 'react';

import './style.scss';

import WorkspaceItem from './WorkspaceItem';

import { useGetWorkspacesForPastQuery } from '@/api/queries/generated/getWorkspacesForPaste.generated';
import { GetWorkspacesForPastQuery } from '@/api/queries/generated/getWorkspacesForPaste.generated.ts';
import CustomLoader from '@/Components/Shared/CustomLoader';
import EmptyDataInfo from '@/Components/Shared/EmptyDataInfo';
import { querySlateTime } from '@/constants';
import ErrorBoundary from '@/Features/ErrorBoundary';
import { useCopyMapStore } from '@/store/copyMap.ts';
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
        <div className={'workspaces-error'}>
          <div className={'workspaces-error--text'}>{errorWorkspaces?.message}</div>
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
              className={'go-back'}>
              <span className={'wm-arrow-back'} />

              <div className={'go-back--text'}>Go to Orgs</div>
            </div>
          )}
          <div data-testid="workspaces-list-id" className={'workspaces-list'}>
            <div className={'workspaces-list--content'}>
              {isLoadingWorkspaces && !workspaces?.length ? (
                <div className={'workspaces-list-loading-section'}>
                  <CustomLoader />
                </div>
              ) : (
                <>
                  {workspaces?.length ? (
                    <ul className={'workspaces-list--content-workspaces'}>
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
          </div>
        </>
      )}
    </>
  );
};

export default OrgWorkspace;
