import { FC, useEffect, useState } from 'react';

import './style.scss';

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
import BaseWuModal from '@/Components/Shared/BaseWuModal';
import CustomLoader from '@/Components/Shared/CustomLoader';
import EmptyDataInfo from '@/Components/Shared/EmptyDataInfo';
import { querySlateTime } from '@/constants';
import { WORKSPACES_LIMIT } from '@/constants/pagination';
import { useOutcomePinBoardsStore } from '@/store/outcomePinBoards';
import { useOutcomePinnedBoardIdsStore } from '@/store/outcomePinBoardsIds';
import { useUserStore } from '@/store/user';

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
      <div className={'pin-persona-modal-container'}>
        {errorWorkspaces ? (
          <div className={'pin-persona-error'}>
            <div className={'pin-persona-error--text'}>{errorWorkspaces?.message}</div>
          </div>
        ) : (
          <>
            <div className={'info-text'}>Choose workspace for selecting boards</div>
            {selectedIdList?.length > 0 && (
              <div className={'pinned-boards'}>
                There are
                <span className={'pinned-boards-count'}>{selectedIdList?.length}</span>
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
              <div className={'workspaces-list'}>
                <div className={'workspaces-list--content'}>
                  {isLoadingWorkspaces && !workspaces?.length ? (
                    <div className={'workspaces-list-loading-section'}>
                      <CustomLoader />
                    </div>
                  ) : (
                    <>
                      {dataWorkspaces?.getWorkspacesByOrganizationId?.workspaces?.length ? (
                        <ul className={'workspaces-list--content-workspaces'}>
                          {workspaces?.map(itm => (
                            <li
                              key={itm?.id}
                              data-testid="workspace-item-test-id"
                              className={`workspaces-list--content-workspaces-item`}
                              onClick={() => {
                                setWorkspaceId(itm?.id);
                              }}>
                              <div className="workspaces-list--content-workspaces-item--left">
                                <div className={'persona-text-info'}>
                                  <div className={'persona-text-info'}>
                                    <WuTooltip
                                      className="wu-tooltip-content"
                                      content={itm?.name}
                                      position="bottom">
                                      <div className={'persona-text-info--title'}>{itm?.name}</div>
                                    </WuTooltip>
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <EmptyDataInfo message={'There are no workspaces yet'} />
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </BaseWuModal>
  );
};

export default PinPersonaModal;
