import { FC, Ref, TextareaHTMLAttributes } from 'react';

import { WuTextarea } from '@npm-questionpro/wick-ui-lib';

interface IBaseWuTextarea extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  placeholder?: string;
  inputRef?: Ref<HTMLTextAreaElement>;
  multiline?: boolean;
}

const BaseWuTextarea: FC<IBaseWuTextarea> = ({ placeholder, inputRef, ...inputRestParams }) => {
  return <WuTextarea placeholder={placeholder} ref={inputRef} {...inputRestParams} />;
};

export default BaseWuTextarea;
