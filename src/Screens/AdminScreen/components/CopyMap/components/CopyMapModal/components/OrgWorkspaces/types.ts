import { GetWorkspacesForPastQuery } from '@/api/queries/generated/getWorkspacesForPaste.generated.ts';

export type OrgWorkspaceType = GetWorkspacesForPastQuery['getWorkspaces'][number];
