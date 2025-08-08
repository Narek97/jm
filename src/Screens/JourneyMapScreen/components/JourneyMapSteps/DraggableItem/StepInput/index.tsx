import { FC, memo, RefObject, useEffect, useState } from 'react';

import { WuTooltip } from '@npm-questionpro/wick-ui-lib';

import BaseWuInput from '@/Components/Shared/BaseWuInput';
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
  inputRef: RefObject<HTMLInputElement | null>;
}

const StepInput: FC<IStepInput> = memo(
  ({ updateStepColumn, label, id, disabled, stepColor, inputRef }) => {
    const [labelValue, setLabelValue] = useState<string>(label || '');

    const textColor = getTextColorBasedOnBackground(stepColor);

    useEffect(() => {
      if (label) {
        setLabelValue(label);
      }
    }, [label]);

    return (
      <WuTooltip className="break-all" content={labelValue} position="top">
        <BaseWuInput
          className={'border-[none] bg-transparent text-[0.75rem]!'}
          id={String(id)}
          inputRef={inputRef}
          data-testid={`step-input-${id}-test-id`}
          style={{
            color: textColor,
          }}
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
        />
      </WuTooltip>
    );
  },
);

export default StepInput;
