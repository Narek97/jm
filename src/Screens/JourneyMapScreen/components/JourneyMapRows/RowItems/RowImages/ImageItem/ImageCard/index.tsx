import { ChangeEvent, FC, memo, useCallback, useEffect, useMemo, useState } from 'react';

import './style.scss';
import { Skeleton } from '@mui/material';
import { useWuShowToast, WuButton } from '@npm-questionpro/wick-ui-lib';
import { useLocation } from '@tanstack/react-router';
import Cropper from 'react-easy-crop';

import {
  UpdateAttachmentCroppedAreaMutation,
  useUpdateAttachmentCroppedAreaMutation,
} from '@/api/mutations/generated/updateAttachmentCroppedArea.generated.ts';
import {
  UpdateAttachmentScaleTypeMutation,
  useUpdateAttachmentScaleTypeMutation,
} from '@/api/mutations/generated/updateAttachmentScaleType.generated.ts';
import { CommentAndNoteModelsEnum, ImgScaleTypeEnum } from '@/api/types.ts';
import CropImage from '@/Components/Shared/CropImage';
import CustomLongMenu from '@/Components/Shared/CustomLongMenu';
import CustomModal from '@/Components/Shared/CustomModal';
import CustomModalHeader from '@/Components/Shared/CustomModalHeader';
import { IMAGE_ASPECT } from '@/constants';
import ImageViewModal from '@/Screens/JourneyMapScreen/components/JourneyMapRows/RowItems/RowImages/ImageItem/ImageCard/ImageViewModal';
import { JOURNEY_MAP_IMAGE_OPTIONS } from '@/Screens/JourneyMapScreen/constants.tsx';
import { useCrudMapBoxElement } from '@/Screens/JourneyMapScreen/hooks/useCRUDMapBoxElement.tsx';
import { BoxType, CommentButtonItemType } from '@/Screens/JourneyMapScreen/types.ts';
import { CroppedAreaType } from '@/types';
import { ActionsEnum, MenuViewTypeEnum } from '@/types/enum.ts';
import { getResizedFileName } from '@/utils/getResizedFileName.ts';

const CROP_AREA_ASPECT = 3 / 3;

interface IImageCard {
  boxItem: BoxType;
  deleteImage: (boxElementId: number) => void;
  disabled: boolean;
  handleUpdateFile: (e: ChangeEvent<HTMLInputElement>, onFinish: () => void) => void;
  changeActiveMode: (isActive: boolean) => void;
}

