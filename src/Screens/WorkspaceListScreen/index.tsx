import { useCallback, useEffect, useMemo, useState } from 'react';

import './style.scss';

import { useTranslation } from 'react-i18next';

import WorkspaceCard from './components/WorkspaceCard';

import {
  GetWorkspacesByOrganizationIdQuery,
  useGetWorkspacesByOrganizationIdQuery,
} from '@/api/queries/generated/getWorkspaces.generated.ts';
import CustomError from '@/Components/Shared/CustomError';
import CustomLoader from '@/Components/Shared/CustomLoader';
import EmptyDataInfo from '@/Components/Shared/EmptyDataInfo';
import Pagination from '@/Components/Shared/Pagination';
import { querySlateTime } from '@/constants';
import { WORKSPACES_LIMIT } from '@/constants/pagination.ts';
import ErrorBoundary from '@/Features/ErrorBoundary';
import { useBreadcrumbStore } from '@/store/breadcrumb.ts';
import { useUserStore } from '@/store/user.ts';

const WorkspaceListScreen = () => {
  const { t } = useTranslation();
  const { user } = useUserStore();
  const { setBreadcrumbs } = useBreadcrumbStore();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [offset, setOffset] = useState<number>(0);

  const {
    isLoading: isLoadingWorkspaces,
    error: errorWorkspaces,
    data: dataWorkspaces,
  } = useGetWorkspacesByOrganizationIdQuery<GetWorkspacesByOrganizationIdQuery, Error>(
    {
      getWorkspacesInput: {
        limit: WORKSPACES_LIMIT,
        offset,
        organizationId: Number(user!.orgID),
      },
    },
    {
      enabled: !!user?.orgID,
      staleTime: querySlateTime,
    },
  );

  const workspaces = useMemo(
    () => dataWorkspaces?.getWorkspacesByOrganizationId.workspaces || [],
    [dataWorkspaces?.getWorkspacesByOrganizationId.workspaces],
  );
  const workspacesCount = useMemo(
    () => dataWorkspaces?.getWorkspacesByOrganizationId.count || 0,
    [dataWorkspaces],
  );

  const onHandleChangePage = useCallback((page: number) => {
    setCurrentPage(page);
    setOffset((page - 1) * WORKSPACES_LIMIT);
  }, []);

  useEffect(() => {
    setBreadcrumbs([
      {
        name: 'Workspaces',
        pathname: '/workspaces',
      },
    ]);
  }, [setBreadcrumbs]);

  if (errorWorkspaces) {
    return <CustomError error={errorWorkspaces?.message} />;
  }

  return (
    <div className={'!py-[2rem] !px-[4rem]'}>
      <div>
        <h3 className={'!text-heading-2'} data-testid="workspace-title-test-id">
          {t('workspace.title')}
        </h3>
      </div>
      <>
        <div className="workspaces-pagination-container">
          {workspacesCount > WORKSPACES_LIMIT && (
            <Pagination
              perPage={WORKSPACES_LIMIT}
              currentPage={currentPage}
              allCount={workspacesCount}
              changePage={onHandleChangePage}
            />
          )}
        </div>
        {isLoadingWorkspaces ? (
          <CustomLoader />
        ) : !workspaces?.length ? (
          <EmptyDataInfo message="There are no organizations" />
        ) : (
          <ul className="workspaces-container">
            {workspaces.map(workspace => (
              <ErrorBoundary key={workspace.id}>
                <WorkspaceCard workspace={workspace} />
              </ErrorBoundary>
            ))}
          </ul>
        )}
      </>
    </div>
  );
};

export default WorkspaceListScreen;
