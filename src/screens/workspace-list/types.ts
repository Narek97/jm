import { GetWorkspaceWithStat } from "@/api/types.ts";

export type WorkspaceType = Pick<
  GetWorkspaceWithStat,
  | "id"
  | "name"
  | "description"
  | "boardsCount"
  | "journeyMapCount"
  | "personasCount"
  | "createdAt"
>;
