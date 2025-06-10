import { GetWorkspaceBoardsQuery } from '@/api/infinite-queries/generated/getWorkspaceBoards.generated.ts';

export type WorkspaceBoardsType = GetWorkspaceBoardsQuery['getWorkspaceBoards']['boards'][number];
