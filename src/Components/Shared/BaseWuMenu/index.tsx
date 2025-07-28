import { ReactElement } from 'react';

import { WuMenu, WuMenuItem, WuMenuSeparatorItem } from '@npm-questionpro/wick-ui-lib';

import { MenuOptionsType } from '@/types';

interface IBaseWuMenu<T> {
  options: Array<MenuOptionsType<T>>;
  topOptions?: Array<MenuOptionsType<T>>;
  item?: T;
  subOptions?: Array<MenuOptionsType<T>>;
  trigger?: ReactElement<HTMLBaseElement>;
  side?: 'left' | 'right' | 'top' | 'bottom';
  align?: 'start' | 'center' | 'end';
  name?: string;
  className?: string;
  disabled?: boolean;
  onCloseFunction?: () => void;
}

const BaseWuMenu = <T,>({
  options,
  topOptions,
  item,
  trigger = <span className={'wm-more-vert cursor-pointer'} />,
  side = 'bottom',
  align = 'end',
  name,
  className,
  disabled,
  onCloseFunction,
}: IBaseWuMenu<T>) => {
  const onHandleSelect = (option: MenuOptionsType<T>) => {
    option.onClick?.(item);
  };

  return (
    <WuMenu
      name={name}
      Trigger={name ? undefined : trigger}
      side={side}
      align={align}
      disabled={disabled}
      onOpenChange={isOpen => {
        if (!isOpen && onCloseFunction) {
          onCloseFunction();
        }
      }}
      className={`${className} w-[fit-content]`}>
      {topOptions && (
        <>
          {topOptions.map((option, index) => {
            return (
              <WuMenuItem
                className={'cursor-pointer'}
                key={index}
                onSelect={() => onHandleSelect(option)}>
                <>{option.icon}</>
                <>{option.name}</>
              </WuMenuItem>
            );
          })}
          <WuMenuSeparatorItem />
        </>
      )}
      {options.map((option, index) => {
        return (
          <WuMenuItem
            className={'cursor-pointer'}
            key={index}
            onSelect={() => onHandleSelect(option)}>
            <>{option.icon}</>
            <>{option.name}</>
          </WuMenuItem>
        );
      })}
    </WuMenu>
  );
};

export default BaseWuMenu;
