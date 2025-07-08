import React, { FC, useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';

import CustomButton from '@/components/atoms/custom-button/custom-button';
import CustomDatePicker from '@/components/atoms/custom-date-picker/custom-date-picker';
import CustomInput from '@/components/atoms/custom-input/custom-input';
import CustomModal from '@/components/atoms/custom-modal/custom-modal';
import ModalHeader from '@/components/molecules/modal-header';
import { MetricsTypeEnum } from '@/gql/types';
import { ADD_CUSTOM_METRICS_VALIDATION_SCHEMA } from '@/utils/constants/form/yup-validation';
import { CustomMetricsFormType, CustomMetricsType } from '@/utils/ts/types/metrics/metrics-type';

import './style.scss';

import 'react-datepicker/dist/react-datepicker.css';

interface IAddCustomMetricsModal {
  metricsType: MetricsTypeEnum;
  isOpen: boolean;
  onHandleAddCustomMetrics: (data: CustomMetricsType) => void;
  handleClose: () => void;
}

const AddCustomMetricsModal: FC<IAddCustomMetricsModal> = ({
  metricsType,
  isOpen,
  onHandleAddCustomMetrics,
  handleClose,
}) => {
  const [date, setDate] = useState(new Date());

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CustomMetricsFormType>({
    resolver: yupResolver(ADD_CUSTOM_METRICS_VALIDATION_SCHEMA(metricsType)),
    defaultValues: {
      value: 0,
    },
  });

  const onFormSubmit = (formData: CustomMetricsFormType) => {
    onHandleAddCustomMetrics({
      id: uuidv4(),
      date,
      ...formData,
    });
  };

  return (
    <CustomModal
      isOpen={isOpen}
      handleClose={handleClose}
      modalSize={'custom'}
      canCloseWithOutsideClick={true}>
      <ModalHeader title={`Add custom ${metricsType}`} />
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className={'add-custom-metrics-modal'}
        data-testid="add-custom-metrics-modal">
        <div className={'add-custom-metrics-modal--content'}>
          <div className={'add-custom-metrics-modal--left-block'}>
            <p className={'add-custom-metrics-modal--title'}>Metrics</p>

            <div className={'add-custom-metrics-modal--input-item'} key={'metricsValue'}>
              <label className={'add-custom-metrics-modal--label'} htmlFor={'metricsValue'}>
                {metricsType}
              </label>
              <Controller
                name={'value'}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <CustomInput
                    data-testid={`metrics-value-data-point-input-test-id`}
                    className={''}
                    inputType={'primary'}
                    placeholder={'Write metrics value'}
                    id={'metricsValue'}
                    type={'number'}
                    value={(+value).toString()}
                    onChange={onChange}
                    isIconInput={false}
                  />
                )}
              />
              <span className={'validation-error'} data-testid={`metrics-value-error-test-id`}>
                {(errors && errors.value?.message) || ''}
              </span>
            </div>
          </div>
          <div className={'add-custom-metrics-modal--right-block'}>
            <p className={'add-custom-metrics-modal--title'}>Select date</p>
            <div className={'add-custom-metrics-modal--date-picker-block'}>
              <CustomDatePicker
                onHandleChangeDate={dateValue => {
                  setDate(dateValue);
                }}
              />
            </div>
          </div>
        </div>
        <div className={'base-modal-footer'}>
          <CustomButton
            onClick={handleClose}
            data-testid="cansel-data-point-test-id"
            variant={'text'}
            startIcon={false}
            style={{
              textTransform: 'inherit',
            }}>
            Cancel
          </CustomButton>
          <CustomButton
            type={'submit'}
            data-testid="submit-data-point-test-id"
            variant={'contained'}
            startIcon={false}>
            Add
          </CustomButton>
        </div>
      </form>
    </CustomModal>
  );
};

export default AddCustomMetricsModal;
