import React from 'react';

import { WuSelect } from '@npm-questionpro/wick-ui-lib';

interface IBaseWuSelect<T> {
  data: Array<T>;
  accessorKey: {
    label: string;
    value: string;
  };
  onSelect: (data: T | T[]) => void;
  onScroll?: (e: React.UIEvent<HTMLElement>) => void;
  disabled?: boolean;
  multiple?: boolean;
  defaultValue?: T | T[];
  name?: string;
  placeholder?: string;
  className?: string;
}

const BaseWuSelect = <T,>({
  data,
  accessorKey,
  onSelect,
  disabled,
  multiple = false,
  defaultValue,
  name,
  placeholder,
  className,
}: IBaseWuSelect<T>) => {
  return (
    <WuSelect
      multiple={multiple}
      className={`${className} w-full`}
      accessorKey={accessorKey}
      data={data}
      onSelect={onSelect}
      data-testid={`${name}-dropdown-test-id`}
      disabled={disabled}
      value={defaultValue}
      placeholder={placeholder}
    />
  );
};

export default BaseWuSelect;
