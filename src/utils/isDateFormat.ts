import dayjs from 'dayjs';

export const isDateFormat = (value: string, format: string): boolean => {
  return dayjs(value, format, true).isValid();
};
