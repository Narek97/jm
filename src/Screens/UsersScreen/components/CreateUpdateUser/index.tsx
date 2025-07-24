import { FC, useCallback } from 'react';

import './style.scss';
import { yupResolver } from '@hookform/resolvers/yup';
import { WuButton } from '@npm-questionpro/wick-ui-lib';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import { CREATE_USER_VALIDATION_SCHEMA } from '../../constants';
import { CreateUserFormElementType, CreateUserFormType } from '../../types';

import BaseWuInput from '@/Components/Shared/BaseWuInput';

interface ICreateUpdateUser {
  createButtonText: string;
  defaultValues: CreateUserFormType;
  isOpenCreateUpdateItem: boolean;
  isLoading: boolean;
  inputPlaceholder: string;
  isDisabledButton: boolean;
  isDisabledInput: boolean;
  onHandleCreateFunction: (data: CreateUserFormType, reset: () => void) => void;
  onHandleUpdateFunction: (data: CreateUserFormType, reset: () => void) => void;
  onToggleCreateUpdateFunction: () => void;
  formElements: CreateUserFormElementType[];
}

const CreateUpdateUser: FC<ICreateUpdateUser> = ({
  createButtonText,
  onHandleCreateFunction,
  defaultValues,
  isOpenCreateUpdateItem,
  isLoading,
  onToggleCreateUpdateFunction,
  formElements,
}) => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateUserFormType>({
    resolver: yupResolver(CREATE_USER_VALIDATION_SCHEMA),
    defaultValues,
  });

  const onSaveForm: SubmitHandler<CreateUserFormType> = useCallback(
    data => {
      onHandleCreateFunction(data, () => reset(defaultValues));
    },
    [defaultValues, onHandleCreateFunction, reset],
  );

  return (
    <div className={'create-update-user-form-block'}>
      <form
        data-testid="create-update-user-form-block-test-id"
        className={`create-update-user-form-block--content ${
          isOpenCreateUpdateItem ? 'create-update-user-form-block--open-content' : ''
        }`}
        onSubmit={handleSubmit(onSaveForm)}>
        {formElements.map(element => (
          <div className={'create-update-user-form-block--content-input'} key={element.name}>
            <Controller
              name={element.name}
              control={control}
              render={({ field: { onChange, value } }) => (
                <BaseWuInput
                  className={errors[element.name]?.message ? 'create-user--error-input' : ''}
                  maxLength={50}
                  placeholder={element.placeholder}
                  id={element.name}
                  type={element.type}
                  onChange={onChange}
                  value={value}
                  isIconInput={false}
                />
              )}
            />
            {isOpenCreateUpdateItem && element?.name && errors[element.name]?.message && (
              <span className={'validation-error'}>
                {(errors && errors[element.name]?.message) || ''}
              </span>
            )}
          </div>
        ))}
        <div>
          <WuButton
            data-testid="create-update-block-save-test-id"
            className={`create-update-user-form-block--content-save-btn ${
              !isOpenCreateUpdateItem ? 'create-update-user-form-block--content--closed-mode' : ''
            }`}
            type={'submit'}
            disabled={isLoading}>
            Save
          </WuButton>
        </div>
      </form>
      {isOpenCreateUpdateItem && (
        <div className={'close-form'}>
          <button
            data-testid="close-form-btn-id"
            className={'close-form--btn'}
            type={'button'}
            onClick={() => onToggleCreateUpdateFunction()}>
            <span className={'wm-close-small'} />
          </button>
        </div>
      )}
      <WuButton
        data-testid="create-update-item-open-btn-test-id"
        className={`create-update-user-form-block--open-btn ${
          isOpenCreateUpdateItem && 'create-update-user-form-block--open-btn--closed-mode'
        }`}
        onClick={() => {
          onToggleCreateUpdateFunction();
          reset(defaultValues);
        }}>
        {createButtonText}
      </WuButton>
    </div>
  );
};

export default CreateUpdateUser;
