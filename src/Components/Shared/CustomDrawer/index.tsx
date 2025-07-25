import React, { useState, useEffect, ReactNode, CSSProperties } from 'react';

import CustomClickAwayListener from '../CustomClickAwayListener';

type DrawerAnchor = 'left' | 'right' | 'top' | 'bottom';
type DrawerVariant = 'temporary' | 'persistent' | 'permanent';

interface DrawerProps {
  open: boolean;
  onClose?: () => void;
  anchor?: DrawerAnchor;
  variant?: DrawerVariant;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  width?: number | string;
  height?: number | string;
  elevation?: number;
  hideBackdrop?: boolean;
  disableBackdropClick?: boolean;
  disableEscapeKeyDown?: boolean;
  keepMounted?: boolean;
  transitionDuration?: number;
  SlideProps?: {
    direction?: DrawerAnchor;
    timeout?: number;
  };
}

const CustomDrawer: React.FC<DrawerProps> = ({
  open,
  onClose,
  anchor = 'left',
  variant = 'temporary',
  children,
  className = '',
  style = {},
  width = 'fit-content',
  height = '100%',
  elevation = 16,
  hideBackdrop = false,
  disableBackdropClick = false,
  disableEscapeKeyDown = false,
  keepMounted = false,
  transitionDuration = 225,
}) => {
  const [mounted, setMounted] = useState(false);
  const [animateOpen, setAnimateOpen] = useState(false);

  // Handle escape key
  useEffect(() => {
    if (!disableEscapeKeyDown && open && onClose) {
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [open, onClose, disableEscapeKeyDown]);

  // Handle mounting and animation
  useEffect(() => {
    if (open) {
      setMounted(true);
      // Trigger open animation after mounting
      const timer = setTimeout(() => setAnimateOpen(true), 0);
      return () => clearTimeout(timer);
    } else {
      setAnimateOpen(false);
      if (!keepMounted) {
        const timer = setTimeout(() => setMounted(false), transitionDuration);
        return () => clearTimeout(timer);
      }
    }
  }, [open, keepMounted, transitionDuration]);

  // Don't render if not mounted and not keeping mounted
  if (!mounted && !keepMounted) {
    return null;
  }

  const handleBackdropClick = () => {
    if (!disableBackdropClick && onClose) {
      onClose();
    }
  };

  const getDrawerStyles = (): CSSProperties => {
    const isHorizontal = anchor === 'left' || anchor === 'right';
    const size = isHorizontal ? width : height;

    const baseStyles: CSSProperties = {
      position: 'fixed',
      zIndex: 1200,
      backgroundColor: 'transparent',
      boxShadow: `0px ${elevation}px ${elevation * 2}px rgba(0, 0, 0, 0.1)`,
      transition: `transform ${transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
      willChange: 'transform',
      ...style,
    };

    switch (anchor) {
      case 'left':
        return {
          ...baseStyles,
          top: 0,
          left: 0,
          width: size,
          height: '100vh',
          transform: animateOpen ? 'translateX(0)' : 'translateX(-100%)',
        };
      case 'right':
        return {
          ...baseStyles,
          top: 0,
          right: 0,
          width: size,
          height: '100vh',
          transform: animateOpen ? 'translateX(0)' : 'translateX(100%)',
        };
      case 'top':
        return {
          ...baseStyles,
          top: 0,
          left: 0,
          width: '100vw',
          height: size,
          transform: animateOpen ? 'translateY(0)' : 'translateY(-100%)',
        };
      case 'bottom':
        return {
          ...baseStyles,
          bottom: 0,
          left: 0,
          width: '100vw',
          height: size,
          transform: animateOpen ? 'translateY(0)' : 'translateY(100%)',
        };
      default:
        return baseStyles;
    }
  };

  const getBackdropStyles = (): CSSProperties => {
    return {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1199,
      opacity: animateOpen ? 1 : 0,
      visibility: animateOpen ? 'visible' : 'hidden',
      transition: `opacity ${transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1), visibility ${transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
    };
  };

  const drawerContent = (
    <div
      className={`${className}`}
      style={getDrawerStyles()}
      role="dialog"
      aria-modal={variant === 'temporary'}>
      {children}
    </div>
  );

  // Permanent variant - always visible, no backdrop
  if (variant === 'permanent') {
    return (
      <div
        className={`${className}`}
        style={{
          ...getDrawerStyles(),
          position: 'relative',
          transform: 'none',
          zIndex: 'auto',
          ...style,
        }}>
        {children}
      </div>
    );
  }

  // Persistent variant - no backdrop when open
  if (variant === 'persistent') {
    return (
      <div className={`${className}`} style={getDrawerStyles()}>
        {children}
      </div>
    );
  }

  // Temporary variant - with backdrop and click away
  const drawerWithBackdrop = (
    <>
      {!hideBackdrop && (
        <div style={getBackdropStyles()} onClick={handleBackdropClick} aria-hidden="true" />
      )}
      {drawerContent}
    </>
  );

  if (disableBackdropClick || hideBackdrop) {
    return drawerWithBackdrop;
  }

  return (
    <CustomClickAwayListener onClickAway={handleBackdropClick}>
      {drawerWithBackdrop}
    </CustomClickAwayListener>
  );
};

export default CustomDrawer;
