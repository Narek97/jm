import { GetOutcomeGroupQuery } from '@/api/queries/generated/getOutcomeGroup.generated.ts';

export type OutcomeFormType = {
  name: string;
  description: string;
  map: number | null;
  stage: number | null;
  step: number | null;
  persona: number | null;
};

export type OutcomeType = GetOutcomeGroupQuery['getOutcomeGroup']['outcomes'][number];
