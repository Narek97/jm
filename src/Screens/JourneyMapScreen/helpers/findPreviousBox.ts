import { BoxElementType } from '@/Screens/JourneyMapScreen/types.ts';

export const findPreviousBox = (boxes: BoxElementType[], boxIndex: number) => {
  for (let i = boxIndex - 1; i >= 0; i--) {
    if (boxes[i].mergeCount >= 1) {
      return {
        stepId: boxes[i].step?.id,
        id: boxes[i].id,
        isStepMerged: boxes[i]?.step?.isMerged,
        mergeCount: boxes[i]?.mergeCount,
        columnId: boxes[i]?.columnId,
      }; // Return the first box that meets the condition
    }
  }
};
