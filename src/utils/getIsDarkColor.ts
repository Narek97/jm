export const getIsDarkColor = (hexColor: string) => {
  hexColor = hexColor.replace('#', '');

  // Convert the hexadecimal color to an RGB array
  const r = parseInt(hexColor.slice(0, 2), 16);
  const g = parseInt(hexColor.slice(2, 4), 16);
  const b = parseInt(hexColor.slice(4, 6), 16);

  // Calculate the relative luminance (perceived brightness) of the background color
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.5;
};
