import { getIsDarkColor } from "@/utils/getIsDarkColor.ts";

export const getTextColorBasedOnBackground = (hexColor: string): string => {
  // Choose text color based on luminance
  if (getIsDarkColor(hexColor)) {
    return "#ffffff"; // Use white text on dark backgrounds
  } else {
    return "#555555"; // Use black text on light backgrounds
  }
};
