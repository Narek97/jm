import { FC } from 'react';

import './style.scss';
import { WuButton } from '@npm-questionpro/wick-ui-lib';

interface IConfirmButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  buttonName: string;
}


const ModalConfirmButton: FC<IConfirmButtonProps> = ({
  onClick,
  disabled,
  variant = 'primary',
  buttonName,
}) => (
  <WuButton
    data-testid="confirm-btn-test-id"
    onClick={onClick}
    disabled={disabled}
    id="confirm-delete-btn"
    variant={variant}>
    {buttonName}
  </WuButton>
);

export { ModalConfirmButton };
