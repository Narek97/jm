import { PersonaStateEnum } from '@/api/types';
import { JourneyMapRowType } from '@/Screens/JourneyMapScreen/types.ts';

type RowWithPersonasType = JourneyMapRowType['rowWithPersonas'][number];

type EmotionGroupType = {
  rowId: number;
  boxId: number;
  columnId: number;
  state: string;
  personaId: number;
  color: string;
  text: string;
};

type SentimentBoxType = {
  [PersonaStateEnum.VeryHappy]: EmotionGroupType[];
  [PersonaStateEnum.Happy]: EmotionGroupType[];
  [PersonaStateEnum.Neutral]: EmotionGroupType[];
  [PersonaStateEnum.Sad]: EmotionGroupType[];
  [PersonaStateEnum.VerySad]: EmotionGroupType[];
  id: number;
};

export type { RowWithPersonasType, SentimentBoxType };
