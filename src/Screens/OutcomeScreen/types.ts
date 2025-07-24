import { GetMapColumnsForOutcomeQuery } from '@/api/infinite-queries/generated/getMapColumnsForOutcome.generated.ts';
import { GetMapPersonasForOutcomeQuery } from '@/api/infinite-queries/generated/getMapPersonasForOutcome.generated.ts';
import { GetWorkspaceMapsQuery } from '@/api/infinite-queries/generated/getWorkspaceMaps.generated';
import { GetColumnStepsQuery } from '@/api/queries/generated/getColumnSteps.generated.ts';
import { GetOutcomeGroupQuery } from '@/api/queries/generated/getOutcomeGroup.generated.ts';

export type OutcomeFormType = {
  name: string;
  description: string;
  map: number | null;
  stage: number | null;
  step: number | null;
  persona: number | null;
};

export type OutcomeGroupOutcomeType = GetOutcomeGroupQuery['getOutcomeGroup']['outcomes'][number];

export type WorkspaceMapsType = GetWorkspaceMapsQuery['getWorkspaceMaps']['maps'][number];

export type MapColumnsForOutcomeType =
  GetMapColumnsForOutcomeQuery['getMapColumnsForOutcome']['columns'][number];

export type ColumnStepsType = GetColumnStepsQuery['getColumnSteps'][number];

export type MapPersonasForOutcomeType =
  GetMapPersonasForOutcomeQuery['getMapPersonasForOutcome']['personas'][number];
