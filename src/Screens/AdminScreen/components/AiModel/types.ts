import { GetAiJourneyModelsQuery } from '@/api/queries/generated/getAiJourneyModels.generated.ts';

export type AiModelType = GetAiJourneyModelsQuery['getAiJourneyModels']['aiJourneyModels'][number];

export type AiModelFormType = {
  name: string;
  prompt: string;
  universal: boolean;
  orgIds: Array<number>;
};

export type AiModelElementType = {
  name: 'name' | 'prompt';
  title: string;
  type: string;
  placeholder?: string;
  isMultiline?: boolean;
};
