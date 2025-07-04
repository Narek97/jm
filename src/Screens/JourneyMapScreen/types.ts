import { GetJourneyMapRowsQuery } from '@/api/infinite-queries/generated/getJourneyMapRows.generated.ts';
import { GetJourneyMapQuery } from '@/api/queries/generated/getJourneyMap.generated.ts';
import { GetLayersByMapIdQuery } from '@/api/queries/generated/getLayersByMapId.generated.ts';
import { GetMapByVersionIdQuery } from '@/api/queries/generated/getMapByVersionId.generated.ts';
import { GetMapSelectedPersonasQuery } from '@/api/queries/generated/getMapSelectedPersonas.generated.ts';
import { GetOrganizationUsersQuery } from '@/api/queries/generated/getOrganizationUsers.generated.ts';
import { GetPersonaDemographicInfosQuery } from '@/api/queries/generated/getPersonaDemographicInfos.generated.ts';
import { GetPersonaSectionsQuery } from '@/api/queries/generated/getPersonaSections.generated.ts';
import { GetPinnedPersonaItemsQuery } from '@/api/queries/generated/getPinnedPersonaItems.generated';

export type OrganizationUsersType =
  GetOrganizationUsersQuery['getOrganizationUsers']['users'][number];

export type JourneyMapRowType = GetJourneyMapRowsQuery['getJourneyMap']['rows'][number];

export type JourneyMapType = {
  title: string;
  workspaceId: number | null;
  columns: GetJourneyMapQuery['getJourneyMap']['columns'];
  rows: JourneyMapRowType[];
};

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
