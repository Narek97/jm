import { Interview } from '@/api/types.ts';

export type InterviewType = Pick<
  Interview,
  'id' | 'boardId' | 'name' | 'aiJourneyModelId' | 'text' | 'mapId' | 'createdAt' | 'updatedAt'
>;

export type InterviewFormType = {
  name: string;
  aiJourneyModelId: number;
  text: string;
  boardId: number;
};
