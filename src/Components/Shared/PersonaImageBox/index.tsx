import { FC } from "react";

import "./style.scss";

import { Tooltip } from "@mui/material";

import CropImage from "@/Components/Shared/CropImage";
import { PersonaImageBoxType } from "@/types";
import { ImageSizeEnum } from "@/types/enum.ts";
import { getResizedFileName } from "@/utils/getResizedFileName.ts";

interface IPersonaImageBox {
  title: string;
  imageItem: PersonaImageBoxType;
  size: ImageSizeEnum;
  onPersonaClick?: () => void;
}

export const IMAGE_ASPECT = 1024;
export const CROPPED_PERSONA_IMAGE_ASPECT = 3 / 3;

const PersonaImageBox: FC<IPersonaImageBox> = ({
  title,
  imageItem,
  size,
  onPersonaClick,
}) => {
  const imageSize = size.toLowerCase();

  const handleClick = () => {
    if (onPersonaClick) {
      onPersonaClick();
    }
  };

  return (
    <Tooltip title={title}>
      <div
        data-testid="persona-image-box-test-id"
        style={{ borderColor: imageItem?.color || "#545E6B " }}
        onClick={handleClick}
        className={`persona-image-box ${imageSize}-img-size`}
      >
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
                data-testid={"image-box-item-test-id"}
                src={`${import.meta.env.VITE_AWS_URL}/${imageItem?.attachment.url}/large${imageItem.attachment?.hasResizedVersions ? getResizedFileName(imageItem?.attachment.key, IMAGE_ASPECT) : imageItem?.attachment.key}`}
                alt={imageItem?.attachment.key}
              />
            )}
          </>
        ) : (
          <div
            className={"default-image"}
            data-testid={"default-image-test-id"}
          >
            <img
              data-testid={"image-box-item-test-id"}
              src={`${import.meta.env.VITE_AWS_URL}/persona_gallery/static/large/1741253622001.png`}
              alt={imageItem?.attachment.key}
            />
          </div>
        )}
      </div>
    </Tooltip>
  );
};
export default PersonaImageBox;
