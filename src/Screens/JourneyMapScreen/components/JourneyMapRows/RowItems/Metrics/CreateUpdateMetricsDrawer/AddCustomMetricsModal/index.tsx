import { FC, useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { WuButton } from '@npm-questionpro/wick-ui-lib';
import { Controller, useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';

import './style.scss';

import 'react-datepicker/dist/react-datepicker.css';
import { CustomMetricsFormType, CustomMetricsType } from '../../types';

import { MetricsTypeEnum } from '@/api/types.ts';
import CustomDatePicker from '@/Components/Shared/CustomDatePicker';
import CustomInput from '@/Components/Shared/CustomInput';
import CustomModal from '@/Components/Shared/CustomModal';
import CustomModalHeader from '@/Components/Shared/CustomModalHeader';
import { ADD_CUSTOM_METRICS_VALIDATION_SCHEMA } from '@/Screens/JourneyMapScreen/components/JourneyMapRows/RowItems/Metrics/constants.tsx';

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
      <CustomModalHeader title={`Add custom ${metricsType}`} />
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
          <WuButton
            onClick={handleClose}
            data-testid="cansel-data-point-test-id"
            variant={'outline'}>
            Cancel
          </WuButton>
          <WuButton type={'submit'} data-testid="submit-data-point-test-id">
            Add
          </WuButton>
        </div>
      </form>
    </CustomModal>
  );
};

export default AddCustomMetricsModal;
