import './style.scss';
import { FC } from 'react';

interface IDragHandle {
  [key: string]: any;
}

const DragHandle: FC<IDragHandle> = props => (
  <div className={'drag-handle-area dragging'} aria-label={'drag'} {...props}>
    <span className={'wm-drag-indicator'} />
  </div>
);

export default DragHandle;
