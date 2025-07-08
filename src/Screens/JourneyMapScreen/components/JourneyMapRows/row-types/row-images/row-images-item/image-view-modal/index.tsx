import React, { FC } from 'react';

import './style.scss';

import Image from 'next/image';

import CustomModal from '@/components/atoms/custom-modal/custom-modal';
import CropImage from '@/components/molecules/crop-image';
import { ImgScaleTypeEnum } from '@/gql/types';
import { IMAGE_ASPECT_LARGE } from '@/utils/constants/general';
import { getResizedFileName } from '@/utils/helpers/general';
import { CroppedAreaType } from '@/utils/ts/types/global-types';
import { BoxElementType } from '@/utils/ts/types/journey-map/journey-map-types';

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
    <CustomModal
      modalSize={'md'}
      isOpen={isOpen}
      handleClose={handleClose}
      canCloseWithOutsideClick={true}>
      <div className={'image-view'}>
        {imgScaleType === ImgScaleTypeEnum.Crop ? (
          <CropImage
            imageSource={`${process.env.NEXT_PUBLIC_AWS_URL}/${boxImage?.attachment?.hasResizedVersions ? getResizedFileName(boxImage.text, IMAGE_ASPECT_LARGE) : boxImage.text}`}
            croppedArea={croppedArea}
            CROP_AREA_ASPECT={CROP_AREA_ASPECT}
          />
        ) : (
          <Image
            src={`${process.env.NEXT_PUBLIC_AWS_URL}/${boxImage?.attachment?.hasResizedVersions ? getResizedFileName(boxImage.text, IMAGE_ASPECT_LARGE) : boxImage.text}`}
            alt="Img"
            width={528}
            height={528}
            style={{
              width: '100%',
              height: '100%',
              objectFit: `${imgScaleType === ImgScaleTypeEnum.Fit ? 'contain' : 'cover'}`,
            }}
          />
        )}
      </div>
    </CustomModal>
  );
};

export default ImageViewModal;
