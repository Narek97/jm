import { FC } from 'react';

import './style.scss';
import { useWuShowToast, WuButton } from '@npm-questionpro/wick-ui-lib';
import { useQueryClient } from '@tanstack/react-query';

import BoardMaps from './components/BoardMaps';
import Orgs from './components/Orgs';
import OrgWorkspaces from './components/OrgWorkspaces';
import WorkspaceBoards from './components/WorkspaceBoards';

import { CopyMapMutation, useCopyMapMutation } from '@/api/mutations/generated/copyMap.generated';
import CustomModal from '@/Components/Shared/CustomModal';
import CustomModalHeader from '@/Components/Shared/CustomModalHeader';
import { CopyMapType } from '@/Screens/AdminScreen/components/CopyMap/components/CopyMapModal/types.ts';
import { useCopyMapStore } from '@/store/copyMap.ts';
import { CopyMapLevelEnum, CopyMapLevelTemplateEnum } from '@/types/enum.ts';
import { getPageContentByKey } from '@/utils/getPageContentByKey.ts';

interface IAssignPersonaToMapModal {
  isOpen: boolean;
  orgId: number;
  level: CopyMapLevelEnum;
  handleClose: () => void;
  mapId?: number;
  currentBoardId?: number;
  handleOnSuccess?: (copyMap: CopyMapType) => void;
}

const CopyMapModal: FC<IAssignPersonaToMapModal> = ({
  isOpen,
  orgId,
  handleClose,
  level,
  currentBoardId,
  handleOnSuccess,
}) => {
  const queryClient = useQueryClient();

  const { showToast } = useWuShowToast();

  const {
    setCopyMapState,
    reset,
    isProcessing,
    mapId,
    orgId: selectedOrgId,
    workspaceId,
    boardId,
    template,
  } = useCopyMapStore();

  const { mutate: copyMap, isPending: isLoadingCopyMap } = useCopyMapMutation<
    Error,
    CopyMapMutation
  >({
    onSuccess: async () => {
      setCopyMapState({ isProcessing: false });
      await queryClient.invalidateQueries({
        queryKey: ['GetBoardOutcomesStat'],
      });
    },
    onError: error => {
      showToast({
        variant: 'error',
        message: error?.message,
      });
      setCopyMapState({ isProcessing: false });
    },
  });

  const handleCopyMap = () => {
    setCopyMapState({ isProcessing: true });

    copyMap(
      {
        copyMapInput: {
          boardId: boardId!,
          mapId: mapId!,
        },
      },
      {
        onSuccess: async response => {
          if (response.copyMap.boardId === (currentBoardId || boardId) && handleOnSuccess) {
            handleOnSuccess(response.copyMap);
          }

          showToast({
            variant: 'success',
            message: 'The map was copied to the selected board successfully.',
          });
          if (currentBoardId && boardId === +currentBoardId) {
            await queryClient.invalidateQueries({ queryKey: ['GetJourneys'] });
          }
          reset();
          handleClose();
        },
        onError: error => {
          showToast({
            variant: 'error',
            message: error?.message,
          });
        },
      },
    );
  };

  return (
    <CustomModal
      isOpen={isOpen}
      modalSize={'md'}
      handleClose={() => {
        reset();
        handleClose();
      }}
      canCloseWithOutsideClick={!isProcessing}>
      <CustomModalHeader title={<div className={'assign-modal-header'}>Map copy</div>} />
      <div className={'copy-map-modal--info'}>
        {mapId
          ? ' * Select workspace, then board for pasting the map'
          : 'Choose workspaces, then boards for paste the map'}
      </div>
      {getPageContentByKey({
        content: {
          [CopyMapLevelTemplateEnum.ORGS]: <Orgs />,
          [CopyMapLevelTemplateEnum.WORKSPACES]: (
            <OrgWorkspaces level={level} orgId={selectedOrgId || orgId} />
          ),
          [CopyMapLevelTemplateEnum.BOARDS]: (
            <WorkspaceBoards isLoadingCopyMap={isLoadingCopyMap} workspaceId={workspaceId!} />
          ),
          [CopyMapLevelTemplateEnum.MAPS]: <BoardMaps boardId={boardId!} />,
        },
        key: template,
        defaultPage: <OrgWorkspaces level={level} orgId={selectedOrgId || orgId} />,
      })}
      <div className={'copy-map-modal--footer'}>
        <WuButton
          type={'button'}
          disabled={!(mapId && boardId)}
          data-testid="submit-outcome-test-id"
          onClick={handleCopyMap}>
          Copy
        </WuButton>
      </div>
    </CustomModal>
  );
};

export default CopyMapModal;
