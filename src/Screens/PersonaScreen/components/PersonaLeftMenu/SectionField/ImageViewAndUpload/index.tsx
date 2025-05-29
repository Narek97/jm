import { FC, memo } from 'react';

import './style.scss';
import CropImage from '@/Components/Shared/CropImage';
import CustomFileUploader from '@/Components/Shared/CustomFileUploader';
import { IMAGE_ASPECT } from '@/constants';
import { CroppedAreaType } from '@/types';
import { getResizedFileName } from '@/utils/getResizedFileName';

interface IImageViewAndUpload {
  avatarKey: string;
  hasResizedVersions: boolean;
  croppedArea: CroppedAreaType | null;
  onlyView: boolean;
  isTemplate?: boolean;
}

const ImageViewAndUpload: FC<IImageViewAndUpload> = memo(
  ({ avatarKey, hasResizedVersions, croppedArea, onlyView, isTemplate }) => {
    const defaultImage = `${import.meta.env.VITE_AWS_URL}/persona_gallery/static/large/1741253622001.png`;
    const imageUrl = avatarKey
      ? `${import.meta.env.VITE_AWS_URL}/${hasResizedVersions ? getResizedFileName(avatarKey, IMAGE_ASPECT) : avatarKey}`
      : defaultImage;

    if (!avatarKey && !isTemplate) {
      return onlyView ? (
        <div>No image</div>
      ) : (
        <div className={'upload-frame'}>
          <CustomFileUploader uploadProgress={0} />
        </div>
      );
    }

    return (
      <div className="image-sections">
        <div className="avatar-border">
          <div className="avatar-border-content">
            {croppedArea ? (
              <>
                <CropImage
                  imageSource={imageUrl}
                  croppedArea={croppedArea}
                  CROP_AREA_ASPECT={3 / 3}
                />
              </>
            ) : (
              <>
                <img className="avatar" src={imageUrl} alt="Avatar" width={100} height={100} />
              </>
            )}
          </div>
        </div>
      </div>
    );
  },
);

export default ImageViewAndUpload;
