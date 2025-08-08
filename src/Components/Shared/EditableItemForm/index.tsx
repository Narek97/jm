import { FC, KeyboardEvent, useRef, useState } from 'react';

import './style.scss';
import { WuButton } from '@npm-questionpro/wick-ui-lib';

import BaseWuInput from '@/Components/Shared/BaseWuInput';

interface IEditableItemForm {
  createButtonText: string;
  inputPlaceholder: string;
  value: string;
  isLoading: boolean;
  isEdit?: boolean;
  onHandleCreate: (value: string, callback?: () => void) => Promise<boolean>;
  onHandleUpdate?: (value: string, callback?: () => void) => Promise<boolean>;
  maxLength?: number;
}

const EditableItemForm: FC<IEditableItemForm> = ({
  createButtonText,
  inputPlaceholder,
  value,
  isLoading,
  isEdit,
  onHandleCreate,
  onHandleUpdate,
  maxLength,
}) => {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [inputValue, setInputValue] = useState(value || '');

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (isEdit) {
        if (onHandleUpdate) {
          onHandleUpdate(inputValue).then();
        }
      } else {
        onHandleCreate(inputValue).then(() => {
          setInputValue('');
          setIsOpen(false);
        });
      }
    }
  };

  return (
    <div className={'create-edit-block'}>
      <div
        className={`create-edit-block--content ${isOpen ? 'create-edit-block--open-content' : ''}`}>
        <BaseWuInput
          onKeyDown={handleInputKeyDown}
          inputRef={nameInputRef}
          value={inputValue}
          onChange={e => setInputValue(e?.target?.value)}
          disabled={isLoading}
          placeholder={inputPlaceholder}
          maxLength={100}
        />
        {isOpen && maxLength && (
          <span className={'editable-input--max-length'}>
            {inputValue?.length} / {maxLength}
          </span>
        )}
        <WuButton
          disabled={isLoading || !inputValue.trim().length}
          className={isLoading ? 'disabled-btn' : ''}
          name={'save'}
          aria-label={'save'}
          data-testid={'save-item-test-id'}
          onClick={() =>
            isEdit
              ? onHandleUpdate &&
                onHandleUpdate(inputValue).then(() => {
                  setInputValue('');
                  setIsOpen(false);
                })
              : onHandleCreate(inputValue).then(() => {
                  setInputValue('');
                  setIsOpen(false);
                })
          }>
          Save
        </WuButton>
        <button onClick={() => setIsOpen(false)} aria-label={'close'} disabled={isLoading}>
          <span className={'wm-close-small'} />
        </button>
      </div>
      {!isOpen ? (
        <WuButton
          onClick={() => setIsOpen(true)}
          data-testid={'create-item-test-id'}
          id={'create-item-id'}
          aria-label={'create'}>
          {createButtonText}
        </WuButton>
      ) : null}
    </div>
  );
};
export default EditableItemForm;
