import { FC } from 'react';

import './style.scss';

import { WuTooltip } from '@npm-questionpro/wick-ui-lib';

import CropImage from '@/Components/Shared/CropImage';
import { IMAGE_ASPECT } from '@/Constants';
import { PersonaImageBoxType } from '@/types';
import { ImageSizeEnum } from '@/types/enum.ts';
import { getResizedFileName } from '@/utils/getResizedFileName.ts';

interface IPersonaImageBox {
  title: string;
  imageItem: PersonaImageBoxType;
  size: ImageSizeEnum;
  onPersonaClick?: () => void;
}

export const CROPPED_PERSONA_IMAGE_ASPECT = 3 / 3;

const PersonaImageBox: FC<IPersonaImageBox> = ({ title, imageItem, size, onPersonaClick }) => {
  const imageSize = size.toLowerCase();

  const handleClick = () => {
    if (onPersonaClick) {
      onPersonaClick();
    }
  };

  return (
    <div
      data-testid="persona-image-box-test-id"
      style={{ borderColor: imageItem?.color || '#545E6B ' }}
      onClick={handleClick}
      className={`persona-image-box ${imageSize}-img-size`}>
      <WuTooltip content={title}>
        {imageItem?.attachment.key ? (
          <>
            {imageItem?.attachment?.croppedArea ? (
              <CropImage
                imageSource={`${import.meta.env.VITE_AWS_URL}/${imageItem?.attachment.url}/large${imageItem.attachment?.hasResizedVersions ? getResizedFileName(imageItem?.attachment.key, IMAGE_ASPECT) : imageItem?.attachment.key}`}
                croppedArea={imageItem?.attachment?.croppedArea}
                CROP_AREA_ASPECT={CROPPED_PERSONA_IMAGE_ASPECT}
              />
            ) : (
              <img
                data-testid={'image-box-item-test-id'}
                src={`${import.meta.env.VITE_AWS_URL}/${imageItem?.attachment.url}/large${imageItem.attachment?.hasResizedVersions ? getResizedFileName(imageItem?.attachment.key, IMAGE_ASPECT) : imageItem?.attachment.key}`}
                alt={imageItem?.attachment.key}
              />
            )}
          </>
        ) : (
          <div className={'default-image'} data-testid={'default-image-test-id'}>
            <img
              data-testid={'image-box-item-test-id'}
              src={`${import.meta.env.VITE_AWS_URL}/persona_gallery/static/large/1741253622001.png`}
              alt={imageItem?.attachment.key}
            />
          </div>
        )}
      </WuTooltip>
    </div>
  );
};
export default PersonaImageBox;
