import React, { FC, useEffect, useState } from 'react';

import { Popover } from '@mui/material';

interface IPopover {
  openedPopoverButtonColor?: string;
  children?: React.ReactNode;
  popoverButton: React.ReactNode;
  anchorOrigin?: {
    vertical: 'top' | 'center' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
  transformOrigin?: {
    vertical: 'top' | 'center' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
  sxStyles?: any;
  onClick?: () => void;
  onParentClick?: () => void;
  onOutsideClick?: () => void;
}

const CustomPopover: FC<IPopover> = ({
  children,
  openedPopoverButtonColor,
  popoverButton,
  anchorOrigin,
  transformOrigin,
  sxStyles,
  onClick,
  onParentClick,
  onOutsideClick,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [isOpenPopover, setIsOpenPopover] = useState<boolean>(false);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (onClick) {
      onClick();
    } else {
      setAnchorEl(event.currentTarget);
    }

    if (onParentClick) {
      onParentClick();
    }
    setIsOpenPopover(true);
  };

  const handleClose = () => {
    if (onOutsideClick) {
      onOutsideClick();
    }
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  useEffect(() => {
    if (!isOpenPopover) {
      setAnchorEl(null);
    }
  }, [isOpenPopover]);

  return (
    <>
      <button
        type="button"
        aria-label={'popover-button'}
        data-testid={'popover-button-test-id'}
        onClick={handleClick}
        style={
          open
            ? {
                background: openedPopoverButtonColor,
                minWidth: 'fit-content',
              }
            : { minWidth: 'fit-content' }
        }>
        {popoverButton}
      </button>
      <Popover
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
        }}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
        sx={{
          ...sxStyles,
        }}>
        {children}
      </Popover>
    </>
  );
};

export default CustomPopover;
