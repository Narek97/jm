import { FC, useState } from 'react';

import './style.scss';
import { DraggableProvidedDragHandleProps } from '@hello-pangea/dnd';

import { getIsDarkColor } from '@/utils/getIsDarkColor.ts';
import { getTextColorBasedOnBackground } from '@/utils/getTextColorBasedOnBackground';

interface IStepColumnDrag {
  columnColor: string;
  dragHandleProps: DraggableProvidedDragHandleProps | null;
}

const StepColumnDrag: FC<IStepColumnDrag> = ({ columnColor, dragHandleProps }) => {
  const [isDragHovered, setIsDragHovered] = useState<boolean>(false);

  return (
    <div
      onMouseEnter={() => setIsDragHovered(true)}
      onMouseLeave={() => setIsDragHovered(false)}
      style={{
        backgroundColor: isDragHovered
          ? getIsDarkColor(columnColor)
            ? 'rgba(255, 255, 255, 0.3)'
            : 'rgba(0, 0, 0, 0.2)'
          : 'inherit',
      }}
      className={'column-step-draggable-item--drag-area'}
      {...dragHandleProps}>
      <span
        className={'wm-drag-indicator'}
        style={{
          color: columnColor ? getTextColorBasedOnBackground(columnColor) : '#9B9B9B',
        }}
      />
    </div>
  );
};

export default StepColumnDrag;
