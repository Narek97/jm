import React, { FC, ReactNode, useCallback, useEffect, useState } from 'react';

import './style.scss';

import { Menu, MenuItem } from '@mui/material';
import { WuTooltip } from '@npm-questionpro/wick-ui-lib';

import { MenuOptionsType, ObjectKeysType } from '@/types';
import { MenuItemIconPositionEnum, MenuViewTypeEnum } from '@/types/enum.ts';
import { getIsDarkColor } from '@/utils/getIsDarkColor.ts';
import { getTextColorBasedOnBackground } from '@/utils/getTextColorBasedOnBackground.ts';

const HORIZONTAL_MENU_SX = {
  display: 'flex',
  overflowX: 'auto',
  maxWidth: '60vw',
};

const VERTICAL_MENU_SX = {
  display: 'flex',
  flexDirection: 'column',
  overflowX: 'auto',
};

const VERTICAL_MENU_ROOT_SX = {
  borderRadius: 0,
  width: 'auto',
  border: '1px solid #1b87e6',
};

const HORIZONTAL_MENU_ROOT_SX = {
  boxShadow: 'none !important',
};

interface ICustomLongMenu {
  anchorOrigin?: {
    vertical: 'top' | 'center' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
  transformOrigin?: {
    vertical: 'top' | 'center' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
  buttonColor?: string;
  item?: any;
  options: Array<MenuOptionsType>;
  subOptions?: Array<MenuOptionsType>;
  sxMenuStyles?: ObjectKeysType;
  rootStyles?: ObjectKeysType;
  sxStyles?: ObjectKeysType;
  type?: MenuViewTypeEnum;
  customButton?: ReactNode | ((value: string) => ReactNode);
  onCloseFunction?: () => void;
  onOpenFunction?: () => void;
  menuItemIconPosition?: MenuItemIconPositionEnum;
  disabled?: boolean;
  buttonId?: string;
  fixedButton?: (close: () => void) => ReactNode;
  menuHeight?: number;
  defaultValue?: number;
  isDefaultOpen?: boolean;
}

const Index: FC<ICustomLongMenu> = ({
  anchorOrigin = { vertical: 'top', horizontal: 'left' },
  transformOrigin = { vertical: 'top', horizontal: 'right' },
  buttonColor,
  options = [],
  subOptions = [],
  item,
  menuItemIconPosition = MenuItemIconPositionEnum.START,
  customButton,
  rootStyles,
  sxMenuStyles,
  onCloseFunction,
  onOpenFunction,
  sxStyles,
  type = MenuViewTypeEnum.HORIZONTAL,
  disabled = false,
  buttonId = 'menu-button',
  fixedButton,
  menuHeight,
  defaultValue,
  isDefaultOpen = false,
}) => {
  const [value, setValue] = useState<number | null>(defaultValue || null);
  const [isHovered, setIsHovered] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpen = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      setAnchorEl(event.currentTarget);
      if (onOpenFunction) {
        onOpenFunction();
      }
    },
    [onOpenFunction],
  );

  const handleClose = (e: React.MouseEvent<Element, MouseEvent>) => {
    e.stopPropagation();
    setAnchorEl(null);
    if (onCloseFunction) {
      onCloseFunction();
    }
  };
  const handleClick = (option: MenuOptionsType) => {
    if (option.onClick) {
      option.onClick(item);
    }
    if (!option.isFileUpload && !option.isColorPicker) {
      setAnchorEl(null);
    }

    if (onCloseFunction) {
      onCloseFunction();
    }
  };

  const primaryClassName = `custom-${type.toLowerCase()}-menu`;

  useEffect(() => {
    if (defaultValue) {
      setValue(defaultValue);
    }
  }, [defaultValue]);

