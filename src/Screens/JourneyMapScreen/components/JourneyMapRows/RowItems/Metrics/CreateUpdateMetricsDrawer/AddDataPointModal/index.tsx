import { FC, useMemo, useRef, useState } from 'react';

import './style.scss';

import { yupResolver } from '@hookform/resolvers/yup';
import { WuButton } from '@npm-questionpro/wick-ui-lib';
import { Controller, useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';

import 'react-datepicker/dist/react-datepicker.css';
import {
  CesType,
  CsatType,
  DataPointFormType,
  DatapointType,
  NPSDataPointElementType,
  NpsType,
} from '../../types';

import { MetricsTypeEnum } from '@/api/types';
import BaseWuInput from '@/Components/Shared/BaseWuInput';
import BaseWuModal from '@/Components/Shared/BaseWuModal';
import CustomDatePicker from '@/Components/Shared/CustomDatePicker';
import {
  ADD_DATA_POINT_VALIDATION_SCHEMA,
  CES_DATA_POINT_ELEMENTS,
  CSAT_DATA_POINT_ELEMENTS,
  NPS_DATA_POINT_ELEMENTS,
} from '@/Screens/JourneyMapScreen/components/JourneyMapRows/RowItems/Metrics/constants.tsx';

interface IAddDataPointModal {
  metricsType: MetricsTypeEnum;
  isOpen: boolean;
  onHandleAddDataPont: (data: Array<DatapointType>) => void;
  handleClose: () => void;
}

const AddDataPointModal: FC<IAddDataPointModal> = ({
  metricsType,
  isOpen,
  onHandleAddDataPont,
  handleClose,
}) => {
  const formRef = useRef<HTMLFormElement>(null);

  const [date, setDate] = useState(new Date());

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<DataPointFormType>({
    resolver: yupResolver(ADD_DATA_POINT_VALIDATION_SCHEMA),
  });

  const valueOne = watch('valueOne');
  const valueTwo = watch('valueTwo');
  const valueThree = watch('valueThree');

  const value = useMemo(() => {
    const total = +valueOne + +valueTwo + +valueThree;
    const valueOnePercent = (+valueOne / +total) * 100;
    const valueThreePercent = (+valueThree / +total) * 100;

    if (!total) {
      return 0;
    }

    switch (metricsType) {
      case MetricsTypeEnum.Nps: {
        return Math.floor(valueThreePercent - valueOnePercent);
      }
      default: {
        return Math.floor(valueOnePercent);
      }
    }
  }, [metricsType, valueOne, valueThree, valueTwo]);

  const onFormSubmit = (formData: DataPointFormType) => {
    const data = {};

    switch (metricsType) {
      case MetricsTypeEnum.Nps: {
        (data as DatapointType).id = uuidv4();
        (data as NpsType).date = date;
        (data as NpsType).detractor = formData.valueOne;
        (data as NpsType).passive = formData.valueTwo;
        (data as NpsType).promoter = formData.valueThree;
        break;
      }
      case MetricsTypeEnum.Csat: {
        (data as DatapointType).id = uuidv4();
        (data as CsatType).date = date;
        (data as CsatType).satisfied = formData.valueOne;
        (data as CsatType).neutral = formData.valueTwo;
        (data as CsatType).dissatisfied = formData.valueThree;
        break;
      }
      case MetricsTypeEnum.Ces: {
        (data as DatapointType).id = uuidv4();
        (data as CesType).date = date;
        (data as CesType).easy = formData.valueOne;
        (data as CesType).neutral = formData.valueTwo;
        (data as CesType).difficult = formData.valueThree;
        break;
      }
    }
    onHandleAddDataPont([data as DatapointType]);
  };

  const formElements: { [key: string]: Array<NPSDataPointElementType> } = {
    [MetricsTypeEnum.Nps]: NPS_DATA_POINT_ELEMENTS,
    [MetricsTypeEnum.Csat]: CSAT_DATA_POINT_ELEMENTS,
    [MetricsTypeEnum.Ces]: CES_DATA_POINT_ELEMENTS,
  };

  const onHandleSubmit = () => {
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  return (
    <BaseWuModal
      headerTitle={'Add data point'}
      isOpen={isOpen}
      handleClose={handleClose}
      modalSize={'lg'}
      canCloseWithOutsideClick={true}
      ModalConfirmButton={
        <WuButton onClick={onHandleSubmit} type={'submit'} data-testid="submit-data-point-test-id">
          Add data point
        </WuButton>
      }>
      <form
        ref={formRef}
        onSubmit={handleSubmit(onFormSubmit)}
        className={'add-data-point-modal'}
        data-testid="add-data-point-modal">
        <div className={'add-data-point-modal--content'}>
          <div className={'add-data-point-modal--left-block'}>
            <p className={'add-data-point-modal--title'}>Set your data</p>

            {formElements[metricsType]?.map((element: NPSDataPointElementType) => (
              <div className={'add-data-point-modal--input-item'} key={element.name}>
                <label className={'add-data-point-modal--label'} htmlFor={element.name}>
                  {element.title}
                </label>
                <Controller
                  name={element.name}
                  control={control}
                  render={({ field: { onChange, value = 0 } }) => (
                    <BaseWuInput
                      data-testid={`${element.title.toLowerCase()}-data-point-input-test-id`}
                      className={''}
                      placeholder={element.placeholder}
                      id={element.name}
                      type={element.type}
                      value={(+value).toString()}
                      onChange={onChange}
                      isIconInput={false}
                      min={0}
                    />
                  )}
                />
                <span className={'validation-error'} data-testid={`${element.name}-error-test-id`}>
                  {(errors && errors[element.name]?.message) || ''}
                </span>
              </div>
            ))}
            <p>
              {metricsType} - {value}
            </p>
          </div>
          <div className={'add-data-point-modal--right-block'}>
            <p className={'add-data-point-modal--title'}>Select date</p>
            <div className={'add-data-point-modal--date-picker-block'}>
              <CustomDatePicker
                onHandleChangeDate={dateValue => {
                  setDate(dateValue);
                }}
              />
            </div>
          </div>
        </div>
      </form>
    </BaseWuModal>
  );
};

export default AddDataPointModal;
