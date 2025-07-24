import { FC, InputHTMLAttributes, Ref } from 'react';

import { WuInput } from '@npm-questionpro/wick-ui-lib';

interface IBaseWuInput extends InputHTMLAttributes<HTMLInputElement> {
  isIconInput?: boolean;
  placeholder?: string;
  inputRef?: Ref<HTMLInputElement>;
  multiline?: boolean;
}

const BaseWuInput: FC<IBaseWuInput> = ({
  isIconInput = false,
  placeholder,
  inputRef,
  ...inputRestParams
}) => {
  return (
    <WuInput
      Icon={isIconInput ? <span className="wm-search" /> : null}
      placeholder={placeholder}
      ref={inputRef}
      {...inputRestParams}
    />
  );
};

export default BaseWuInput;
