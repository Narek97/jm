import { FC } from 'react';

import './style.scss';
import { ImgScaleTypeEnum } from '@/api/types';
import BaseWuModal from '@/Components/Shared/BaseWuModal';
import CropImage from '@/Components/Shared/CropImage';
import { IMAGE_ASPECT_LARGE } from '@/Constants';
import { BoxElementType } from '@/Screens/JourneyMapScreen/types.ts';
import { CroppedAreaType } from '@/types';
import { getResizedFileName } from '@/utils/getResizedFileName.ts';

const CROP_AREA_ASPECT = 3 / 3;

interface IImageViewModal {
  isOpen: boolean;
  boxImage: BoxElementType;
  croppedArea: CroppedAreaType;
  imgScaleType: ImgScaleTypeEnum;
  handleClose: () => void;
}

const ImageViewModal: FC<IImageViewModal> = ({
  isOpen,
  boxImage,
  croppedArea,
  imgScaleType,
  handleClose,
}) => {
  return (
    <BaseWuModal
      headerTitle={''}
      maxHeight={'900'}
      modalSize={'md'}
      isOpen={isOpen}
      handleClose={handleClose}
      canCloseWithOutsideClick={true}>
      <div className={'image-view'}>
        {imgScaleType === ImgScaleTypeEnum.Crop ? (
          <CropImage
            imageSource={`${import.meta.env.VITE_AWS_URL}/${boxImage?.attachment?.hasResizedVersions ? getResizedFileName(boxImage?.text || '', IMAGE_ASPECT_LARGE) : boxImage?.text}`}
            croppedArea={croppedArea}
            CROP_AREA_ASPECT={CROP_AREA_ASPECT}
          />
        ) : (
          <img
            src={`${import.meta.env.VITE_AWS_URL}/${boxImage?.attachment?.hasResizedVersions ? getResizedFileName(boxImage?.text || '', IMAGE_ASPECT_LARGE) : boxImage?.text}`}
            alt="Img"
            style={{
              width: '100%',
              height: '100%',
              objectFit: `${imgScaleType === ImgScaleTypeEnum.Fit ? 'contain' : 'cover'}`,
            }}
          />
        )}
      </div>
    </BaseWuModal>
  );
};

export default ImageViewModal;
