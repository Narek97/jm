import { FC, useCallback, useEffect, useState } from 'react';

import './style.scss';
import { CroppedAreaType } from '@/types';

interface ICropImage {
  imageSource: string;
  croppedArea: CroppedAreaType;
  CROP_AREA_ASPECT: number;
}

const CropImage: FC<ICropImage> = ({ imageSource, croppedArea }) => {
  const [croppedImage, setCroppedImage] = useState<string | null>(null);

  const rotateSize = (width: number, height: number) => {
    return {
      width: Math.abs(Math.cos(0) * width) + Math.abs(Math.sin(0) * height),
      height: Math.abs(Math.sin(0) * width) + Math.abs(Math.cos(0) * height),
    };
  };

  const createImage = useCallback((url: string) => {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  }, []);

  const getCroppedImg = useCallback(
    async (
      imageSrc: string,
      crop: { x: number; y: number; width: number; height: number },
      flip = { horizontal: false, vertical: false },
    ) => {
      const image = await createImage(imageSrc);

      const pixelCrop = {
        x: (crop.x / 100) * image.width,
        y: (crop.y / 100) * image.height,
        width: (crop.width / 100) * image.width,
        height: (crop.height / 100) * image.height,
      };

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      const { width: bBoxWidth, height: bBoxHeight } = rotateSize(image.width, image.height);

      canvas.width = bBoxWidth;
      canvas.height = bBoxHeight;
      ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
      ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
      ctx.translate(-image.width / 2, -image.height / 2);
      ctx.drawImage(image, 0, 0);

      const croppedCanvas = document.createElement('canvas');
      const croppedCtx = croppedCanvas.getContext('2d');
      if (!croppedCtx) return null;

      croppedCanvas.width = pixelCrop.width;
      croppedCanvas.height = pixelCrop.height;

      croppedCtx.drawImage(
        canvas,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height,
      );

      return new Promise<string>((resolve, reject) => {
        croppedCanvas.toBlob(blob => {
          if (blob) resolve(URL.createObjectURL(blob));
          else reject(new Error('Failed to create blob from canvas'));
        }, 'image/png');
      });
    },
    [createImage],
  );

  const showCroppedImage = useCallback(
    async (croppedArea: any) => {
      try {
        const cropped = await getCroppedImg(imageSource, croppedArea);
        setCroppedImage(cropped);
      } catch (error) {
        console.error('Failed to crop image:', error);
      }
    },
    [getCroppedImg, imageSource],
  );

  useEffect(() => {
    if (croppedArea) {
      showCroppedImage(croppedArea).then();
    }
  }, [croppedArea, showCroppedImage]);

  return (
    <div className="output">
      {croppedImage && <img width={300} height={300} src={croppedImage} alt="Cropped" />}
    </div>
  );
};

export default CropImage;
