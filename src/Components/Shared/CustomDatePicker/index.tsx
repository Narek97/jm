import React, { FC, useEffect, useState } from 'react';

import 'react-datepicker/dist/react-datepicker.css';
import './style.scss';
import dayjs from 'dayjs';
import fromNow from 'dayjs/plugin/relativeTime';
import DatePicker from 'react-datepicker';

interface ICustomDatePicker {
  isInline?: boolean;
  defaultDate?: Date | null;
  defaultMinDate?: any;
  onHandleChangeDate: (date: Date) => void;
}
dayjs.extend(fromNow);

const CustomDatePicker: FC<ICustomDatePicker> = ({
  isInline = true,
  defaultDate = null,
  defaultMinDate = null,
  onHandleChangeDate,
}) => {
  const [startDate, setStartDate] = useState(defaultDate);
  const [minDate, setMinDate] = useState(defaultMinDate);

  const onChange = (date: React.SetStateAction<Date | null>) => {
    setStartDate(date);
    onHandleChangeDate(date as Date);
  };

  useEffect(() => {
    setMinDate(defaultMinDate);
    setStartDate(defaultMinDate);
  }, [defaultMinDate]);

  useEffect(() => {
    setStartDate(defaultDate);
  }, [defaultDate]);

  return (
    <div className={'custom-date-picker'}>
      <DatePicker
        {...(startDate && { selected: startDate })}
        // startDate={startDate}
        minDate={minDate}
        inline={isInline}
        onChange={onChange}
        showMonthDropdown
        showYearDropdown
        popperProps={{
          strategy: 'fixed',
        }}
      />
    </div>
  );
};

export default CustomDatePicker;
