import { FC, useState } from 'react';

import { WuTooltip } from '@npm-questionpro/wick-ui-lib';

interface INoteBtn {
  handleClick: (e?: any) => void;
  hasValue: boolean;
}

const NoteBtn: FC<INoteBtn> = ({ hasValue, handleClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <WuTooltip positionOffset={10} position={'bottom'} content={'Note'}>
      {hasValue && (
        <div
          className={'absolute w-[6px] h-[6px] rounded-[50px] bg-[#1B87E6] top-[2px] left-[2px]'}
        />
      )}
      <button
        className={'flex items-center justify-center'}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label={'Note'}
        onClick={handleClick}
        data-testid="note-button-test-id">
        <span
          className={'wm-add-notes'}
          style={{
            color: isHovered ? '#1B3380' : '#545E6B',
          }}
        />
      </button>
    </WuTooltip>
  );
};

export default NoteBtn;
