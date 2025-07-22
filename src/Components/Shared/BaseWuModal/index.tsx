import React, { FC, ReactNode } from 'react';

import './style.scss';
import {
  WuButton,
  WuModal,
  WuModalContent,
  WuModalFooter,
  WuModalHeader,
} from '@npm-questionpro/wick-ui-lib';

interface IBaseWuModal {
  children: React.ReactNode;
  modalSize?: 'sm' | 'md' | 'lg';
  isOpen: boolean;
  className?: string;
  handleClose: () => void;
  canCloseWithOutsideClick?: boolean;
  headerTitle: string;
  ModalConfirmButton?: ReactNode;
  headerIcon?: ReactNode;
  cancelButton?: ReactNode;
  isProcessing?: boolean;
  maxHeight?: string;
}

const BaseWuModal: FC<IBaseWuModal> = ({
  children,
  isOpen,
  handleClose,
  canCloseWithOutsideClick,
  modalSize = 'sm',
  headerTitle,
  ModalConfirmButton,
  headerIcon,
  cancelButton,
  isProcessing,
  maxHeight,
}) => {
  const onClose = () => {
    if (canCloseWithOutsideClick) {
      handleClose();
    }
  };

  return (
    <WuModal size={modalSize} open={isOpen} onOpenChange={onClose} maxHeight={maxHeight}>
      <WuModalHeader>
        {headerTitle}
        {headerIcon}
      </WuModalHeader>
      <div className={'wu-modal-content'}>
        <WuModalContent>{children}</WuModalContent>
      </div>

      {ModalConfirmButton && (
        <WuModalFooter>
          {cancelButton || (
            <WuButton
              data-testid="first-btn-test-id"
              onClick={onClose}
              disabled={isProcessing}
              id={'first-btn-test-id'}
              variant="secondary">
              Cancel
            </WuButton>
          )}
          {ModalConfirmButton}
        </WuModalFooter>
      )}
    </WuModal>
  );
};

export default BaseWuModal;
