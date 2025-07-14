import { BoxType, JourneyMapType } from '@/Screens/JourneyMapScreen/types.ts';

export const getConnectionDetails = (box: BoxType, journeyMap: JourneyMapType) => ({
  id: box.step?.id,
  isMerged: box.step?.isMerged,
  isNextColumnMerged: journeyMap.columns.find(c => c.id === box.columnId)?.isNextColumnMerged,
  columnId: box.columnId,
});
