import React, { ChangeEvent, FC, memo, useCallback, useEffect, useMemo, useState } from 'react';
import './style.scss';

import Image from 'next/image';
import { usePathname } from 'next/navigation';

import { Skeleton } from '@mui/material';
import Cropper from 'react-easy-crop';
import { useRecoilValue } from 'recoil';

import CustomButton from '@/components/atoms/custom-button/custom-button';
import CustomLongMenu from '@/components/atoms/custom-long-menu/custom-long-menu';
import CustomModal from '@/components/atoms/custom-modal/custom-modal';
import CropImage from '@/components/molecules/crop-image';
import ModalHeader from '@/components/molecules/modal-header';
import { useCrudMapBoxElement } from '@/containers/journey-map-container/hooks/useCRUDMapBoxElement';
import CommentBtn from '@/containers/journey-map-container/journey-map-card-comments-drawer/comment-btn';
import JourneyMapCardNote from '@/containers/journey-map-container/journey-map-card-note';
import NoteBtn from '@/containers/journey-map-container/journey-map-note-btn';
import ImageViewModal from '@/containers/journey-map-container/journey-map-rows/row-types/row-images/row-images-item/image-view-modal';
import JourneyMapCardTags from '@/containers/journey-map-container/journey-map-tags-popover';
import {
  UpdateAttachmentCroppedAreaMutation,
  useUpdateAttachmentCroppedAreaMutation,
} from '@/gql/mutations/generated/updateAttachmentCroppedArea.generated';
import {
  UpdateAttachmentScaleTypeMutation,
  useUpdateAttachmentScaleTypeMutation,
} from '@/gql/mutations/generated/updateAttachmentScaleType.generated';
import { CommentAndNoteModelsEnum, ImgScaleTypeEnum, MapCardTypeEnum } from '@/gql/types';
import { noteStateFamily } from '@/store/atoms/note.atom';
import { IMAGE_ASPECT } from '@/utils/constants/general';
import { JOURNEY_MAP_IMAGE_OPTIONS } from '@/utils/constants/options';
import { getResizedFileName } from '@/utils/helpers/general';
import { ActionsEnum, menuViewTypeEnum } from '@/utils/ts/enums/global-enums';
import { CommentButtonItemType } from '@/utils/ts/types/global-types';
import { BoxItemType } from '@/utils/ts/types/journey-map/journey-map-types';

const CROP_AREA_ASPECT = 3 / 3;

interface IImageCard {
  rowItem: BoxItemType;
  deleteImage: (boxElementId: number) => void;
  disabled: boolean;
  handleUpdateFile: (e: ChangeEvent<HTMLInputElement>, onFinish: () => void) => void;
  changeActiveMode: (isActive: boolean) => void;
}