  return (
    <div
      className={`${primaryClassName} ${open || isDefaultOpen ? `${primaryClassName}-open` : ''}`}>
      <button
        type="button"
        data-testid="long-menu-button-test-id"
        onClick={handleOpen}
        aria-label="more"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        className={`${primaryClassName}--btn`}
        disabled={disabled}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          backgroundColor:
            isHovered && buttonColor
              ? getIsDarkColor(getTextColorBasedOnBackground(buttonColor))
                ? 'rgba(0, 0, 0, 0.2)'
                : 'rgba(255, 255, 255, 0.3)'
              : '',
        }}
        id={buttonId}>
        {customButton ? (
          typeof customButton === 'function' ? (
            customButton(options?.find(itm => itm?.id && itm.id === value)?.name)
          ) : (
            customButton
          )
        ) : (
          <span className={'wm-more-vert'} />
        )}
      </button>
      <Menu
        autoFocus={false}
        onClick={e => e.stopPropagation()}
        id="long-menu"
        sx={{
          '& .MuiList-root': {
            position: 'relative',
            maxHeight: menuHeight ? menuHeight : '100%',
          },
          '& .MuiPaper-root': {
            ...(type === MenuViewTypeEnum?.VERTICAL
              ? VERTICAL_MENU_ROOT_SX
              : HORIZONTAL_MENU_ROOT_SX),
            ...rootStyles,
          },
          ul: {
            ...(type === MenuViewTypeEnum?.VERTICAL ? VERTICAL_MENU_SX : HORIZONTAL_MENU_SX),
            ...sxMenuStyles,
          },
        }}
        transformOrigin={transformOrigin}
        anchorOrigin={anchorOrigin}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}>
        <div
          className={'menu-options-container'}
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: 'calc(100% - 2.125rem)',
            overflowY: 'auto',
          }}>
          {options.map((option, index) => (
            <MenuItem
              disableRipple
              disabled={option?.disabled}
              key={option.name + index}
              value={String(option.id)}
              selected={option?.id === value}
              id={`${option.name?.toLowerCase()}-${index}`}
              data-testid={`long-menu-${option.name?.toLowerCase()}-button-test-id`}
              onClick={e => {
                if (value !== option?.id) {
                  e.stopPropagation();
                  if (!option.isSubOption) {
                    handleClick(option);
                  }
                  if (option.id) {
                    setValue(option.id);
                  }
                }
              }}
              sx={{
                ...sxStyles,
                lineHeight: 0,
                '&:hover': {
                  backgroundColor: 'transparent',
                },
              }}
              className={`${primaryClassName}--menu-item`}>
              <div
                className={`${primaryClassName}--menu-item-content ${
                  option?.icon
                    ? menuItemIconPosition === MenuItemIconPositionEnum.START
                      ? 'icon-position-start'
                      : 'icon-position-end'
                    : ''
                }`}>
                {option.label
                  ? option?.icon
                  : option?.icon && (
                      <span className={`${primaryClassName}--menu-item-content-icon`}>
                        {option?.icon}
                      </span>
                    )}

                {option.label ? (
                  option.label
                ) : (
                  <span className={`${primaryClassName}--menu-item-content--text`}>
                    {option?.name}
                  </span>
                )}
              </div>
              {option.isSubOption && (
                <div className={`${primaryClassName}--sub-options`}>
                  {subOptions?.map((subOption, subIndex) => (
                    <WuTooltip
                      key={subOption.name + subIndex}
                      content={subOption?.name}
                      position="right"
                      showArrow>
                      <div
                        className={`${primaryClassName}--item ${primaryClassName}--sub-item`}
                        onClick={e => {
                          e.stopPropagation();
                          if (option.onClick) {
                            option.onClick(subOption);
                            setAnchorEl(null);
                            if (onCloseFunction) {
                              onCloseFunction();
                            }
                          }
                        }}>
                        <span className={`${primaryClassName}--sub-item--name`}>
                          {subOption?.name}
                        </span>
                        <span className={`${primaryClassName}--sub-item--icon`}>
                          {subOption?.icon}
                        </span>
                      </div>
                    </WuTooltip>
                  ))}
                </div>
              )}
            </MenuItem>
          ))}
        </div>
        {fixedButton && fixedButton(() => setAnchorEl(null))}
      </Menu>
    </div>
  );
};

export default Index;
