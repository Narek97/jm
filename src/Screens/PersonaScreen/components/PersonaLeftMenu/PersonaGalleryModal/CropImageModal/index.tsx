import { FC, memo, useCallback, useState } from 'react';

import './style.scss';
import Slider from '@mui/material/Slider';
import { WuButton } from '@npm-questionpro/wick-ui-lib';
import Cropper from 'react-easy-crop';

import { ActionEnum } from '@/api/types.ts';
import BaseWuModal from '@/Components/Shared/BaseWuModal';

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

    const handleChange = (_: Event, newValue: number | number[]) => {
      setZoom(newValue as number);
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

    const sliderSx = {
      width: 292,
      MuiSlider: {
        thumb: {
          '&$focused, &$activated, &$jumped, &:hover': {
            boxShadow: 'none',
          },
        },
      },
      color: '#D8D8D8',
      height: 6,
      '& .MuiSlider-track': {
        height: 4,
        backgroundColor: '#D8D8D8',
      },
      '& .MuiSlider-rail': {
        height: 4,
        borderRadius: 0,
        backgroundColor: '#D8D8D8',
        opacity: 1,
        boxShadow: 'inherit !important',
      },
      '& .MuiSlider-thumb': {
        backgroundColor: '#1B87E6',
        width: 16,
        height: 16,
        boxShadow: 'inherit !important',
      },
      '& .MuiSlider-valueLabel': {
        backgroundColor: '#555555',
        width: 38,
        height: 32,
        fontSize: 12,
        '&::before': {
          top: -8,
          left: 14,
        },
        '&.MuiSlider-valueLabelOpen': {
          transform: 'translate(14%, 105%) scale(1)',
        },
      },
    };

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
        <div className="persona-image-card-cropper-modal">
          <div className="persona-image-card-cropper-modal--content">
            <div className="image-card-cropper">
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
            <div className="controls">
              <button
                data-testid={'zoom-out'}
                className={'zoom-out-btn'}
                onClick={() => zoomInAndOut('out')}>
                <span className={'wm-chrome-minimize'} />
              </button>
              <Slider className={'!w-full'}
                aria-label="Small steps"
                defaultValue={3}
                min={1}
                max={7}
                step={0.01}
                value={zoom}
                onChange={handleChange}
                valueLabelDisplay="auto"
                sx={sliderSx}
                valueLabelFormat={valueLabelFormat}
              />
              <button
                data-testid={'zoom-in'}
                className={'zoom-in-btn'}
                onClick={() => zoomInAndOut('in')}>
                <span className={'wm-add'} />
              </button>
            </div>
          </div>
        </div>
      </BaseWuModal>
    );
  },
);

export default CropImageModal;