const ImageCard: FC<IImageCard> = memo(
  ({ boxItem, deleteImage, disabled, handleUpdateFile, changeActiveMode }) => {
    const { showToast } = useWuShowToast();

    const location = useLocation();
    const isGuest = location.pathname.includes('/guest');

    const { crudBoxElement } = useCrudMapBoxElement();

    const boxImage = boxItem?.boxElements[0];

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isOpenNote, setIsOpenNote] = useState<boolean>(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
    const [isOpenCropModal, setIsOpenCropModal] = useState<boolean>(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [imgScaleType, setImgScaleType] = useState<ImgScaleTypeEnum>(ImgScaleTypeEnum.Fit);

    const [croppedArea, setCroppedArea] = useState<CroppedAreaType>(
      boxImage.attachmentPosition || {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
      },
    );

    const [newCroppedArea, setNewCroppedArea] = useState<CroppedAreaType>(
      boxImage.attachmentPosition || {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
      },
    );

    // todo
    // const noteData = useRecoilValue(
    //   noteStateFamily({ type: CommentAndNoteModelsEnum.BoxElement, id: boxImage.id }),
    // );
    // const hasNote = noteData ? noteData.text.length : boxImage.note?.text.length;
    // const hasNote = false;

    const { mutate: updateAttachmentScaleType } = useUpdateAttachmentScaleTypeMutation<
      Error,
      UpdateAttachmentScaleTypeMutation
    >({
      onError: error => {
        showToast({
          variant: 'error',
          message: error?.message,
        });
      },
    });

    const { mutate: updateAttachmentCroppedArea, isPending: isLoadingAttachmentCroppedArea } =
      useUpdateAttachmentCroppedAreaMutation<Error, UpdateAttachmentCroppedAreaMutation>({
        onSuccess: () => {
          setIsOpenCropModal(false);
        },
        onError: error => {
          showToast({
            variant: 'error',
            message: error?.message,
          });
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
                  stepId: boxItem.step?.id,
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
      [boxImage, crudBoxElement, imgScaleType, boxItem.step?.id, updateAttachmentScaleType],
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
          deleteImage(item?.itemId);
          setIsLoading(true);
        },
      });
    }, [deleteImage, handleUpdateFile, onHandleChangeImgScale]);

    const commentRelatedData: CommentButtonItemType = {
      title: boxItem?.boxTextElement?.text || '',
      itemId: boxImage.id,
      rowId: boxImage.rowId,
      columnId: boxItem.columnId,
      stepId: boxItem.step?.id || 0,
      type: CommentAndNoteModelsEnum.BoxElement,
    };

    const imageSrc = boxImage?.attachment?.hasResizedVersions
      ? `${import.meta.env.VITE_AWS_URL}/${getResizedFileName(boxImage.text || '', IMAGE_ASPECT)}`
      : `${import.meta.env.VITE_AWS_URL}/${boxImage.text}`;

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
            <CustomModalHeader title={'Crop image'} />
            <div
              className="image-card-cropper-modal"
              data-testid="image-card-cropper-modal-test-id">
              <div className="image-card-cropper">
                <Cropper
                  image={`${import.meta.env.VITE_AWS_URL}/${boxImage?.text}`}
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
                <WuButton
                  data-testid={'crop-btn-test-id'}
                  onClick={onHandleSaveCropImage}
                  disabled={isLoadingAttachmentCroppedArea}>
                  Save
                </WuButton>
              </div>
            </div>
          </CustomModal>
        )}

        <div key={boxImage?.id} className={'image-card'} data-testid={'image-card-test-id'}>
          {/*{isOpenNote && (*/}
          {/*  <JourneyMapCardNote*/}
          {/*    type={CommentAndNoteModelsEnum.BoxElement}*/}
          {/*    itemId={boxImage.id}*/}
          {/*    rowId={boxImage.rowId}*/}
          {/*    stepId={boxItem.step.id}*/}
          {/*    onClickAway={onHandleToggleNote}*/}
          {/*  />*/}
          {/*)}*/}

          {!isGuest && (
            <div className={'image-card--header'}>
              <div className={'image-card--header--comment'}>
                {/*<CommentBtn commentsCount={boxImage.commentsCount} item={commentRelatedData} />*/}
              </div>
              <div className={'image-card--header--note'}>
                {/*<NoteBtn hasValue={!!hasNote} handleClick={onHandleToggleNote} />*/}
              </div>
              <div className={'image-card--header--tag card-header--tag'}>
                {/*todo*/}
                {/*<JourneyMapCardTags*/}
                {/*  cardType={MapCardTypeEnum.BoxElement}*/}
                {/*  itemId={boxImage.id}*/}
                {/*  changeActiveMode={changeActiveMode}*/}
                {/*  attachedTagsCount={boxImage.tagsCount || 0}*/}
                {/*  createTagItemAttrs={{*/}
                {/*    stepId: boxItem.step?.id,*/}
                {/*    columnId: boxItem.columnId,*/}
                {/*    rowId: boxImage.rowId,*/}
                {/*  }}*/}
                {/*/>*/}
              </div>

              <div className={'image-card--header--menu'}>
                <CustomLongMenu
                  type={MenuViewTypeEnum.VERTICAL}
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
                  <img
                    src={imageSrc}
                    alt="Img"
                    loading="eager"
                    onClick={() => setIsViewModalOpen(true)}
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
