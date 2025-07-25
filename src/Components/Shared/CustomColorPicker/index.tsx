import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';

import './style.scss';
import { HexColorPicker as Colorful } from 'react-colorful';

import CustomClickAwayListener from '@/Components/Shared/CustomClickAwayListener';

interface ICustomColorPicker {
  defaultColor: string;
  onSelect?: (color: string) => void;
  onChange?: (color: string) => void;
  className?: string;
  isOpen?: boolean;
}

interface ColorPickerRef {
  openColorPicker: () => void;
}

const CustomColorPicker = forwardRef<ColorPickerRef, ICustomColorPicker>(
  ({ defaultColor, onSelect, onChange, className = '', isOpen = false }, ref) => {
    const [selectedColor, setSelectedColor] = useState<string>(defaultColor);
    const [showColorsWheel, setShowColorsWheel] = useState<boolean>(isOpen);

    useImperativeHandle(ref, () => ({
      openColorPicker,
    }));
    const openColorPicker = () => {
      setShowColorsWheel(true);
    };

    const changeColor = (color: string) => {
      setSelectedColor(color);
      if (onChange) {
        onChange(color);
      }
    };

    const closeColorPicker = useCallback(() => {
      if (onSelect) {
        onSelect(selectedColor);
      }
      setShowColorsWheel(false);
    }, [onSelect, selectedColor]);

    const onHandleKeydown = useCallback(
      (e: KeyboardEvent) => {
        if (e.code === 'Escape' || e.keyCode === 27) {
          closeColorPicker();
        }
      },
      [closeColorPicker],
    );

    useEffect(() => {
      document.addEventListener('keydown', onHandleKeydown);
      return () => {
        document.removeEventListener('keydown', onHandleKeydown);
      };
    }, [onHandleKeydown]);

    useEffect(() => {
      setSelectedColor(defaultColor);
    }, [defaultColor]);

    return (
      <div className={`color-picker ${className}`} data-testid="color-picker-test-id">
        <div
          style={{ backgroundColor: selectedColor }}
          className={'color-picker-circle'}
          data-testid="color-picker-color-test-id"
          onClick={openColorPicker}
        />
        {showColorsWheel && (
          <CustomClickAwayListener onClickAway={closeColorPicker}>
            <div className={'wheel-color-picker'} data-testid="wheel-color-picker-test-id">
              <Colorful
                color={selectedColor}
                onChange={color => {
                  changeColor(color);
                }}
              />
            </div>
          </CustomClickAwayListener>
        )}
      </div>
    );
  },
);

export default CustomColorPicker;
