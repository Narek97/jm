import { GetJourneyMapRowsQuery } from '@/api/infinite-queries/generated/getJourneyMapRows.generated.ts';
import { GetJourneyMapQuery } from '@/api/queries/generated/getJourneyMap.generated.ts';
import { GetLayersByMapIdQuery } from '@/api/queries/generated/getLayersByMapId.generated.ts';
import { GetMapSelectedPersonasQuery } from '@/api/queries/generated/getMapSelectedPersonas.generated.ts';
import { GetMapOutcomeGroupsForRowCreationQuery } from '@/api/queries/generated/getOutcomeGroupsForMap.generated.ts';
import { GetPersonaDemographicInfosQuery } from '@/api/queries/generated/getPersonaDemographicInfos.generated.ts';
import { GetPersonaSectionsQuery } from '@/api/queries/generated/getPersonaSections.generated.ts';
import { GetPinnedPersonaItemsQuery } from '@/api/queries/generated/getPinnedPersonaItems.generated';
import { CommentAndNoteModelsEnum } from '@/api/types.ts';
import { JourneyMapRowTypesEnum } from '@/types/enum.ts';

export type JourneyMapRowType = GetJourneyMapRowsQuery['getJourneyMap']['rows'][number] & {
  isLoading?: boolean;
  isDisabled?: boolean;
};

export type BoxType = NonNullable<
  GetJourneyMapRowsQuery['getJourneyMap']['rows'][number]['boxes']
>[number] & {
  isLoading?: boolean;
  isDisabled?: boolean;
};

export type BoxElementType = BoxType['boxElements'][number];

export type TouchPointType = BoxType['touchPoints'][number];

export type OutcomeGroupType =
  GetJourneyMapRowsQuery['getJourneyMap']['rows'][number]['outcomeGroup'];

export type JourneyMapColumnType = GetJourneyMapQuery['getJourneyMap']['columns'][number] & {
  isLoading?: boolean;
  isDisabled?: boolean;
};

export type JourneyMapType = {
  title: string;
  workspaceId: number | null;
  columns: JourneyMapColumnType[];
  rows: JourneyMapRowType[];
};

export type MapOutcomeGroupsForRowCreationType =
  GetMapOutcomeGroupsForRowCreationQuery['getMapOutcomeGroupsForRowCreation'][number];

export type MapSelectedPersonasType = GetMapSelectedPersonasQuery['getMapSelectedPersonas'][number];

export type LayerType = GetLayersByMapIdQuery['getLayersByMapId']['layers'][number] & {
  isBase?: boolean;
};

export type PinPersonaDemographicInfoType =
  GetPinnedPersonaItemsQuery['getPinnedPersonaItems']['demographicInfos'][number];
export type PinPersonFieldSectionType =
  GetPinnedPersonaItemsQuery['getPinnedPersonaItems']['pinnedSections'][number];
export type PersonaDemographicInfoType =
  GetPersonaDemographicInfosQuery['getPersonaDemographicInfos']['demographicInfoFields'][number];

export type PersonSectionType = GetPersonaSectionsQuery['getPersonaSections'][number];

export type CommentButtonItemType = {
  title: string;
  itemId: number;
  rowId: number;
  columnId: number;
  stepId: number;
  type: CommentAndNoteModelsEnum;
};

export type JourneyMapTextAreaRowsType =
  | JourneyMapRowTypesEnum.TEXT
  | JourneyMapRowTypesEnum.INSIGHTS;

export type JourneyMapDraggableTextFields =
  | JourneyMapRowTypesEnum.INTERACTIONS
  | JourneyMapRowTypesEnum.PROS
  | JourneyMapRowTypesEnum.CONS
  | JourneyMapRowTypesEnum.LIST_ITEM;

export type JourneyMapTouchpointIconsType = {
  id: number | string;
  name: string;
  key: string;
  uuid?: string;
  url?: string;
  type?: string;
};

// todo
export type JourneyMapVersionType = any;
