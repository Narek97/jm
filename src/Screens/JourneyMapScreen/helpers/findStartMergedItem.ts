import { BoxType } from '@/Screens/JourneyMapScreen/types.ts';

export const findStartMergedItem = (data: BoxType[], boxIndex: number) => {
  let index = 0;
  for (let i = boxIndex - 1; i >= 0; i--) {
    if (data[i].mergeCount > 0) {
      return { startBox: data[i], index };
    }
    index++;
  }
  return null;
};
