import { GetJourneyMapRowsQuery } from '@/api/infinite-queries/generated/getJourneyMapRows.generated.ts';
import { GetJourneyMapQuery } from '@/api/queries/generated/getJourneyMap.generated.ts';
import { GetLayersByMapIdQuery } from '@/api/queries/generated/getLayersByMapId.generated.ts';
import { GetMapByVersionIdQuery } from '@/api/queries/generated/getMapByVersionId.generated.ts';
import { GetMapSelectedPersonasQuery } from '@/api/queries/generated/getMapSelectedPersonas.generated.ts';
import { GetOrganizationUsersQuery } from '@/api/queries/generated/getOrganizationUsers.generated.ts';
import { GetMapOutcomeGroupsForRowCreationQuery } from '@/api/queries/generated/getOutcomeGroupsForMap.generated.ts';
import { GetPersonaDemographicInfosQuery } from '@/api/queries/generated/getPersonaDemographicInfos.generated.ts';
import { GetPersonaSectionsQuery } from '@/api/queries/generated/getPersonaSections.generated.ts';
import { GetPinnedPersonaItemsQuery } from '@/api/queries/generated/getPinnedPersonaItems.generated';

export type OrganizationUsersType =
  GetOrganizationUsersQuery['getOrganizationUsers']['users'][number];

export type JourneyMapRowType = GetJourneyMapRowsQuery['getJourneyMap']['rows'][number] & {
  isLoading?: boolean;
  isDisabled?: boolean;
};

export type BoxElementType = NonNullable<
  GetJourneyMapRowsQuery['getJourneyMap']['rows'][number]['boxes']
>[number] & {
  isLoading?: boolean;
  isDisabled?: boolean;
};

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

export type JourneyMapVersionIdType = GetMapByVersionIdQuery['getMapByVersionId'];
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

// todo
export type JourneyMapVersionType = any;
