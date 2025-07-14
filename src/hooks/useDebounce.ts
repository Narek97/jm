const debounce = <T extends (...args: any[]) => void>(fn: T, wait: number) => {
  let timeoutID: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    if (timeoutID) clearTimeout(timeoutID);
    timeoutID = setTimeout(() => fn(...args), wait);
  };
};

export const debounced1 = debounce((fn: () => void) => fn(), 1);
export const debounced400 = debounce((fn: () => void) => fn(), 400);
export const debounced600 = debounce((fn: () => void) => fn(), 600);
export const debounced800 = debounce((fn: () => void) => fn(), 800);
