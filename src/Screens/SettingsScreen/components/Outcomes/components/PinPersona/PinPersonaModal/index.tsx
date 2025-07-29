import { FC, useEffect, useState } from 'react';

import { WuButton, WuTooltip } from '@npm-questionpro/wick-ui-lib';

import WorkspaceBoards from './components/WorkspaceBoards';

import {
  GetAllPinnedBoardsQuery,
  useGetAllPinnedBoardsQuery,
} from '@/api/queries/generated/getAllPinnedBoards.generated';
import {
  GetWorkspacesByOrganizationIdQuery,
  useGetWorkspacesByOrganizationIdQuery,
} from '@/api/queries/generated/getWorkspaces.generated';
import BaseWuLoader from '@/Components/Shared/BaseWuLoader';
import BaseWuModal from '@/Components/Shared/BaseWuModal';
import EmptyDataInfo from '@/Components/Shared/EmptyDataInfo';
import { querySlateTime } from '@/Constants';
import { WORKSPACES_LIMIT } from '@/Constants/pagination';
import { useOutcomePinBoardsStore } from '@/Store/outcomePinBoards';
import { useOutcomePinnedBoardIdsStore } from '@/Store/outcomePinBoardsIds';
import { useUserStore } from '@/Store/user';

interface IPinPersonaModal {
  isOpen: boolean;
  outcomeGroupId?: number;
  updatePinnedBoardsList: (data: { pinned: number[] }) => void;
  handleClose: () => void;
}

const PinPersonaModal: FC<IPinPersonaModal> = ({ isOpen, outcomeGroupId, handleClose }) => {
  const { user } = useUserStore();
  const { outcomePinnedBoardIds, setOutcomePinnedBoardIds } = useOutcomePinnedBoardIdsStore();
  const { selectedIdList, setSelectedIdList } = useOutcomePinBoardsStore();

  const [workspaceId, setWorkspaceId] = useState<number | null>(null);

  const { data, isSuccess } = useGetAllPinnedBoardsQuery<GetAllPinnedBoardsQuery, Error>(
    {
      outcomeGroupId: outcomeGroupId!,
    },
    {
      enabled: !!outcomeGroupId && !outcomePinnedBoardIds[outcomeGroupId],
    },
  );

  useEffect(() => {
    if (data && outcomeGroupId && !outcomePinnedBoardIds[outcomeGroupId]) {
      setOutcomePinnedBoardIds(prev => ({
        ...prev,
        [outcomeGroupId as number]: {
          default: [...(data?.getAllPinnedBoards || [])],
          selected: data?.getAllPinnedBoards,
        },
      }));
      setSelectedIdList(data?.getAllPinnedBoards || []);
    }
  }, [
    data,
    isSuccess,
    outcomeGroupId,
    outcomePinnedBoardIds,
    setOutcomePinnedBoardIds,
    setSelectedIdList,
  ]);

  const orgId = user?.orgID ? Number(user.orgID) : undefined;

  const {
    isLoading: isLoadingWorkspaces,
    error: errorWorkspaces,
    data: dataWorkspaces,
  } = useGetWorkspacesByOrganizationIdQuery<GetWorkspacesByOrganizationIdQuery, Error>(
    {
      getWorkspacesInput: {
        limit: WORKSPACES_LIMIT,
        offset: 0,
        organizationId: orgId!,
      },
    },
    {
      enabled: !!orgId,
      staleTime: querySlateTime,
    },
  );

  const workspaces = dataWorkspaces?.getWorkspacesByOrganizationId?.workspaces;

  return (
    <BaseWuModal
      isOpen={isOpen}
      modalSize={'md'}
      handleClose={handleClose}
      canCloseWithOutsideClick={!isLoadingWorkspaces}
      headerTitle={'Pin board'}
      ModalConfirmButton={
        <WuButton
          data-testid={'apply-layer-button'}
          style={{ width: '98px' }}
          type={'submit'}
          onClick={() => {
            // update MODE | outcome existst
            setOutcomePinnedBoardIds((prev: any) => {
              return {
                ...prev,
                [outcomeGroupId || 'new']: {
                  default: prev[outcomeGroupId || 'new']?.default,
                  selected: [...selectedIdList],
                },
              };
            });
            handleClose();
          }}>
          Apply
        </WuButton>
      }>
      <div className={'h-[24rem]'}>
        {errorWorkspaces ? (
          <div className={'m-[1.375rem]! mb-0!'}>
            <div className={'text-[var(--error)]'}>{errorWorkspaces?.message}</div>
          </div>
        ) : (
          <>
            <div className={'mx-[1rem]!'}>Choose workspace for selecting boards</div>
            {selectedIdList?.length > 0 && (
              <div className={'mt-4! mx-[1.375rem]!'}>
                There are
                <span className={'mx-1! text-[var(--primary)] font-[var(--font-weight-medium)]'}>
                  {selectedIdList?.length}
                </span>
                selected boards
              </div>
            )}
            {workspaceId ? (
              <WorkspaceBoards
                handleClose={() => {
                  setWorkspaceId(null);
                }}
                outcomeGroupId={outcomeGroupId}
                workspaceId={workspaceId}
              />
            ) : (
              <div className={'px-8! py-4! min-h-[22rem] h-[22rem] overflow-auto'}>
                {isLoadingWorkspaces && !workspaces?.length ? (
                  <BaseWuLoader />
                ) : (
                  <>
                    {dataWorkspaces?.getWorkspacesByOrganizationId?.workspaces?.length ? (
                      <ul>
                        {workspaces?.map(itm => (
                          <li
                            key={itm?.id}
                            data-testid="workspace-item-test-id"
                            className={`card-borders mb-4! pt-[0.625rem]! px-[0.75rem]! pb-[0.75rem]!`}
                            onClick={() => {
                              setWorkspaceId(itm?.id);
                            }}>
                            <WuTooltip
                              className="wu-tooltip-content"
                              content={itm?.name}
                              position="bottom">
                              <div>{itm?.name}</div>
                            </WuTooltip>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <EmptyDataInfo message={'There are no workspaces yet'} />
                    )}
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </BaseWuModal>
  );
};

export default PinPersonaModal;
