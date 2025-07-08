import { BoxElementType } from '@/Screens/JourneyMapScreen/types.ts';

export const findStartMergedItem = (data: BoxElementType[], boxIndex: number) => {
  let index = 0;
  for (let i = boxIndex - 1; i >= 0; i--) {
    if (data[i].mergeCount > 0) {
      return { startBox: data[i], index };
    }
    index++;
  }
  return null;
};
