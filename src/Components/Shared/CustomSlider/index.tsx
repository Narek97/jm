import React, { useState, useRef, useCallback } from 'react';

interface ICustomSlider {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
  className?: string;
  valueLabelFormat?: (value: number) => string;
}

const CustomSlider: React.FC<ICustomSlider> = ({
  value: controlledValue,
  defaultValue = 0,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  className = '',
  valueLabelFormat,
}) => {
  const [internalValue, setInternalValue] = useState(controlledValue ?? defaultValue);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  const getValueFromPosition = useCallback(
    (clientX: number) => {
      if (!sliderRef.current) return currentValue;

      const rect = sliderRef.current.getBoundingClientRect();
      const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const rawValue = min + percentage * (max - min);
      return Math.round(rawValue / step) * step;
    },
    [min, max, step, currentValue],
  );

  const updateValue = useCallback(
    (newValue: number) => {
      const clampedValue = Math.max(min, Math.min(max, newValue));

      if (!isControlled) {
        setInternalValue(clampedValue);
      }

      if (onChange) {
        onChange(clampedValue);
      }
    },
    [isControlled, onChange, min, max],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);

      const newValue = getValueFromPosition(e.clientX);
      updateValue(newValue);
    },
    [getValueFromPosition, updateValue],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      const newValue = getValueFromPosition(e.clientX);
      updateValue(newValue);
    },
    [isDragging, getValueFromPosition, updateValue],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add global mouse events when dragging
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const percentage = ((currentValue - min) / (max - min)) * 100;

  return (
    <div className={`w-full ${className}`}>
      <div
        ref={sliderRef}
        className="relative h-2 bg-gray-200 rounded-full cursor-pointer"
        onMouseDown={handleMouseDown}>
        {/* Active track */}
        <div
          className="absolute h-full bg-blue-500 rounded-full"
          style={{ width: `${percentage}%` }}
        />

        {/* Thumb */}
        <div
          className="absolute w-5 h-5 bg-white border-2 border-blue-500 rounded-full transform -translate-y-1/2 -translate-x-1/2 cursor-grab"
          style={{
            left: `${percentage}%`,
            top: '50%',
          }}>
          {/* Tooltip */}
          {isDragging && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              {valueLabelFormat ? valueLabelFormat(currentValue) : `${Math.round(percentage)}%`}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45 -mt-1" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomSlider;
