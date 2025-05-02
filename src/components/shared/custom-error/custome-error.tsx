import { FC } from 'react';
import './custome-error.scss';

interface IBasicError {
  error?: string;
}

const CustomError: FC<IBasicError> = ({ error }) => {
  return (
    <div className={'custom-error'} data-testid={'error-message-test-id'} id={'error-message-id'}>
      {error || 'Something went wrong'}
    </div>
  );
};

export default CustomError;
