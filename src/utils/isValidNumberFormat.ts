export const isValidNumberFormat = (value: any): value is number => {
  return /^-?\d*\.?\d+$/.test(value);
};
