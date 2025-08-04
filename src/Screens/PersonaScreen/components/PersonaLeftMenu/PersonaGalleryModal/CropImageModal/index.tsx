import { FC, memo, useCallback, useState } from 'react';

import { WuButton } from '@npm-questionpro/wick-ui-lib';
import Cropper from 'react-easy-crop';

import { ActionEnum } from '@/api/types.ts';
import BaseWuModal from '@/Components/Shared/BaseWuModal';
import CustomSlider from '@/Components/Shared/CustomSlider';

const CROP_AREA_ASPECT = 3 / 3;

interface ICropImageModal {
  imageFile: string;
  mode: ActionEnum.Add | ActionEnum.Update;
  isOpenCropModal: boolean;
  closeModal: () => void;
  onHandleSaveCropImage: (dat: { x: number; y: number; width: number; height: number }) => void;
}

const CropImageModal: FC<ICropImageModal> = memo(
  ({ imageFile, mode, isOpenCropModal, closeModal, onHandleSaveCropImage }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState<number>(4);
    const [croppedArea, setCroppedArea] = useState<{
      x: number;
      y: number;
      width: number;
      height: number;
    }>({
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    });

    const onCropComplete = useCallback(
      (croppedAreaPercentages: { x: number; y: number; width: number; height: number }) => {
        setCroppedArea(croppedAreaPercentages);
      },
      [],
    );

    const getCroppedImage = () => {
      if (!imageFile || !croppedArea) return;
      onHandleSaveCropImage(croppedArea);
      closeModal();
    };

    const handleChange = (newValue: number) => {
      setZoom(newValue);
    };

    const valueLabelFormat = (value: number) => {
      return Math.round(((value - 1) / (7 - 1)) * 100) + '%';
    };

    const zoomInAndOut = useCallback(
      (type: 'in' | 'out') => {
        setZoom(prev => {
          if ((zoom > 0 && type === 'in') || (zoom > 1 && zoom <= 7 && type === 'out')) {
            if (type === 'in') {
              return prev + 1;
            }
            return prev - 1;
          }
          return prev;
        });
      },
      [zoom],
    );

    return (
      <BaseWuModal
        headerTitle={'Upload photo'}
        isOpen={isOpenCropModal}
        maxHeight={'950'}
        handleClose={closeModal}
        canCloseWithOutsideClick={true}
        ModalConfirmButton={
          <WuButton data-testid={'crop-btn-test-id'} onClick={getCroppedImage}>
            {mode === ActionEnum.Add ? 'Upload' : 'Update'}
          </WuButton>
        }>
        <>
          <div className="relative h-[25rem] w-full">
            <Cropper
              minZoom={1}
              maxZoom={7}
              image={imageFile}
              aspect={CROP_AREA_ASPECT}
              crop={crop}
              zoom={zoom}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <div className="my-4 text-center flex items-center justify-center p-0.5 gap-3">
            <button
              data-testid={'zoom-out'}
              className={'zoom-out-btn'}
              onClick={() => zoomInAndOut('out')}>
              <span className={'wm-chrome-minimize'} />
            </button>
            <CustomSlider
              value={zoom}
              onChange={handleChange}
              min={1}
              max={7}
              step={0.01}
              valueLabelFormat={valueLabelFormat}
            />
            <button
              data-testid={'zoom-in'}
              className={'zoom-in-btn'}
              onClick={() => zoomInAndOut('in')}>
              <span className={'wm-add'} />
            </button>
          </div>
        </>
      </BaseWuModal>
    );
  },
);

export default CropImageModal;
