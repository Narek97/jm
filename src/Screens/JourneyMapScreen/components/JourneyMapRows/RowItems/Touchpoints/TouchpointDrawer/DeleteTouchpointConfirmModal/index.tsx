import { FC, useCallback, useMemo } from 'react';

import './style.scss';

import { Skeleton } from '@mui/material';
import { useWuShowToast } from '@npm-questionpro/wick-ui-lib';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

import { DeleteAiJourneyModelMutation } from '@/api/mutations/generated/deleteAiJourneyModel.generated';
import { useDeleteTouchPointAttachmentMutation } from '@/api/mutations/generated/deleteTouchPointAttachment.generated.ts';
import {
  GetAttachmentTouchPointMapsQuery,
  useGetAttachmentTouchPointMapsQuery,
} from '@/api/queries/generated/getAttachmentTouchPointMaps.generated.ts';
import { MapRowTypeEnum } from '@/api/types.ts';
import BaseWuModal from '@/Components/Shared/BaseWuModal';
import EmptyDataInfo from '@/Components/Shared/EmptyDataInfo';
import { ModalConfirmButton } from '@/Components/Shared/ModalConfirmButton';
import { querySlateTime } from '@/constants';
import { useJourneyMapStore } from '@/store/journeyMap.ts';
import { useTouchpointsStore } from '@/store/touchpoints.ts';

interface IDeleteTouchPointAttachmentModal {
  touchPointAttachment: { id: number; url: string; key: string; type: string };
  isOpen: boolean;
  handleClose: () => void;
}

const DeleteTouchPointConfirmModal: FC<IDeleteTouchPointAttachmentModal> = ({
  touchPointAttachment,
  isOpen,
  handleClose,
}) => {
  const { showToast } = useWuShowToast();
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const {
    selectedTouchpoints,
    selectedCustomTouchpoints,
    setSelectedTouchpoints,
    setSelectedCustomTouchpoints,
  } = useTouchpointsStore();

  const { journeyMap, updateJourneyMap } = useJourneyMapStore();

  const removeTouchPointsFromCurrentMap = useCallback(
    (url: string, key: string) => {
      const touchPointIconUrl =
        touchPointAttachment?.type !== 'NOUN_PROJECT_ICON'
          ? `${import.meta.env.VITE_AWS_URL}/${url}/large${key}`
          : url;

      const rows = journeyMap.rows.map(r => {
        if (r.rowFunction === MapRowTypeEnum.Touchpoints) {
          return {
            ...r,
            boxes: r.boxes?.map(box => {
              return {
                ...box,
                touchPoints: box.touchPoints.filter(
                  (touchPoint: { iconUrl: string }) => touchPointIconUrl !== touchPoint.iconUrl,
                ),
              };
            }),
          };
        }
        return r;
      });
      updateJourneyMap({ rows });
    },
    [journeyMap.rows, touchPointAttachment?.type, updateJourneyMap],
  );

  const { data: attachmentTouchPointMapsData, isLoading: isLoadingAttachmentTouchPointMapsData } =
    useGetAttachmentTouchPointMapsQuery<GetAttachmentTouchPointMapsQuery, Error>(
      {
        getAttachmentTouchPointMapsInput: {
          attachmentId: touchPointAttachment?.id,
        },
      },
      {
        enabled: !!touchPointAttachment.id,
        staleTime: querySlateTime,
      },
    );

  const {
    mutate: deleteTouchPointAttachmentMutate,
    isPending: isLoadingDeleteTouchPointAttachmentMutate,
  } = useDeleteTouchPointAttachmentMutation<Error, DeleteAiJourneyModelMutation>({
    onError: error => {
      showToast({
        variant: 'error',
        message: error?.message,
      });
    },
  });

  const handleDeleteTouchPoint = useCallback(() => {
    const { id, url } = touchPointAttachment;
    deleteTouchPointAttachmentMutate(
      {
        deleteTouchPointAttachmentTypeInput: { id, url },
      },
      {
        onSuccess: async () => {
          const refetch = async () => {
            await queryClient.invalidateQueries({
              queryKey: ['GetTouchPointIcons'],
            });
          };
          await refetch();
          setSelectedTouchpoints(selectedTouchpoints.filter(el => el.id !== id));
          setSelectedCustomTouchpoints(selectedCustomTouchpoints.filter(el => el.id !== id));
          removeTouchPointsFromCurrentMap(touchPointAttachment.url, touchPointAttachment.key);
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
  }, [
    deleteTouchPointAttachmentMutate,
    handleClose,
    queryClient,
    removeTouchPointsFromCurrentMap,
    selectedCustomTouchpoints,
    selectedTouchpoints,
    setSelectedCustomTouchpoints,
    setSelectedTouchpoints,
    showToast,
    touchPointAttachment,
  ]);

  const openMap = (boardId: number, id: number) => {
    navigate({
      to: `/board/${boardId}/journey-map/${id}`,
    }).then();
  };

  const touchPointsAssignedMaps = useMemo(() => {
    return attachmentTouchPointMapsData?.getAttachmentTouchPointMaps?.touchpoints.filter(
      (item, index, self) => index === self.findIndex(t => t.map.id === item.map.id),
    );
  }, [attachmentTouchPointMapsData?.getAttachmentTouchPointMaps?.touchpoints]);

  return (
    <BaseWuModal
      headerTitle={'Delete attachment'}
      isOpen={isOpen}
      modalSize={'md'}
      handleClose={handleClose}
      canCloseWithOutsideClick={true}
      ModalConfirmButton={
        <ModalConfirmButton
          disabled={isLoadingDeleteTouchPointAttachmentMutate}
          buttonName={'Delete'}
          onClick={handleDeleteTouchPoint}
        />
      }>
      <div className={'delete-touch-point-attachments--frame'}>
        <div className={'delete-touch-point-attachments--frame--message'}>
          Are you sure you want to delete attachment ?
        </div>
        {isLoadingAttachmentTouchPointMapsData ? (
          <Skeleton height={100} data-testid={'skeleton-test-id'} />
        ) : touchPointsAssignedMaps?.length ? (
          <>
            <div className={'delete-touch-point-attachments--frame--message'}>
              Attachments are assigned in these maps:
            </div>
            <div className={'delete-touch-point-attachments--frame--map-list'}>
              {touchPointsAssignedMaps.map(touchPoint => (
                <span
                  onClick={() => openMap(touchPoint?.map?.boardId, touchPoint?.map?.id)}
                  key={touchPoint?.id}
                  className={'delete-touch-point-attachments--frame--map-list-item'}>
                  {touchPoint?.map?.title}
                </span>
              ))}
            </div>
          </>
        ) : (
          <EmptyDataInfo message={`Touchpoint isn't used in any map.`} />
        )}
      </div>
    </BaseWuModal>
  );
};

export default DeleteTouchPointConfirmModal;
