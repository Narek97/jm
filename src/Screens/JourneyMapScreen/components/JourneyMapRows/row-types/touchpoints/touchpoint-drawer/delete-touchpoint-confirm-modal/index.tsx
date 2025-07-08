import React, { FC, useCallback, useMemo } from 'react';

import './style.scss';

import { useRouter } from 'next/navigation';

import { Box, Skeleton } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useSetRecoilState } from 'recoil';

import CustomModal from '@/components/atoms/custom-modal/custom-modal';
import ModalFooterButtons from '@/components/molecules/modal-footer-buttons';
import ModalHeader from '@/components/molecules/modal-header';
import EmptyDataInfoTemplate from '@/components/templates/empty-data-info-template';
import { DeleteAiJourneyModelMutation } from '@/gql/mutations/generated/deleteAiJourneyModel.generated';
import { useDeleteTouchPointAttachmentMutation } from '@/gql/mutations/generated/deleteTouchPointAttachment.generated';
import {
  GetAttachmentTouchPointMapsQuery,
  useGetAttachmentTouchPointMapsQuery,
} from '@/gql/queries/generated/getAttachmentTouchPointMaps.generated';
import { MapRowTypeEnum } from '@/gql/types';
import { journeyMapState } from '@/store/atoms/journeyMap.atom';
import { queryCacheTime, querySlateTime } from '@/utils/constants/general';

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
  const queryClient = useQueryClient();

  const setJourneyMap = useSetRecoilState(journeyMapState);

  const removeTouchPointsFromCurrentMap = useCallback(
    (url: string, key: string) => {
      setJourneyMap(prev => {
        const touchPointIconUrl =
          touchPointAttachment?.type !== 'NOUN_PROJECT_ICON'
            ? `${process.env.NEXT_PUBLIC_AWS_URL}/${url}/large${key}`
            : url;
        const rows = prev.rows.map(r => {
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
        return { ...prev, rows };
      });
    },
    [setJourneyMap, touchPointAttachment.type],
  );

  const router = useRouter();

  const { data: attachmentTouchPointMapsData, isLoading: isLoadingAttachmentTouchPointMapsData } =
    useGetAttachmentTouchPointMapsQuery<GetAttachmentTouchPointMapsQuery, Error>(
      {
        getAttachmentTouchPointMapsInput: {
          attachmentId: touchPointAttachment?.id,
        },
      },
      {
        enabled: !!touchPointAttachment.id,
        cacheTime: queryCacheTime,
        staleTime: querySlateTime,
      },
    );

  const {
    mutate: deleteTouchPointAttachmentMutate,
    isLoading: isLoadingDeleteTouchPointAttachmentMutate,
  } = useDeleteTouchPointAttachmentMutation<DeleteAiJourneyModelMutation, Error>();

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
          removeTouchPointsFromCurrentMap(touchPointAttachment.url, touchPointAttachment.key);
          handleClose();
        },
      },
    );
  }, [
    deleteTouchPointAttachmentMutate,
    handleClose,
    queryClient,
    removeTouchPointsFromCurrentMap,
    touchPointAttachment,
  ]);

  const openMap = (boardId: number, id: number) => {
    router.push(`/board/${boardId}/journey-map/${id}`);
  };

  const touchPointsAssignedMaps = useMemo(() => {
    return attachmentTouchPointMapsData?.getAttachmentTouchPointMaps?.touchpoints.filter(
      (item, index, self) => index === self.findIndex(t => t.map.id === item.map.id),
    );
  }, [attachmentTouchPointMapsData?.getAttachmentTouchPointMaps?.touchpoints]);

  return (
    <CustomModal
      isOpen={isOpen}
      modalSize={'md'}
      handleClose={handleClose}
      canCloseWithOutsideClick={true}>
      <ModalHeader title={`Delete attachment`} />
      <div className={'delete-touch-point-attachments--frame'}>
        <div className={'delete-touch-point-attachments--frame--message'}>
          Are you sure you want to delete attachment ?
        </div>
        {isLoadingAttachmentTouchPointMapsData ? (
          <Skeleton height={100} data-testid={'skeleton-test-id'} />
        ) : !!touchPointsAssignedMaps?.length ? (
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
          <EmptyDataInfoTemplate icon={<Box />} message={`Touchpoint isn't used in any map.`} />
        )}
      </div>
      <ModalFooterButtons
        handleFirstButtonClick={handleClose}
        handleSecondButtonClick={handleDeleteTouchPoint}
        isLoading={isLoadingDeleteTouchPointAttachmentMutate}
        secondButtonName={'Delete'}
      />
    </CustomModal>
  );
};

export default DeleteTouchPointConfirmModal;
