import { FC, memo, RefObject, useEffect, useState } from 'react';

import { WuTooltip } from '@npm-questionpro/wick-ui-lib';

import CustomInput from '@/Components/Shared/CustomInput';
import { getTextColorBasedOnBackground } from '@/utils/getTextColorBasedOnBackground.ts';

interface IStepInput {
  updateStepColumn: (data: { value: string; id: number }) => void;
  label: string;
  rowId: number | null;
  id: number;
  disabled: boolean;
  columnId: number;
  index: number;
  stepColor: string;
  inputRef: RefObject<HTMLInputElement>;
}

const StepInput: FC<IStepInput> = memo(
  ({ updateStepColumn, label, id, disabled, stepColor, inputRef }) => {
    const [labelValue, setLabelValue] = useState<string>(label || '');
    const [isFocused, setIsFocused] = useState(false);

    const textColor = getTextColorBasedOnBackground(stepColor);

    const toggleFocus = () => setIsFocused(prev => !prev);

    useEffect(() => {
      if (label) {
        setLabelValue(label);
      }
    }, [label]);

    return (
      <WuTooltip className="wu-tooltip-content" content={labelValue} position="top">
        <CustomInput
          id={String(id)}
          inputRef={inputRef}
          data-testid={`step-input-${id}-test-id`}
          sxStyles={{
            '&.Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                border: `0.313rem dotted red`,
              },
            },
            background: 'transparent',
            '& .MuiOutlinedInput-notchedOutline': {
              border: `0.313rem solid green`,
            },
            '& .MuiInputBase-input': {
              maxHeight: '25px !important',
              padding: '0 10px',
              fontWeight: '400',
              fontSize: '0.9rem',
              color: textColor,
              textAlign: 'center',
              wordBreak: 'break-word',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
              ...(isFocused
                ? {
                    textOverflow: 'unset',
                    overflow: 'visible',
                    display: 'block',
                    whiteSpace: 'nowrap',
                  }
                : {
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    whiteSpace: 'normal',
                  }),
            },
          }}
          inputType="secondary"
          placeholder="title..."
          value={labelValue}
          disabled={disabled}
          onChange={e => {
            setLabelValue(e.target.value);
            updateStepColumn({
              value: e.target.value,
              id,
            });
          }}
          onKeyDown={event => {
            if (event.keyCode === 13) {
              event.preventDefault();
              (event.target as HTMLElement).blur();
            }
          }}
          onBlur={toggleFocus}
          onFocus={toggleFocus}
          multiline
          maxRows={2}
        />
      </WuTooltip>
    );
  },
);

export default StepInput;
