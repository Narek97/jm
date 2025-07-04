import { GetWorkspacesByOrganizationIdQuery } from '@/api/queries/generated/getWorkspaces.generated.ts';

export type WorkspaceType =
  GetWorkspacesByOrganizationIdQuery['getWorkspacesByOrganizationId']['workspaces'][number]