const ImageCard: FC<IImageCard> = memo(
  ({ rowItem, deleteImage, disabled, handleUpdateFile, changeActiveMode }) => {
    const pathname = usePathname();
    const isGuest = pathname.includes('/guest');
    const { crudBoxElement } = useCrudMapBoxElement();

    const boxImage = rowItem?.boxElements[0];

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isOpenNote, setIsOpenNote] = useState<boolean>(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
    const [isOpenCropModal, setIsOpenCropModal] = useState<boolean>(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [imgScaleType, setImgScaleType] = useState<ImgScaleTypeEnum>(ImgScaleTypeEnum.Fit);

    const [croppedArea, setCroppedArea] = useState<{
      x: number;
      y: number;
      width: number;
      height: number;
    }>(
      boxImage.attachmentPosition || {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
      },
    );

    const [newCroppedArea, setNewCroppedArea] = useState<{
      x: number;
      y: number;
      width: number;
      height: number;
    }>(
      boxImage.attachmentPosition || {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
      },
    );

    const noteData = useRecoilValue(
      noteStateFamily({ type: CommentAndNoteModelsEnum.BoxElement, id: boxImage.id }),
    );
    const hasNote = noteData ? noteData.text.length : boxImage.note?.text.length;

    const { mutate: updateAttachmentScaleType } = useUpdateAttachmentScaleTypeMutation<
      UpdateAttachmentScaleTypeMutation,
      Error
    >();

    const { mutate: updateAttachmentCroppedArea, isLoading: isLoadingAttachmentCroppedArea } =
      useUpdateAttachmentCroppedAreaMutation<UpdateAttachmentCroppedAreaMutation, Error>({
        onSuccess: () => {
          setIsOpenCropModal(false);
        },
      });

    const onHandleToggleNote = useCallback(() => {
      setIsOpenNote(prev => !prev);
    }, []);

    const onHandleChangeImgScale = useCallback(
      (scale: ImgScaleTypeEnum) => {
        setImgScaleType(scale);
        updateAttachmentScaleType(
          {
            updateAttachmentScaleTypeInput: {
              attachmentId: boxImage.attachmentId!,
              imgScaleType: scale,
            },
          },
          {
            onSuccess: () => {
              crudBoxElement(
                {
                  ...boxImage,
                  stepId: rowItem.step.id,
                  previousScale: imgScaleType,
                  attachment: {
                    ...boxImage.attachment,
                    imgScaleType: scale,
                  },
                },
                ActionsEnum.UPDATE,
              );
            },
          },
        );
      },
      [boxImage, crudBoxElement, imgScaleType, rowItem.step.id, updateAttachmentScaleType],
    );

    const onHandleSaveCropImage = () => {
      onHandleChangeImgScale(ImgScaleTypeEnum.Crop);
      setCroppedArea(newCroppedArea);
      updateAttachmentCroppedArea({
        updateAttachmentCroppedAreaInput: {
          attachmentId: boxImage.attachmentId!,
          ...newCroppedArea,
        },
      });
    };

    const options = useMemo(() => {
      return JOURNEY_MAP_IMAGE_OPTIONS({
        onHandleOpenViewModal: () => setIsViewModalOpen(true),
        onHandleFileUpload: (e: ChangeEvent<HTMLInputElement>) => {
          setIsLoading(true);
          handleUpdateFile(e, () => {
            setIsLoading(false);
          });
        },
        onHandleFit: () => {
          onHandleChangeImgScale(ImgScaleTypeEnum.Fit);
        },
        onHandleFill: () => {
          onHandleChangeImgScale(ImgScaleTypeEnum.Fill);
        },
        onHandleCrop: () => {
          setIsOpenCropModal(true);
        },
        onHandleDelete: item => {
          deleteImage(item?.itemId!);
          setIsLoading(true);
        },
      });
    }, [deleteImage, handleUpdateFile, onHandleChangeImgScale]);

    const commentRelatedData: CommentButtonItemType = {
      title: rowItem?.boxTextElement?.text || '',
      itemId: boxImage.id,
      rowId: boxImage.rowId,
      columnId: rowItem.columnId!,
      stepId: rowItem.step.id,
      type: CommentAndNoteModelsEnum.BoxElement,
    };

    const imageSrc = boxImage?.attachment?.hasResizedVersions
      ? `${process.env.NEXT_PUBLIC_AWS_URL}/${getResizedFileName(boxImage.text, IMAGE_ASPECT)}`
      : `${process.env.NEXT_PUBLIC_AWS_URL}/${boxImage.text}`;

    useEffect(() => {
      setImgScaleType(boxImage.attachment?.imgScaleType || ImgScaleTypeEnum.Fit);
    }, [boxImage.attachment?.imgScaleType]);

    return (
      <>
        {isViewModalOpen && (
          <ImageViewModal
            isOpen={isViewModalOpen}
            boxImage={boxImage}
            croppedArea={croppedArea}
            imgScaleType={imgScaleType}
            handleClose={() => setIsViewModalOpen(false)}
          />
        )}

        {isOpenCropModal && (
          <CustomModal
            isOpen={isOpenCropModal}
            modalSize={'md'}
            handleClose={() => setIsOpenCropModal(false)}
            canCloseWithOutsideClick={true}>
            <ModalHeader title={'Crop image'} />
            <div
              className="image-card-cropper-modal"
              data-testid="image-card-cropper-modal-test-id">
              <div className="image-card-cropper">
                <Cropper
                  image={`${process.env.NEXT_PUBLIC_AWS_URL}/${boxImage?.text}`}
                  aspect={CROP_AREA_ASPECT}
                  crop={crop}
                  zoom={zoom}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropAreaChange={setNewCroppedArea}
                />
              </div>
              <div className={'base-modal-footer'}>
                <button
                  className={'base-modal-footer--cancel-btn'}
                  onClick={() => setIsOpenCropModal(false)}
                  disabled={isLoadingAttachmentCroppedArea}>
                  Cancel
                </button>
                <CustomButton
                  startIcon={false}
                  data-testid={'crop-btn-test-id'}
                  sxStyles={{ width: '6.125rem' }}
                  onClick={onHandleSaveCropImage}
                  disabled={isLoadingAttachmentCroppedArea}
                  isLoading={isLoadingAttachmentCroppedArea}>
                  Save
                </CustomButton>
              </div>
            </div>
          </CustomModal>
        )}

        <div key={boxImage?.id} className={'image-card'} data-testid={'image-card-test-id'}>
          {isOpenNote && (
            <JourneyMapCardNote
              type={CommentAndNoteModelsEnum.BoxElement}
              itemId={boxImage.id}
              rowId={boxImage.rowId}
              stepId={rowItem.step.id}
              onClickAway={onHandleToggleNote}
            />
          )}

          {!isGuest && (
            <div className={'image-card--header'}>
              <div className={'image-card--header--comment'}>
                <CommentBtn commentsCount={boxImage.commentsCount} item={commentRelatedData} />
              </div>
              <div className={'image-card--header--note'}>
                <NoteBtn hasValue={!!hasNote} handleClick={onHandleToggleNote} />
              </div>
              <div className={'image-card--header--tag card-header--tag'}>
                <JourneyMapCardTags
                  cardType={MapCardTypeEnum.BoxElement}
                  itemId={boxImage.id}
                  changeActiveMode={changeActiveMode}
                  attachedTagsCount={boxImage.tagsCount || 0}
                  createTagItemAttrs={{
                    stepId: rowItem.step.id,
                    columnId: rowItem.columnId!,
                    rowId: boxImage.rowId,
                  }}
                />
              </div>

              <div className={'image-card--header--menu'}>
                <CustomLongMenu
                  type={menuViewTypeEnum.VERTICAL}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  item={commentRelatedData}
                  options={options}
                  disabled={disabled}
                  sxStyles={{
                    display: 'inline-block',
                    background: 'transparent',
                  }}
                />
              </div>
            </div>
          )}

          {isLoading ? (
            <Skeleton
              sx={{
                width: '100%',
                height: '100%',
                borderRadius: 1,
              }}
              animation="wave"
              variant="rectangular"
            />
          ) : (
            <>
              {imgScaleType === ImgScaleTypeEnum.Crop ? (
                <div className={'cropped-content'}>
                  <CropImage
                    imageSource={imageSrc}
                    croppedArea={croppedArea}
                    CROP_AREA_ASPECT={CROP_AREA_ASPECT}
                  />
                </div>
              ) : (
                <div className="output">
                  <Image
                    src={imageSrc}
                    alt="Img"
                    loading="eager"
                    onClick={() => setIsViewModalOpen(true)}
                    width={260}
                    height={260}
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: `${imgScaleType === ImgScaleTypeEnum.Fit ? 'contain' : 'cover'}`,
                    }}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </>
    );
  },
);

export default ImageCard;
