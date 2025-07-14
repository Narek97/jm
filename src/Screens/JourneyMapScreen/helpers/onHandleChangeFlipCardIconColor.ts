import { getIsDarkColor } from '@/utils/getIsDarkColor.ts';

export const onHandleChangeFlipCardIconColor = (color: string, id: string) => {
  const flipCard = document.getElementById(id);
  if (flipCard) {
    const isDarkColor = getIsDarkColor(color);
    flipCard.classList.remove(isDarkColor ? 'light-mode' : 'dark-mode');
    flipCard.classList.add(isDarkColor ? 'dark-mode' : 'light-mode');
  }
};
