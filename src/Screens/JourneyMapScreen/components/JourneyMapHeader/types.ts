import { GetBoardTagsQuery } from '@/api/queries/generated/getBoardTags.generated.ts';
import { GetJourneyMapRowsAndColumnsQuery } from '@/api/queries/generated/getJourneyMapRowsAndColumns.generated.ts';
import { ObjectKeysType } from '@/types';

export type LayerFormType = {
  name: string;
  columnIds: number[];
  rowIds: number[];
  tagIds: number[];
  columnSelectedStepIds: ObjectKeysType | null;
  isBase: boolean;
};

export type LayerStagesStepsType = {
  [key: string]: {
    id: number;
    columnId: number;
    isMerged: boolean;
    mergedIds: number[];
    name: string;
  }[];
};

export type LayerStagesAndLanesType = {
  stages: GetJourneyMapRowsAndColumnsQuery['getJourneyMapRowsAndColumns']['columns'];
  lanes: GetJourneyMapRowsAndColumnsQuery['getJourneyMapRowsAndColumns']['rows'];
  steps: LayerStagesStepsType | null;
};

export type BoardTagType = GetBoardTagsQuery['getBoardTags']['tags'][number];
