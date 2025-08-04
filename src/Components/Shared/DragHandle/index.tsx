import { FC } from 'react';

interface IDragHandle {
  [key: string]: any;
}

const DragHandle: FC<IDragHandle> = props => (
  <div
    className="
        w-4
h-inherit
    bg-[#d8d8d8]
 group-hover:bg-[#1B87E6]
       absolute
    top-[-0px]
    left-[-1px]
    z-10
h-full
    rounded-l
    hover:cursor-grab
flex items-center justify-center

  "
    aria-label="drag"
    {...props}>
    <span
      className="
        wm-drag-indicator
         opacity-0
        group-hover:opacity-100
        text-white
      "
    />
  </div>
);

export default DragHandle;
