import { FC, useCallback, useEffect } from 'react';

import './style.scss';
import { yupResolver } from '@hookform/resolvers/yup';
import { WuButton } from '@npm-questionpro/wick-ui-lib';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import CustomInput from '@/Components/Shared/CustomInput';
import { CreatUpdateFormGeneralType } from '@/types';

interface ICreateUpdateUser {
  createButtonText: string;
  formData: any;
  defaultValues: CreatUpdateFormGeneralType;
  isOpenCreateUpdateItem: boolean;
  isLoading: boolean;
  inputPlaceholder: string;
  isDisabledButton: boolean;
  isDisabledInput: boolean;
  onHandleCreateFunction: (data: CreatUpdateFormGeneralType, reset: () => void) => void;
  onHandleUpdateFunction: (data: CreatUpdateFormGeneralType, reset: () => void) => void;
  onToggleCreateUpdateFunction: () => void;
  formElements: any[];
  validationSchema: any;
}

const CreateUpdateUser: FC<ICreateUpdateUser> = ({
  createButtonText,
  onHandleCreateFunction,
  formData,
  onHandleUpdateFunction,
  defaultValues,
  isOpenCreateUpdateItem,
  isLoading,
  onToggleCreateUpdateFunction,
  validationSchema,
  formElements,
}) => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreatUpdateFormGeneralType>({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const onSaveForm: SubmitHandler<CreatUpdateFormGeneralType> = useCallback(
    data => {
      if (formData) {
        onHandleUpdateFunction(data, () => reset(defaultValues));
      } else {
        onHandleCreateFunction(data, () => reset(defaultValues));
      }
    },
    [defaultValues, formData, onHandleCreateFunction, onHandleUpdateFunction, reset],
  );

  useEffect(() => {
    if (formData) {
      reset(formData);
    }
  }, [formData, reset]);

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
                <CustomInput
                  className={errors[element.name]?.message ? 'create-user--error-input' : ''}
                  inputType={'primary'}
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
