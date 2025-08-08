import { FC } from 'react';

interface IDragHandle {
  [key: string]: any;
}

const DragHandle: FC<IDragHandle> = props => (
  <div
    className={
      'absolute left-[-1px] top-0 z-10 flex h-full w-4 items-center justify-center rounded-l bg-[var(--medium-light-gray)] hover:cursor-grab group-hover:bg-[var(--primary)]'
    }
    aria-label={'drag'}
    {...props}>
    <span className={'wm-drag-indicator opacity-0 text-white group-hover:opacity-100'} />
  </div>
);

export default DragHandle;
