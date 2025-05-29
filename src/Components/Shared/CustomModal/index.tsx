import React, { FC } from 'react';

import { Modal } from '@mui/material';

import './style.scss';

interface ICustomModal {
  children: React.ReactNode;
  modalSize?: 'sm' | 'md' | 'lg' | 'custom';
  isOpen: boolean;
  className?: string;
  handleClose: () => void;
  canCloseWithOutsideClick?: boolean;
}

const CustomModal: FC<ICustomModal> = ({
  children,
  isOpen,
  handleClose,
  className,
  canCloseWithOutsideClick,
  modalSize = 'sm',
}) => {
  const onClose = () => {
    if (canCloseWithOutsideClick) {
      handleClose();
    }
  };

  return (
    <Modal
      aria-labelledby="spring-modal-title"
      aria-describedby="spring-modal-description"
      open={isOpen}
      onClose={onClose}
      closeAfterTransition
      sx={{
        minHeight: '18.75rem',
      }}>
      <div className={`custom-modal ${modalSize} ${className || ''}`}>
        <button
          className={'close-icon'}
          data-testid="modal-close-test-id"
          aria-label={'Close'}
          onClick={onClose}>
          <span className={'wm-close'} />
        </button>
        {children}
      </div>
    </Modal>
  );
};

export default CustomModal;
