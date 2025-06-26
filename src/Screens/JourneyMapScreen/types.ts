import { GetJourneyMapRowsQuery } from '@/api/infinite-queries/generated/getJourneyMapRows.generated.ts';
import { GetJourneyMapQuery } from '@/api/queries/generated/getJourneyMap.generated.ts';
import { GetLayersByMapIdQuery } from '@/api/queries/generated/getLayersByMapId.generated.ts';
import { GetMapByVersionIdQuery } from '@/api/queries/generated/getMapByVersionId.generated.ts';
import { GetMapSelectedPersonasQuery } from '@/api/queries/generated/getMapSelectedPersonas.generated.ts';
import { GetOrganizationUsersQuery } from '@/api/queries/generated/getOrganizationUsers.generated.ts';

export type OrganizationUsersType =
  GetOrganizationUsersQuery['getOrganizationUsers']['users'][number];

export type JourneyMapType = {
  title: string;
  workspaceId: number | null;
  columns: GetJourneyMapQuery['getJourneyMap']['columns'];
  rows: GetJourneyMapRowsQuery['getJourneyMap']['rows'];
};

export type MapSelectedPersonasType = GetMapSelectedPersonasQuery['getMapSelectedPersonas'][number];

export type JourneyMapVersionIdType = GetMapByVersionIdQuery['getMapByVersionId'];
export type LayerType = GetLayersByMapIdQuery['getLayersByMapId']['layers'][number] & {
  isBase?: boolean;
};
// todo
export type JourneyMapVersionType = any;
